import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import bcrypt from 'bcryptjs'
import { createSession, setSessionCookie } from '../../../../lib/sessionManager'
import { createTwoFactorCode, isTwoFactorEnabled } from '../../../../lib/twoFactor'
import { checkLoginRateLimit } from '../../../../lib/rateLimit'
import { logSecurityEvent } from '../../../../lib/securityLogger'
import { sanitizeString, isValidEmail } from '../../../../lib/validation'


export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  
  try {
    const { email, password } = await request.json()

   
    const rateLimit = checkLoginRateLimit(request, email)
    if (!rateLimit.allowed) {
      await logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        endpoint: '/api/admin/login-secure',
        ip,
        email,
        blockedUntil: rateLimit.blockedUntil
      })
      
      return NextResponse.json(
        { 
          error: 'Trop de tentatives de connexion. Veuillez patienter 30 minutes.',
          blockedUntil: rateLimit.blockedUntil
        },
        { status: 429 }
      )
    }

   
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    const sanitizedEmail = sanitizeString(email).toLowerCase().trim()

    const { data: admin, error: dbError } = await supabase
      .from('admins')
      .select('id, email, full_name, role, password_hash, is_active, two_factor_enabled')
      .eq('email', sanitizedEmail)
      .single()

    if (dbError || !admin) {
      await logSecurityEvent('LOGIN_FAILED', {
        endpoint: '/api/admin/login-secure',
        ip,
        email: sanitizedEmail,
        reason: 'Admin not found'
      })
      
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    
    if (!admin.is_active) {
      await logSecurityEvent('LOGIN_FAILED', {
        endpoint: '/api/admin/login-secure',
        ip,
        email: sanitizedEmail,
        reason: 'Account disabled'
      })
      
      return NextResponse.json(
        { error: 'Compte désactivé' },
        { status: 403 }
      )
    }

    
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    
    if (!isValidPassword) {
      await logSecurityEvent('LOGIN_FAILED', {
        endpoint: '/api/admin/login-secure',
        ip,
        email: sanitizedEmail,
        reason: 'Invalid password'
      })
      
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    
    const twoFactorEnabled = admin.two_factor_enabled || false

    if (twoFactorEnabled) {
      
      const result = await createTwoFactorCode(sanitizedEmail)
      
      if (!result.success) {
        return NextResponse.json(
          { error: 'Erreur lors de l\'envoi du code 2FA' },
          { status: 500 }
        )
      }

      
      const tempToken = createSession(
        admin.id,
        admin.email,
        admin.full_name,
        admin.role,
        false 
      )

      await logSecurityEvent('LOGIN_2FA_REQUIRED', {
        endpoint: '/api/admin/login-secure',
        ip,
        email: sanitizedEmail
      })

      
      const response = NextResponse.json({
        success: true,
        requiresTwoFactor: true,
        message: 'Code de vérification envoyé par email'
      })

      
      response.cookies.set('admin_temp_session', tempToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 10 * 60, 
        path: '/'
      })

      return response
    }

    
    const sessionToken = createSession(
      admin.id,
      admin.email,
      admin.full_name,
      admin.role,
      true 
    )

    await logSecurityEvent('LOGIN_SUCCESS', {
      endpoint: '/api/admin/login-secure',
      ip,
      email: sanitizedEmail
    })

    
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.full_name,
        role: admin.role
      }
    })

    return setSessionCookie(response, sessionToken)

  } catch (error: any) {
    console.error('Erreur connexion:', error)
    await logSecurityEvent('LOGIN_ERROR', {
      endpoint: '/api/admin/login-secure',
      ip,
      error: error.message
    })
    
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
