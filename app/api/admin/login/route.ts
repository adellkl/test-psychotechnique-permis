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
    
    const advancedCheck = advancedSecurityMiddleware(request, {
      checkHoneypot: true,
      honeypotField: 'username', 
      checkUserAgent: true,
      checkInjections: true,
      data: { email, password }
    })
    if (advancedCheck) return addSecurityHeaders(advancedCheck)
    
      const { allowed } = checkRateLimit(`admin-login:${ip}`, 3, 300000)
    
    if (!allowed) {
      recordFailedLogin(ip)
      return addSecurityHeaders(NextResponse.json(
        { error: 'Trop de tentatives de connexion. Veuillez réessayer dans 5 minutes.' },
        { status: 429 }
      ))
    }

    const securityCheck = securityMiddleware(request, { validateOrigin: true })
    if (securityCheck) return addSecurityHeaders(securityCheck)

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Mot de passe invalide' }, { status: 400 })
    }

    const sanitizedEmail = sanitizeString(email).toLowerCase().trim()

    const { valid, admin, error } = await validateAdminPassword(sanitizedEmail, password)

    if (!valid || !admin) {
      recordFailedLogin(ip)
      
      await logAdminAction('unknown', 'LOGIN_FAILED', `Failed login attempt for ${sanitizedEmail}`, ip)
      
      return addSecurityHeaders(NextResponse.json({ 
        error: error || 'Email ou mot de passe incorrect' 
      }, { status: 401 }))
    }

    recordSuccessfulLogin(ip)
    
    const sessionToken = generateSessionToken()

        await logAdminAction(admin.id, 'LOGIN_SUCCESS', `Successful login from ${ip}`, ip)

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
