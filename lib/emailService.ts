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

function getAccessDetailsHTML(centerCity: string): string {
  if (centerCity === 'Colombes') {
    return `
      <div style="background-color: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; color: #1e40af; font-size: 15px; font-weight: 700; display: flex; align-items: center;">
          📍 Plan d'accès détaillé
        </h4>
        <div style="color: #1f2937; font-size: 14px; line-height: 1.8;">
          <p style="margin: 0 0 8px 0;"><strong>14 rue de Mantes, 92700 Colombes</strong></p>
          <p style="margin: 0 0 5px 0;">→ 1er Bâtiment dans la cour : <strong>Bâtiment A/B</strong></p>
          <p style="margin: 0 0 5px 0;">→ Accès <strong>ascenseur B</strong> du hall, à gauche</p>
          <p style="margin: 0 0 5px 0;">→ <strong>5e étage</strong> au bout du couloir à gauche</p>
          <p style="margin: 0;">→ Suivre l'affichage <strong style="color: #2563eb;">ProDrive Academy</strong></p>
        </div>
      </div>
    `
  } else {
    // Clichy par défaut
    return `
      <div style="background-color: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 15px; font-weight: 700; display: flex; align-items: center;">
          📍 Plan d'accès détaillé
        </h4>
        
        <!-- Adresse -->
        <div style="background-color: #ffffff; border-radius: 6px; padding: 12px; margin-bottom: 12px; border-left: 3px solid #3b82f6;">
          <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 600;">
            📌 82, rue Henri Barbusse, 92110 Clichy
          </p>
        </div>
        
        <!-- Instructions d'accès -->
        <div style="background-color: #ffffff; border-radius: 6px; padding: 12px; margin-bottom: 12px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <div style="display: flex; align-items: start;">
                  <span style="color: #3b82f6; font-size: 18px; margin-right: 10px;">→</span>
                  <span style="color: #1f2937; font-size: 14px;"><strong>Rez-de-chaussée</strong>, à droite</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <div style="display: flex; align-items: start;">
                  <span style="color: #3b82f6; font-size: 18px; margin-right: 10px;">🔔</span>
                  <span style="color: #1f2937; font-size: 14px;"><strong>Sonner à Cabinet</strong></span>
                </div>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Code d'entrée mis en avant -->
        <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #3b82f6; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);">
          <p style="margin: 0 0 8px 0; color: #1e40af; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
            🔑 Code d'entrée
          </p>
          <p style="margin: 0; font-size: 28px; font-weight: 700; color: #1e40af; letter-spacing: 4px; font-family: 'Courier New', Courier, monospace; text-shadow: 1px 1px 2px rgba(30, 64, 175, 0.1);">
            6138A
          </p>
        </div>
      </div>
    `
  }
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

    const centerCity = appointmentData.center_city || 'Clichy'
    
    // Informations selon le centre (template unifié)
    let centerName, centerAddress, centerPostalCode, contactPhone, metroInfo
    
    if (centerCity === 'Colombes') {
      centerName = 'Test Psychotechnique Permis - Colombes'
      centerAddress = '14 Rue de Mantes, Pro Drive Academy'
      centerPostalCode = '92700'
      contactPhone = '07 65 56 53 79'
      metroInfo = 'Proche des transports en commun'
    } else {
      // Clichy par défaut
      centerName = 'Test Psychotechnique Permis - Clichy'
      centerAddress = '82 Rue Henri Barbusse'
      centerPostalCode = '92110'
      contactPhone = '07 65 56 53 79'
      metroInfo = 'Ligne 13 - Mairie de Clichy'
    }
    
    const fullAddress = `${centerAddress}, ${centerPostalCode} ${centerCity}`

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
      metro_info: metroInfo,
      contact_phone: contactPhone,
      contact_email: 'contact@test-psychotechnique-permis.com',
      website: 'https://test-psychotechnique-permis.com',
      access_details: getAccessDetailsHTML(centerCity)
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

    const centerCity = appointmentData.center_city || 'Clichy'
    
    // Informations selon le centre (template unifié)
    let centerName, centerAddress, centerPostalCode, contactPhone, locationDetails
    
    if (centerCity === 'Colombes') {
      centerName = 'Test Psychotechnique Permis - Colombes'
      centerAddress = '14 Rue de Mantes, Pro Drive Academy'
      centerPostalCode = '92700'
      contactPhone = '07 65 56 53 79'
      locationDetails = 'Proche des transports en commun'
    } else {
      // Clichy par défaut
      centerName = 'Test Psychotechnique Permis - Clichy'
      centerAddress = '82 Rue Henri Barbusse'
      centerPostalCode = '92110'
      contactPhone = '07 65 56 53 79'
      locationDetails = 'Ligne 13 - Mairie de Clichy'
    }
    
    const fullAddress = `${centerAddress}, ${centerPostalCode} ${centerCity}`

    const variables = {
      first_name: appointmentData.first_name,
      last_name: appointmentData.last_name,
      appointment_date: formattedDate,
      appointment_time: appointmentData.appointment_time,
      location: centerName,
      address: fullAddress,
      location_details: locationDetails,
      contact_phone: contactPhone,
      contact_email: 'contact@test-psychotechnique-permis.com',
      phone: contactPhone
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
    const contactPhone = '07 65 56 53 79'

    const variables = {
      first_name: appointmentData.first_name,
      last_name: appointmentData.last_name,
      appointment_date: formattedDate,
      appointment_time: appointmentData.appointment_time,
      reason: appointmentData.reason || 'Non spécifiée',
      contact_phone: contactPhone,
      contact_email: 'contact@test-psychotechnique-permis.com',
      phone: contactPhone,
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

    const centerName = appointmentData.center_name || 'Test Psychotechnique Permis'
    const centerAddress = appointmentData.center_address || '82 Rue Henri Barbusse'
    const centerCity = appointmentData.center_city || 'Clichy'
    const centerPostalCode = appointmentData.center_postal_code || '92110'
    const fullAddress = `${centerAddress}, ${centerPostalCode} ${centerCity}`
    const contactPhone = '07 65 56 53 79'

    const variables = {
      first_name: appointmentData.first_name,
      last_name: appointmentData.last_name,
      appointment_date: formattedDate,
      appointment_time: appointmentData.appointment_time,
      location: centerName,
      address: fullAddress,
      contact_phone: contactPhone,
      contact_email: 'contact@test-psychotechnique-permis.com',
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

    const subject = `Annulation - ${appointmentData.first_name} ${appointmentData.last_name}`

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Rendez-vous annulé</title>
    <style type="text/css">
        body, table, td, p, h1, h2, h3, h4 {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header rouge -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                Rendez-vous annulé
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #fecaca; font-size: 16px; font-weight: 500;">Notification Admin</p>
                        </td>
                    </tr>
                    
                    <!-- Contenu -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; margin-bottom: 30px;">
                                <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                                    <strong>Un client a annulé son rendez-vous</strong>
                                </p>
                            </div>
                            
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
                                Détails du rendez-vous annulé
                            </h2>
                            
                            <!-- Section Informations -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 12px; border: 2px solid #ef4444; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 0;">
                                            <tr>
                                                <td style="color: #7f1d1d; font-weight: 600; font-size: 14px; padding: 8px 0; width: 40%;">Client</td>
                                                <td style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right; font-weight: 600;">${appointmentData.first_name} ${appointmentData.last_name}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #fca5a5;">
                                                <td style="color: #7f1d1d; font-weight: 600; font-size: 14px; padding: 8px 0;">Email</td>
                                                <td style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">
                                                    <a href="mailto:${appointmentData.email}" style="color: #2563eb; text-decoration: none;">${appointmentData.email}</a>
                                                </td>
                                            </tr>
                                            <tr style="border-top: 1px solid #fca5a5;">
                                                <td style="color: #7f1d1d; font-weight: 600; font-size: 14px; padding: 8px 0;">Téléphone</td>
                                                <td style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">
                                                    <a href="tel:${appointmentData.phone}" style="color: #2563eb; text-decoration: none;">${appointmentData.phone || 'Non renseigné'}</a>
                                                </td>
                                            </tr>
                                            <tr style="border-top: 1px solid #fca5a5;">
                                                <td style="color: #7f1d1d; font-weight: 600; font-size: 14px; padding: 8px 0;">Date</td>
                                                <td style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right; font-weight: 700;">${formattedDate}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #fca5a5;">
                                                <td style="color: #7f1d1d; font-weight: 600; font-size: 14px; padding: 8px 0;">Heure</td>
                                                <td style="color: #1f2937; font-size: 16px; font-weight: 700; padding: 8px 0; text-align: right;">${appointmentData.appointment_time}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Information -->
                            <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
                                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                                    <strong>Information :</strong> Ce créneau est maintenant disponible pour d'autres clients.
                                </p>
                            </div>
                            
                            <!-- Bouton -->
                            <table width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td align="center" style="padding: 10px 0;">
                                        <a href="https://test-psychotechnique-permis.com/admin/dashboard" style="display: inline-block; padding: 14px 32px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
                                            Voir le Dashboard Admin
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #9ca3af; font-size: 14px;">
                                <strong>Test Psychotechnique Permis</strong><br>
                                Notification automatique
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`

    const text = `
RENDEZ-VOUS ANNULÉ
Notification Admin

Un client a annulé son rendez-vous :

Client: ${appointmentData.first_name} ${appointmentData.last_name}
Email: ${appointmentData.email}
Téléphone: ${appointmentData.phone || 'Non renseigné'}
Date: ${formattedDate}
Heure: ${appointmentData.appointment_time}

Information : Ce créneau est maintenant disponible pour d'autres clients.

Connectez-vous au dashboard admin pour voir les détails :
https://test-psychotechnique-permis.com/admin/dashboard
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
      subject: 'Test Email Configuration - Test Psychotechnique Permis',
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
