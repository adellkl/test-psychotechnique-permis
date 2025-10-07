// Default email templates for the system
export const defaultEmailTemplates = [
  {
    template_name: 'appointment_confirmation_client',
    subject: 'Confirmation de votre rendez-vous - {{first_name}} {{last_name}}',
    html_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header simple -->
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">✅ Rendez-vous confirmé</h1>
    </div>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #2563eb; margin-top: 0;">Bonjour {{first_name}} {{last_name}},</h2>

        <p>Votre rendez-vous pour le test psychotechnique a été confirmé avec succès.</p>

        <!-- Informations principales -->
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">📅 Détails du rendez-vous</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">📆 Date :</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{appointment_date}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">⏰ Heure :</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">{{appointment_time}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">📍 Lieu :</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{location}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">🏠 Adresse :</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{address}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">💰 Tarif :</td>
                    <td style="padding: 8px 0; color: #059669; font-weight: bold; font-size: 18px;">90€</td>
                </tr>
            </table>
        </div>

        <!-- Informations importantes -->
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #92400e;">⚠️ À noter</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Arrivez 15 minutes avant l'heure</li>
                <li>Munissez-vous d'une pièce d'identité valide</li>
                <li>Apportez vos lunettes si vous en portez</li>
                <li>Paiement sur place uniquement</li>
            </ul>
        </div>

        <!-- Contact -->
        <div style="text-align: center; margin: 30px 0;">
            <p><strong>Contact :</strong> {{contact_phone}}</p>
            <p><a href="{{website}}" style="color: #2563eb; text-decoration: none;">🌐 Visitez notre site web</a></p>
        </div>

        <p style="text-align: center; color: #6b7280; font-size: 14px;">
            Merci de votre confiance !<br>
            L'équipe de test psychotechnique Clichy
        </p>
    </div>
</body>
</html>`,
    text_content: `
Bonjour {{first_name}} {{last_name}},

Votre rendez-vous a été confirmé avec succès.

📅 DÉTAILS DU RENDEZ-VOUS :
Date : {{appointment_date}}
Heure : {{appointment_time}}
Lieu : {{location}}
Adresse : {{address}}
Tarif : 90€

⚠️ À NOTER :
- Arrivez 15 minutes avant l'heure
- Munissez-vous d'une pièce d'identité valide
- Apportez vos lunettes si vous en portez
- Paiement sur place uniquement

Contact : {{contact_phone}}
Site web : {{website}}

Merci de votre confiance !
L'équipe de test psychotechnique Clichy
`
  },
  
  {
    template_name: 'appointment_notification_admin',
    subject: 'Nouvelle réservation - {{first_name}} {{last_name}} - {{appointment_time}}',
    html_content: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Nouvelle réservation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px 20px; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-family: Arial, sans-serif; font-weight: bold;">
                                ✅ Nouvelle réservation
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #dbeafe; border-left: 4px solid #2563eb; border-radius: 4px;">
                                <tr>
                                    <td style="padding: 15px 20px;">
                                        <p style="margin: 0; color: #1e40af; font-size: 14px; font-family: Arial, sans-serif; font-weight: 600;">
                                            🔔 Un nouveau client a réservé un rendez-vous
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 30px 20px;">
                            <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-family: Arial, sans-serif; font-weight: bold; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                👤 Informations client
                            </h2>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td width="130" style="padding: 10px 0; color: #6b7280; font-size: 14px; font-family: Arial, sans-serif; vertical-align: top;">
                                        <strong>Nom complet :</strong>
                                    </td>
                                    <td style="padding: 10px 0; color: #111827; font-size: 14px; font-family: Arial, sans-serif; font-weight: 600;">
                                        {{first_name}} {{last_name}}
                                    </td>
                                </tr>
                                <tr style="background-color: #f9fafb;">
                                    <td style="padding: 10px 0; color: #6b7280; font-size: 14px; font-family: Arial, sans-serif; vertical-align: top;">
                                        <strong>Email :</strong>
                                    </td>
                                    <td style="padding: 10px 0; color: #111827; font-size: 14px; font-family: Arial, sans-serif;">
                                        <a href="mailto:{{email}}" style="color: #2563eb; text-decoration: none;">{{email}}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #6b7280; font-size: 14px; font-family: Arial, sans-serif; vertical-align: top;">
                                        <strong>Téléphone :</strong>
                                    </td>
                                    <td style="padding: 10px 0; color: #111827; font-size: 14px; font-family: Arial, sans-serif;">
                                        <a href="tel:{{phone}}" style="color: #2563eb; text-decoration: none;">{{phone}}</a>
                                    </td>
                                </tr>
                                <tr style="background-color: #f9fafb;">
                                    <td style="padding: 10px 0; color: #6b7280; font-size: 14px; font-family: Arial, sans-serif; vertical-align: top;">
                                        <strong>Motif :</strong>
                                    </td>
                                    <td style="padding: 10px 0; color: #111827; font-size: 14px; font-family: Arial, sans-serif;">
                                        {{reason}}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 30px 30px;">
                            <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-family: Arial, sans-serif; font-weight: bold; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                📅 Détails du rendez-vous
                            </h2>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef3c7; border-radius: 6px; border: 2px solid #fbbf24;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="100" style="padding: 8px 0; color: #92400e; font-size: 14px; font-family: Arial, sans-serif;">
                                                    <strong>📆 Date :</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #78350f; font-size: 15px; font-family: Arial, sans-serif; font-weight: 600;">
                                                    {{appointment_date}}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #92400e; font-size: 14px; font-family: Arial, sans-serif;">
                                                    <strong>⏰ Heure :</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #dc2626; font-size: 20px; font-family: Arial, sans-serif; font-weight: bold;">
                                                    {{appointment_time}}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 30px 40px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="border-radius: 6px; background-color: #2563eb;">
                                        <a href="{{dashboard_url}}" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block;">
                                            📊 Accéder au tableau de bord
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding: 25px 30px; border-top: 2px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0 0 5px 0; color: #111827; font-size: 14px; font-family: Arial, sans-serif; font-weight: bold;">
                                            Test Psychotechnique Permis
                                        </p>
                                        <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 13px; font-family: Arial, sans-serif;">
                                            📍 82 Rue Henri Barbusse, 92110 Clichy
                                        </p>
                                        <p style="margin: 0; color: #6b7280; font-size: 13px; font-family: Arial, sans-serif;">
                                            📞 <a href="tel:0765565379" style="color: #2563eb; text-decoration: none; font-weight: 600;">07 65 56 53 79</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
    text_content: `
NOUVEAU RENDEZ-VOUS

{{ ... }}
Email : {{email}}
Téléphone : {{phone}}
Motif : {{reason}}

Rendez-vous :
Date : {{appointment_date}}
Heure : {{appointment_time}}

Tableau de bord : {{dashboard_url}}
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
  }
]

// Function to initialize email templates in database
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
