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

    console.log('🔍 [API] Requête available-slots:', {
      startDate,
      endDate,
      centerId,
      hasCenterId: !!centerId
    })

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start date and end date are required' }, { status: 400 })
    }

    // Get available slots that are not booked
    let query = supabase
      .from('available_slots')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)

    // Filter by center if centerId is provided
    if (centerId) {
      console.log('✅ [API] Filtrage par centre:', centerId)
      query = query.eq('center_id', centerId)
    } else {
      console.log('⚠️ [API] Aucun filtre de centre appliqué - TOUS les créneaux seront retournés')
    }

    let { data: slots, error: slotsError } = await query.order('date')

    if (slotsError) {
      console.error('❌ [API] Erreur lors de la récupération des créneaux:', slotsError)
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

    console.log(`📊 [API] ${slots?.length || 0} créneaux disponibles trouvés avant filtrage appointments`)

    if (slots && slots.length > 0) {
      console.log('📋 [API] Exemples de créneaux trouvés avec is_available=true:', slots.slice(0, 3).map(s => ({
        date: s.date,
        time: s.start_time || s.time,
        center_id: s.center_id,
        is_available: s.is_available
      })))
    }

    // Log si aucun créneau trouvé
    if (!slots || slots.length === 0) {
      console.warn('⚠️ [API] Aucun créneau disponible trouvé pour les critères donnés')
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

    console.log(`🔒 [API] ${bookedSlots.size} créneaux réservés (confirmed)`)

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

    console.log(`✅ [API] ${allSlots.length} créneaux retournés (${allSlots.filter(s => s.is_available).length} disponibles, ${allSlots.filter(s => s.is_booked).length} réservés)${centerId ? ` (centre=${centerId})` : ''}`)

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
