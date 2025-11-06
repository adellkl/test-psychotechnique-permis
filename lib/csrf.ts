import { NextRequest } from 'next/server'
import crypto from 'crypto'

interface CSRFToken {
  token: string
  createdAt: number
  expiresAt: number
}

// Cache en mémoire pour les tokens CSRF
const csrfTokens = new Map<string, CSRFToken>()

// Nettoyage automatique des tokens expirés toutes les 5 minutes
setInterval(() => {
  const now = Date.now()
  csrfTokens.forEach((token, key) => {
    if (token.expiresAt < now) {
      csrfTokens.delete(key)
    }
  })
}, 5 * 60 * 1000)

/**
 * Générer un token CSRF unique
 */
export function generateCSRFToken(sessionId?: string): string {
  const token = crypto.randomBytes(32).toString('hex')
  const now = Date.now()
  const expiresAt = now + 60 * 60 * 1000 // 1 heure
  
  const key = sessionId || token
  
  csrfTokens.set(key, {
    token,
    createdAt: now,
    expiresAt
  })
  
  return token
}

/**
 * Vérifier la validité d'un token CSRF
 */
export function verifyCSRFToken(token: string, sessionId?: string): boolean {
  if (!token) return false
  
  // Chercher le token dans le cache
  for (const [key, storedToken] of csrfTokens.entries()) {
    if (storedToken.token === token) {
      const now = Date.now()
      
      // Vérifier l'expiration
      if (storedToken.expiresAt < now) {
        csrfTokens.delete(key)
        return false
      }
      
      // Vérifier la session si fournie
      if (sessionId && key !== sessionId && key !== token) {
        return false
      }
      
      return true
    }
  }
  
  return false
}

/**
 * Middleware CSRF pour les routes API
 * Vérifie le token CSRF dans les headers ou le body
 */
export function checkCSRF(request: NextRequest): { valid: boolean; error?: string } {
  // Ignorer la vérification CSRF pour les requêtes GET (lecture seule)
  if (request.method === 'GET') {
    return { valid: true }
  }
  
  // Récupérer le token depuis les headers
  const csrfToken = request.headers.get('x-csrf-token')
  
  if (!csrfToken) {
    return {
      valid: false,
      error: 'Token CSRF manquant'
    }
  }
  
  const isValid = verifyCSRFToken(csrfToken)
  
  if (!isValid) {
    return {
      valid: false,
      error: 'Token CSRF invalide ou expiré'
    }
  }
  
  return { valid: true }
}

/**
 * Supprimer un token CSRF
 */
export function deleteCSRFToken(token: string): boolean {
  for (const [key, storedToken] of csrfTokens.entries()) {
    if (storedToken.token === token) {
      return csrfTokens.delete(key)
    }
  }
  return false
}

/**
 * Obtenir les statistiques des tokens CSRF
 */
export function getCSRFStats() {
  const now = Date.now()
  let validTokens = 0
  let expiredTokens = 0
  
  for (const token of csrfTokens.values()) {
    if (token.expiresAt > now) {
      validTokens++
    } else {
      expiredTokens++
    }
  }
  
  return {
    total: csrfTokens.size,
    valid: validTokens,
    expired: expiredTokens
  }
}
