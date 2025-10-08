const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'

const supabase = createClient(supabaseUrl, supabaseKey)

const newTemplate = {
  template_name: 'appointment_confirmation_client',
  subject: '✅ Confirmation de rendez-vous - Test Psychotechnique',
  html_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de rendez-vous</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header avec gradient moderne -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                                ✅ Rendez-vous Confirmé
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Test Psychotechnique du Permis de Conduire</p>
                        </td>
                    </tr>
                    
                    <!-- Contenu principal -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
                                Bonjour {{first_name}} {{last_name}},
                            </h2>
                            
                            <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Nous avons le plaisir de confirmer votre rendez-vous pour le test psychotechnique. Toutes les informations importantes sont détaillées ci-dessous.
                            </p>
                            
                            <!-- Carte d'informations du RDV -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 12px; border: 2px solid #667eea; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="margin: 0 0 20px 0; color: #667eea; font-size: 18px; font-weight: 600;">
                                            📋 Informations de votre rendez-vous
                                        </h3>
                                        
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #374151; font-weight: 600; font-size: 15px; padding: 10px 0;">📅 Date</td>
                                                <td style="color: #1f2937; font-size: 15px; padding: 10px 0; text-align: right;">{{appointment_date}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td style="color: #374151; font-weight: 600; font-size: 15px; padding: 10px 0;">⏰ Heure</td>
                                                <td style="color: #1f2937; font-size: 16px; font-weight: 700; padding: 10px 0; text-align: right;">{{appointment_time}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td style="color: #374151; font-weight: 600; font-size: 15px; padding: 10px 0;">📍 Centre</td>
                                                <td style="color: #1f2937; font-size: 15px; padding: 10px 0; text-align: right;">{{location}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td style="color: #374151; font-weight: 600; font-size: 15px; padding: 10px 0;">🏠 Adresse</td>
                                                <td style="color: #1f2937; font-size: 15px; padding: 10px 0; text-align: right;">{{address}}</td>
                                            </tr>
                                            <tr style="border-top: 2px solid #667eea;">
                                                <td style="color: #374151; font-weight: 600; font-size: 16px; padding: 15px 0 10px 0;">💰 Tarif</td>
                                                <td style="color: #059669; font-size: 24px; font-weight: 700; padding: 15px 0 10px 0; text-align: right;">90€</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Instructions importantes -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 12px; border-left: 4px solid #f59e0b; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600;">
                                            ⚠️ Informations importantes
                                        </h3>
                                        <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 15px; line-height: 1.8;">
                                            <li style="margin-bottom: 8px;"><strong>Arrivez 15 minutes avant</strong> l'heure de votre rendez-vous</li>
                                            <li style="margin-bottom: 8px;"><strong>Pièce d'identité valide</strong> obligatoire (CNI, passeport ou titre de séjour)</li>
                                            <li style="margin-bottom: 8px;"><strong>Lunettes ou lentilles</strong> si vous en portez habituellement</li>
                                            <li style="margin-bottom: 8px;"><strong>Paiement sur place</strong> : espèces, carte bancaire ou chèque</li>
                                            <li><strong>Durée du test</strong> : environ 45 minutes</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Accès et contact -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 12px; border-left: 4px solid #3b82f6;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px; font-weight: 600;">
                                            🚇 Accès et Contact
                                        </h3>
                                        <p style="margin: 0 0 10px 0; color: #1e3a8a; font-size: 15px; line-height: 1.6;">
                                            <strong>Métro :</strong> Ligne 13 - Station Mairie de Clichy (3 minutes à pied)
                                        </p>
                                        <p style="margin: 0 0 10px 0; color: #1e3a8a; font-size: 15px; line-height: 1.6;">
                                            <strong>Téléphone :</strong> <a href="tel:{{contact_phone}}" style="color: #2563eb; text-decoration: none; font-weight: 600;">{{contact_phone}}</a>
                                        </p>
                                        <p style="margin: 0; color: #1e3a8a; font-size: 15px; line-height: 1.6;">
                                            <strong>Site web :</strong> <a href="{{website}}" style="color: #2563eb; text-decoration: none; font-weight: 600;">{{website}}</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                                Merci de votre confiance ! 🙏
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 14px;">
                                <strong>Centre Psychotechnique Permis Expert</strong><br>
                                Test Psychotechnique du Permis de Conduire - Clichy
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
  text_content: `
✅ RENDEZ-VOUS CONFIRMÉ
Test Psychotechnique du Permis de Conduire

Bonjour {{first_name}} {{last_name}},

Nous avons le plaisir de confirmer votre rendez-vous pour le test psychotechnique.

📋 INFORMATIONS DE VOTRE RENDEZ-VOUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Date : {{appointment_date}}
⏰ Heure : {{appointment_time}}
📍 Centre : {{location}}
🏠 Adresse : {{address}}
💰 Tarif : 90€

⚠️ INFORMATIONS IMPORTANTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Arrivez 15 minutes avant l'heure de votre rendez-vous
• Pièce d'identité valide obligatoire (CNI, passeport ou titre de séjour)
• Lunettes ou lentilles si vous en portez habituellement
• Paiement sur place : espèces, carte bancaire ou chèque
• Durée du test : environ 45 minutes

🚇 ACCÈS ET CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Métro : Ligne 13 - Station Mairie de Clichy (3 minutes à pied)
Téléphone : {{contact_phone}}
Site web : {{website}}

Merci de votre confiance ! 🙏
Centre Psychotechnique Permis Expert
Test Psychotechnique du Permis de Conduire - Clichy
`
}

async function updateTemplate() {
  console.log('🔄 Mise à jour du template email dans la base de données...\n')

  try {
    const { data, error } = await supabase
      .from('email_templates')
      .upsert(newTemplate, { 
        onConflict: 'template_name',
        ignoreDuplicates: false 
      })
      .select()

    if (error) {
      console.error('❌ Erreur lors de la mise à jour:', error)
      return
    }

    console.log('✅ Template mis à jour avec succès!')
    console.log('\n📧 Nouveau template:')
    console.log('   - Nom:', newTemplate.template_name)
    console.log('   - Sujet:', newTemplate.subject)
    console.log('   - Police: Segoe UI, Tahoma, Geneva, Verdana')
    console.log('   - Design: Gradient moderne violet/mauve')
    console.log('   - Prix: 90€ affiché en grand')
    console.log('   - Email admin: f.sebti@outlook.com')
    console.log('\n✅ Tous les changements ont été appliqués!')

  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

updateTemplate()
