import { NextRequest } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
  blockedUntil?: number
}

// Cache en mémoire pour le rate limiting
const rateLimitCache = new Map<string, RateLimitEntry>()

// Nettoyer les entrées expirées toutes les minutes
setInterval(() => {
  const now = Date.now()
  rateLimitCache.forEach((entry, key) => {
    if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
      rateLimitCache.delete(key)
    }
  })
}, 60 * 1000) // 1 minute

/**
 * Obtenir l'identifiant unique du client (IP + User-Agent)
 */
function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Hash simple pour anonymiser
  return `${ip}-${userAgent.substring(0, 50)}`
}

/**
 * Rate limiting côté serveur pour les routes API
 * 
 * @param request - NextRequest
 * @param identifier - Identifiant unique (par défaut: IP + User-Agent)
 * @param maxAttempts - Nombre maximum de tentatives
 * @param windowMs - Fenêtre de temps en millisecondes
 * @param blockDurationMs - Durée de blocage après dépassement (optionnel)
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkServerRateLimit(
  request: NextRequest,
  identifier?: string,
  maxAttempts: number = 5,
  windowMs: number = 60000, // 1 minute par défaut
  blockDurationMs?: number
): { allowed: boolean; remaining: number; resetTime: number; blockedUntil?: number } {
  const clientId = identifier || getClientId(request)
  const now = Date.now()
  
  let entry = rateLimitCache.get(clientId)
  
  // Vérifier si le client est bloqué
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      blockedUntil: entry.blockedUntil
    }
  }
  
  // Réinitialiser si la fenêtre est expirée
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs
    }
  }
  
  // Incrémenter le compteur
  entry.count++
  
  // Vérifier si la limite est dépassée
  if (entry.count > maxAttempts) {
    if (blockDurationMs) {
      entry.blockedUntil = now + blockDurationMs
    }
    rateLimitCache.set(clientId, entry)
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      blockedUntil: entry.blockedUntil
    }
  }
  
  rateLimitCache.set(clientId, entry)
  
  return {
    allowed: true,
    remaining: maxAttempts - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * Rate limiting spécifique pour la connexion admin
 * Plus strict avec blocage temporaire après échecs
 */
export function checkLoginRateLimit(request: NextRequest, email?: string) {
  const identifier = email ? `login-${email}` : `login-${getClientId(request)}`
  
  return checkServerRateLimit(
    request,
    identifier,
    5, // 5 tentatives
    15 * 60 * 1000, // Fenêtre de 15 minutes
    30 * 60 * 1000 // Blocage de 30 minutes après dépassement
  )
}

/**
 * Rate limiting pour les soumissions de formulaires
 */
export function checkFormRateLimit(request: NextRequest, formType: string) {
  const identifier = `form-${formType}-${getClientId(request)}`
  
  return checkServerRateLimit(
    request,
    identifier,
    10, // 10 soumissions
    60 * 1000, // Par minute
    5 * 60 * 1000 // Blocage de 5 minutes
  )
}

/**
 * Rate limiting pour les API générales
 */
export function checkApiRateLimit(request: NextRequest, endpoint: string) {
  const identifier = `api-${endpoint}-${getClientId(request)}`
  
  return checkServerRateLimit(
    request,
    identifier,
    100, // 100 requêtes
    60 * 1000 // Par minute
  )
}

/**
 * Réinitialiser le rate limit pour un identifiant spécifique
 * Utile pour débloquer un utilisateur manuellement
 */
export function resetRateLimit(identifier: string): boolean {
  return rateLimitCache.delete(identifier)
}

/**
 * Obtenir les statistiques de rate limiting
 */
export function getRateLimitStats() {
  const stats = {
    totalEntries: rateLimitCache.size,
    blockedClients: 0,
    entries: [] as Array<{ id: string; count: number; blocked: boolean }>
  }
  
  const now = Date.now()
  for (const [key, entry] of rateLimitCache.entries()) {
    const isBlocked = entry.blockedUntil ? entry.blockedUntil > now : false
    if (isBlocked) stats.blockedClients++
    
    stats.entries.push({
      id: key,
      count: entry.count,
      blocked: isBlocked
    })
  }
  
  return stats
}
