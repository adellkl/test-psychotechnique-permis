export const defaultEmailTemplates = [
  {
    template_name: 'appointment_confirmation_client',
    subject: '✅ Confirmation de rendez-vous - Test Psychotechnique',
    html_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Confirmation de rendez-vous</title>
    <style type="text/css">
        /* Styles responsive pour mobile */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                min-width: 100% !important;
            }
            .mobile-padding {
                padding: 20px 15px !important;
            }
            .mobile-padding-small {
                padding: 15px !important;
            }
            .mobile-font-large {
                font-size: 24px !important;
            }
            .mobile-font-medium {
                font-size: 18px !important;
            }
            .mobile-font-small {
                font-size: 14px !important;
            }
            .mobile-price {
                font-size: 20px !important;
            }
            .mobile-stack {
                display: block !important;
                width: 100% !important;
                text-align: left !important;
            }
            .mobile-hide {
                display: none !important;
            }
        }
        
        /* Styles pour Outlook */
        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <!-- Wrapper complet -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 10px;">
        <tr>
            <td align="center">
                <!-- Container principal -->
                <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header avec gradient moderne -->
                    <tr>
                        <td class="mobile-padding" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 class="mobile-font-large" style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; line-height: 1.2;">
                                ✅ Rendez-vous Confirmé
                            </h1>
                            <p class="mobile-font-small" style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px; line-height: 1.4;">Test Psychotechnique du Permis de Conduire</p>
                        </td>
                    </tr>
                    
                    <!-- Contenu principal -->
                    <tr>
                        <td class="mobile-padding" style="padding: 40px 30px;">
                            <h2 class="mobile-font-medium" style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600; line-height: 1.3;">
                                Bonjour {{first_name}} {{last_name}},
                            </h2>
                            
                            <p class="mobile-font-small" style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Nous avons le plaisir de confirmer votre rendez-vous pour le test psychotechnique. Toutes les informations importantes sont détaillées ci-dessous.
                            </p>
                            
                            <!-- Section Informations unique -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 12px; border: 2px solid #667eea; margin-bottom: 30px;">
                                <tr>
                                    <td class="mobile-padding-small" style="padding: 25px;">
                                        <h2 class="mobile-font-medium" style="margin: 0 0 25px 0; color: #667eea; font-size: 22px; font-weight: 700; line-height: 1.3; text-align: center;">
                                            📋 Informations de votre rendez-vous
                                        </h2>
                                        
                                        <!-- Sous-section: Rendez-vous -->
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
                                            📅 Votre rendez-vous
                                        </h3>
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
                                        
                                        <!-- Sous-section: Localisation -->
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
                                            📍 Localisation
                                        </h3>
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
                                        
                                        <!-- Sous-section: Accès au cabinet -->
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
                                            🔑 Accès au cabinet
                                        </h3>
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                            <tr>
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0; width: 40%;">Code d'entrée</td>
                                                <td class="mobile-stack mobile-font-small" style="color: #1f2937; padding: 8px 0; text-align: right;">
                                                    <span style="background-color: #d1fae5; padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 16px; color: #065f46;">6138A</span>
                                                </td>
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
                                        
                                        <!-- Sous-section: À prévoir -->
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
                                            ⚠️ À prévoir
                                        </h3>
                                        <ul class="mobile-font-small" style="margin: 0 0 20px 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                                            <li style="margin-bottom: 6px;">Arrivez <strong>15 minutes avant</strong></li>
                                            <li style="margin-bottom: 6px;"><strong>Pièce d'identité valide</strong> obligatoire</li>
                                            <li style="margin-bottom: 6px;">Lunettes ou lentilles si nécessaire</li>
                                            <li style="margin-bottom: 6px;"><strong>Paiement en espèces</strong></li>
                                            <li>Durée : 40 minutes</li>
                                        </ul>
                                        
                                        <!-- Sous-section: Contact -->
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
                                            📞 Contact
                                        </h3>
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0; width: 40%;">Téléphone</td>
                                                <td class="mobile-stack mobile-font-small" style="padding: 8px 0; text-align: right;">
                                                    <a href="tel:{{contact_phone}}" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px;">{{contact_phone}}</a>
                                                </td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td class="mobile-stack" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Site web</td>
                                                <td class="mobile-stack mobile-font-small" style="padding: 8px 0; text-align: right;">
                                                    <a href="{{website}}" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px;">test-psychotechnique-permis.com</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Bouton d'annulation uniquement -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                <tr>
                                    <td align="center" style="padding: 10px 0;">
                                        <h3 class="mobile-font-medium" style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600; text-align: center;">
                                            Besoin d'annuler votre rendez-vous ?
                                        </h3>
                                        <p class="mobile-font-small" style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; text-align: center;">
                                            Votre rendez-vous est <strong style="color: #059669;">confirmé</strong>. Si vous ne pouvez pas vous présenter, merci de l'annuler en cliquant sur le bouton ci-dessous.
                                        </p>
                                        <a href="{{website}}/api/appointments/cancel?id={{appointment_id}}&token={{confirmation_token}}" style="display: inline-block; padding: 14px 32px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);">
                                            ❌ Annuler mon rendez-vous
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="mobile-padding-small" style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p class="mobile-font-small" style="margin: 0 0 10px 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                                Merci de votre confiance ! 🙏
                            </p>
                            <p class="mobile-font-small" style="margin: 0; color: #9ca3af; font-size: 14px; line-height: 1.5;">
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
• Paiement en espèces
• Durée du test : 40 minutes

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
Test Psychotechnique du Permis de Conduire - Clichy
`
  },
  
  {

    template_name: 'appointment_reminder_client',
    subject: 'Rappel : Votre rendez-vous demain - {{first_name}} {{last_name}}',
    html_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rappel de rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Rappel de rendez-vous</h1>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #059669; margin-top: 0;">Bonjour {{first_name}},</h2>
        
        <p>Nous vous rappelons votre rendez-vous prévu <strong>demain</strong> :</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #10b981;">📅 Votre rendez-vous</h3>
            <p><strong>Date :</strong> {{appointment_date}}</p>
            <p><strong>Heure :</strong> {{appointment_time}}</p>
            <p><strong>Lieu :</strong> {{location}}</p>
            <p>{{address}}</p>
            <p style="color: #6b7280;">{{location_details}}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #92400e;">📋 N'oubliez pas</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Arrivez 15 minutes avant l'heure</li>
                <li>Pièce d'identité obligatoire</li>
                <li>Lunettes si vous en portez</li>
            </ul>
        </div>
        
        <p style="text-align: center;">
            <strong>Contact :</strong> {{phone}}
        </p>
        
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
            À bientôt !<br>
            L'équipe Permis Expert
        </p>
    </div>
</body>
</html>`,
    text_content: `
RAPPEL DE RENDEZ-VOUS

Bonjour {{first_name}},

Nous vous rappelons votre rendez-vous prévu DEMAIN :

Date : {{appointment_date}}
Heure : {{appointment_time}}

Lieu : {{location}}
{{address}}
{{location_details}}

N'OUBLIEZ PAS :
- Arrivez 15 minutes avant l'heure
- Pièce d'identité obligatoire
- Lunettes si vous en portez

Contact : {{phone}}

À bientôt !
L'équipe Permis Expert
`
  },
  
  {
    template_name: 'appointment_cancellation_client',
    subject: 'Annulation de votre rendez-vous - {{first_name}} {{last_name}}',
    html_content: `
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
        <h2 style="color: #dc2626; margin-top: 0;">Bonjour {{first_name}} {{last_name}},</h2>
        
        <p>Nous vous informons que votre rendez-vous a été annulé :</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #dc2626;">📅 Rendez-vous annulé</h3>
            <p><strong>Date :</strong> {{appointment_date}}</p>
            <p><strong>Heure :</strong> {{appointment_time}}</p>
            <p><strong>Raison :</strong> {{reason}}</p>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #1d4ed8;">💡 Reprendre rendez-vous</h4>
            <p>Vous pouvez reprendre un nouveau rendez-vous à tout moment sur notre site web ou en nous contactant directement.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <p><strong>Contact :</strong> {{phone}}</p>
            <p><a href="{{website}}" style="color: #2563eb; text-decoration: none;">🌐 Reprendre rendez-vous</a></p>
        </div>
        
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
            Nous nous excusons pour la gêne occasionnée.<br>
            L'équipe Permis Expert
        </p>
    </div>
</body>
</html>`,
    text_content: `
RENDEZ-VOUS ANNULÉ

Bonjour {{first_name}} {{last_name}},

Nous vous informons que votre rendez-vous a été annulé :

Date : {{appointment_date}}
Heure : {{appointment_time}}
Raison : {{reason}}

REPRENDRE RENDEZ-VOUS
Vous pouvez reprendre un nouveau rendez-vous à tout moment sur notre site web ou en nous contactant directement.

Contact : {{phone}}
Site web : {{website}}

Nous nous excusons pour la gêne occasionnée.
L'équipe Permis Expert
`
  },
  
  {
    template_name: 'appointment_confirmation_reminder',
    subject: '⏰ Rappel : Confirmez votre rendez-vous - {{first_name}} {{last_name}}',
    html_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rappel de confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">⏰ N'oubliez pas de confirmer !</h1>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #d97706; margin-top: 0;">Bonjour {{first_name}} {{last_name}},</h2>
        
        <p>Nous avons remarqué que vous n'avez pas encore confirmé votre rendez-vous réservé il y a quelques heures.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #d97706;">📅 Votre rendez-vous</h3>
            <p><strong>Date :</strong> {{appointment_date}}</p>
            <p><strong>Heure :</strong> {{appointment_time}}</p>
            <p><strong>Lieu :</strong> {{location}}</p>
            <p>{{address}}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #92400e;">⚠️ Action requise</h4>
            <p>Pour garantir votre place, merci de confirmer ou annuler votre rendez-vous en cliquant sur l'un des boutons ci-dessous.</p>
            <p><strong>Si vous ne confirmez pas, votre créneau pourrait être libéré pour d'autres personnes.</strong></p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{website}}/api/appointments/confirm?id={{appointment_id}}&token={{confirmation_token}}" style="display: inline-block; padding: 14px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 0 10px;">
                ✅ Confirmer ma présence
            </a>
            <a href="{{website}}/api/appointments/cancel?id={{appointment_id}}&token={{confirmation_token}}" style="display: inline-block; padding: 14px 32px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 0 10px;">
                ❌ Annuler
            </a>
        </div>
        
        <p style="text-align: center;">
            <strong>Contact :</strong> {{contact_phone}}
        </p>
        
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
            Merci de votre attention !<br>
            L'équipe Test Psychotechnique Permis Expert
        </p>
    </div>
</body>
</html>`,
    text_content: `
⏰ RAPPEL DE CONFIRMATION

Bonjour {{first_name}} {{last_name}},

Nous avons remarqué que vous n'avez pas encore confirmé votre rendez-vous réservé il y a quelques heures.

📅 VOTRE RENDEZ-VOUS
Date : {{appointment_date}}
Heure : {{appointment_time}}
Lieu : {{location}}
{{address}}

⚠️ ACTION REQUISE
Pour garantir votre place, merci de confirmer ou annuler votre rendez-vous.
Si vous ne confirmez pas, votre créneau pourrait être libéré pour d'autres personnes.

CONFIRMER : {{website}}/api/appointments/confirm?id={{appointment_id}}&token={{confirmation_token}}
ANNULER : {{website}}/api/appointments/cancel?id={{appointment_id}}&token={{confirmation_token}}

Contact : {{contact_phone}}

Merci de votre attention !
L'équipe Test Psychotechnique Permis Expert
`
  }
]

export async function initializeEmailTemplates() {
  const { supabase } = await import('./supabase')
  
  try {
    for (const template of defaultEmailTemplates) {
      const { error } = await supabase
        .from('email_templates')
        .upsert(template, { 
          onConflict: 'template_name',
          ignoreDuplicates: false 
        })
      
      if (error) {
        console.error(`Error upserting template ${template.template_name}:`, error)
      } else {
        console.log(`✅ Template ${template.template_name} initialized`)
      }
    }
    
    console.log('✅ All email templates initialized successfully')
    return { success: true }
  } catch (error) {
    console.error('❌ Error initializing email templates:', error)
    return { success: false, error }
  }
}
