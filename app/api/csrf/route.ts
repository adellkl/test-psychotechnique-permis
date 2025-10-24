import { NextRequest, NextResponse } from 'next/server'
import { generateCSRFToken } from '../../../lib/csrf'

/**
 * API pour générer un token CSRF
 * GET /api/csrf - Retourne un nouveau token CSRF
 */
export async function GET(request: NextRequest) {
  try {
    // Générer un token CSRF unique
    const token = generateCSRFToken()
    
    return NextResponse.json({
      csrfToken: token,
      expiresIn: 3600 // 1 heure en secondes
    })
  } catch (error) {
    console.error('Erreur génération CSRF:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du token CSRF' },
      { status: 500 }
    )
  }
}
