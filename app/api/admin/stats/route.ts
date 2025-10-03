import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// GET - Fetch dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))
    const startDateStr = startDate.toISOString().split('T')[0]

    // Get appointment statistics
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('status, appointment_date, created_at')
      .gte('appointment_date', startDateStr)

    if (appointmentsError) {
      return NextResponse.json({ error: appointmentsError.message }, { status: 500 })
    }

    // Get available slots count
    const { data: slots, error: slotsError } = await supabase
      .from('available_slots')
      .select('is_available, date')
      .gte('date', startDateStr)

    if (slotsError) {
      return NextResponse.json({ error: slotsError.message }, { status: 500 })
    }

    // Calculate statistics
    const totalAppointments = appointments?.length || 0
    const confirmedAppointments = appointments?.filter(a => a.status === 'confirmed').length || 0
    const completedAppointments = appointments?.filter(a => a.status === 'completed').length || 0
    const cancelledAppointments = appointments?.filter(a => a.status === 'cancelled').length || 0
    const noShowAppointments = appointments?.filter(a => a.status === 'no_show').length || 0

    const totalSlots = slots?.length || 0
    const availableSlots = slots?.filter(s => s.is_available).length || 0
    const bookedSlots = totalSlots - availableSlots

    // Calculate daily statistics for chart
    const dailyStats = []
    for (let i = parseInt(period) - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayAppointments = appointments?.filter(a => a.appointment_date === dateStr) || []
      
      dailyStats.push({
        date: dateStr,
        appointments: dayAppointments.length,
        confirmed: dayAppointments.filter(a => a.status === 'confirmed').length,
        completed: dayAppointments.filter(a => a.status === 'completed').length,
        cancelled: dayAppointments.filter(a => a.status === 'cancelled').length
      })
    }

    // Get recent activity (last 10 appointments)
    const { data: recentAppointments, error: recentError } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (recentError) {
      return NextResponse.json({ error: recentError.message }, { status: 500 })
    }

    const stats = {
      appointments: {
        total: totalAppointments,
        confirmed: confirmedAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
        noShow: noShowAppointments,
        completionRate: totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0
      },
      slots: {
        total: totalSlots,
        available: availableSlots,
        booked: bookedSlots,
        utilizationRate: totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0
      },
      dailyStats,
      recentAppointments: recentAppointments || []
    }

    return NextResponse.json({ stats })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
