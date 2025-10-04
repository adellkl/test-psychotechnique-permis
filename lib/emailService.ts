import { Resend } from 'resend'
import { supabase } from './supabase'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email template interface
interface EmailTemplate {
  id: string
  template_name: string
  subject: string
  html_content: string
  text_content: string
  created_at: string
  updated_at: string
}

// Replace template variables
function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  let result = template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value)
  })
  return result
}

// Get email template from database
async function getEmailTemplate(templateName: string): Promise<EmailTemplate> {
  const { data: template, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('template_name', templateName)
    .single()

  if (error || !template) {
    throw new Error(`Email template '${templateName}' not found`)
  }

  return template
}

// Send appointment confirmation to client
export async function sendAppointmentConfirmation(appointmentData: {
  first_name: string
  last_name: string
  email: string
  phone?: string
  appointment_date: string
  appointment_time: string
}) {
  try {
    console.log(`📧 Sending confirmation email to: ${appointmentData.email}`)

    const template = await getEmailTemplate('appointment_confirmation_client')

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
      email: appointmentData.email,
      phone: appointmentData.phone || 'Non renseigné',
      appointment_date: formattedDate,
      appointment_time: appointmentData.appointment_time,
      location: 'Centre Psychotechnique Permis Expert',
      address: '82 Rue Henri Barbusse, 92110 Clichy',
      location_details: 'À 3 minutes du métro Mairie de Clichy (Ligne 13)',
      contact_phone: '07 65 56 53 79',
      website: 'https://test-psychotechnique-permis.com'
    }

    const htmlContent = replaceTemplateVariables(template.html_content, variables)
    const textContent = replaceTemplateVariables(template.text_content, variables)
    const subject = replaceTemplateVariables(template.subject, variables)

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: appointmentData.email,
      subject,
      html: htmlContent,
      text: textContent,
    })

    if (error) {
      throw error
    }

    console.log('✅ Confirmation email sent to client:', appointmentData.email, 'ID:', data?.id)
    return data
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error)
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
    const template = await getEmailTemplate('appointment_notification_admin')

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
      reason: appointmentData.reason,
      dashboard_url: process.env.NEXT_PUBLIC_APP_URL + '/admin/dashboard'
    }

    const htmlContent = replaceTemplateVariables(template.html_content, variables)
    const textContent = replaceTemplateVariables(template.text_content, variables)
    const subject = replaceTemplateVariables(template.subject, variables)

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL || 'f.sebti@outlook.com',
      subject,
      html: htmlContent,
      text: textContent,
    })

    if (error) {
      throw error
    }

    console.log('✅ Notification email sent to admin, ID:', data?.id)
    return data
  } catch (error) {
    console.error('❌ Error sending admin notification:', error)
    throw error
  }
}

// Send appointment reminder (24h before)
export async function sendAppointmentReminder(appointmentData: {
  first_name: string
  last_name: string
  email: string
  appointment_date: string
  appointment_time: string
}) {
  try {
    const template = await getEmailTemplate('appointment_reminder_client')

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
      location: 'Centre Psychotechnique Permis Expert',
      address: '3 rue de la Paix, 92110 Clichy',
      location_details: 'À 3 minutes du métro Mairie de Clichy (Ligne 13)',
      phone: '01 47 37 12 34'
    }

    const htmlContent = replaceTemplateVariables(template.html_content, variables)
    const textContent = replaceTemplateVariables(template.text_content, variables)
    const subject = replaceTemplateVariables(template.subject, variables)

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: appointmentData.email,
      subject,
      html: htmlContent,
      text: textContent,
    })

    if (error) {
      throw error
    }

    console.log('✅ Reminder email sent to client:', appointmentData.email, 'ID:', data?.id)
    return data
  } catch (error) {
    console.error('❌ Error sending reminder email:', error)
    throw error
  }
}

// Send cancellation notification
export async function sendAppointmentCancellation(appointmentData: {
  first_name: string
  last_name: string
  email: string
  appointment_date: string
  appointment_time: string
  reason?: string
}) {
  try {
    const template = await getEmailTemplate('appointment_cancellation_client')

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
      reason: appointmentData.reason || 'Non spécifiée',
      phone: '01 47 37 12 34',
      website: 'https://permis-expert.fr'
    }

    const htmlContent = replaceTemplateVariables(template.html_content, variables)
    const textContent = replaceTemplateVariables(template.text_content, variables)
    const subject = replaceTemplateVariables(template.subject, variables)

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: appointmentData.email,
      subject,
      html: htmlContent,
      text: textContent,
    })

    if (error) {
      throw error
    }

    console.log('✅ Cancellation email sent to client:', appointmentData.email, 'ID:', data?.id)
    return data
  } catch (error) {
    console.error('❌ Error sending cancellation email:', error)
    throw error
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL || 'f.sebti@outlook.com',
      subject: 'Test Email Configuration - Permis Expert',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Configuration Email Testée ✅</h2>
          <p>Ce message confirme que la configuration email fonctionne correctement.</p>
          <p><strong>Service:</strong> Resend</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `,
      text: 'Configuration email testée avec succès via Resend.'
    })

    if (error) {
      throw error
    }

    console.log('✅ Test email sent successfully, ID:', data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('❌ Test email failed:', error)
    return { success: false, error }
  }
}
