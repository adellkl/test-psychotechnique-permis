import { NextRequest, NextResponse } from 'next/server'

// Rate limiting par IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Blacklist d'IPs suspectes avec expiration
const ipBlacklist = new Map<string, { until: number; reason: string }>()

// Détection d'anomalies - Tracking des comportements suspects
const suspiciousActivityMap = new Map<string, {
  failedLogins: number
  rapidRequests: number
  honeypotTriggers: number
  lastActivity: number
  violations: string[]
}>()

// Liste des User-Agents suspects (bots malveillants)
const suspiciousUserAgents = [
  'sqlmap', 'nikto', 'nmap', 'masscan', 'nessus', 'openvas',
  'metasploit', 'burp', 'zap', 'acunetix', 'w3af', 'havij',
  'python-requests', 'curl', 'wget', 'scrapy'
]

// Patterns d'attaques SQL Injection
const sqlInjectionPatterns = [
  /('|(\-\-)|(;)|(\|\|)|(\*))/gi,
  /(union|select|insert|update|delete|drop|create|alter|exec|execute)/gi,
  /(script|javascript|onerror|onload|eval|expression)/gi,
  /(<|>|%3C|%3E)/gi
]

// Patterns d'attaques XSS
const xssPatterns = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi
]

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

// ========== HONEYPOT SYSTEM ==========

// Validation du honeypot (champ invisible qui ne doit jamais être rempli)
export function validateHoneypot(honeypotValue: string | null | undefined): boolean {
  // Si le honeypot est rempli, c'est un bot
  return !honeypotValue || honeypotValue.trim() === ''
}

// Enregistrer une tentative de honeypot
export function recordHoneypotTrigger(ip: string): void {
  const activity = getOrCreateSuspiciousActivity(ip)
  activity.honeypotTriggers++
  activity.violations.push(`Honeypot trigger at ${new Date().toISOString()}`)
  
  // Si 2+ triggers de honeypot, blacklist immédiat
  if (activity.honeypotTriggers >= 2) {
    blacklistIP(ip, 'Multiple honeypot triggers - Bot detected', 24 * 60 * 60 * 1000) // 24h
  }
}

// ========== IP BLACKLIST SYSTEM ==========

export function isIPBlacklisted(ip: string): { blacklisted: boolean; reason?: string } {
  const entry = ipBlacklist.get(ip)
  if (!entry) return { blacklisted: false }
  
  if (Date.now() > entry.until) {
    ipBlacklist.delete(ip)
    return { blacklisted: false }
  }
  
  return { blacklisted: true, reason: entry.reason }
}

export function blacklistIP(ip: string, reason: string, durationMs: number = 3600000): void {
  ipBlacklist.set(ip, {
    until: Date.now() + durationMs,
    reason
  })
  console.warn(`🚫 IP BLACKLISTED: ${ip} - Reason: ${reason} - Duration: ${durationMs}ms`)
}

export function unblacklistIP(ip: string): void {
  ipBlacklist.delete(ip)
}

// ========== ANOMALY DETECTION ==========

function getOrCreateSuspiciousActivity(ip: string) {
  if (!suspiciousActivityMap.has(ip)) {
    suspiciousActivityMap.set(ip, {
      failedLogins: 0,
      rapidRequests: 0,
      honeypotTriggers: 0,
      lastActivity: Date.now(),
      violations: []
    })
  }
  return suspiciousActivityMap.get(ip)!
}

export function recordFailedLogin(ip: string): void {
  const activity = getOrCreateSuspiciousActivity(ip)
  activity.failedLogins++
  activity.violations.push(`Failed login at ${new Date().toISOString()}`)
  
  // 5+ échecs de connexion = blacklist 1h
  if (activity.failedLogins >= 5) {
    blacklistIP(ip, 'Multiple failed login attempts - Brute force detected', 60 * 60 * 1000)
  }
}

export function recordSuccessfulLogin(ip: string): void {
  const activity = suspiciousActivityMap.get(ip)
  if (activity) {
    activity.failedLogins = 0 // Reset sur succès
  }
}

export function detectRapidRequests(ip: string): boolean {
  const activity = getOrCreateSuspiciousActivity(ip)
  const now = Date.now()
  const timeSinceLastActivity = now - activity.lastActivity
  
  // Si moins de 100ms entre requêtes, c'est suspect
  if (timeSinceLastActivity < 100) {
    activity.rapidRequests++
    if (activity.rapidRequests >= 10) {
      blacklistIP(ip, 'Rapid automated requests detected', 30 * 60 * 1000) // 30min
      return true
    }
  } else if (timeSinceLastActivity > 5000) {
    // Reset si plus de 5 secondes
    activity.rapidRequests = 0
  }
  
  activity.lastActivity = now
  return false
}

// ========== USER AGENT VALIDATION ==========

export function validateUserAgent(request: NextRequest): { valid: boolean; reason?: string } {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
  
  // Pas de User-Agent = suspect
  if (!userAgent) {
    return { valid: false, reason: 'Missing User-Agent' }
  }
  
  // Check contre les User-Agents suspects
  for (const suspicious of suspiciousUserAgents) {
    if (userAgent.includes(suspicious.toLowerCase())) {
      return { valid: false, reason: `Suspicious User-Agent: ${suspicious}` }
    }
  }
  
  return { valid: true }
}

// ========== INJECTION ATTACK DETECTION ==========

export function detectSQLInjection(input: string): boolean {
  return sqlInjectionPatterns.some(pattern => pattern.test(input))
}

export function detectXSS(input: string): boolean {
  return xssPatterns.some(pattern => pattern.test(input))
}

export function detectInjectionAttack(data: any): { detected: boolean; type?: string; field?: string } {
  if (typeof data === 'string') {
    if (detectSQLInjection(data)) {
      return { detected: true, type: 'SQL Injection' }
    }
    if (detectXSS(data)) {
      return { detected: true, type: 'XSS' }
    }
  } else if (typeof data === 'object' && data !== null) {
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        if (detectSQLInjection(value)) {
          return { detected: true, type: 'SQL Injection', field: key }
        }
        if (detectXSS(value)) {
          return { detected: true, type: 'XSS', field: key }
        }
      }
    }
  }
  return { detected: false }
}

// ========== ADVANCED SECURITY MIDDLEWARE ==========

export function advancedSecurityMiddleware(
  request: NextRequest,
  options: {
    checkHoneypot?: boolean
    honeypotField?: string
    checkUserAgent?: boolean
    checkInjections?: boolean
    data?: any
  } = {}
): NextResponse | null {
  const ip = getRateLimitKey(request)
  
  // 1. Check IP Blacklist
  const blacklistCheck = isIPBlacklisted(ip)
  if (blacklistCheck.blacklisted) {
    console.warn(`🚫 Blocked blacklisted IP: ${ip} - ${blacklistCheck.reason}`)
    return NextResponse.json(
      { error: 'Accès refusé' },
      { status: 403 }
    )
  }
  
  // 2. Detect rapid automated requests
  if (detectRapidRequests(ip)) {
    console.warn(`⚡ Rapid requests detected from IP: ${ip}`)
    return NextResponse.json(
      { error: 'Trop de requêtes rapides détectées' },
      { status: 429 }
    )
  }
  
  // 3. Validate User-Agent
  if (options.checkUserAgent !== false) {
    const uaCheck = validateUserAgent(request)
    if (!uaCheck.valid) {
      console.warn(`🤖 Suspicious User-Agent from IP ${ip}: ${uaCheck.reason}`)
      blacklistIP(ip, uaCheck.reason || 'Suspicious User-Agent', 60 * 60 * 1000)
      return NextResponse.json(
        { error: 'Requête invalide' },
        { status: 403 }
      )
    }
  }
  
  // 4. Check Honeypot
  if (options.checkHoneypot && options.data) {
    const honeypotField = options.honeypotField || 'website'
    const honeypotValue = options.data[honeypotField]
    
    if (!validateHoneypot(honeypotValue)) {
      console.warn(`🍯 Honeypot triggered by IP: ${ip} - Value: ${honeypotValue}`)
      recordHoneypotTrigger(ip)
      return NextResponse.json(
        { error: 'Validation échouée' },
        { status: 400 }
      )
    }
  }
  
  // 5. Check for injection attacks
  if (options.checkInjections && options.data) {
    const injectionCheck = detectInjectionAttack(options.data)
    if (injectionCheck.detected) {
      console.error(`💉 ${injectionCheck.type} attack detected from IP ${ip} in field: ${injectionCheck.field || 'unknown'}`)
      blacklistIP(ip, `${injectionCheck.type} attack attempt`, 24 * 60 * 60 * 1000) // 24h
      return NextResponse.json(
        { error: 'Données invalides détectées' },
        { status: 400 }
      )
    }
  }
  
  return null // Tout est OK
}

// ========== SECURITY HEADERS ==========

export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Protection XSS
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Empêcher le MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Clickjacking protection
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  )
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions Policy
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  return response
}

// Nettoyage périodique des maps
setInterval(() => {
  const now = Date.now()
  
  // Nettoyer les activités suspectes anciennes (> 1h)
  suspiciousActivityMap.forEach((activity, ip) => {
    if (now - activity.lastActivity > 3600000) {
      suspiciousActivityMap.delete(ip)
    }
  })
  
  // Nettoyer les blacklists expirées
  ipBlacklist.forEach((entry, ip) => {
    if (now > entry.until) {
      ipBlacklist.delete(ip)
    }
  })
}, 300000) // Toutes les 5 minutes
