import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

interface SessionData {
  adminId: string
  email: string
  fullName: string
  role: string
  createdAt: number
  expiresAt: number
  twoFactorVerified?: boolean
}

// Cache en mémoire pour les sessions (en production, utiliser Redis)
const sessions = new Map<string, SessionData>()

// Nettoyer les sessions expirées toutes les 5 minutes
setInterval(() => {
  const now = Date.now()
  sessions.forEach((session, token) => {
    if (session.expiresAt < now) {
      sessions.delete(token)
    }
  })
}, 5 * 60 * 1000) // Toutes les 5 minutes

/**
 * Générer un token de session sécurisé
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Créer une nouvelle session
 */
export function createSession(
  adminId: string,
  email: string,
  fullName: string,
  role: string,
  twoFactorVerified: boolean = false
): string {
  const token = generateSessionToken()
  const now = Date.now()
  const expiresAt = now + 30 * 24 * 60 * 60 * 1000 // 30 jours

  sessions.set(token, {
    adminId,
    email,
    fullName,
    role,
    createdAt: now,
    expiresAt,
    twoFactorVerified
  })

  return token
}

/**
 * Récupérer une session
 */
export function getSession(token: string): SessionData | null {
  const session = sessions.get(token)
  
  if (!session) return null
  
  // Vérifier l'expiration
  if (session.expiresAt < Date.now()) {
    sessions.delete(token)
    return null
  }
  
  return session
}

/**
 * Mettre à jour une session (ex: après vérification 2FA)
 */
export function updateSession(token: string, updates: Partial<SessionData>): boolean {
  const session = sessions.get(token)
  
  if (!session) return false
  
  sessions.set(token, {
    ...session,
    ...updates
  })
  
  return true
}

/**
 * Supprimer une session (logout)
 */
export function deleteSession(token: string): boolean {
  return sessions.delete(token)
}

/**
 * Définir un cookie de session httpOnly
 */
export function setSessionCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set('admin_session', token, {
    httpOnly: true, // Protection XSS
    secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en production
    sameSite: 'lax', // Protection CSRF
    maxAge: 30 * 24 * 60 * 60, // 30 jours
    path: '/'
  })
  
  return response
}

/**
 * Récupérer le token de session depuis les cookies
 */
export function getSessionFromCookie(request: NextRequest): string | null {
  return request.cookies.get('admin_session')?.value || null
}

/**
 * Supprimer le cookie de session
 */
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.delete('admin_session')
  return response
}

/**
 * Middleware pour vérifier la session
 */
export function requireSession(request: NextRequest): { 
  valid: boolean
  session?: SessionData
  error?: string 
} {
  const token = getSessionFromCookie(request)
  
  if (!token) {
    return { valid: false, error: 'Session manquante' }
  }
  
  const session = getSession(token)
  
  if (!session) {
    return { valid: false, error: 'Session invalide ou expirée' }
  }
  
  return { valid: true, session }
}

/**
 * Obtenir les statistiques des sessions
 */
export function getSessionStats() {
  const now = Date.now()
  let activeSessions = 0
  let expiredSessions = 0
  
  for (const session of sessions.values()) {
    if (session.expiresAt > now) {
      activeSessions++
    } else {
      expiredSessions++
    }
  }
  
  return {
    total: sessions.size,
    active: activeSessions,
    expired: expiredSessions
  }
}
