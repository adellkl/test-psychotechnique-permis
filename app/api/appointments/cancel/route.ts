import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import crypto from 'crypto'
import { sendCancellationNotificationToAdmin } from '../../../../lib/emailService'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('id')
    const token = searchParams.get('token')

    if (!appointmentId || !token) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Erreur</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 500px; }
            h1 { color: #ef4444; margin-bottom: 20px; }
            p { color: #6b7280; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Erreur</h1>
            <p>Lien invalide. Veuillez utiliser le lien fourni dans votre email de confirmation.</p>
          </div>
        </body>
        </html>`,
        { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }

    // Récupérer le rendez-vous
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single()

    if (fetchError || !appointment) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Rendez-vous introuvable</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
              padding: 20px;
            }
            .container { 
              background: white; 
              padding: 50px 40px; 
              border-radius: 20px; 
              box-shadow: 0 20px 60px rgba(0,0,0,0.3); 
              text-align: center; 
              max-width: 600px; 
              width: 100%;
            }
            .icon {
              font-size: 80px;
              margin-bottom: 24px;
            }
            h1 { 
              color: #ef4444; 
              margin-bottom: 16px; 
              font-size: 32px;
              font-weight: 700;
              line-height: 1.2;
            }
            p { 
              color: #6b7280; 
              line-height: 1.7; 
              font-size: 17px;
              margin-bottom: 30px;
            }
            .btn {
              display: inline-block;
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: white;
              padding: 16px 36px;
              border-radius: 12px;
              text-decoration: none;
              font-weight: 700;
              font-size: 17px;
              transition: all 0.3s;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
            }
            .btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
            }
            @media (max-width: 640px) {
              body { padding: 15px; }
              .container { 
                padding: 35px 25px;
                border-radius: 16px;
              }
              .icon { font-size: 64px; margin-bottom: 20px; }
              h1 { font-size: 26px; margin-bottom: 12px; }
              p { font-size: 15px; margin-bottom: 25px; }
              .btn {
                width: 100%;
                padding: 14px 24px;
                font-size: 16px;
              }
            }
            @media (max-width: 400px) {
              .container { padding: 28px 20px; }
              .icon { font-size: 56px; }
              h1 { font-size: 23px; }
              p { font-size: 14px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">❌</div>
            <h1>Rendez-vous introuvable</h1>
            <p>Ce rendez-vous n'existe pas ou a été supprimé.</p>
            <a href="https://test-psychotechnique-permis.com/prendre-rendez-vous" class="btn">
              Prendre rendez-vous
            </a>
          </div>
        </body>
        </html>`,
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }

    // Vérifier le token
    const expectedToken = crypto
      .createHash('sha256')
      .update(`${appointmentId}-${appointment.email}`)
      .digest('hex')

    if (token !== expectedToken) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Token invalide</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 500px; }
            h1 { color: #ef4444; margin-bottom: 20px; }
            p { color: #6b7280; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Token invalide</h1>
            <p>Le lien d'annulation n'est pas valide. Veuillez contacter le centre.</p>
          </div>
        </body>
        </html>`,
        { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }

    // Vérifier si déjà annulé
    if (appointment.status === 'cancelled') {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Déjà annulé</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 500px; }
            h1 { color: #ef4444; margin-bottom: 20px; }
            p { color: #6b7280; line-height: 1.6; }
            a { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>ℹ️ Déjà annulé</h1>
            <p>Ce rendez-vous a déjà été annulé.</p>
            <a href="https://test-psychotechnique-permis.com/prendre-rendez-vous">Prendre un nouveau rendez-vous</a>
          </div>
        </body>
        </html>`,
        { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }

    // Mettre à jour le statut à "cancelled"
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)

    if (updateError) {
      console.error('Error cancelling appointment:', updateError)
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Erreur</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 500px; }
            h1 { color: #ef4444; margin-bottom: 20px; }
            p { color: #6b7280; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Erreur</h1>
            <p>Une erreur est survenue lors de l'annulation. Veuillez réessayer ou contacter le centre.</p>
          </div>
        </body>
        </html>`,
        { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }

    // Remettre le créneau disponible dans le calendrier
    try {
      const slotTime = appointment.appointment_time.includes(':')
        ? appointment.appointment_time
        : `${appointment.appointment_time}:00`

      const { error: slotError } = await supabase
        .from('available_slots')
        .update({ is_available: true })
        .eq('date', appointment.appointment_date)
        .eq('start_time', slotTime)
        .eq('center_id', appointment.center_id)

      if (slotError) {
        console.error('⚠️ Erreur lors de la remise à disposition du créneau:', slotError)
      } else {
        console.log('✅ Créneau remis disponible dans le calendrier client:', appointment.appointment_date, slotTime, `(centre: ${appointment.center_id})`)
      }
    } catch (slotError) {
      console.error('⚠️ Erreur lors de la remise à disposition du créneau:', slotError)
      // On ne bloque pas l'annulation si la mise à jour du slot échoue
    }

    // Notifications désactivées - table supprimée
    try {
      await sendCancellationNotificationToAdmin({
        first_name: appointment.first_name,
        last_name: appointment.last_name,
        email: appointment.email,
        phone: appointment.phone,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time
      })
      console.log('✅ Email d\'annulation envoyé à l\'admin')
    } catch (emailError) {
      console.error('❌ Erreur envoi email annulation admin:', emailError)
      // On ne bloque pas le processus si l'email échoue
    }

    // Page simple d'annulation
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rendez-vous annulé</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .card { 
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
            padding: 50px 40px;
            text-align: center;
          }
          .icon { 
            font-size: 80px; 
            margin-bottom: 24px;
            animation: scaleIn 0.5s ease-out;
          }
          @keyframes scaleIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          h1 { 
            color: #1f2937; 
            font-size: 32px; 
            margin-bottom: 16px;
            font-weight: 700;
            line-height: 1.2;
          }
          .message { 
            color: #6b7280; 
            font-size: 17px; 
            line-height: 1.7; 
            margin-bottom: 35px;
          }
          .info-box {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 2px solid #3b82f6;
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 35px;
            text-align: left;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #bfdbfe;
          }
          .info-row:last-child { border-bottom: none; }
          .info-label { 
            color: #1e40af; 
            font-size: 15px;
            font-weight: 600;
          }
          .info-value { 
            color: #1f2937; 
            font-weight: 700; 
            font-size: 15px;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 16px 36px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 17px;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          }
          .btn:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
          }
          .contact {
            margin-top: 35px;
            padding-top: 25px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 15px;
          }
          .contact a { 
            color: #2563eb; 
            text-decoration: none;
            font-weight: 600;
          }
          .contact a:hover { text-decoration: underline; }
          
          @media (max-width: 640px) {
            body { padding: 15px; }
            .card { 
              padding: 35px 25px;
              border-radius: 16px;
            }
            h1 { 
              font-size: 26px;
              margin-bottom: 12px;
            }
            .icon { 
              font-size: 64px;
              margin-bottom: 20px;
            }
            .message {
              font-size: 15px;
              margin-bottom: 28px;
            }
            .info-box {
              padding: 20px 18px;
              margin-bottom: 28px;
            }
            .info-row { 
              flex-direction: column;
              align-items: flex-start;
              gap: 6px;
              padding: 10px 0;
            }
            .info-value { 
              text-align: left;
              font-size: 14px;
            }
            .info-label {
              font-size: 14px;
            }
            .btn {
              width: 100%;
              padding: 14px 24px;
              font-size: 16px;
            }
            .contact {
              margin-top: 28px;
              padding-top: 20px;
              font-size: 14px;
            }
          }
          
          @media (max-width: 400px) {
            .card { padding: 28px 20px; }
            h1 { font-size: 23px; }
            .icon { font-size: 56px; }
            .message { font-size: 14px; }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✅</div>
          <h1>Rendez-vous annulé</h1>
          <p class="message">Votre rendez-vous a bien été annulé. Le créneau est maintenant disponible pour d'autres personnes.</p>
          
          <div class="info-box">
            <div class="info-row">
              <span class="info-label">📅 Date</span>
              <span class="info-value">${new Date(appointment.appointment_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div class="info-row">
              <span class="info-label">⏰ Heure</span>
              <span class="info-value">${appointment.appointment_time}</span>
            </div>
          </div>
          
          <a href="https://test-psychotechnique-permis.com/prendre-rendez-vous" class="btn">
            Prendre un nouveau rendez-vous
          </a>
          
          <div class="contact">
            <p>Besoin d'aide ? <a href="tel:0765565379">07 65 56 53 79</a></p>
          </div>
        </div>
      </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )

  } catch (error) {
    console.error('Error in cancel route:', error)
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Erreur système</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
          .container { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px; width: 100%; }
          .error-icon { font-size: 80px; margin-bottom: 20px; }
          h1 { color: #ef4444; margin-bottom: 15px; font-size: 28px; font-weight: 700; }
          p { color: #6b7280; line-height: 1.8; margin-bottom: 20px; font-size: 16px; }
          .help { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 12px; margin-top: 25px; border: 2px solid #3b82f6; }
          .help p { color: #1e40af; font-size: 15px; margin: 8px 0; font-weight: 500; }
          a { color: #2563eb; text-decoration: none; font-weight: 600; transition: all 0.3s; }
          a:hover { text-decoration: underline; color: #1d4ed8; }
          @media (max-width: 640px) {
            .container { padding: 30px 20px; }
            h1 { font-size: 24px; }
            .error-icon { font-size: 60px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-icon">⚠️</div>
          <h1>Erreur système</h1>
          <p>Une erreur inattendue est survenue lors du traitement de votre demande.</p>
          <p>Veuillez réessayer ou nous contacter.</p>
          <div class="help">
            <p><strong>Besoin d'aide ?</strong></p>
            <p>📞 Contactez-nous : <a href="tel:0765565379">07 65 56 53 79</a></p>
            <p>🌐 <a href="https://test-psychotechnique-permis.com">Retour au site</a></p>
          </div>
        </div>
      </body>
      </html>`,
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }
}
