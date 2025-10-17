import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { sendAppointmentConfirmation, sendAppointmentNotificationToAdmin } from '../../../lib/emailService'

// POST - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      first_name,
      last_name,
      email,
      phone,
      appointment_date,
      appointment_time,
      test_type,
      reason,
      is_second_chance = false,
      client_notes
    } = body

    // Validate required fields
    if (!first_name || !last_name || !email || !phone || !appointment_date || !appointment_time || !test_type || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if slot is still available
    const { data: existingSlot, error: slotError } = await supabase
      .from('available_slots')
      .select('*')
      .eq('date', appointment_date)
      .eq('start_time', appointment_time + ':00')
      .eq('is_available', true)
      .single()

    if (slotError || !existingSlot) {
      return NextResponse.json({ error: 'Selected time slot is no longer available' }, { status: 400 })
    }

    // Check if slot is already booked (exclude cancelled appointments)
    const { data: existingAppointments, error: appointmentError } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', appointment_date)
      .eq('appointment_time', appointment_time)
      .in('status', ['confirmed', 'completed'])

    if (appointmentError) {
      console.error('Error checking existing appointments:', appointmentError)
    }

    if (existingAppointments && existingAppointments.length > 0) {
      return NextResponse.json({ error: 'This time slot is already booked' }, { status: 400 })
    }

    // Create the appointment
    const appointmentData = {
      first_name,
      last_name,
      email,
      phone,
      appointment_date,
      appointment_time,
      duration_minutes: 40, // 40 minutes
      test_type,
      reason,
      is_second_chance,
      status: 'confirmed', // Confirmé automatiquement par défaut
      client_notes: client_notes || null,
      center_id: '11111111-1111-1111-1111-111111111111', // Centre par défaut (Clichy)
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: appointment, error: createError } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    // Notifications désactivées - table supprimée de la base de données
    console.log('📧 Envoi des emails de confirmation...')
    console.log('📧 Configuration:', {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      FROM_EMAIL: process.env.FROM_EMAIL,
      ELASTIC_EMAIL_API_KEY: process.env.ELASTIC_EMAIL_API_KEY ? 'Définie' : 'Non définie'
    })

    // Send confirmation emails
    try {
      // Email au client
      console.log('📤 Envoi email client à:', email)
      const clientResult = await sendAppointmentConfirmation({
        first_name,
        last_name,
        email,
        phone,
        appointment_date,
        appointment_time,
        appointment_id: appointment.id,
        created_at: appointment.created_at
      })
      console.log('✅ Email client envoyé avec succès, ID:', clientResult?.messageId)
    } catch (clientError) {
      console.error('❌ ERREUR EMAIL CLIENT:', clientError)
      console.error('❌ Stack:', clientError instanceof Error ? clientError.stack : 'No stack')
    }

    try {
      // Email à l'admin
      console.log('📤 Envoi email admin à:', process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com')
      const adminResult = await sendAppointmentNotificationToAdmin({
        first_name,
        last_name,
        email,
        phone,
        appointment_date,
        appointment_time
      })
      console.log('✅ Email admin envoyé avec succès, ID:', adminResult?.messageId)
    } catch (adminError) {
      console.error('❌ ERREUR EMAIL ADMIN:', adminError)
      console.error('❌ Stack:', adminError instanceof Error ? adminError.stack : 'No stack')
    }

    return NextResponse.json({
      appointment,
      message: 'Appointment created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET - Fetch appointments (for admin use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (email) {
      query = query.eq('email', email)
    }
    if (status && status !== 'all') {
      query = query.eq('status', status)
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
