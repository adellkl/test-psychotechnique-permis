import nodemailer from 'nodemailer'
import { supabase } from './supabase'

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Replace template variables
function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  let result = template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value)
  })
  return result
}

// Send appointment confirmation to client
export async function sendAppointmentConfirmation(appointmentData: {
  first_name: string
  last_name: string
  email: string
  appointment_date: string
  appointment_time: string
}) {
  try {
    // Get email template
    const { data: template } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_name', 'appointment_confirmation_client')
      .single()

    if (!template) throw new Error('Email template not found')

    // Format date and time
    const formattedDate = new Date(appointmentData.appointment_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const variables = {
      first_name: appointmentData.first_name,
      last_name: appointmentData.last_name,
      appointment_date: formattedDate,
      appointment_time: appointmentData.appointment_time,
      location: 'Centre Psychotechnique Permis Expert, 3 rue de la Paix, 92110 Clichy',
      location_details: 'À 3 minutes du métro Mairie de Clichy (Ligne 13)'
    }

    const htmlContent = replaceTemplateVariables(template.html_content, variables)
    const textContent = replaceTemplateVariables(template.text_content, variables)
    const subject = replaceTemplateVariables(template.subject, variables)

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: appointmentData.email,
      subject,
      html: htmlContent,
      text: textContent,
    })

    console.log('Confirmation email sent to client:', appointmentData.email)
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    throw error
  }
}

// Send appointment notification to admin
export async function sendAppointmentNotificationToAdmin(appointmentData: {
  first_name: string
  last_name: string
  email: string
  phone: string
  appointment_date: string
  appointment_time: string
  reason: string
}) {
  try {
    // Get email template
    const { data: template } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_name', 'appointment_notification_admin')
      .single()

    if (!template) throw new Error('Email template not found')

    // Format date
    const formattedDate = new Date(appointmentData.appointment_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const variables = {
      first_name: appointmentData.first_name,
      last_name: appointmentData.last_name,
      email: appointmentData.email,
      phone: appointmentData.phone,
      appointment_date: formattedDate,
      appointment_time: appointmentData.appointment_time,
      reason: appointmentData.reason
    }

    const htmlContent = replaceTemplateVariables(template.html_content, variables)
    const textContent = replaceTemplateVariables(template.text_content, variables)
    const subject = replaceTemplateVariables(template.subject, variables)

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject,
      html: htmlContent,
      text: textContent,
    })

    console.log('Notification email sent to admin')
  } catch (error) {
    console.error('Error sending admin notification:', error)
    throw error
  }
}
