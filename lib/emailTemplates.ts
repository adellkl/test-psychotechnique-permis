export const defaultEmailTemplates = [
    {
        template_name: 'appointment_confirmation_client',
        subject: 'Confirmation du rendez-vous - Test Psychotechnique & Plan d\'accès au centre {{location}}',
        html_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Confirmation de rendez-vous</title>
    <style type="text/css">
        /* Police professionnelle */
        body, table, td, p, h1, h2, h3, h4, ul, li {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        /* Styles responsive pour mobile */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                min-width: 100% !important;
                border-radius: 0 !important;
            }
            .mobile-padding {
                padding: 25px 20px !important;
            }
            .mobile-padding-small {
                padding: 20px 15px !important;
            }
            .mobile-font-large {
                font-size: 22px !important;
                line-height: 1.3 !important;
            }
            .mobile-font-medium {
                font-size: 18px !important;
                line-height: 1.4 !important;
            }
            .mobile-font-small {
                font-size: 13px !important;
                line-height: 1.5 !important;
            }
            .mobile-price {
                font-size: 18px !important;
            }
            .mobile-stack {
                display: block !important;
                width: 100% !important;
                text-align: left !important;
                padding: 6px 0 !important;
            }
            .mobile-stack-right {
                text-align: left !important;
                padding-top: 4px !important;
            }
            .mobile-hide {
                display: none !important;
            }
            .mobile-button {
                padding: 12px 24px !important;
                font-size: 14px !important;
                display: block !important;
                width: 90% !important;
                max-width: 280px !important;
            }
            .mobile-table-cell {
                font-size: 13px !important;
                padding: 6px 0 !important;
            }
            ul li {
                font-size: 13px !important;
                margin-bottom: 8px !important;
            }
            /* Styles responsive pour access details */
            .access-code-text {
                font-size: 24px !important;
                letter-spacing: 2px !important;
            }
            .access-instruction-icon {
                font-size: 16px !important;
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
        
        /* Styles pour les détails d'accès */
        .access-container {
            background-color: #f0f9ff;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .access-title {
            margin: 0 0 15px 0;
            color: #1e40af;
            font-size: 15px;
            font-weight: 700;
        }
        
        .access-address-box {
            background-color: #ffffff;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
            border-left: 3px solid #3b82f6;
        }
        
        .access-instructions-box {
            background-color: #ffffff;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
        }
        
        .access-instruction-row {
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .access-instruction-row:last-child {
            border-bottom: none;
        }
        
        .access-code-box {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
        }
        
        .access-code-label {
            margin: 0 0 8px 0;
            color: #1e40af;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .access-code-text {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            color: #1e40af;
            letter-spacing: 4px;
            font-family: 'Courier New', Courier, monospace;
            text-shadow: 1px 1px 2px rgba(30, 64, 175, 0.1);
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
                    
                    <!-- Header professionnel -->
                    <tr>
                        <td class="mobile-padding" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
                            <h1 class="mobile-font-large" style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">
                                Confirmation de rendez-vous
                            </h1>
                            <p class="mobile-font-small" style="margin: 10px 0 0 0; color: #dbeafe; font-size: 16px; line-height: 1.4; font-weight: 500;">Test Psychotechnique du Permis de Conduire</p>
                        </td>
                    </tr>
                    
                    <!-- Contenu principal -->
                    <tr>
                        <td class="mobile-padding" style="padding: 40px 30px;">
                            <!-- Message important en haut -->
                            <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6; text-align: center;">
                                    <strong>Important :</strong> En cas d'empêchement, merci de nous en informer 48h avant, au <a href="tel:0765565379" style="color: #2563eb; text-decoration: none; font-weight: 700;">07 65 56 53 79</a> afin de ne pas bloquer le créneau à d'autres candidats. Merci de votre compréhension.
                                </p>
                            </div>
                            
                            <h2 class="mobile-font-medium" style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600; line-height: 1.3;">
                                Bonjour {{first_name}} {{last_name}},
                            </h2>
                            
                            <p class="mobile-font-small" style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Nous avons le plaisir de confirmer votre rendez-vous pour le test psychotechnique. Toutes les informations importantes sont détaillées ci-dessous.
                            </p>
                            
                            <!-- Section Informations unique -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; border: 2px solid #3b82f6; margin-bottom: 30px;">
                                <tr>
                                    <td class="mobile-padding-small" style="padding: 25px;">
                                        <h2 class="mobile-font-medium" style="margin: 0 0 25px 0; color: #1e40af; font-size: 22px; font-weight: 700; line-height: 1.3; text-align: center;">
                                            Informations de votre rendez-vous
                                        </h2>
                                        
                                        <!-- Sous-section: Rendez-vous -->
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 700; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
                                            Votre rendez-vous
                                        </h3>
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                            <tr>
                                                <td class="mobile-table-cell" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0; width: 40%;">Date</td>
                                                <td class="mobile-table-cell mobile-stack-right" style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">{{appointment_date}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td class="mobile-table-cell" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Heure</td>
                                                <td class="mobile-table-cell mobile-stack-right" style="color: #1f2937; font-size: 16px; font-weight: 700; padding: 8px 0; text-align: right;">{{appointment_time}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td class="mobile-table-cell" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Tarif</td>
                                                <td class="mobile-table-cell mobile-price mobile-stack-right" style="color: #059669; font-size: 18px; font-weight: 700; padding: 8px 0; text-align: right;">90€</td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Sous-section: Localisation -->
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 700; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
                                            Localisation
                                        </h3>
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                            <tr>
                                                <td class="mobile-table-cell" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0; width: 40%;">Centre</td>
                                                <td class="mobile-table-cell mobile-stack-right" style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">{{location}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td class="mobile-table-cell" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Adresse</td>
                                                <td class="mobile-table-cell mobile-stack-right" style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right; line-height: 1.4;">{{address}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td class="mobile-table-cell" style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Accès</td>
                                                <td class="mobile-table-cell mobile-stack-right" style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">{{metro_info}}</td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Plan d'accès détaillé (dynamique selon le centre) -->
                                        {{access_details}}
                                        
                                        
                                        <!-- Sous-section: À prévoir -->
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 700; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
                                            À prévoir
                                        </h3>
                                        <ul class="mobile-font-small" style="margin: 0 0 20px 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                                            <li style="margin-bottom: 6px;">Arrivez <strong>15 minutes avant</strong></li>
                                            <li style="margin-bottom: 6px;"><strong>Pièce d'identité valide</strong></li>
                                            <li style="margin-bottom: 6px;">Lunettes ou lentilles si nécessaire</li>
                                            <li style="margin-bottom: 6px;"><strong>Paiement en espèces & chèques</strong></li>
                                        </ul>
                                        
                                        
                                        <!-- Sous-section: Contact -->
                                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 700; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
                                            Contact
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
                            
                            <!-- Message annulation -->
                            <div style="background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: center;">
                                <h3 class="mobile-font-medium" style="margin: 0 0 15px 0; color: #991b1b; font-size: 18px; font-weight: 700;">
                                    Besoin d'annuler votre rendez-vous ?
                                </h3>
                                <p class="mobile-font-small" style="margin: 0; color: #7f1d1d; font-size: 15px; line-height: 1.6;">
                                    Si vous souhaitez annuler votre rendez-vous, merci de contacter le centre <strong>48 heures avant</strong> au <a href="tel:0765565379" style="color: #2563eb; text-decoration: none; font-weight: 700;">07 65 56 53 79</a>
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="mobile-padding-small" style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p class="mobile-font-small" style="margin: 0 0 10px 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                                Merci de votre confiance.
                            </p>
                            <p class="mobile-font-small" style="margin: 0; color: #9ca3af; font-size: 14px; line-height: 1.5;">
                                <strong>Test Psychotechnique Permis</strong><br>
                                Centre Agréé 
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
RENDEZ-VOUS CONFIRMÉ
Test Psychotechnique du Permis de Conduire

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT : En cas d'empêchement, merci de nous en informer 48h avant, au 07 65 56 53 79 afin de ne pas bloquer le créneau à d'autres candidats. Merci de votre compréhension.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bonjour {{first_name}} {{last_name}},

Nous avons le plaisir de confirmer votre rendez-vous pour le test psychotechnique.

INFORMATIONS DE VOTRE RENDEZ-VOUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date : {{appointment_date}}
Heure : {{appointment_time}}
Centre : {{location}}
Adresse : {{address}}
Tarif : 90€

INFORMATIONS IMPORTANTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Arrivez 15 minutes avant l'heure de votre rendez-vous
• Pièce d'identité valide (CNI, passeport ou titre de séjour)
• Lunettes ou lentilles si vous en portez habituellement
• Paiement en espèces & chèques

ACCÈS ET CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Accès : {{metro_info}}
Téléphone : {{contact_phone}}
Site web : {{website}}

BESOIN D'ANNULER ?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Si vous souhaitez annuler votre rendez-vous, merci de contacter le centre 48 heures avant au 07 65 56 53 79

Merci de votre confiance.
L'équipe Test Psychotechnique Permis
Centre Agréé 
`
    },

    {

        template_name: 'appointment_reminder_client',
        subject: 'Rappel : Votre rendez-vous - Test Psychotechnique',
        html_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Rappel de rendez-vous</title>
    <style type="text/css">
        /* Police professionnelle */
        body, table, td, p, h1, h2, h3, h4, ul, li {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        /* Styles responsive pour mobile */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                min-width: 100% !important;
            }
            .mobile-padding {
                padding: 20px 15px !important;
            }
            .mobile-font-large {
                font-size: 24px !important;
            }
            .mobile-font-medium {
                font-size: 18px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 10px;">
        <tr>
            <td align="center">
                <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header bleu professionnel -->
                    <tr>
                        <td class="mobile-padding" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
                            <h1 class="mobile-font-large" style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">
                                Rappel de rendez-vous
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 16px; line-height: 1.4; font-weight: 500;">Test Psychotechnique du Permis de Conduire</p>
                        </td>
                    </tr>
                    
                    <!-- Contenu principal -->
                    <tr>
                        <td class="mobile-padding" style="padding: 40px 30px;">
                            <h2 class="mobile-font-medium" style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600; line-height: 1.3;">
                                Bonjour {{first_name}} {{last_name}},
                            </h2>
                            
                            <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Nous vous rappelons que vous avez un rendez-vous prévu prochainement pour votre test psychotechnique.
                            </p>
                            
                            <!-- Section Informations -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; border: 2px solid #3b82f6; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h2 style="margin: 0 0 25px 0; color: #1e40af; font-size: 22px; font-weight: 700; text-align: center;">
                                            Détails de votre rendez-vous
                                        </h2>
                                        
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                            <tr>
                                                <td style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0; width: 40%;">Date</td>
                                                <td style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">{{appointment_date}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Heure</td>
                                                <td style="color: #1f2937; font-size: 16px; font-weight: 700; padding: 8px 0; text-align: right;">{{appointment_time}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Centre</td>
                                                <td style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">{{location}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #e5e7eb;">
                                                <td style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Adresse</td>
                                                <td style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right; line-height: 1.4;">{{address}}</td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Rappels importants -->
                                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-top: 20px;">
                                            <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 700;">
                                                À ne pas oublier
                                            </h3>
                                            <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.8;">
                                                <li>Arrivez <strong>15 minutes avant</strong> l'heure de votre rendez-vous</li>
                                                <li><strong>Pièce d'identité valide</strong> obligatoire</li>
                                                <li>Lunettes ou lentilles si vous en portez habituellement</li>
                                                <li><strong>Paiement en espèces</strong></li>
                                            </ul>
                                        </div>
                                        
                                        <!-- Contact -->
                                        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #3b82f6;">
                                            <table width="100%">
                                                <tr>
                                                    <td style="color: #374151; font-weight: 600; font-size: 14px; padding: 8px 0;">Téléphone</td>
                                                    <td style="padding: 8px 0; text-align: right;">
                                                        <a href="tel:{{contact_phone}}" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px;">{{contact_phone}}</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center; line-height: 1.6;">
                                Si vous avez un empêchement, merci de nous prévenir au plus vite afin de libérer le créneau pour d'autres personnes.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 15px;">
                                À très bientôt.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 14px;">
                                <strong>Test Psychotechnique Permis</strong><br>
                                Centre Agréé 
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
RAPPEL DE RENDEZ-VOUS
Test Psychotechnique du Permis de Conduire

Bonjour {{first_name}} {{last_name}},

Nous vous rappelons que vous avez un rendez-vous prévu prochainement pour votre test psychotechnique.

DÉTAILS DE VOTRE RENDEZ-VOUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date : {{appointment_date}}
Heure : {{appointment_time}}
Centre : {{location}}
Adresse : {{address}}

À NE PAS OUBLIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Arrivez 15 minutes avant l'heure de votre rendez-vous
• Pièce d'identité valide obligatoire
• Lunettes ou lentilles si vous en portez habituellement
• Paiement en espèces

Contact : {{contact_phone}}

Si vous avez un empêchement, merci de nous prévenir au plus vite afin de libérer le créneau pour d'autres personnes.

À très bientôt.
L'équipe Test Psychotechnique Permis
Centre Agréé 
`
    },

    {
        template_name: 'appointment_cancellation_client',
        subject: 'Annulation de votre rendez-vous - Test Psychotechnique au centre {{location}}',
        html_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Annulation de rendez-vous</title>
    <style type="text/css">
        /* Police professionnelle */
        body, table, td, p, h1, h2, h3, h4, ul, li {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        /* Styles responsive pour mobile */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                min-width: 100% !important;
            }
            .mobile-padding {
                padding: 20px 15px !important;
            }
            .mobile-font-large {
                font-size: 24px !important;
            }
            .mobile-font-medium {
                font-size: 18px !important;
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 10px;">
        <tr>
            <td align="center">
                <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header rouge -->
                    <tr>
                        <td class="mobile-padding" style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px 30px; text-align: center;">
                            <h1 class="mobile-font-large" style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">
                                Annulation de rendez-vous
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #fecaca; font-size: 16px; line-height: 1.4; font-weight: 500;">Test Psychotechnique du Permis de Conduire</p>
                        </td>
                    </tr>
                    
                    <!-- Contenu principal -->
                    <tr>
                        <td class="mobile-padding" style="padding: 40px 30px;">
                            <h2 class="mobile-font-medium" style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600; line-height: 1.3;">
                                Bonjour {{first_name}} {{last_name}},
                            </h2>
                            
                            <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Votre rendez-vous pour le test psychotechnique a bien été annulé.
                            </p>
                            
                            <!-- Section Informations -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 12px; border: 2px solid #ef4444; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h2 style="margin: 0 0 25px 0; color: #dc2626; font-size: 22px; font-weight: 700; text-align: center;">
                                            Rendez-vous annulé
                                        </h2>
                                        
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                            <tr>
                                                <td style="color: #7f1d1d; font-weight: 600; font-size: 14px; padding: 8px 0; width: 40%;">📅 Date</td>
                                                <td style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">{{appointment_date}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #fca5a5;">
                                                <td style="color: #7f1d1d; font-weight: 600; font-size: 14px; padding: 8px 0;">🕐 Heure</td>
                                                <td style="color: #1f2937; font-size: 16px; font-weight: 700; padding: 8px 0; text-align: right;">{{appointment_time}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #fca5a5;">
                                                <td style="color: #7f1d1d; font-weight: 600; font-size: 14px; padding: 8px 0;">📍 Centre</td>
                                                <td style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right;">{{location}}</td>
                                            </tr>
                                            <tr style="border-top: 1px solid #fca5a5;">
                                                <td style="color: #7f1d1d; font-weight: 600; font-size: 14px; padding: 8px 0;">📫 Adresse</td>
                                                <td style="color: #1f2937; font-size: 14px; padding: 8px 0; text-align: right; line-height: 1.4;">{{address}}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Reprendre rendez-vous -->
                            <div style="background-color: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
                                <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 18px; font-weight: 700;">
                                    📅 Besoin de reprendre rendez-vous ?
                                </h3>
                                <p style="margin: 0 0 15px 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                                    Réservez un nouveau créneau en ligne ou contactez-nous par téléphone.
                                </p>
                            </div>
                            
                            <!-- Bouton et contact -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                <tr>
                                    <td align="center" style="padding: 10px 0;">
                                        <a href="{{website}}/prendre-rendez-vous" class="mobile-button" style="display: inline-block; padding: 14px 32px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
                                            Reprendre rendez-vous
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-top: 20px; text-align: center;">
                                <p style="margin: 0 0 10px 0; color: #374151; font-size: 14px; font-weight: 600;">📞 Besoin d'aide ?</p>
                                <p style="margin: 0;">
                                    <a href="tel:{{contact_phone}}" style="color: #2563eb; text-decoration: none; font-weight: 700; font-size: 16px;">{{contact_phone}}</a>
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 15px;">
                                Nous restons à votre disposition.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 14px;">
                                <strong>Test Psychotechnique Permis</strong><br>
                                Clichy & Colombes - Hauts-de-Seine
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
ANNULATION DE RENDEZ-VOUS
Test Psychotechnique du Permis de Conduire

Bonjour {{first_name}} {{last_name}},

Votre rendez-vous pour le test psychotechnique a bien été annulé.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RENDEZ-VOUS ANNULÉ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Date : {{appointment_date}}
🕐 Heure : {{appointment_time}}
📍 Centre : {{location}}
📫 Adresse : {{address}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPRENDRE RENDEZ-VOUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Réservez un nouveau créneau en ligne ou contactez-nous par téléphone.

🌐 Site web : {{website}}/prendre-rendez-vous
📞 Téléphone : {{contact_phone}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nous restons à votre disposition.

L'équipe Test Psychotechnique Permis
Clichy & Colombes - Hauts-de-Seine
`
  },

  {
    template_name: 'appointment_confirmation_reminder',
    subject: 'Rappel : Confirmez votre rendez-vous - Test Psychotechnique',
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
        <h1 style="color: white; margin: 0; font-size: 24px;">N'oubliez pas de confirmer</h1>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #d97706; margin-top: 0;">Bonjour {{first_name}} {{last_name}},</h2>
        
        <p>Nous avons remarqué que vous n'avez pas encore confirmé votre rendez-vous réservé il y a quelques heures.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #d97706;">Votre rendez-vous</h3>
            <p><strong>Date :</strong> {{appointment_date}}</p>
            <p><strong>Heure :</strong> {{appointment_time}}</p>
            <p><strong>Lieu :</strong> {{location}}</p>
            <p>{{address}}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #92400e;">Action requise</h4>
            <p>Pour garantir votre place, merci de confirmer ou annuler votre rendez-vous en cliquant sur l'un des boutons ci-dessous.</p>
            <p><strong>Si vous ne confirmez pas, votre créneau pourrait être libéré pour d'autres personnes.</strong></p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{website}}/api/appointments/confirm?id={{appointment_id}}&token={{confirmation_token}}" style="display: inline-block; padding: 14px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 0 10px;">
                Confirmer ma présence
            </a>
            <a href="{{website}}/api/appointments/cancel?id={{appointment_id}}&token={{confirmation_token}}" style="display: inline-block; padding: 14px 32px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 0 10px;">
                Annuler
            </a>
        </div>
        
        <p style="text-align: center;">
            <strong>Contact :</strong> {{contact_phone}}
        </p>
        
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
            Merci de votre attention.<br>
            L'équipe Test Psychotechnique Permis
        </p>
    </div>
</body>
</html>`,
    text_content: `
RAPPEL DE CONFIRMATION

Bonjour {{first_name}} {{last_name}},

Nous avons remarqué que vous n'avez pas encore confirmé votre rendez-vous réservé il y a quelques heures.

VOTRE RENDEZ-VOUS
Date : {{appointment_date}}
Heure : {{appointment_time}}
Lieu : {{location}}
{{address}}

ACTION REQUISE
Pour garantir votre place, merci de confirmer ou annuler votre rendez-vous.
Si vous ne confirmez pas, votre créneau pourrait être libéré pour d'autres personnes.

Confirmer : {{website}}/api/appointments/confirm?id={{appointment_id}}&token={{confirmation_token}}
Annuler : {{website}}/api/appointments/cancel?id={{appointment_id}}&token={{confirmation_token}}

Contact : {{contact_phone}}

Merci de votre attention.
L'équipe Test Psychotechnique Permis
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
