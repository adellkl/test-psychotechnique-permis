import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hzfpscgdyrqbplmhgwhi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'
);

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Confirmation de rendez-vous</title>
    <style type="text/css">
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; min-width: 100% !important; }
            .mobile-padding { padding: 20px 15px !important; }
            .mobile-padding-small { padding: 15px !important; }
            .mobile-font-large { font-size: 24px !important; }
            .mobile-font-medium { font-size: 18px !important; }
            .mobile-font-small { font-size: 14px !important; }
            .mobile-price { font-size: 20px !important; }
            .mobile-stack { display: block !important; width: 100% !important; text-align: left !important; }
            .mobile-hide { display: none !important; }
        }
        body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 10px;">
        <tr>
            <td align="center">
                <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <tr>
                        <td class="mobile-padding" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 class="mobile-font-large" style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; line-height: 1.2;">✅ Rendez-vous Confirmé</h1>
                            <p class="mobile-font-small" style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px; line-height: 1.4;">Test Psychotechnique du Permis de Conduire</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="mobile-padding" style="padding: 40px 30px;">
                            <h2 class="mobile-font-medium" style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600; line-height: 1.3;">Bonjour {{first_name}} {{last_name}},</h2>
                            <p class="mobile-font-small" style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">Nous avons le plaisir de confirmer votre rendez-vous pour le test psychotechnique. Toutes les informations importantes sont détaillées ci-dessous.</p>
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 12px; border: 2px solid #667eea; margin-bottom: 30px;">
                                <tr>
                                    <td class="mobile-padding-small" style="padding: 25px;">
                                        <h2 class="mobile-font-medium" style="margin: 0 0 25px 0; color: #667eea; font-size: 22px; font-weight: 700; line-height: 1.3; text-align: center;">📋 Informations de votre rendez-vous</h2>
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px;">📅 Votre rendez-vous</h3>
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                            <tr>
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0; width: 40%;">Date</td>
                                                <td class="mobile-stack mobile-font-small" style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">{{appointment_date}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Heure</td>
                                                <td class="mobile-stack mobile-font-small" style="color: #1f2937; font-size: 16px; font-weight: 700; padding: 8px 0; text-align: right;">{{appointment_time}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Tarif</td>
                                                <td class="mobile-stack mobile-price" style="color: #059669; font-size: 18px; font-weight: 700; padding: 8px 0; text-align: right;">90€</td>
                                            </tr>
                                        </table>
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px;">📍 Localisation</h3>
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                            <tr>
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0; width: 40%;">Centre</td>
                                                <td class="mobile-stack mobile-font-small" style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">{{location}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Adresse</td>
                                                <td class="mobile-stack mobile-font-small" style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right; line-height: 1.4;">{{address}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Métro</td>
                                                <td class="mobile-stack mobile-font-small" style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">Ligne 13 - Mairie de Clichy</td>
                                            </tr>
                                        </table>
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px;">🔑 Accès au cabinet</h3>
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                            <tr>
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0; width: 40%;">Code d'entrée</td>
                                                <td class="mobile-stack mobile-font-small" style="color: #1f2937; padding: 8px 0; text-align: right;"><span style="background-color: #d1fae5; padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 16px; color: #065f46;">6138A</span></td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Sonner à</td>
                                                <td class="mobile-stack mobile-font-small" style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">Cabinet</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Localisation</td>
                                                <td class="mobile-stack mobile-font-small" style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">Rez-de-chaussée, droit</td>
                                            </tr>
                                        </table>
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px;">⚠️ À prévoir</h3>
                                        <ul class="mobile-font-small" style="margin: 0 0 20px 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                                            <li style="margin-bottom: 6px;">Arrivez <strong>15 minutes avant</strong></li>
                                            <li style="margin-bottom: 6px;"><strong>Pièce d'identité valide</strong> obligatoire</li>
                                            <li style="margin-bottom: 6px;">Lunettes ou lentilles si nécessaire</li>
                                            <li style="margin-bottom: 6px;"><strong>Paiement en espèces</strong></li>
                                            <li>Durée : environ 45 minutes</li>
                                        </ul>
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px;">📞 Contact</h3>
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0; width: 40%;">Téléphone</td>
                                                <td class="mobile-stack mobile-font-small" style="padding: 8px 0; text-align: right;"><a href="tel:{{contact_phone}}" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px;">{{contact_phone}}</a></td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Site web</td>
                                                <td class="mobile-stack mobile-font-small" style="padding: 8px 0; text-align: right;"><a href="{{website}}" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px;">test-psychotechnique-permis.com</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                <tr>
                                    <td align="center" style="padding: 10px 0;">
                                        <h3 class="mobile-font-medium" style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600; text-align: center;">Besoin d'annuler votre rendez-vous ?</h3>
                                        <p class="mobile-font-small" style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; text-align: center;">Votre rendez-vous est <strong style="color: #059669;">confirmé</strong>. Si vous ne pouvez pas vous présenter, merci de l'annuler en cliquant sur le bouton ci-dessous.</p>
                                        <a href="{{website}}/api/appointments/cancel?id={{appointment_id}}&token={{confirmation_token}}" style="display: inline-block; padding: 14px 32px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);">❌ Annuler mon rendez-vous</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="mobile-padding-small" style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p class="mobile-font-small" style="margin: 0 0 10px 0; color: #6b7280; font-size: 15px; line-height: 1.6;">Merci de votre confiance ! 🙏</p>
                            <p class="mobile-font-small" style="margin: 0; color: #9ca3af; font-size: 14px; line-height: 1.5;"><strong>Centre Psychotechnique Permis Expert</strong><br>Test Psychotechnique du Permis de Conduire - Clichy</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

const textContent = `✅ RENDEZ-VOUS CONFIRMÉ
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
• Paiement en espèces
• Durée du test : environ 45 minutes

🚇 ACCÈS ET CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Métro : Ligne 13 - Station Mairie de Clichy (3 minutes à pied)
Téléphone : {{contact_phone}}
Site web : {{website}}

🔑 INFORMATIONS D'ACCÈS AU CABINET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Code d'entrée : 6138A
🔔 Sonner à : Cabinet
📍 Localisation : Rez-de-chaussée, droit

⚡ BESOIN D'ANNULER ?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Votre rendez-vous est CONFIRMÉ.
Si vous ne pouvez pas vous présenter, merci de l'annuler en cliquant ici :
{{website}}/api/appointments/cancel?id={{appointment_id}}&token={{confirmation_token}}

Merci de votre confiance ! 🙏
Centre Psychotechnique Permis Expert
Test Psychotechnique du Permis de Conduire - Clichy`;

async function updateTemplate() {
  console.log('📧 Mise à jour du template email...');
  
  const { data, error } = await supabase
    .from('email_templates')
    .update({
      html_content: htmlContent,
      text_content: textContent,
      updated_at: new Date().toISOString()
    })
    .eq('template_name', 'appointment_confirmation_client');
  
  if (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } else {
    console.log('✅ Template mis à jour avec succès');
    console.log('✅ Les nouveaux rendez-vous afficheront "Votre rendez-vous est confirmé"');
  }
}

updateTemplate();
