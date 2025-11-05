import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .limit(1)

    if (error) throw error

    return {
      name: 'Connexion à la base de données',
      success: true,
      details: 'Connexion établie avec succès',
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    return {
      name: 'Connexion à la base de données',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

async function checkTables() {
  const tables = ['appointments', 'admins', 'email_templates', 'admin_activity_log']
  const results = []

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) throw error

      results.push({
        table,
        accessible: true,
        count
      })
    } catch (error: any) {
      results.push({
        table,
        accessible: false,
        error: error.message
      })
    }
  }

  const allAccessible = results.every(r => r.accessible)

  return {
    name: 'Vérification des tables',
    success: allAccessible,
    details: allAccessible 
      ? 'Toutes les tables sont accessibles' 
      : `Tables inaccessibles: ${results.filter(r => !r.accessible).map(r => r.table).join(', ')}`,
    tables: results,
    timestamp: new Date().toISOString()
  }
}

async function checkDataIntegrity() {
  const issues = []

  try {
    // Vérifier les rendez-vous sans email
    const { data: appointmentsWithoutEmail } = await supabase
      .from('appointments')
      .select('id')
      .or('email.is.null,email.eq.')

    if (appointmentsWithoutEmail && appointmentsWithoutEmail.length > 0) {
      issues.push(`${appointmentsWithoutEmail.length} rendez-vous sans email`)
    }

    // Vérifier les rendez-vous passés avec statut "confirmed"
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const { data: pastConfirmed } = await supabase
      .from('appointments')
      .select('id')
      .eq('status', 'confirmed')
      .lt('appointment_date', yesterday.toISOString().split('T')[0])

    if (pastConfirmed && pastConfirmed.length > 0) {
      issues.push(`${pastConfirmed.length} rendez-vous passés toujours en statut "confirmed"`)
    }

    // Vérifier les templates d'email actifs
    const { data: templates } = await supabase
      .from('email_templates')
      .select('template_name, is_active')
      .eq('is_active', true)

    if (!templates || templates.length === 0) {
      issues.push('Aucun template d\'email actif trouvé')
    }

    return {
      name: 'Intégrité des données',
      success: issues.length === 0,
      details: issues.length === 0 
        ? 'Aucun problème d\'intégrité détecté' 
        : `${issues.length} problème(s) détecté(s)`,
      issues,
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    return {
      name: 'Intégrité des données',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

async function getDatabaseStats() {
  try {
    const stats: any = {}

    // Compter les rendez-vous par statut
    const { data: appointments } = await supabase
      .from('appointments')
      .select('status')

    if (appointments) {
      stats.totalAppointments = appointments.length
      stats.appointmentsByStatus = appointments.reduce((acc: any, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1
        return acc
      }, {})
    }

    // Compter les admins
    const { count: adminCount } = await supabase
      .from('admins')
      .select('*', { count: 'exact', head: true })

    stats.totalAdmins = adminCount || 0

    // Compter les templates actifs
    const { count: templateCount } = await supabase
      .from('email_templates')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    stats.activeEmailTemplates = templateCount || 0

    // Dernière activité admin
    const { data: lastActivity } = await supabase
      .from('admin_activity_log')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)

    if (lastActivity && lastActivity.length > 0) {
      stats.lastAdminActivity = lastActivity[0].created_at
    }

    return {
      name: 'Statistiques de la base de données',
      success: true,
      stats,
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    return {
      name: 'Statistiques de la base de données',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

export async function GET() {
  try {
    const results: any = {
      timestamp: new Date().toISOString(),
      status: 'success',
      checks: [],
      errors: []
    }

    // Test de connexion
    const connectionCheck = await testConnection()
    results.checks.push(connectionCheck)
    if (!connectionCheck.success) {
      results.status = 'error'
      results.errors.push('❌ Impossible de se connecter à la base de données')
      return NextResponse.json(results)
    }

    // Vérifier les tables
    const tablesCheck = await checkTables()
    results.checks.push(tablesCheck)
    if (!tablesCheck.success) {
      results.status = 'error'
      results.errors.push('❌ Problème avec les tables de la base de données')
    }

    // Vérifier l'intégrité
    const integrityCheck = await checkDataIntegrity()
    results.checks.push(integrityCheck)
    if (!integrityCheck.success) {
      results.status = 'warning'
      results.errors.push('⚠️ Problèmes d\'intégrité des données détectés')
    }

    // Statistiques
    const statsCheck = await getDatabaseStats()
    results.checks.push(statsCheck)
    results.stats = statsCheck.stats

    return NextResponse.json(results)
  } catch (error: any) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'error',
      checks: [],
      errors: [error.message]
    }, { status: 500 })
  }
}
