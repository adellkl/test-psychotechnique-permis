import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import crypto from 'crypto'

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
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 500px; }
            h1 { color: #ef4444; margin-bottom: 20px; }
            p { color: #6b7280; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Rendez-vous introuvable</h1>
            <p>Ce rendez-vous n'existe pas ou a été supprimé.</p>
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

    // Redirection vers la page de prise de rendez-vous
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="5;url=https://test-psychotechnique-permis.com/prendre-rendez-vous">
        <title>Rendez-vous annulé</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
          .container { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 600px; width: 100%; margin: 0 auto; }
          .icon { font-size: 80px; margin-bottom: 20px; animation: shake 0.5s ease; }
          @keyframes shake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
          h1 { color: #ef4444; margin-bottom: 10px; font-size: 32px; font-weight: 700; }
          .subtitle { color: #dc2626; font-size: 18px; font-weight: 600; margin-bottom: 30px; }
          p { color: #6b7280; line-height: 1.6; margin-bottom: 15px; font-size: 16px; }
          .info { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #ef4444; text-align: left; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1); }
          .info-row { display: flex; justify-content: space-between; align-items: center; margin: 12px 0; padding: 10px 0; border-bottom: 1px solid #fecaca; }
          .info-row:last-child { border-bottom: none; }
          .info-label { color: #991b1b; font-weight: 600; font-size: 15px; }
          .info-value { color: #991b1b; font-size: 15px; font-weight: 500; }
          .cta { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 16px 32px; border-radius: 10px; font-weight: 600; text-decoration: none; display: inline-block; margin: 25px 0; transition: all 0.3s; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); font-size: 16px; }
          .cta:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4); background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); }
          .contact { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 12px; margin-top: 25px; border: 2px solid #3b82f6; }
          .contact p { margin: 8px 0; color: #1e40af; font-size: 15px; font-weight: 500; }
          .contact strong { color: #1e3a8a; }
          .redirect { background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 16px; border-radius: 10px; margin-top: 25px; border: 2px solid #9ca3af; }
          .redirect p { color: #4b5563; font-size: 15px; margin: 5px 0; font-weight: 500; }
          .countdown { font-size: 24px; font-weight: 700; color: #6b7280; margin: 10px 0; }
          a { color: #2563eb; text-decoration: none; font-weight: 600; transition: all 0.3s; }
          a:hover { text-decoration: underline; color: #1d4ed8; }
          @media (max-width: 640px) {
            .container { padding: 30px 20px; }
            h1 { font-size: 26px; }
            .subtitle { font-size: 16px; }
            .icon { font-size: 60px; }
            .cta { padding: 14px 24px; font-size: 15px; }
            .info-row { flex-direction: column; align-items: flex-start; gap: 5px; }
            .info-value { text-align: left; }
          }
        </style>
        <script>
          let seconds = 20;
          function updateCountdown() {
            const elem = document.getElementById('countdown');
            if (elem && seconds > 0) {
              elem.textContent = seconds;
              seconds--;
              setTimeout(updateCountdown, 1000);
            }
          }
          window.onload = updateCountdown;
        </script>
      </head>
      <body>
        <div class="container">
          <div class="icon">❌</div>
          <h1>Rendez-vous annulé</h1>
          <p class="subtitle">Votre rendez-vous a bien été annulé</p>
          
          <div class="info">
            <div class="info-row">
              <span class="info-label">📅 Date annulée</span>
              <span class="info-value">${new Date(appointment.appointment_date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="info-row">
              <span class="info-label">⏰ Heure</span>
              <span class="info-value">${appointment.appointment_time}</span>
            </div>
          </div>
          
          <p style="margin-bottom: 25px;">Vous pouvez prendre un nouveau rendez-vous à tout moment.</p>
          
          <a href="https://test-psychotechnique-permis.com/prendre-rendez-vous" class="cta">
            📅 Prendre un nouveau rendez-vous
          </a>
          
          <div class="contact">
            <p><strong>Besoin d'aide ?</strong></p>
            <p>📞 Téléphone : <a href="tel:0765565379">07 65 56 53 79</a></p>
            <p>🌐 Site web : <a href="https://test-psychotechnique-permis.com">test-psychotechnique-permis.com</a></p>
          </div>
          
          <div class="redirect">
            <p>🔄 Redirection automatique dans <span id="countdown" class="countdown">20</span> secondes...</p>
            <p>vers la page de prise de rendez-vous</p>
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
