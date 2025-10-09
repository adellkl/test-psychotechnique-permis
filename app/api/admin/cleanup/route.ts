import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { logAdminActivity, AdminLogger } from '../../../../lib/adminLogger'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointmentIds, status, olderThan } = body
    
    let appointmentsToDelete: any[] = []
    
    if (appointmentIds && Array.isArray(appointmentIds) && appointmentIds.length > 0) {
      const { data, error: selectError } = await supabase
        .from('appointments')
        .select('id, first_name, last_name, appointment_date, status')
        .in('id', appointmentIds)

      if (selectError) {
        console.error('Error selecting appointments:', selectError)
        return NextResponse.json({ error: selectError.message }, { status: 500 })
      }

      appointmentsToDelete = data || []
    } else if (status && olderThan) {
      if (!['completed', 'cancelled'].includes(status)) {
        return NextResponse.json({ 
          error: 'Status parameter must be "completed" or "cancelled"' 
        }, { status: 400 })
      }

      const days = parseInt(olderThan)
      if (isNaN(days) || days < 0) {
        return NextResponse.json({ 
          error: 'olderThan parameter must be a number >= 0' 
        }, { status: 400 })
      }

      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      const cutoffDateString = cutoffDate.toISOString().split('T')[0]

      const { data, error: selectError } = await supabase
        .from('appointments')
        .select('id, first_name, last_name, appointment_date, status, created_at')
        .eq('status', status)
        .lte('created_at', cutoffDate.toISOString())

      if (selectError) {
        console.error('Error selecting appointments:', selectError)
        return NextResponse.json({ error: selectError.message }, { status: 500 })
      }

      appointmentsToDelete = data || []
    } else {
      return NextResponse.json({ 
        error: 'Either appointmentIds array or status+olderThan parameters are required' 
      }, { status: 400 })
    }

    const appointmentCount = appointmentsToDelete?.length || 0

    if (appointmentCount === 0) {
      return NextResponse.json({ 
        message: 'No appointments found matching the criteria',
        deletedCount: 0
      })
    }

    const idsToDelete = appointmentsToDelete.map(apt => apt.id)

    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .in('id', idsToDelete)

    if (deleteError) {
      console.error('Error deleting appointments:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    try {
      const appointmentNames = appointmentsToDelete.map(apt => `${apt.first_name} ${apt.last_name}`).join(', ')
      await logAdminActivity(
        AdminLogger.ACTIONS.DELETE_APPOINTMENT,
        `Deleted ${appointmentCount} appointments: ${appointmentNames}`
      )
    } catch (logError) {
      console.error('Logging error (non-blocking):', logError)
    }

    return NextResponse.json({
      message: `Successfully deleted ${appointmentCount} appointments`,
      deletedCount: appointmentCount,
      deletedAppointments: appointmentsToDelete
    })

  } catch (error) {
    console.error('Error in cleanup operation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const olderThan = searchParams.get('olderThan')
    
    if (!status || !['completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ 
        error: 'Status parameter is required and must be "completed" or "cancelled"' 
      }, { status: 400 })
    }

    const days = olderThan ? parseInt(olderThan) : 30
    if (isNaN(days) || days < 0) {
      return NextResponse.json({ 
        error: 'olderThan parameter must be a number >= 0' 
      }, { status: 400 })
    }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    const cutoffDateString = cutoffDate.toISOString().split('T')[0]

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('id, first_name, last_name, email, appointment_date, appointment_time, status, created_at')
      .eq('status', status)
      .lte('created_at', cutoffDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      appointments: appointments || [],
      count: appointments?.length || 0,
      cutoffDate: cutoffDateString,
      status,
      olderThanDays: days
    })

  } catch (error) {
    console.error('Error in cleanup preview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
