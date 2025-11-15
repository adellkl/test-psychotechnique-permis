import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// Désactiver le cache pour avoir des données toujours fraîches
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const centerId = searchParams.get('centerId')


    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start date and end date are required' }, { status: 400 })
    }

    // Récupérer les créneaux disponibles
    let query = supabase
      .from('available_slots')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)

    // Filtrer par centre si spécifié
    if (centerId) {
      query = query.eq('center_id', centerId)
    }

    let { data: slots, error: slotsError } = await query.order('date')

    if (slotsError) {
      return NextResponse.json({ error: slotsError.message }, { status: 500 })
    }

    // Filtrer manuellement les créneaux disponibles et trier
    if (slots && slots.length > 0) {
      // Garder seulement les créneaux disponibles (is_available = true ou null)
      slots = slots.filter(s => s.is_available !== false)

      // Trier par start_time
      slots = slots.sort((a, b) => {
        const timeA = a.start_time || a.time || ''
        const timeB = b.start_time || b.time || ''
        return timeA.localeCompare(timeB)
      })
    }


    // Normaliser les champs: utiliser 'time' si 'start_time' est vide
    const normalizedSlots = (slots || []).map((s: any) => ({
      ...s,
      start_time: s.start_time || s.time,
      is_available: s.is_available !== false, // traiter null/undefined comme disponible
    }))

    // Get existing appointments to check which slots are already booked
    // Only confirmed appointments block the slot
    // Cancelled appointments free up the slot
    let appointmentsQuery = supabase
      .from('appointments')
      .select('appointment_date, appointment_time, status, center_id')
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .eq('status', 'confirmed')

    // Filter appointments by center if centerId is provided
    if (centerId) {
      appointmentsQuery = appointmentsQuery.eq('center_id', centerId)
    }

    const { data: appointments, error: appointmentsError } = await appointmentsQuery

    if (appointmentsError) {
      return NextResponse.json({ error: appointmentsError.message }, { status: 500 })
    }

    // Create set of booked slots (confirmed only)
    const bookedSlots = new Set(
      appointments?.map(apt => `${apt.appointment_date}_${apt.appointment_time}`) || []
    )


    // Mark slots as booked or available - return ALL slots
    const allSlots = normalizedSlots?.map(slot => {
      const time = slot.start_time || slot.time
      if (!time) return null
      const slotKey = `${slot.date}_${time}`
      const isBooked = bookedSlots.has(slotKey)

      return {
        ...slot,
        is_booked: isBooked,
        is_available: !isBooked && slot.is_available !== false
      }
    }).filter(slot => slot !== null) || []


    return NextResponse.json({ slots: allSlots })
  } catch (error: any) {
    console.error('❌ [API] Erreur fatale:', error)
    console.error('Stack:', error?.stack)
    return NextResponse.json({
      error: 'Internal server error',
      message: error?.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 })
  }
}
