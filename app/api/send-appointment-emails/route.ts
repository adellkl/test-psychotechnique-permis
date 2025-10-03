import { NextRequest, NextResponse } from 'next/server'
import { sendAppointmentConfirmation, sendAppointmentNotificationToAdmin } from '../../../lib/email'

export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json()

    // Send confirmation email to client
    await sendAppointmentConfirmation({
      first_name: appointmentData.first_name,
      last_name: appointmentData.last_name,
      email: appointmentData.email,
      appointment_date: appointmentData.appointment_date,
      appointment_time: appointmentData.appointment_time
    })

    // Send notification email to admin
    await sendAppointmentNotificationToAdmin({
      first_name: appointmentData.first_name,
      last_name: appointmentData.last_name,
      email: appointmentData.email,
      phone: appointmentData.phone,
      appointment_date: appointmentData.appointment_date,
      appointment_time: appointmentData.appointment_time,
      reason: appointmentData.reason
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending emails:', error)
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    )
  }
}
