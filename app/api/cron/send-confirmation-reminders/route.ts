import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('ℹ️ [CRON] Fonction de rappel de confirmation désactivée')
    console.log('ℹ️ [CRON] Les rendez-vous sont maintenant confirmés automatiquement par défaut')

    // Cette fonction n'est plus nécessaire car les rendez-vous sont confirmés par défaut
    // Elle est conservée pour compatibilité avec les tâches CRON existantes
    return NextResponse.json({ 
      success: true, 
      message: 'Fonction désactivée - Les rendez-vous sont confirmés automatiquement',
      count: 0,
      disabled: true
    })

  } catch (error) {
    console.error('❌ [CRON] Erreur générale:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de l\'envoi des rappels',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
