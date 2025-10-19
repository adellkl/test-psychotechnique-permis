import { supabase } from './supabase'

const ELASTIC_EMAIL_API_KEY = process.env.ELASTIC_EMAIL_API_KEY

export async function sendEmailWithElasticEmail(emailData: {
  from: string
  to: string
  subject: string
  html: string
  text: string
}) {
  try {
    if (!ELASTIC_EMAIL_API_KEY) {
      throw new Error('ELASTIC_EMAIL_API_KEY non définie')
    }

    const formData = new URLSearchParams()
    formData.append('apikey', ELASTIC_EMAIL_API_KEY)
    formData.append('from', emailData.from)
    formData.append('to', emailData.to)
    formData.append('subject', emailData.subject)
    formData.append('bodyHtml', emailData.html)
    formData.append('bodyText', emailData.text)
    formData.append('replyTo', process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com')

    const response = await fetch('https://api.elasticemail.com/v2/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    })

    const result = await response.text()

    if (!response.ok) {
      throw new Error(`Elastic Email API error: ${result}`)
    }

    const data = JSON.parse(result)
    if (data.success === false) {
      throw new Error(`Elastic Email error: ${data.error || 'Unknown error'}`)
    }

    return { messageId: data.data?.messageid || result }
  } catch (error) {
    console.error('❌ [ELASTIC] Erreur:', error)
    throw error
  }
}

interface EmailTemplate {
  id: string
  template_name: string
  subject: string
  html_content: string
  text_content: string
  created_at: string
  updated_at: string
}

function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  let result = template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value)
  })
  return result
}

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

export async function sendAppointmentConfirmation(appointmentData: {
  first_name: string
  last_name: string
  email: string
  phone?: string
  appointment_date: string
  appointment_time: string
  appointment_id?: string
  created_at?: string
  center_name?: string
  center_address?: string
  center_city?: string
  center_postal_code?: string
}) {
  try {
    console.log(`📧 [CLIENT] Récupération du template...`)

    const template = await getEmailTemplate('appointment_confirmation_client')
    console.log(`✅ [CLIENT] Template récupéré: ${template.template_name}`)

    const formattedDate = new Date(appointmentData.appointment_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const crypto = require('crypto')
    const confirmationToken = crypto
      .createHash('sha256')
      .update(`${appointmentData.appointment_id}-${appointmentData.email}`)
      .digest('hex')

    const centerName = appointmentData.center_name || 'Centre Psychotechnique Permis Expert'
    const centerAddress = appointmentData.center_address || '82 Rue Henri Barbusse'
    const centerCity = appointmentData.center_city || 'Clichy'
    const centerPostalCode = appointmentData.center_postal_code || '92110'
    const fullAddress = `${centerAddress}, ${centerPostalCode} ${centerCity}`

    const contactPhone = centerCity === 'Colombes' ? '09 72 13 22 50' : '07 65 56 53 79'

    const variables = {
      first_name: appointmentData.first_name,
      last_name: appointmentData.last_name,
      email: appointmentData.email,
      phone: appointmentData.phone || 'Non renseigné',
      appointment_date: formattedDate,
      appointment_time: appointmentData.appointment_time,
      appointment_id: appointmentData.appointment_id || '',
      confirmation_token: confirmationToken,
      location: centerName,
      address: fullAddress,
      location_details: centerCity === 'Clichy' ? 'À 3 minutes du métro Mairie de Clichy (Ligne 13)' : 'Proche des transports en commun',
      contact_phone: contactPhone,
      website: 'https://test-psychotechnique-permis.com'
    }

    console.log(`📝 [CLIENT] Remplacement des variables...`)
    const htmlContent = replaceTemplateVariables(template.html_content, variables)
    const textContent = replaceTemplateVariables(template.text_content, variables)
    const subject = replaceTemplateVariables(template.subject, variables)

    console.log(`📤 [CLIENT] Envoi via Elastic Email à: ${appointmentData.email}`)
    const info = await sendEmailWithElasticEmail({
      from: process.env.FROM_EMAIL || 'contact@test-psychotechnique-permis.com',
      to: appointmentData.email,
      subject,
      html: htmlContent,
      text: textContent,
    })

    console.log('✅ [CLIENT] Email envoyé avec succès, ID:', info.messageId)
    return info
  } catch (error) {
    console.error('❌ [CLIENT] ERREUR:', error)
    console.error('❌ [CLIENT] Type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('❌ [CLIENT] Message:', error instanceof Error ? error.message : String(error))
    throw error
  }
}

export async function sendAppointmentNotificationToAdmin(appointmentData: {
  first_name: string
  last_name: string
  email: string
  phone?: string
  appointment_date: string
  appointment_time: string
  center_name?: string
  center_address?: string
  center_city?: string
  center_postal_code?: string
}) {
  try {
    console.log(`📧 [ADMIN] Préparation notification admin...`)
    console.log(`📧 [ADMIN] Email admin configuré:`, process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com')

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
                                <tr style="border-top: 1px solid #e5e7eb;">
                                    <td style="color: #374151; font-weight: 600;">📍 Centre</td>
                                    <td style="color: #1f2937; text-align: right; font-weight: 700;">${appointmentData.center_name || 'Centre de Clichy'}</td>
                                </tr>
                                <tr style="border-top: 1px solid #e5e7eb;">
                                    <td style="color: #374151; font-weight: 600;">🏢 Adresse</td>
                                    <td style="color: #1f2937; text-align: right;">${appointmentData.center_address || '82 Rue Henri Barbusse'}, ${appointmentData.center_postal_code || '92110'} ${appointmentData.center_city || 'Clichy'}</td>
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

    console.log(`📤 [ADMIN] Envoi via Elastic Email...`)
    const info = await sendEmailWithElasticEmail({
      from: process.env.FROM_EMAIL || 'contact@test-psychotechnique-permis.com',
      to: 'sebtifatiha170617@gmail.com',
      subject,
      html,
      text,
    })

    console.log('✅ [ADMIN] Email envoyé avec succès à: sebtifatiha170617@gmail.com, ID:', info.messageId)
    return info
  } catch (error) {
    console.error('❌ [ADMIN] ERREUR:', error)
    console.error('❌ [ADMIN] Type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('❌ [ADMIN] Message:', error instanceof Error ? error.message : String(error))
    throw error
  }
}

export async function sendAppointmentReminder(appointmentData: {
  first_name: string
  last_name: string
  email: string
  appointment_date: string
  appointment_time: string
  center_name?: string
  center_address?: string
  center_city?: string
  center_postal_code?: string
}) {
  try {
    const template = await getEmailTemplate('appointment_reminder_client')

    const formattedDate = new Date(appointmentData.appointment_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const centerName = appointmentData.center_name || 'Centre Psychotechnique Permis Expert'
    const centerAddress = appointmentData.center_address || '82 Rue Henri Barbusse'
    const centerCity = appointmentData.center_city || 'Clichy'
    const centerPostalCode = appointmentData.center_postal_code || '92110'
    const fullAddress = `${centerAddress}, ${centerPostalCode} ${centerCity}`
    const contactPhone = centerCity === 'Colombes' ? '09 72 13 22 50' : '07 65 56 53 79'

    const variables = {
      first_name: appointmentData.first_name,
      last_name: appointmentData.last_name,
      appointment_date: formattedDate,
      appointment_time: appointmentData.appointment_time,
      location: centerName,
      address: fullAddress,
      location_details: centerCity === 'Clichy' ? 'À 3 minutes du métro Mairie de Clichy (Ligne 13)' : 'Proche des transports en commun',
      contact_phone: contactPhone
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

export async function sendAppointmentCancellation(appointmentData: {
  first_name: string
  last_name: string
  email: string
  appointment_date: string
  appointment_time: string
  reason?: string
  center_city?: string
}) {
  try {
    const template = await getEmailTemplate('appointment_cancellation_client')

    const formattedDate = new Date(appointmentData.appointment_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const centerCity = appointmentData.center_city || 'Clichy'
    const contactPhone = centerCity === 'Colombes' ? '09 72 13 22 50' : '07 65 56 53 79'

    const variables = {
      first_name: appointmentData.first_name,
      last_name: appointmentData.last_name,
      appointment_date: formattedDate,
      appointment_time: appointmentData.appointment_time,
      reason: appointmentData.reason || 'Non spécifiée',
      contact_phone: contactPhone,
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

export async function sendConfirmationReminder(appointmentData: {
  first_name: string
  last_name: string
  email: string
  appointment_date: string
  appointment_time: string
  appointment_id: string
  center_name?: string
  center_address?: string
  center_city?: string
  center_postal_code?: string
}) {
  try {
    console.log(`📧 [REMINDER] Envoi rappel de confirmation à: ${appointmentData.email}`)

    const template = await getEmailTemplate('appointment_confirmation_reminder')

    const formattedDate = new Date(appointmentData.appointment_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const crypto = require('crypto')
    const confirmationToken = crypto
      .createHash('sha256')
      .update(`${appointmentData.appointment_id}-${appointmentData.email}`)
      .digest('hex')

    const centerName = appointmentData.center_name || 'Centre Psychotechnique Permis Expert'
    const centerAddress = appointmentData.center_address || '82 Rue Henri Barbusse'
    const centerCity = appointmentData.center_city || 'Clichy'
    const centerPostalCode = appointmentData.center_postal_code || '92110'
    const fullAddress = `${centerAddress}, ${centerPostalCode} ${centerCity}`
    const contactPhone = centerCity === 'Colombes' ? '09 72 13 22 50' : '07 65 56 53 79'

    const variables = {
      first_name: appointmentData.first_name,
      last_name: appointmentData.last_name,
      appointment_date: formattedDate,
      appointment_time: appointmentData.appointment_time,
      location: centerName,
      address: fullAddress,
      contact_phone: contactPhone,
      website: 'https://test-psychotechnique-permis.com',
      appointment_id: appointmentData.appointment_id,
      confirmation_token: confirmationToken
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

    console.log('✅ [REMINDER] Rappel envoyé à:', appointmentData.email, 'ID:', info.messageId)
    return info
  } catch (error) {
    console.error('❌ [REMINDER] Erreur:', error)
    throw error
  }
}

export async function sendCancellationNotificationToAdmin(appointmentData: {
  first_name: string
  last_name: string
  email: string
  phone?: string
  appointment_date: string
  appointment_time: string
}) {
  try {
    console.log(`📧 [ADMIN-CANCEL] Notification annulation à l'admin...`)

    const formattedDate = new Date(appointmentData.appointment_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const subject = `❌ Annulation - ${appointmentData.first_name} ${appointmentData.last_name}`

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rendez-vous annulé</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px;">❌ Rendez-vous Annulé</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #991b1b; font-size: 14px;">
                                    <strong>⚠️ Un client a annulé son rendez-vous</strong>
                                </p>
                            </div>
                            
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px;">Détails du rendez-vous annulé</h2>
                            
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
                                    <strong>💡 Information :</strong> Ce créneau est maintenant disponible pour d'autres clients.
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
❌ RENDEZ-VOUS ANNULÉ

Un client a annulé son rendez-vous :

Client: ${appointmentData.first_name} ${appointmentData.last_name}
Email: ${appointmentData.email}
Téléphone: ${appointmentData.phone || 'Non renseigné'}
Date: ${formattedDate}
Heure: ${appointmentData.appointment_time}

Ce créneau est maintenant disponible pour d'autres clients.
Connectez-vous au dashboard admin pour voir les détails.
`

    console.log(`📤 [ADMIN-CANCEL] Envoi via Elastic Email...`)
    const info = await sendEmailWithElasticEmail({
      from: process.env.FROM_EMAIL || 'contact@test-psychotechnique-permis.com',
      to: 'sebtifatiha170617@gmail.com',
      subject,
      html,
      text,
    })

    console.log('✅ [ADMIN-CANCEL] Email envoyé avec succès à: sebtifatiha170617@gmail.com, ID:', info.messageId)
    return info
  } catch (error) {
    console.error('❌ [ADMIN-CANCEL] ERREUR:', error)
    console.error('❌ [ADMIN-CANCEL] Type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('❌ [ADMIN-CANCEL] Message:', error instanceof Error ? error.message : String(error))
    throw error
  }
}

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
