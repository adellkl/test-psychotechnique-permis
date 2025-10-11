import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { logAdminActivity, AdminLogger } from '../../../../lib/adminLogger'

// GET - Preview logs to be deleted
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const olderThan = searchParams.get('olderThan') || '30'
    
    const days = parseInt(olderThan)
    if (isNaN(days) || days < 0) {
      return NextResponse.json({ 
        error: 'olderThan parameter must be a number >= 0' 
      }, { status: 400 })
    }

    // Permettre 0 pour voir tous les logs actuels
    if (days === 0) {
      const cutoffDate = new Date() // Date actuelle
      
      const { count: totalCount, error: countError } = await supabase
        .from('admin_logs')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        return NextResponse.json({ error: countError.message }, { status: 500 })
      }

      const { data: logs, error } = await supabase
        .from('admin_logs')
        .select('id, admin_id, action, details, created_at')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        logs: logs || [],
        count: totalCount || 0,
        previewCount: logs?.length || 0,
        cutoffDate: cutoffDate.toISOString().split('T')[0],
        olderThanDays: days
      })
    }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Compter le nombre total de logs qui seront supprimés
    const { count: totalCount, error: countError } = await supabase
      .from('admin_logs')
      .select('*', { count: 'exact', head: true })
      .lte('created_at', cutoffDate.toISOString())

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    // Récupérer les 100 premiers logs pour l'aperçu
    const { data: logs, error } = await supabase
      .from('admin_logs')
      .select('id, admin_id, action, details, created_at')
      .lte('created_at', cutoffDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      logs: logs || [],
      count: totalCount || 0, // Nombre total de logs qui seront supprimés
      previewCount: logs?.length || 0, // Nombre de logs dans l'aperçu
      cutoffDate: cutoffDate.toISOString().split('T')[0],
      olderThanDays: days
    })

  } catch (error) {
    console.error('Error in logs cleanup preview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete old admin logs
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { olderThan } = body
    
    if (!olderThan) {
      return NextResponse.json({ 
        error: 'olderThan parameter is required' 
      }, { status: 400 })
    }

    const days = parseInt(olderThan)
    if (isNaN(days) || days < 0) {
      return NextResponse.json({ 
        error: 'olderThan parameter must be a number >= 0' 
      }, { status: 400 })
    }

    // Si 0, supprimer tous les logs
    if (days === 0) {
      const { count: logsCount, error: countError } = await supabase
        .from('admin_logs')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        console.error('Error counting logs:', countError)
        return NextResponse.json({ error: countError.message }, { status: 500 })
      }

      if (!logsCount || logsCount === 0) {
        return NextResponse.json({ 
          message: 'No logs found',
          deletedCount: 0
        })
      }

      const { error: deleteError } = await supabase
        .from('admin_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (deleteError) {
        console.error('Error deleting logs:', deleteError)
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }

      try {
        await logAdminActivity(
          AdminLogger.ACTIONS.DELETE_APPOINTMENT,
          `Cleaned up all ${logsCount} admin logs`
        )
      } catch (logError) {
        console.error('Logging error (non-blocking):', logError)
      }

      return NextResponse.json({
        message: `Successfully deleted all ${logsCount} admin logs`,
        deletedCount: logsCount,
        cutoffDate: new Date().toISOString().split('T')[0]
      })
    }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Compter d'abord combien de logs seront supprimés
    const { count: logsCount, error: countError } = await supabase
      .from('admin_logs')
      .select('*', { count: 'exact', head: true })
      .lte('created_at', cutoffDate.toISOString())

    if (countError) {
      console.error('Error counting logs:', countError)
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    if (!logsCount || logsCount === 0) {
      return NextResponse.json({ 
        message: 'No logs found matching the criteria',
        deletedCount: 0
      })
    }

    // Supprimer les logs
    const { error: deleteError } = await supabase
      .from('admin_logs')
      .delete()
      .lte('created_at', cutoffDate.toISOString())

    if (deleteError) {
      console.error('Error deleting logs:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Logger l'action de nettoyage
    try {
      await logAdminActivity(
        AdminLogger.ACTIONS.DELETE_APPOINTMENT,
        `Cleaned up ${logsCount} admin logs older than ${days} days`
      )
    } catch (logError) {
      console.error('Logging error (non-blocking):', logError)
    }

    return NextResponse.json({
      message: `Successfully deleted ${logsCount} admin logs`,
      deletedCount: logsCount,
      cutoffDate: cutoffDate.toISOString().split('T')[0]
    })

  } catch (error) {
    console.error('Error in logs cleanup operation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
