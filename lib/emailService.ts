import nodemailer from 'nodemailer'
import { supabase } from './supabase'

// Configuration SMTP Outlook
const outlookTransporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.OUTLOOK_EMAIL || 'contact@test-psychotechnique-permis.com',
    pass: process.env.OUTLOOK_APP_PASSWORD || ''
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
      headers: {
        'X-Mailer': 'Permis Expert Booking System',
        'X-Priority': '3',
        'Importance': 'Normal',
        'Reply-To': process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com',
        'List-Unsubscribe': `<mailto:${process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com'}?subject=unsubscribe>`
      }
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
    
    // Headers anti-spam
    formData.append('replyTo', process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com')
    formData.append('headers', JSON.stringify({
      'X-Mailer': 'Permis Expert Booking System',
      'X-Priority': '3',
      'Importance': 'Normal',
      'List-Unsubscribe': `<mailto:${process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com'}?subject=unsubscribe>`
    }))

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
      from: process.env.FROM_EMAIL || 'contact@test-psychotechnique-permis.com',
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
  phone?: string
  appointment_date: string
  appointment_time: string
}) {
  try {
    console.log(`📧 Sending admin notification for new appointment`)

    const formattedDate = new Date(appointmentData.appointment_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const subject = `🔔 Nouveau rendez-vous - ${appointmentData.first_name} ${appointmentData.last_name}`
    
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau rendez-vous</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px;">🔔 Nouveau Rendez-vous</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px;">Détails du rendez-vous</h2>
                            
                            <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
                                <tr>
                                    <td style="color: #374151; font-weight: 600;">👤 Client</td>
                                    <td style="color: #1f2937; text-align: right;">${appointmentData.first_name} ${appointmentData.last_name}</td>
                                </tr>
                                <tr style="border-top: 1px solid #e5e7eb;">
                                    <td style="color: #374151; font-weight: 600;">📧 Email</td>
                                    <td style="color: #1f2937; text-align: right;"><a href="mailto:${appointmentData.email}" style="color: #2563eb; text-decoration: none;">${appointmentData.email}</a></td>
                                </tr>
                                <tr style="border-top: 1px solid #e5e7eb;">
                                    <td style="color: #374151; font-weight: 600;">📱 Téléphone</td>
                                    <td style="color: #1f2937; text-align: right;"><a href="tel:${appointmentData.phone}" style="color: #2563eb; text-decoration: none;">${appointmentData.phone || 'Non renseigné'}</a></td>
                                </tr>
                                <tr style="border-top: 1px solid #e5e7eb;">
                                    <td style="color: #374151; font-weight: 600;">📅 Date</td>
                                    <td style="color: #1f2937; text-align: right; font-weight: 700;">${formattedDate}</td>
                                </tr>
                                <tr style="border-top: 1px solid #e5e7eb;">
                                    <td style="color: #374151; font-weight: 600;">⏰ Heure</td>
                                    <td style="color: #1f2937; text-align: right; font-weight: 700; font-size: 18px;">${appointmentData.appointment_time}</td>
                                </tr>
                            </table>
                            
                            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin-top: 20px;">
                                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                                    <strong>💡 Action requise :</strong> Vérifiez le dashboard admin pour confirmer ou gérer ce rendez-vous.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <a href="https://test-psychotechnique-permis.com/admin/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
                                Voir le Dashboard Admin
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`

    const text = `
🔔 NOUVEAU RENDEZ-VOUS

Client: ${appointmentData.first_name} ${appointmentData.last_name}
Email: ${appointmentData.email}
Téléphone: ${appointmentData.phone || 'Non renseigné'}
Date: ${formattedDate}
Heure: ${appointmentData.appointment_time}

Connectez-vous au dashboard admin pour gérer ce rendez-vous.
`

    const info = await sendEmailWithElasticEmail({
      from: process.env.FROM_EMAIL || 'contact@test-psychotechnique-permis.com',
      to: process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com',
      subject,
      html,
      text,
    })

    console.log('✅ Admin notification sent to:', process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com', 'ID:', info.messageId)
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
      from: process.env.FROM_EMAIL || 'contact@test-psychotechnique-permis.com',
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
      from: process.env.FROM_EMAIL || 'contact@test-psychotechnique-permis.com',
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
      from: process.env.FROM_EMAIL || 'contact@test-psychotechnique-permis.com',
      to: process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com',
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
