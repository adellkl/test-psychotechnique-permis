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
            <p>Le lien de confirmation n'est pas valide. Veuillez contacter le centre.</p>
          </div>
        </body>
        </html>`,
        { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }

    // Vérifier si déjà confirmé ou annulé
    if (appointment.status === 'confirmed') {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Déjà confirmé</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 500px; }
            h1 { color: #10b981; margin-bottom: 20px; }
            p { color: #6b7280; line-height: 1.6; margin-bottom: 10px; }
            .info { background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Déjà confirmé</h1>
            <p>Votre rendez-vous a déjà été confirmé.</p>
            <div class="info">
              <p><strong>Date :</strong> ${new Date(appointment.appointment_date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Heure :</strong> ${appointment.appointment_time}</p>
            </div>
            <p style="margin-top: 20px;">À bientôt ! 👋</p>
          </div>
        </body>
        </html>`,
        { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }

    if (appointment.status === 'cancelled') {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Rendez-vous annulé</title>
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
            <h1>❌ Rendez-vous annulé</h1>
            <p>Ce rendez-vous a déjà été annulé.</p>
            <a href="https://test-psychotechnique-permis.com/prendre-rendez-vous">Prendre un nouveau rendez-vous</a>
          </div>
        </body>
        </html>`,
        { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }

    // Mettre à jour le statut à "confirmed"
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ 
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)

    if (updateError) {
      console.error('Error confirming appointment:', updateError)
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
            <p>Une erreur est survenue lors de la confirmation. Veuillez réessayer ou contacter le centre.</p>
          </div>
        </body>
        </html>`,
        { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }

    // Redirection vers la page d'accueil avec message de succès
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="5;url=https://test-psychotechnique-permis.com">
        <title>Rendez-vous confirmé</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 550px; margin: 20px; }
          h1 { color: #10b981; margin-bottom: 20px; font-size: 32px; }
          .success-icon { font-size: 64px; margin-bottom: 20px; animation: bounce 1s ease; }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          p { color: #6b7280; line-height: 1.6; margin-bottom: 10px; font-size: 16px; }
          .info { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; text-align: left; }
          .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #d1fae5; }
          .info-row:last-child { border-bottom: none; }
          .info-label { color: #065f46; font-weight: 600; font-size: 14px; }
          .info-value { color: #064e3b; font-size: 14px; text-align: right; }
          .code { background: #d1fae5; padding: 6px 12px; border-radius: 4px; font-weight: 700; font-size: 16px; color: #065f46; }
          .redirect { background: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 20px; }
          .redirect p { color: #1e40af; font-size: 14px; margin: 5px 0; }
          a { color: #2563eb; text-decoration: none; font-weight: 600; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>Rendez-vous confirmé !</h1>
          <p style="font-size: 18px; color: #10b981; font-weight: 600;">Merci d'avoir confirmé votre présence</p>
          
          <div class="info">
            <div class="info-row">
              <span class="info-label">📅 Date</span>
              <span class="info-value">${new Date(appointment.appointment_date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="info-row">
              <span class="info-label">⏰ Heure</span>
              <span class="info-value" style="font-weight: 700; font-size: 16px;">${appointment.appointment_time}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📍 Adresse</span>
              <span class="info-value">82 Rue Henri Barbusse, 92110 Clichy</span>
            </div>
            <div class="info-row">
              <span class="info-label">🚇 Métro</span>
              <span class="info-value">Ligne 13 - Mairie de Clichy</span>
            </div>
            <div class="info-row">
              <span class="info-label">🔑 Code d'entrée</span>
              <span class="info-value"><span class="code">6138A</span></span>
            </div>
            <div class="info-row">
              <span class="info-label">🔔 Sonner à</span>
              <span class="info-value">Cabinet</span>
            </div>
            <div class="info-row">
              <span class="info-label">📍 Localisation</span>
              <span class="info-value">Rez-de-chaussée, droit</span>
            </div>
            <div class="info-row">
              <span class="info-label">📞 Contact</span>
              <span class="info-value"><a href="tel:0765565379">07 65 56 53 79</a></span>
            </div>
          </div>
          
          <p style="background: #fef3c7; padding: 12px; border-radius: 6px; color: #92400e; font-size: 14px; margin: 20px 0;">
            ⚠️ <strong>N'oubliez pas :</strong> Arrivez 15 minutes avant avec votre pièce d'identité
          </p>
          
          <div class="redirect">
            <p>🔄 Redirection automatique dans 5 secondes...</p>
            <p>ou <a href="https://test-psychotechnique-permis.com">cliquez ici pour retourner au site</a></p>
          </div>
        </div>
      </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )

  } catch (error) {
    console.error('Error in confirm route:', error)
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
          <p>Une erreur inattendue est survenue. Veuillez contacter le centre.</p>
        </div>
      </body>
      </html>`,
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }
}
