import nodemailer from 'nodemailer'
import { supabase } from './supabase'

// Configuration SMTP Outlook
const outlookTransporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.OUTLOOK_EMAIL || 'sebtifatiha@live.fr',
    pass: process.env.OUTLOOK_APP_PASSWORD || 'klozfurpuolscefm'
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  },
  requireTLS: true
})

// Send email using SMTP (Outlook/Gmail)
async function sendEmailWithSMTP(emailData: any) {
  // Utiliser Outlook SMTP
  const transporter = outlookTransporter

  try {
    const info = await transporter.sendMail({
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    })

    console.log(`✅ Email envoyé via SMTP: ${info.messageId}`)
    return { messageId: info.messageId }
  } catch (error) {
    console.error('❌ Erreur SMTP:', error)
    throw error
  }
}

// Configuration Elastic Email API (solution fonctionnelle)
async function sendEmailWithElasticEmail(emailData: {
  from: string
  to: string
  subject: string
  html: string
  text: string
}) {
  try {
    const formData = new FormData()
    formData.append('apikey', process.env.ELASTIC_EMAIL_API_KEY || 'B0D3C9F949F85DF5B9045463F6B4A04C1194929A06D05B8B972AAC0B14682CEFB03CA8FA79579D005F264103C6C92987')
    formData.append('from', emailData.from)
    formData.append('to', emailData.to)
    formData.append('subject', emailData.subject)
    formData.append('bodyHtml', emailData.html)
    formData.append('bodyText', emailData.text)

    const response = await fetch('https://api.elasticemail.com/v2/email/send', {
      method: 'POST',
      body: formData
    })

    const result = await response.text()
    
    if (!response.ok) {
      throw new Error(`Elastic Email API error: ${result}`)
    }

    // Parse response (format: transaction-id or error message)
    const data = JSON.parse(result)
    if (data.success === false) {
      throw new Error(data.error || 'Unknown Elastic Email error')
    }

    console.log('✅ Email sent successfully via Elastic Email, ID:', data.data?.messageid || result)
    return { messageId: data.data?.messageid || result }
  } catch (error) {
    console.error('❌ Elastic Email sending failed:', error)
    throw error
  }
}

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

    const info = await sendEmailWithElasticEmail({
      from: process.env.FROM_EMAIL || 'adelloukal2@gmail.com',
      to: appointmentData.email,
      subject,
      html: htmlContent,
      text: textContent,
    })

    console.log('✅ Confirmation email sent to client:', appointmentData.email, 'ID:', info.messageId)
    return info
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

    const info = await sendEmailWithElasticEmail({
      from: process.env.FROM_EMAIL || 'adelloukal2@gmail.com',
      to: process.env.ADMIN_EMAIL || 'sebtifatiha@live.fr',
      subject,
      html: htmlContent,
      text: textContent,
    })

    console.log('✅ Notification email sent to admin, ID:', info.messageId)
    return info
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
      address: '82 Rue Henri Barbusse, 92110 Clichy',
      location_details: 'À 3 minutes du métro Mairie de Clichy (Ligne 13)',
      contact_phone: '07 65 56 53 79'
    }

    const htmlContent = replaceTemplateVariables(template.html_content, variables)
    const textContent = replaceTemplateVariables(template.text_content, variables)
    const subject = replaceTemplateVariables(template.subject, variables)

    const info = await sendEmailWithElasticEmail({
      from: process.env.FROM_EMAIL || 'adelloukal2@gmail.com',
      to: appointmentData.email,
      subject,
      html: htmlContent,
      text: textContent,
    })

    console.log('✅ Reminder email sent to client:', appointmentData.email, 'ID:', info.messageId)
    return info
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
      contact_phone: '07 65 56 53 79',
      website: 'https://test-psychotechnique-permis.com'
    }

    const htmlContent = replaceTemplateVariables(template.html_content, variables)
    const textContent = replaceTemplateVariables(template.text_content, variables)
    const subject = replaceTemplateVariables(template.subject, variables)

    const info = await sendEmailWithElasticEmail({
      from: process.env.FROM_EMAIL || 'adelloukal2@gmail.com',
      to: appointmentData.email,
      subject,
      html: htmlContent,
      text: textContent,
    })

    console.log('✅ Cancellation email sent to client:', appointmentData.email, 'ID:', info.messageId)
    return info
  } catch (error) {
    console.error('❌ Error sending cancellation email:', error)
    throw error
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  try {
    const info = await sendEmailWithElasticEmail({
      from: process.env.FROM_EMAIL || 'adelloukal2@gmail.com',
      to: process.env.ADMIN_EMAIL || 'sebtifatiha@live.fr',
      subject: 'Test Email Configuration - Permis Expert',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Configuration Email Testée ✅</h2>
          <p>Ce message confirme que la configuration email fonctionne correctement.</p>
          <p><strong>Service:</strong> Elastic Email API</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `,
      text: 'Configuration email testée avec succès via Elastic Email API.'
    })

    console.log('✅ Test email sent successfully, ID:', info.messageId)
    return { success: true, id: info.messageId }
  } catch (error) {
    console.error('❌ Test email failed:', error)
    return { success: false, error }
  }
}
