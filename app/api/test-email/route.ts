import { NextRequest, NextResponse } from 'next/server'
import { testEmailConfiguration } from '../../../lib/emailService'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('📧 Exécution du test de configuration email...')
    const result = await testEmailConfiguration()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Email de test envoyé avec succès à ${process.env.ADMIN_EMAIL}`,
        details: result
      })
    } else {
      throw result.error
    }
  } catch (error: any) {
    console.error("❌ Erreur lors de l'envoi de l'email de test:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur inconnue',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}

