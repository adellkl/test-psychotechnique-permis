import { NextRequest, NextResponse } from 'next/server'

// Rate limiting par IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
  return ip
}

export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: maxRequests - record.count }
}

// Nettoyage périodique du cache de rate limiting
setInterval(() => {
  const now = Date.now()
  const keysToDelete: string[] = []
  
  rateLimitMap.forEach((record, key) => {
    if (now > record.resetTime) {
      keysToDelete.push(key)
    }
  })
  
  keysToDelete.forEach(key => rateLimitMap.delete(key))
}, 300000) // Nettoyage toutes les 5 minutes

// Validation CSRF Token
export function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function validateCSRFToken(token: string | null, storedToken: string | null): boolean {
  if (!token || !storedToken) return false
  return token === storedToken
}

// Validation de l'origine de la requête
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  
  if (!origin) return true // Requêtes same-origin n'ont pas d'origin header
  
  const allowedOrigins = [
    'https://test-psychotechnique-permis.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
  ]
  
  return allowedOrigins.some(allowed => origin.startsWith(allowed)) || 
         origin.includes(host || '')
}

// Middleware de sécurité pour les routes API
export function securityMiddleware(
  request: NextRequest,
  options: {
    requireAuth?: boolean
    rateLimit?: { maxRequests: number; windowMs: number }
    validateOrigin?: boolean
  } = {}
): NextResponse | null {
  // Validation de l'origine
  if (options.validateOrigin !== false && !validateOrigin(request)) {
    return NextResponse.json(
      { error: 'Origine non autorisée' },
      { status: 403 }
    )
  }

  // Rate limiting
  if (options.rateLimit) {
    const ip = getRateLimitKey(request)
    const { allowed, remaining } = checkRateLimit(
      ip,
      options.rateLimit.maxRequests,
      options.rateLimit.windowMs
    )

    if (!allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Remaining': '0'
          }
        }
      )
    }
  }

  return null // Pas d'erreur, continuer
}

// Validation des données d'entrée
export function validateInput(data: any, schema: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key]

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`Le champ ${key} est requis`)
      continue
    }

    if (value && rules.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value
      if (actualType !== rules.type) {
        errors.push(`Le champ ${key} doit être de type ${rules.type}`)
      }
    }

    if (value && rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      errors.push(`Le champ ${key} ne peut pas dépasser ${rules.maxLength} caractères`)
    }

    if (value && rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      errors.push(`Le champ ${key} doit contenir au moins ${rules.minLength} caractères`)
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors.push(`Le champ ${key} a un format invalide`)
    }
  }

  return { valid: errors.length === 0, errors }
}

// Protection contre les attaques par timing
export async function constantTimeCompare(a: string, b: string): Promise<boolean> {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  // Ajouter un délai aléatoire pour éviter les attaques par timing
  await new Promise(resolve => setTimeout(resolve, Math.random() * 10))

  return result === 0
}

// Logging sécurisé (ne pas logger les données sensibles)
export function sanitizeLogData(data: any): any {
  const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'creditCard', 'ssn']
  
  if (typeof data !== 'object' || data === null) {
    return data
  }

  const sanitized = Array.isArray(data) ? [...data] : { ...data }

  for (const key in sanitized) {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeLogData(sanitized[key])
    }
  }

  return sanitized
}
