import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { validateAdminPassword, generateSessionToken, logAdminAction } from '../../../../lib/adminAuth'
import { 
  getRateLimitKey, 
  checkRateLimit, 
  securityMiddleware,
  advancedSecurityMiddleware,
  addSecurityHeaders,
  recordFailedLogin,
  recordSuccessfulLogin
} from '../../../../lib/security'
import { sanitizeString, isValidEmail } from '../../../../lib/validation'

export async function POST(request: NextRequest) {
  const ip = getRateLimitKey(request)
  
  try {
    const { email, password } = await request.json()
    
    // 🔒 SÉCURITÉ AVANCÉE : Honeypot + Injection + User-Agent + IP Blacklist
    const advancedCheck = advancedSecurityMiddleware(request, {
      checkHoneypot: true,
      honeypotField: 'username', // Champ piège pour admin login
      checkUserAgent: true,
      checkInjections: true,
      data: { email, password }
    })
    if (advancedCheck) return addSecurityHeaders(advancedCheck)
    
    // Sécurité : Rate limiting TRÈS strict sur login admin (3 tentatives par 5 minutes par IP)
    const { allowed } = checkRateLimit(`admin-login:${ip}`, 3, 300000)
    
    if (!allowed) {
      recordFailedLogin(ip)
      return addSecurityHeaders(NextResponse.json(
        { error: 'Trop de tentatives de connexion. Veuillez réessayer dans 5 minutes.' },
        { status: 429 }
      ))
    }

    // Sécurité : Validation de l'origine
    const securityCheck = securityMiddleware(request, { validateOrigin: true })
    if (securityCheck) return addSecurityHeaders(securityCheck)

    // Validation des entrées
    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Mot de passe invalide' }, { status: 400 })
    }

    // Sanitization
    const sanitizedEmail = sanitizeString(email).toLowerCase().trim()

    // Validation du mot de passe avec protection timing attack
    const { valid, admin, error } = await validateAdminPassword(sanitizedEmail, password)

    if (!valid || !admin) {
      // 🚨 Enregistrer l'échec de connexion pour détection brute force
      recordFailedLogin(ip)
      
      // Log de la tentative échouée
      await logAdminAction('unknown', 'LOGIN_FAILED', `Failed login attempt for ${sanitizedEmail}`, ip)
      
      return addSecurityHeaders(NextResponse.json({ 
        error: error || 'Email ou mot de passe incorrect' 
      }, { status: 401 }))
    }

    // ✅ Connexion réussie - Reset le compteur d'échecs
    recordSuccessfulLogin(ip)
    
    // Génération d'un token de session
    const sessionToken = generateSessionToken()

    // Log de la connexion réussie
    await logAdminAction(admin.id, 'LOGIN_SUCCESS', `Successful login from ${ip}`, ip)

    // Retourner les données admin (sans le mot de passe)
    return addSecurityHeaders(NextResponse.json({ 
      success: true, 
      admin,
      sessionToken
    }))
  } catch (error) {
    console.error('Login error:', error)
    recordFailedLogin(ip)
    return addSecurityHeaders(NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    ))
  }
}
