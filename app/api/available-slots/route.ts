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

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start date and end date are required' }, { status: 400 })
    }

    // Get available slots that are not booked
    const { data: slots, error: slotsError } = await supabase
      .from('available_slots')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('is_available', true)
      .order('date')
      .order('start_time')

    if (slotsError) {
      return NextResponse.json({ error: slotsError.message }, { status: 500 })
    }

    // Get existing appointments to check which slots are already booked or pending
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('appointment_date, appointment_time, status')
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .neq('status', 'cancelled')

    if (appointmentsError) {
      return NextResponse.json({ error: appointmentsError.message }, { status: 500 })
    }

    // Separate confirmed/completed and pending appointments
    const bookedSlots = new Set(
      appointments?.filter(apt => apt.status === 'confirmed' || apt.status === 'completed')
        .map(apt => `${apt.appointment_date}_${apt.appointment_time}`) || []
    )

    const pendingSlots = new Set(
      appointments?.filter(apt => apt.status === 'pending')
        .map(apt => `${apt.appointment_date}_${apt.appointment_time}`) || []
    )

    // Filter out confirmed/completed slots and add pending status to pending slots
    const availableSlots = slots?.filter(slot => {
      const slotKey = `${slot.date}_${slot.start_time}`
      return !bookedSlots.has(slotKey)
    }).map(slot => {
      const slotKey = `${slot.date}_${slot.start_time}`
      return {
        ...slot,
        isPending: pendingSlots.has(slotKey)
      }
    }) || []

    return NextResponse.json({ slots: availableSlots })
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
