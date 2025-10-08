import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { sendEmailWithElasticEmail } from '../../../../lib/emailService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointmentId, emailType, customMessage, cancelReason } = body

    // Récupérer les informations du rendez-vous
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single()

    if (appointmentError || !appointment) {
      return NextResponse.json({ error: 'Rendez-vous non trouvé' }, { status: 404 })
    }

    const formattedDate = new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    let subject = ''
    let html = ''
    let text = ''

    if (emailType === 'cancellation') {
      // Email d'annulation
      subject = `Annulation de votre rendez-vous - ${appointment.first_name} ${appointment.last_name}`
      
      html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Annulation de rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">❌ Rendez-vous Annulé</h1>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #dc2626; margin-top: 0;">Bonjour ${appointment.first_name} ${appointment.last_name},</h2>
        
        <p>Nous vous informons que votre rendez-vous a été annulé :</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #dc2626;">📅 Rendez-vous annulé</h3>
            <p><strong>Date :</strong> ${formattedDate}</p>
            <p><strong>Heure :</strong> ${appointment.appointment_time.slice(0, 5)}</p>
            <p><strong>Raison :</strong> ${cancelReason}</p>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #1d4ed8;">💡 Reprendre rendez-vous</h4>
            <p>Vous pouvez reprendre un nouveau rendez-vous à tout moment sur notre site web ou en nous contactant directement.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <p><strong>Contact :</strong> 07 65 56 53 79</p>
            <p><a href="https://test-psychotechnique-permis.com/prendre-rendez-vous" style="color: #2563eb; text-decoration: none;">🌐 Reprendre rendez-vous</a></p>
        </div>
        
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
            Nous nous excusons pour la gêne occasionnée.<br>
            L'équipe Test Psychotechnique Permis
        </p>
    </div>
</body>
</html>`

      text = `
RENDEZ-VOUS ANNULÉ

Bonjour ${appointment.first_name} ${appointment.last_name},

Nous vous informons que votre rendez-vous a été annulé :

Date : ${formattedDate}
Heure : ${appointment.appointment_time.slice(0, 5)}
Raison : ${cancelReason}

REPRENDRE RENDEZ-VOUS
Vous pouvez reprendre un nouveau rendez-vous à tout moment sur notre site web ou en nous contactant directement.

Contact : 07 65 56 53 79
Site web : https://test-psychotechnique-permis.com/prendre-rendez-vous

Nous nous excusons pour la gêne occasionnée.
L'équipe Test Psychotechnique Permis
`

      // Mettre à jour le statut du rendez-vous
      await supabase
        .from('appointments')
        .update({ 
          status: 'cancelled',
          admin_notes: `Annulé par admin - Raison: ${cancelReason}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId)

    } else if (emailType === 'custom') {
      // Email personnalisé
      subject = customMessage?.split('\n')[0] || 'Message de Test Psychotechnique Permis'
      
      html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📧 Message Important</h1>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #2563eb; margin-top: 0;">Bonjour ${appointment.first_name} ${appointment.last_name},</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-wrap;">
${customMessage}
        </div>
        
        <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #1e40af;">📅 Rappel de votre rendez-vous</h4>
            <p><strong>Date :</strong> ${formattedDate}</p>
            <p><strong>Heure :</strong> ${appointment.appointment_time.slice(0, 5)}</p>
            <p><strong>Adresse :</strong> 82 Rue Henri Barbusse, 92110 Clichy</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <p><strong>Contact :</strong> 07 65 56 53 79</p>
            <p><a href="https://test-psychotechnique-permis.com" style="color: #2563eb; text-decoration: none;">🌐 Notre site web</a></p>
        </div>
        
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
            L'équipe Test Psychotechnique Permis
        </p>
    </div>
</body>
</html>`

      text = `
MESSAGE IMPORTANT

Bonjour ${appointment.first_name} ${appointment.last_name},

${customMessage}

RAPPEL DE VOTRE RENDEZ-VOUS
Date : ${formattedDate}
Heure : ${appointment.appointment_time.slice(0, 5)}
Adresse : 82 Rue Henri Barbusse, 92110 Clichy

Contact : 07 65 56 53 79
Site web : https://test-psychotechnique-permis.com

L'équipe Test Psychotechnique Permis
`
    }

    // Envoyer l'email
    const info = await sendEmailWithElasticEmail({
      from: process.env.FROM_EMAIL || 'contact@test-psychotechnique-permis.com',
      to: appointment.email,
      subject,
      html,
      text
    })

    console.log('✅ Email envoyé au client:', appointment.email, 'ID:', info.messageId)

    // Logger l'activité admin
    await supabase
      .from('admin_activity_logs')
      .insert({
        action: emailType === 'cancellation' ? 'email_cancellation_sent' : 'email_custom_sent',
        details: `Email envoyé à ${appointment.first_name} ${appointment.last_name} (${appointment.email})`,
        created_at: new Date().toISOString()
      })

    return NextResponse.json({ 
      success: true,
      message: 'Email envoyé avec succès',
      messageId: info.messageId
    })

  } catch (error) {
    console.error('❌ Error sending email:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
