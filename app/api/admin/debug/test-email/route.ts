import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { to } = await request.json()
    
    if (!to) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email destinataire requis' 
      }, { status: 400 })
    }

    const apiKey = process.env.ELASTIC_EMAIL_API_KEY
    const fromEmail = process.env.FROM_EMAIL || 'contact@test-psychotechnique-permis.com'

    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'ELASTIC_EMAIL_API_KEY non configurée' 
      }, { status: 500 })
    }

    const params = new URLSearchParams({
      apikey: apiKey,
      from: fromEmail,
      to,
      subject: '[TEST DEBUG] Email de test',
      bodyHtml: `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-center; margin-bottom: 15px;">
                  <span style="font-size: 30px;">✅</span>
                </div>
                <h2 style="color: #1f2937; margin: 0;">Email de Test Réussi</h2>
              </div>
              
              <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <p style="margin: 0; color: #1e40af;">
                  <strong>✉️ Ce message confirme que le service d'envoi d'emails fonctionne correctement.</strong>
                </p>
              </div>
              
              <div style="margin: 20px 0;">
                <p style="color: #4b5563; line-height: 1.6;">
                  <strong>Informations du test:</strong><br>
                  📅 Date: ${new Date().toLocaleString('fr-FR')}<br>
                  📧 Destinataire: ${to}<br>
                  🔧 Envoyé depuis: Panneau de debug admin
                </p>
              </div>
              
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  <strong>Configuration:</strong><br>
                  • Service: Elastic Email API<br>
                  • Expéditeur: ${fromEmail}<br>
                  • Type: Email transactionnel
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              
              <div style="text-align: center; color: #9ca3af; font-size: 12px;">
                <p style="margin: 5px 0;">Test automatique du système d'emails</p>
                <p style="margin: 5px 0;">Test Psychotechnique Permis</p>
                <p style="margin: 5px 0;">
                  <a href="https://test-psychotechnique-permis.com" style="color: #3b82f6; text-decoration: none;">
                    https://test-psychotechnique-permis.com
                  </a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      isTransactional: 'true'
    })

    const response = await fetch('https://api.elasticemail.com/v2/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Échec de l\'envoi')
    }

    return NextResponse.json({
      success: true,
      transactionId: result.data.transactionid,
      messageId: result.data.messageid
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
