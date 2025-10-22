import { supabase } from './supabase'

export interface SecurityEvent {
  event_type: 'HONEYPOT_TRIGGER' | 'SQL_INJECTION' | 'XSS_ATTEMPT' | 'BRUTE_FORCE' | 'RAPID_REQUESTS' | 'SUSPICIOUS_USER_AGENT' | 'IP_BLACKLISTED' | 'RATE_LIMIT_EXCEEDED'
  ip_address: string
  user_agent?: string
  request_path?: string
  request_method?: string
  details?: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  blocked: boolean
}

/**
 * Enregistre un événement de sécurité dans la base de données
 */
export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  try {
    const { error } = await supabase
      .from('security_logs')
      .insert([{
        event_type: event.event_type,
        ip_address: event.ip_address,
        user_agent: event.user_agent,
        request_path: event.request_path,
        request_method: event.request_method,
        details: event.details,
        severity: event.severity,
        blocked: event.blocked,
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error('❌ Failed to log security event:', error)
    } else {
      console.warn(`🔐 Security Event Logged: ${event.event_type} from ${event.ip_address} - Severity: ${event.severity}`)
    }

    // Si c'est critique, envoyer une alerte
    if (event.severity === 'CRITICAL') {
      await sendSecurityAlert(event)
    }
  } catch (error) {
    console.error('❌ Error logging security event:', error)
  }
}

/**
 * Envoie une alerte pour les événements critiques
 */
async function sendSecurityAlert(event: SecurityEvent): Promise<void> {
  // TODO: Intégrer avec un système d'alerte (email, SMS, Slack, etc.)
  console.error(`
🚨🚨🚨 ALERTE SÉCURITÉ CRITIQUE 🚨🚨🚨
Type: ${event.event_type}
IP: ${event.ip_address}
User-Agent: ${event.user_agent || 'N/A'}
Path: ${event.request_path || 'N/A'}
Details: ${event.details || 'N/A'}
Blocked: ${event.blocked ? 'OUI' : 'NON'}
Time: ${new Date().toISOString()}
  `)
}

/**
 * Récupère les événements de sécurité récents
 */
export async function getRecentSecurityEvents(limit: number = 100): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('security_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching security events:', error)
    return []
  }
}

/**
 * Récupère les statistiques de sécurité
 */
export async function getSecurityStats(hours: number = 24): Promise<{
  totalEvents: number
  criticalEvents: number
  blockedIPs: number
  topAttackTypes: { type: string; count: number }[]
  topAttackerIPs: { ip: string; count: number }[]
}> {
  try {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('security_logs')
      .select('*')
      .gte('created_at', since)

    if (error) throw error

    const events = data || []
    const totalEvents = events.length
    const criticalEvents = events.filter(e => e.severity === 'CRITICAL').length
    const blockedIPs = new Set(events.filter(e => e.blocked).map(e => e.ip_address)).size

    // Top types d'attaques
    const attackTypeCounts = events.reduce((acc: any, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1
      return acc
    }, {})
    const topAttackTypes = Object.entries(attackTypeCounts)
      .map(([type, count]) => ({ type, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Top IPs attaquantes
    const ipCounts = events.reduce((acc: any, event) => {
      acc[event.ip_address] = (acc[event.ip_address] || 0) + 1
      return acc
    }, {})
    const topAttackerIPs = Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalEvents,
      criticalEvents,
      blockedIPs,
      topAttackTypes,
      topAttackerIPs
    }
  } catch (error) {
    console.error('Error fetching security stats:', error)
    return {
      totalEvents: 0,
      criticalEvents: 0,
      blockedIPs: 0,
      topAttackTypes: [],
      topAttackerIPs: []
    }
  }
}

/**
 * Nettoie les anciens logs de sécurité (> 30 jours)
 */
export async function cleanupOldSecurityLogs(): Promise<number> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('security_logs')
      .delete()
      .lt('created_at', thirtyDaysAgo)
      .select()

    if (error) throw error
    
    const deletedCount = data?.length || 0
    console.log(`🧹 Cleaned up ${deletedCount} old security logs`)
    return deletedCount
  } catch (error) {
    console.error('Error cleaning up security logs:', error)
    return 0
  }
}
