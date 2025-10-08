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

    // Check if slot is already booked
    const { data: existingAppointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', appointment_date)
      .eq('appointment_time', appointment_time)
      .in('status', ['confirmed', 'completed'])
      .single()

    if (existingAppointment) {
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
      duration_minutes: 120, // 2 hours default
      test_type,
      reason,
      is_second_chance,
      status: 'confirmed',
      client_notes: client_notes || null,
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

    // Send confirmation emails
    try {
      console.log('📧 Envoi des emails de confirmation...')
      
      // Email au client
      console.log('📤 Envoi email client à:', email)
      await sendAppointmentConfirmation({
        first_name,
        last_name,
        email,
        phone,
        appointment_date,
        appointment_time
      })
      console.log('✅ Email client envoyé avec succès')

      // Email à l'admin
      console.log('📤 Envoi email admin à:', process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com')
      await sendAppointmentNotificationToAdmin({
        first_name,
        last_name,
        email,
        phone,
        appointment_date,
        appointment_time
      })
      console.log('✅ Email admin envoyé avec succès')
    } catch (emailError) {
      console.error('❌ Error sending emails:', emailError)
      console.error('❌ Email error details:', JSON.stringify(emailError, null, 2))
      // Don't fail the appointment creation if emails fail
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
