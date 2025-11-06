import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { sendAppointmentConfirmation, sendAppointmentNotificationToAdmin } from '../../../lib/emailService'
import { validateAppointmentForm, sanitizeString } from '../../../lib/validation'
import { 
  securityMiddleware, 
  getRateLimitKey, 
  checkRateLimit,
  advancedSecurityMiddleware,
  addSecurityHeaders
} from '../../../lib/security'

// POST - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 🔒 SÉCURITÉ AVANCÉE : Honeypot + Injection + User-Agent + IP Blacklist
    const advancedCheck = advancedSecurityMiddleware(request, {
      checkHoneypot: true,
      honeypotField: 'website', // Champ piège invisible
      checkUserAgent: true,
      checkInjections: true,
      data: body
    })
    if (advancedCheck) return addSecurityHeaders(advancedCheck)
    
    // Sécurité : Rate limiting (5 requêtes par minute par IP)
    const ip = getRateLimitKey(request)
    const { allowed } = checkRateLimit(ip, 5, 60000)
    
    if (!allowed) {
      return addSecurityHeaders(NextResponse.json(
        { error: 'Trop de tentatives. Veuillez réessayer dans quelques instants.' },
        { status: 429 }
      ))
    }

    // Sécurité : Validation de l'origine
    const securityCheck = securityMiddleware(request, { validateOrigin: true })
    if (securityCheck) return addSecurityHeaders(securityCheck)
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
      client_notes,
      center_id
    } = body

    // Validation complète des données
    const validation = validateAppointmentForm({
      firstName: first_name,
      lastName: last_name,
      email,
      phone,
      reason,
      notes: client_notes,
      date: appointment_date,
      time: appointment_time
    })

    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Données invalides', 
        details: validation.errors 
      }, { status: 400 })
    }

    // Sanitization des données
    const sanitizedData = {
      first_name: sanitizeString(first_name),
      last_name: sanitizeString(last_name),
      email: email.toLowerCase().trim(),
      phone: phone.replace(/\s/g, ''),
      test_type: sanitizeString(test_type),
      reason: sanitizeString(reason),
      client_notes: client_notes ? sanitizeString(client_notes) : null
    }

    // Check if slot is still available for this center
    const { data: existingSlot, error: slotError } = await supabase
      .from('available_slots')
      .select('*')
      .eq('date', appointment_date)
      .eq('start_time', appointment_time + ':00')
      .eq('center_id', center_id)
      .eq('is_available', true)
      .single()

    if (slotError || !existingSlot) {
      return NextResponse.json({ error: 'Selected time slot is no longer available' }, { status: 400 })
    }

    // Check if slot is already booked for this center (exclude cancelled appointments)
    const { data: existingAppointments, error: appointmentError } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', appointment_date)
      .eq('appointment_time', appointment_time)
      .eq('center_id', center_id)
      .in('status', ['confirmed', 'completed'])

    if (appointmentError) {
      console.error('Error checking existing appointments:', appointmentError)
    }

    if (existingAppointments && existingAppointments.length > 0) {
      return NextResponse.json({ error: 'This time slot is already booked' }, { status: 400 })
    }

    // Validate center_id is provided
    if (!center_id) {
      return NextResponse.json({ 
        error: 'Centre non sélectionné', 
        details: ['Veuillez sélectionner un centre'] 
      }, { status: 400 })
    }

    // Get center information
    const { data: centerInfo, error: centerError } = await supabase
      .from('centers')
      .select('*')
      .eq('id', center_id)
      .single()

    if (centerError || !centerInfo) {
      return NextResponse.json({ 
        error: 'Centre invalide', 
        details: ['Le centre sélectionné n\'existe pas'] 
      }, { status: 400 })
    }

    // Create the appointment avec données sanitizées
    const appointmentData = {
      first_name: sanitizedData.first_name,
      last_name: sanitizedData.last_name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      appointment_date,
      appointment_time,
      duration_minutes: 40,
      test_type: sanitizedData.test_type,
      reason: sanitizedData.reason,
      is_second_chance,
      status: 'confirmed',
      client_notes: sanitizedData.client_notes,
      center_id: center_id,
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

    // Notifications désactivées - table supprimée
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
        created_at: appointment.created_at,
        center_name: centerInfo.name,
        center_address: centerInfo.address,
        center_city: centerInfo.city,
        center_postal_code: centerInfo.postal_code
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
        appointment_time,
        center_name: centerInfo.name,
        center_address: centerInfo.address,
        center_city: centerInfo.city,
        center_postal_code: centerInfo.postal_code
      })
      console.log('✅ Email admin envoyé avec succès, ID:', adminResult?.messageId)
    } catch (adminError) {
      console.error('❌ ERREUR EMAIL ADMIN:', adminError)
      console.error('❌ Stack:', adminError instanceof Error ? adminError.stack : 'No stack')
    }

    const response = NextResponse.json({
      appointment,
      message: 'Appointment created successfully'
    }, { status: 201 })
    
    return addSecurityHeaders(response)

  } catch (error) {
    console.error('Error creating appointment:', error)
    return addSecurityHeaders(NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }
}

// GET - Fetch appointments (for admin use)
export async function GET(request: NextRequest) {
  try {
    // Protection basique pour GET
    const ip = getRateLimitKey(request)
    const { allowed } = checkRateLimit(`get-appointments:${ip}`, 30, 60000)
    if (!allowed) {
      return addSecurityHeaders(NextResponse.json(
        { error: 'Trop de requêtes' },
        { status: 429 }
      ))
    }
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

    return addSecurityHeaders(NextResponse.json({ appointments: data }))
  } catch (error) {
    return addSecurityHeaders(NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }
}
