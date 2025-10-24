import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie, deleteSession, clearSessionCookie } from '../../../../lib/sessionManager'
import { logSecurityEvent } from '../../../../lib/securityLogger'

/**
 * API de déconnexion sécurisée
 * POST /api/admin/logout
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  
  try {
    const token = getSessionFromCookie(request)
    
    if (token) {
      deleteSession(token)
      
      await logSecurityEvent('LOGOUT_SUCCESS', {
        endpoint: '/api/admin/logout',
        ip
      })
    }

    const response = NextResponse.json({ success: true })
    return clearSessionCookie(response)

  } catch (error: any) {
    console.error('Erreur déconnexion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}
