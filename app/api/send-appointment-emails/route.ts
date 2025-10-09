import { NextRequest, NextResponse } from 'next/server'
import { sendAppointmentConfirmation, sendAppointmentNotificationToAdmin } from '../../../lib/emailService'
import { isValidEmail, isValidPhone, isValidName, sanitizeString } from '../../../lib/validation'

export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json()

    // Validate required fields
    if (!appointmentData.first_name || !appointmentData.last_name || !appointmentData.email) {
      return NextResponse.json({ error: 'Missing required fields', appointmentData }, { status: 400, })
    }

    // Validate email format
    if (!isValidEmail(appointmentData.email)) {
      return NextResponse.json({ error: 'Invalid email format', appointmentData }, { status: 400, })
    }

    // Validate phone if provided
    if (appointmentData.phone && !isValidPhone(appointmentData.phone)) {
      return NextResponse.json({ error: 'Invalid phone format', appointmentData }, { status: 400, })
    }

    // Validate names
    if (!isValidName(appointmentData.first_name) || !isValidName(appointmentData.last_name)) {
      return NextResponse.json({ error: 'Invalid name format', appointmentData }, { status: 400, })
    }

    // Sanitize all string inputs
    const sanitizedData = {
      first_name: sanitizeString(appointmentData.first_name),
      last_name: sanitizeString(appointmentData.last_name),
      email: sanitizeString(appointmentData.email).toLowerCase(),
      phone: appointmentData.phone ? sanitizeString(appointmentData.phone) : '',
      appointment_date: appointmentData.appointment_date,
      appointment_time: appointmentData.appointment_time,
      reason: appointmentData.reason ? sanitizeString(appointmentData.reason) : '',
      appointment_id: appointmentData.appointment_id,
      created_at: appointmentData.created_at
    }

    console.log('📧 Sending emails for appointment:', {
      client_email: sanitizedData.email,
      name: `${sanitizedData.first_name} ${sanitizedData.last_name}`,
      date: sanitizedData.appointment_date,
      time: sanitizedData.appointment_time
    })

    // Send both emails in parallel for instant delivery
    const [clientEmailResult, adminEmailResult] = await Promise.allSettled([
      sendAppointmentConfirmation(sanitizedData),
      sendAppointmentNotificationToAdmin(sanitizedData)
    ])

    // Log results
    if (clientEmailResult.status === 'fulfilled') {
      console.log('✅ Client confirmation email sent to:', sanitizedData.email)
    } else {
      console.error('❌ Client email failed:', clientEmailResult.reason)
    }

    if (adminEmailResult.status === 'fulfilled') {
      console.log('✅ Admin notification email sent to:', process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com')
    } else {
      console.error('❌ Admin email failed:', adminEmailResult.reason)
    }

    return NextResponse.json({
      success: true,
      client_email_id: clientEmailResult.status === 'fulfilled' ? clientEmailResult.value?.messageId : null,
      admin_email_id: adminEmailResult.status === 'fulfilled' ? adminEmailResult.value?.messageId : null,
      appointmentData
    })
  } catch (error) {
    console.error('❌ Error sending emails:', error)
    return NextResponse.json(
      { error: 'Failed to send emails', details: error instanceof Error ? error.message : 'Unknown error', appointmentData: await request.json() },
      { status: 500 }
    )
  }
}
