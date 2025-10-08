import { NextRequest, NextResponse } from 'next/server'
import { sendAppointmentConfirmation, sendAppointmentNotificationToAdmin } from '../../../lib/emailService'
import { isValidEmail, isValidPhone, isValidName, sanitizeString } from '../../../lib/validation'

export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json()

    // Validate required fields
    if (!appointmentData.first_name || !appointmentData.last_name || !appointmentData.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email format
    if (!isValidEmail(appointmentData.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate phone if provided
    if (appointmentData.phone && !isValidPhone(appointmentData.phone)) {
      return NextResponse.json({ error: 'Invalid phone format' }, { status: 400 })
    }

    // Validate names
    if (!isValidName(appointmentData.first_name) || !isValidName(appointmentData.last_name)) {
      return NextResponse.json({ error: 'Invalid name format' }, { status: 400 })
    }

    // Sanitize all string inputs
    const sanitizedData = {
      first_name: sanitizeString(appointmentData.first_name),
      last_name: sanitizeString(appointmentData.last_name),
      email: sanitizeString(appointmentData.email).toLowerCase(),
      phone: appointmentData.phone ? sanitizeString(appointmentData.phone) : '',
      appointment_date: appointmentData.appointment_date,
      appointment_time: appointmentData.appointment_time,
      reason: appointmentData.reason ? sanitizeString(appointmentData.reason) : ''
    }

    console.log('📧 Sending emails for appointment:', {
      client_email: sanitizedData.email,
      name: `${sanitizedData.first_name} ${sanitizedData.last_name}`,
      date: sanitizedData.appointment_date,
      time: sanitizedData.appointment_time
    })

    let clientEmailResult
    let adminEmailResult

    // Send confirmation email to client
    try {
      clientEmailResult = await sendAppointmentConfirmation(sanitizedData)
      console.log('✅ Client confirmation email sent to:', sanitizedData.email)
    } catch (clientError) {
      console.error('❌ Client email failed:', clientError)
    }

    // Send notification email to admin
    try {
      adminEmailResult = await sendAppointmentNotificationToAdmin(sanitizedData)
      console.log('✅ Admin notification email sent to:', process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com')
    } catch (adminError) {
      console.error('❌ Admin email failed:', adminError)
    }

    return NextResponse.json({
      success: true,
      client_email_id: clientEmailResult?.messageId,
      admin_email_id: adminEmailResult?.messageId
    })
  } catch (error) {
    console.error('❌ Error sending emails:', error)
    return NextResponse.json(
      { error: 'Failed to send emails', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
