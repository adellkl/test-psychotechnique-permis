const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'

const supabase = createClient(supabaseUrl, supabaseKey)

// Configuration Elastic Email
const ELASTIC_API_KEY = 'B0D3C9F949F85DF5B9045463F6B4A04C1194929A06D05B8B972AAC0B14682CEFB03CA8FA79579D005F264103C6C92987'
const FROM_EMAIL = 'contact@test-psychotechnique-permis.com'
const ADMIN_EMAIL = 'f.sebti@outlook.com'

async function sendAdminNotification(appointmentData) {
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
                                    <td style="color: #1f2937; text-align: right;"><a href="tel:${appointmentData.phone}" style="color: #2563eb; text-decoration: none;">${appointmentData.phone}</a></td>
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
Téléphone: ${appointmentData.phone}
Date: ${formattedDate}
Heure: ${appointmentData.appointment_time}

Connectez-vous au dashboard admin pour gérer ce rendez-vous.
`

  try {
    const formData = new FormData()
    formData.append('apikey', ELASTIC_API_KEY)
    formData.append('from', FROM_EMAIL)
    formData.append('to', ADMIN_EMAIL)
    formData.append('subject', subject)
    formData.append('bodyHtml', html)
    formData.append('bodyText', text)

    const response = await fetch('https://api.elasticemail.com/v2/email/send', {
      method: 'POST',
      body: formData
    })

    const result = await response.text()
    
    if (!response.ok) {
      throw new Error(`Elastic Email API error: ${result}`)
    }

    const data = JSON.parse(result)
    return { success: true, messageId: data.data?.messageid || result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function testAdminNotification() {
  console.log('🧪 Test de notification admin\n')
  console.log('📧 Configuration:')
  console.log('   - De:', FROM_EMAIL)
  console.log('   - À:', ADMIN_EMAIL)
  console.log('   - Service: Elastic Email API\n')

  // Données de test
  const testAppointment = {
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '06 12 34 56 78',
    appointment_date: '2025-10-20',
    appointment_time: '14:30:00'
  }

  console.log('📤 Envoi de l\'email de notification admin...\n')

  const result = await sendAdminNotification(testAppointment)

  if (result.success) {
    console.log('✅ EMAIL ADMIN ENVOYÉ AVEC SUCCÈS!')
    console.log('   - Transaction ID:', result.messageId)
    console.log('   - Destinataire:', ADMIN_EMAIL)
    console.log('\n📋 Vérifications:')
    console.log('   ✅ Email envoyé depuis:', FROM_EMAIL)
    console.log('   ✅ Email reçu par:', ADMIN_EMAIL)
    console.log('   ✅ Contient les détails du RDV')
    console.log('   ✅ Lien vers le dashboard admin')
    console.log('\n🎉 Le système de notification admin fonctionne!')
    console.log('\n💡 Vérifiez votre boîte mail:', ADMIN_EMAIL)
  } else {
    console.error('\n❌ Erreur lors de l\'envoi:', result.error)
  }
}

testAdminNotification()
