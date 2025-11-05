import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { requireAdmin } from '../../../../lib/adminAuth'
import { sanitizeString } from '../../../../lib/validation'
import { getRateLimitKey } from '../../../../lib/security'

// GET - Fetch appointments with filters
export async function GET(request: NextRequest) {
  try {
    // Sécurité : Authentification admin requise
    const authResult = await requireAdmin(request, {
      rateLimit: { maxRequests: 30, windowMs: 60000 }
    })
    
    if (authResult instanceof NextResponse) return authResult

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Validation et sanitization des paramètres
    const validStatuses = ['all', 'confirmed', 'completed', 'cancelled', 'no_show']
    const sanitizedStatus = status && validStatuses.includes(status) ? status : 'all'

    let query = supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (sanitizedStatus !== 'all') {
      query = query.eq('status', sanitizedStatus)
    }
    if (startDate) {
      query = query.gte('appointment_date', startDate)
    }
    if (endDate) {
      query = query.lte('appointment_date', endDate)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ appointments: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update appointment status
export async function PUT(request: NextRequest) {
  try {
    // Sécurité : Authentification admin requise
    const authResult = await requireAdmin(request, {
      rateLimit: { maxRequests: 20, windowMs: 60000 }
    })
    
    if (authResult instanceof NextResponse) return authResult
    const { admin } = authResult

    const body = await request.json()
    const { id, status, admin_notes } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validation du statut
    const validStatuses = ['confirmed', 'completed', 'cancelled', 'no_show']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Sanitization
    const updateData: any = { 
      status, 
      updated_at: new Date().toISOString() 
    }
    
    if (admin_notes !== undefined) {
      updateData.admin_notes = sanitizeString(admin_notes)
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select('*, centers(*)')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Si le statut est "cancelled", envoyer un email au client et libérer le créneau
    if (status === 'cancelled' && data && data[0]) {
      try {
        const appointment = data[0]
        const { sendAppointmentCancellation } = await import('../../../../lib/emailService')
        
        // Log pour débugger
        console.log('📧 Envoi email annulation pour:', {
          email: appointment.email,
          center_city: appointment.center_city,
          center_id: appointment.center_id,
          has_centers_relation: !!appointment.centers
        })
        
        // Récupérer les infos du centre depuis la relation si disponible
        const centerInfo = appointment.centers
        
        await sendAppointmentCancellation({
          first_name: appointment.first_name,
          last_name: appointment.last_name,
          email: appointment.email,
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time,
          reason: admin_notes || 'Annulation par le centre',
          center_city: appointment.center_city || centerInfo?.city,
          center_id: appointment.center_id?.toString(),
          center_name: centerInfo?.name,
          center_address: centerInfo?.address
        })
        
        console.log('✅ Email d\'annulation envoyé au client:', appointment.email)
      } catch (emailError) {
        console.error('❌ Erreur envoi email annulation:', emailError)
        // On ne bloque pas la mise à jour même si l'email échoue
      }

      // Remettre le créneau disponible dans le calendrier
      try {
        await supabase
          .from('available_slots')
          .update({ is_available: true })
          .eq('date', data[0].appointment_date)
          .eq('time', data[0].appointment_time)
          .eq('center_id', data[0].center_id || null)
        
        console.log('✅ Créneau remis disponible:', data[0].appointment_date, data[0].appointment_time)
      } catch (slotError) {
        console.error('⚠️ Erreur lors de la remise à disposition du créneau:', slotError)
      }
    }

    // Log de l'action
    const ip = getRateLimitKey(request)
    const { logAdminAction } = await import('../../../../lib/adminAuth')
    await logAdminAction(admin.id, 'UPDATE_APPOINTMENT', `Updated appointment ${id} to status ${status}`, ip)

    return NextResponse.json({ appointment: data[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete appointment and free up the slot
export async function DELETE(request: NextRequest) {
  try {
    // Sécurité : Authentification admin requise avec permissions élevées
    const authResult = await requireAdmin(request, {
      requireRole: ['super_admin', 'admin'],
      rateLimit: { maxRequests: 10, windowMs: 60000 }
    })
    
    if (authResult instanceof NextResponse) return authResult
    const { admin } = authResult

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }

    // Validation UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid appointment ID format' }, { status: 400 })
    }

    // Récupérer les infos du rendez-vous avant de le supprimer
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('appointment_date, appointment_time, status')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    // Supprimer le rendez-vous
    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Libérer le créneau UNIQUEMENT si le rendez-vous était annulé (cancelled)
    if (appointment && appointment.status === 'cancelled') {
      const slotTime = appointment.appointment_time.includes(':') 
        ? appointment.appointment_time 
        : `${appointment.appointment_time}:00`

      await supabase
        .from('available_slots')
        .update({ is_available: true })
        .eq('date', appointment.appointment_date)
        .eq('start_time', slotTime)
    }

    // Log de l'action
    const ip = getRateLimitKey(request)
    const { logAdminAction } = await import('../../../../lib/adminAuth')
    await logAdminAction(admin.id, 'DELETE_APPOINTMENT', `Deleted appointment ${id}`, ip)

    return NextResponse.json({ message: 'Appointment deleted and slot freed successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
