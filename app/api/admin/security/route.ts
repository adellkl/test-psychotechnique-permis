import { NextRequest, NextResponse } from 'next/server'
import { getSecurityStats, getRecentSecurityEvents } from '../../../../lib/securityLogger'
import { getRateLimitKey, checkRateLimit, addSecurityHeaders } from '../../../../lib/security'

// GET - Récupérer les statistiques et événements de sécurité
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getRateLimitKey(request)
    const { allowed } = checkRateLimit(`security-dashboard:${ip}`, 30, 60000)
    
    if (!allowed) {
      return addSecurityHeaders(NextResponse.json(
        { error: 'Trop de requêtes' },
        { status: 429 }
      ))
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const hours = parseInt(searchParams.get('hours') || '24')
    const limit = parseInt(searchParams.get('limit') || '100')

    if (action === 'stats') {
      // Récupérer les statistiques
      const stats = await getSecurityStats(hours)
      return addSecurityHeaders(NextResponse.json({ stats }))
    } else if (action === 'events') {
      // Récupérer les événements récents
      const events = await getRecentSecurityEvents(limit)
      return addSecurityHeaders(NextResponse.json({ events }))
    } else {
      // Par défaut, retourner les deux
      const [stats, events] = await Promise.all([
        getSecurityStats(hours),
        getRecentSecurityEvents(limit)
      ])
      return addSecurityHeaders(NextResponse.json({ stats, events }))
    }
  } catch (error) {
    console.error('Error fetching security data:', error)
    return addSecurityHeaders(NextResponse.json(
      { error: 'Erreur lors de la récupération des données de sécurité' },
      { status: 500 }
    ))
  }
}
