// Default email templates for the system
export const defaultEmailTemplates = [
  {
    template_name: 'appointment_confirmation_client',
    subject: 'Confirmation de votre rendez-vous - {{first_name}} {{last_name}}',
    html_content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <!-- En-tête -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Rendez-vous Confirmé</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Centre Psychotechnique Permis Expert</p>
          </div>

          <!-- Contenu principal -->
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2563eb; margin-top: 0; font-size: 20px;">Bonjour {{first_name}} {{last_name}},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Votre rendez-vous pour le test psychotechnique a été confirmé avec succès. Voici tous les détails :
            </p>

            <!-- Informations client -->
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3 style="margin-top: 0; color: #2563eb; font-size: 18px;">👤 Vos informations</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 30%;">Nom complet :</td>
                  <td style="padding: 8px 0; color: #374151;">{{first_name}} {{last_name}}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email :</td>
                  <td style="padding: 8px 0; color: #374151;">{{email}}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Téléphone :</td>
                  <td style="padding: 8px 0; color: #374151;">{{phone}}</td>
                </tr>
              </table>
            </div>

            <!-- Détails du rendez-vous -->
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="margin-top: 0; color: #10b981; font-size: 18px;">📅 Détails du rendez-vous</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 30%;">Date :</td>
                  <td style="padding: 8px 0; color: #374151; font-size: 16px;">{{appointment_date}}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Heure :</td>
                  <td style="padding: 8px 0; color: #374151; font-size: 16px;">{{appointment_time}}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Durée :</td>
                  <td style="padding: 8px 0; color: #374151;">2 heures</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Type de test :</td>
                  <td style="padding: 8px 0; color: #374151;">Test psychotechnique</td>
                </tr>
              </table>
            </div>

            <!-- Lieu du rendez-vous -->
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="margin-top: 0; color: #d97706; font-size: 18px;">📍 Lieu du rendez-vous</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 30%;">Centre :</td>
                  <td style="padding: 8px 0; color: #374151;">{{location}}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Adresse :</td>
                  <td style="padding: 8px 0; color: #374151;">{{address}}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Accès :</td>
                  <td style="padding: 8px 0; color: #374151;">{{location_details}}</td>
                </tr>
              </table>
            </div>

            <!-- Instructions importantes -->
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <h3 style="margin-top: 0; color: #dc2626; font-size: 18px;">⚠️ Instructions importantes</h3>
              <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.6;">
                <li style="margin-bottom: 8px;">Arrivez <strong>15 minutes avant</strong> votre rendez-vous</li>
                <li style="margin-bottom: 8px;">Munissez-vous d'une <strong>pièce d'identité valide</strong></li>
                <li style="margin-bottom: 8px;">Apportez vos <strong>lunettes</strong> si vous en portez</li>
                <li style="margin-bottom: 8px;">Paiement sur place : <strong>aucun acompte requis</strong></li>
              </ul>
            </div>

            <!-- Contact -->
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #2563eb; font-size: 18px;">📞 Une question ?</h3>
              <p style="margin: 10px 0; font-size: 18px; font-weight: bold; color: #2563eb;">{{contact_phone}}</p>
              <p style="margin: 10px 0;">
                <a href="{{website}}" style="color: #2563eb; text-decoration: none; font-weight: bold;">🌐 Visitez notre site web</a>
              </p>
            </div>

            <!-- Signature -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <p style="font-size: 16px; color: #2563eb; font-weight: bold; margin: 0;">Merci de votre confiance !</p>
              <p style="font-size: 14px; color: #6b7280; margin: 5px 0 0 0;">L'équipe Permis Expert</p>
            </div>
          </div>
        </div>
      `,
    text_content: `
Bonjour {{first_name}} {{last_name}},

Votre rendez-vous a été confirmé avec succès.

Date : {{appointment_date}}
Heure : {{appointment_time}}
Lieu : {{location}}
Adresse : {{address}}
Durée : 2 heures
Contact : {{phone}}

Merci de votre confiance !
L'équipe Permis Expert
`
  },
  
  {
    template_name: 'appointment_notification_admin',
    subject: 'Nouveau rendez-vous - {{first_name}} {{last_name}} - {{appointment_date}}',
    html_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🔔 Nouveau Rendez-vous</h1>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #d97706; margin-top: 0;">Détails du client</h2>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Nom :</strong> {{first_name}} {{last_name}}</p>
            <p><strong>Email :</strong> {{email}}</p>
            <p><strong>Téléphone :</strong> {{phone}}</p>
            <p><strong>Motif :</strong> {{reason}}</p>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #d97706; margin: 15px 0;">
            <h3 style="margin-top: 0; color: #d97706;">📅 Rendez-vous</h3>
            <p><strong>Date :</strong> {{appointment_date}}</p>
            <p><strong>Heure :</strong> {{appointment_time}}</p>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
            <a href="{{dashboard_url}}" style="background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Voir le tableau de bord
            </a>
        </div>
    </div>
</body>
</html>`,
    text_content: `
NOUVEAU RENDEZ-VOUS

Client : {{first_name}} {{last_name}}
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
