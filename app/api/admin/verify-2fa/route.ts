import { NextRequest, NextResponse } from 'next/server'
import { verifyTwoFactorCode } from '../../../../lib/twoFactor'
import { getSession, updateSession, setSessionCookie, clearSessionCookie } from '../../../../lib/sessionManager'
import { logSecurityEvent } from '../../../../lib/securityLogger'

/**
 * API pour vérifier le code 2FA
 * POST /api/admin/verify-2fa
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Code requis' },
        { status: 400 }
      )
    }

    // Récupérer la session temporaire
    const tempToken = request.cookies.get('admin_temp_session')?.value
    
    if (!tempToken) {
      return NextResponse.json(
        { error: 'Session expirée. Veuillez vous reconnecter.' },
        { status: 401 }
      )
    }

    const session = getSession(tempToken)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session invalide ou expirée' },
        { status: 401 }
      )
    }

    // Vérifier le code 2FA
    const verification = verifyTwoFactorCode(session.email, code)
    
    if (!verification.valid) {
      await logSecurityEvent('2FA_VERIFICATION_FAILED', {
        endpoint: '/api/admin/verify-2fa',
        ip,
        email: session.email,
        reason: verification.error
      })
      
      return NextResponse.json(
        { error: verification.error },
        { status: 401 }
      )
    }

    // Mettre à jour la session pour marquer le 2FA comme vérifié
    updateSession(tempToken, { twoFactorVerified: true })

    await logSecurityEvent('2FA_VERIFICATION_SUCCESS', {
      endpoint: '/api/admin/verify-2fa',
      ip,
      email: session.email
    })

    // Créer la réponse avec le cookie de session permanent
    const response = NextResponse.json({
      success: true,
      admin: {
        id: session.adminId,
        email: session.email,
        fullName: session.fullName,
        role: session.role
      }
    })

    // Remplacer le cookie temporaire par un permanent
    response.cookies.delete('admin_temp_session')
    return setSessionCookie(response, tempToken)

  } catch (error: any) {
    console.error('Erreur vérification 2FA:', error)
    await logSecurityEvent('2FA_VERIFICATION_ERROR', {
      endpoint: '/api/admin/verify-2fa',
      ip,
      error: error.message
    })
    
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}
