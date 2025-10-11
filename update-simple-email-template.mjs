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
    <title>Confirmation de rendez-vous</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 26px;">✅ Rendez-vous Confirmé</h1>
                <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 15px;">Test Psychotechnique du Permis de Conduire</p>
            </td>
        </tr>
        
        <!-- Contenu -->
        <tr>
            <td style="padding: 30px;">
                <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px;">Bonjour {{first_name}} {{last_name}},</h2>
                <p style="margin: 0 0 25px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">Votre rendez-vous est <strong style="color: #059669;">confirmé</strong>. Voici toutes les informations importantes :</p>
                
                <!-- Bloc Date et Heure -->
                <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #dbeafe; border-radius: 8px; margin-bottom: 20px;">
                    <tr>
                        <td>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <strong style="color: #1e40af; font-size: 14px;">📅 Date :</strong>
                                        <span style="color: #1f2937; font-size: 16px; font-weight: bold; display: block; margin-top: 5px;">{{appointment_date}}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-top: 1px solid #bfdbfe;">
                                        <strong style="color: #1e40af; font-size: 14px;">⏰ Heure :</strong>
                                        <span style="color: #1f2937; font-size: 18px; font-weight: bold; display: block; margin-top: 5px;">{{appointment_time}}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-top: 1px solid #bfdbfe;">
                                        <strong style="color: #1e40af; font-size: 14px;">💰 Tarif :</strong>
                                        <span style="color: #059669; font-size: 18px; font-weight: bold; display: block; margin-top: 5px;">90€ (paiement en espèces)</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <!-- Bloc Adresse -->
                <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #fef3c7; border-radius: 8px; margin-bottom: 20px;">
                    <tr>
                        <td>
                            <strong style="color: #92400e; font-size: 16px; display: block; margin-bottom: 10px;">📍 Adresse du centre</strong>
                            <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.6;">
                                <strong>{{location}}</strong><br>
                                {{address}}<br>
                                🚇 Métro Ligne 13 - Mairie de Clichy
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Bloc Accès -->
                <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #d1fae5; border-radius: 8px; margin-bottom: 20px;">
                    <tr>
                        <td>
                            <strong style="color: #065f46; font-size: 16px; display: block; margin-bottom: 10px;">🔑 Accès au cabinet</strong>
                            <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.8;">
                                <strong>Code d'entrée :</strong> <span style="background-color: #fff; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #065f46;">6138A</span><br>
                                <strong>Sonner à :</strong> Cabinet<br>
                                <strong>Localisation :</strong> Rez-de-chaussée, droit
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Bloc À prévoir -->
                <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #fee2e2; border-radius: 8px; margin-bottom: 25px;">
                    <tr>
                        <td>
                            <strong style="color: #991b1b; font-size: 16px; display: block; margin-bottom: 10px;">⚠️ À prévoir</strong>
                            <ul style="margin: 0; padding-left: 20px; color: #1f2937; font-size: 14px; line-height: 1.8;">
                                <li><strong>Arrivez 10 minutes avant</strong> l'heure du rendez-vous</li>
                                <li><strong>Pièce d'identité valide</strong> obligatoire</li>
                                <li>Lunettes ou lentilles si nécessaire</li>
                                <li><strong>Paiement en espèces uniquement</strong></li>
                                <li>Durée du test : 40 minutes</li>
                            </ul>
                        </td>
                    </tr>
                </table>
                
                <!-- Contact -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                    <tr>
                        <td style="text-align: center; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
                            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Besoin d'aide ?</p>
                            <p style="margin: 0;">
                                <a href="tel:{{contact_phone}}" style="color: #2563eb; text-decoration: none; font-weight: bold; font-size: 16px;">📞 {{contact_phone}}</a>
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Bouton Annulation -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="text-align: center; padding: 20px 0;">
                            <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">Besoin d'annuler ?</p>
                            <a href="{{website}}/api/appointments/cancel?id={{appointment_id}}&token={{confirmation_token}}" style="display: inline-block; padding: 12px 30px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">❌ Annuler mon rendez-vous</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 13px;">Merci de votre confiance ! 🙏</p>
                <p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 12px;"><strong>Centre Psychotechnique Permis Expert</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>`;

const textContent = `✅ RENDEZ-VOUS CONFIRMÉ
Test Psychotechnique du Permis de Conduire

Bonjour {{first_name}} {{last_name}},

Votre rendez-vous est CONFIRMÉ.

📅 DATE : {{appointment_date}}
⏰ HEURE : {{appointment_time}}
💰 TARIF : 90€ (paiement en espèces)

📍 ADRESSE
{{location}}
{{address}}
🚇 Métro Ligne 13 - Mairie de Clichy

🔑 ACCÈS AU CABINET
Code d'entrée : 6138A
Sonner à : Cabinet
Localisation : Rez-de-chaussée, droit

⚠️ À PRÉVOIR
• Arrivez 10 minutes avant l'heure
• Pièce d'identité valide obligatoire
• Lunettes ou lentilles si nécessaire
• Paiement en espèces uniquement
• Durée : 40 minutes

📞 CONTACT
Téléphone : {{contact_phone}}
Site web : {{website}}

BESOIN D'ANNULER ?
{{website}}/api/appointments/cancel?id={{appointment_id}}&token={{confirmation_token}}

Merci de votre confiance ! 🙏
Centre Psychotechnique Permis Expert`;

async function updateTemplate() {
  console.log('📧 Mise à jour du template email simplifié...');
  
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
  }
  
  console.log('✅ Template mis à jour avec succès !');
  console.log('✅ Email optimisé pour affichage complet et immédiat');
  console.log('✅ Toutes les informations visibles sans scroll');
}

updateTemplate();
