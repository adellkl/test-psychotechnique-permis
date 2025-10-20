import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET - Fetch available slots for client booking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const centerId = searchParams.get('centerId')

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start date and end date are required' }, { status: 400 })
    }

    // Get available slots that are not booked
    let query = supabase
      .from('available_slots')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('is_available', true)

    // Filter by center if centerId is provided
    if (centerId) {
      query = query.eq('center_id', centerId)
    }

    const { data: slots, error: slotsError } = await query
      .order('date')
      .order('start_time')

    if (slotsError) {
      return NextResponse.json({ error: slotsError.message }, { status: 500 })
    }

    // Get existing appointments to check which slots are already booked
    // Only confirmed and completed appointments block the slot
    // Cancelled, pending, and no_show appointments free up the slot
    let appointmentsQuery = supabase
      .from('appointments')
      .select('appointment_date, appointment_time, status, center_id')
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .in('status', ['confirmed', 'completed'])

    // Filter appointments by center if centerId is provided
    if (centerId) {
      appointmentsQuery = appointmentsQuery.eq('center_id', centerId)
    }

    const { data: appointments, error: appointmentsError } = await appointmentsQuery

    if (appointmentsError) {
      return NextResponse.json({ error: appointmentsError.message }, { status: 500 })
    }

    // Create set of booked slots (confirmed and completed only)
    const bookedSlots = new Set(
      appointments?.map(apt => `${apt.appointment_date}_${apt.appointment_time}`) || []
    )

    // Filter out booked slots - cancelled appointments free up the slot
    const availableSlots = slots?.filter(slot => {
      const slotKey = `${slot.date}_${slot.start_time}`
      return !bookedSlots.has(slotKey)
    }) || []

    return NextResponse.json({ slots: availableSlots })
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
