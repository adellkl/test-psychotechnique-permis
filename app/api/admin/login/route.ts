import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '../../../../lib/supabase-server'
import { validateAdminPassword, generateSessionToken, logAdminAction } from '../../../../lib/adminAuth'
import { getRateLimitKey, checkRateLimit, securityMiddleware } from '../../../../lib/security'
import { sanitizeString, isValidEmail } from '../../../../lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Sécurité : Rate limiting strict sur login (3 tentatives par 5 minutes par IP)
    const ip = getRateLimitKey(request)
    const { allowed } = checkRateLimit(`admin-login:${ip}`, 3, 300000)
    
    if (!allowed) {
      return NextResponse.json(
        { error: 'Trop de tentatives de connexion. Veuillez réessayer dans 5 minutes.' },
        { status: 429 }
      )
    }

    // Sécurité : Validation de l'origine
    const securityCheck = securityMiddleware(request, { validateOrigin: true })
    if (securityCheck) return securityCheck

    const { email, password } = await request.json()

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
      // Log de la tentative échouée
      await logAdminAction('unknown', 'LOGIN_FAILED', `Failed login attempt for ${sanitizedEmail}`, ip)
      
      return NextResponse.json({ 
        error: error || 'Email ou mot de passe incorrect' 
      }, { status: 401 })
    }

    // Génération d'un token de session
    const sessionToken = generateSessionToken()

    // Log de la connexion réussie
    await logAdminAction(admin.id, 'LOGIN_SUCCESS', `Successful login from ${ip}`, ip)

    // Retourner les données admin (sans le mot de passe)
    return NextResponse.json({ 
      success: true, 
      admin,
      sessionToken
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
