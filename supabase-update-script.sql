-- Script de mise à jour pour Supabase - Permis Expert
-- Exécutez ce script dans l'éditeur SQL de Supabase pour mettre à jour votre base de données

-- 1. Mise à jour du template email de confirmation client avec le nouveau design
UPDATE email_templates 
SET 
    html_content = '<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <!-- Header with gradient -->
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center; margin-bottom: 0;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">✅ Confirmation de rendez-vous</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Test Psychotechnique du Permis de Conduire</p>
        </div>
        
        <!-- Main content -->
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
            <p style="font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{first_name}} {{last_name}}</strong>,</p>
            
            <p style="margin-bottom: 25px;">Nous confirmons votre rendez-vous pour un test psychotechnique :</p>
            
            <!-- Appointment details table -->
            <table style="width: 100%; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0; margin: 25px 0; border-collapse: collapse; overflow: hidden;">
                <tr style="background-color: #3b82f6; color: white;">
                    <td colspan="2" style="padding: 15px; font-weight: bold; text-align: center;">📅 Détails du rendez-vous</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; font-weight: bold; background-color: #f1f5f9;">Date :</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0;">{{appointment_date}}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; font-weight: bold; background-color: #f1f5f9;">Heure :</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0;">{{appointment_time}}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; font-weight: bold; background-color: #f1f5f9;">Durée :</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0;">{{duration}} minutes</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; font-weight: bold; background-color: #f1f5f9;">Type :</td>
                    <td style="padding: 12px 15px;">{{test_type}}</td>
                </tr>
            </table>
            
            <!-- Location details -->
            <table style="width: 100%; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0; margin: 25px 0; border-collapse: collapse; overflow: hidden;">
                <tr style="background-color: #10b981; color: white;">
                    <td colspan="2" style="padding: 15px; font-weight: bold; text-align: center;">📍 Lieu du rendez-vous</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; font-weight: bold; background-color: #f1f5f9;">Centre :</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0;">{{location}}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; font-weight: bold; background-color: #f1f5f9;">Adresse :</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0;">{{address}}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; font-weight: bold; background-color: #f1f5f9;">Accès :</td>
                    <td style="padding: 12px 15px;">{{location_details}}</td>
                </tr>
            </table>
            
            <!-- Important instructions -->
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin-top: 0; color: #92400e; display: flex; align-items: center;">⚠️ Informations importantes</h3>
                <ul style="margin: 15px 0; padding-left: 20px; color: #92400e;">
                    <li style="margin-bottom: 8px;">Merci d''arriver <strong>15 minutes avant</strong> l''heure de votre rendez-vous</li>
                    <li style="margin-bottom: 8px;">N''oubliez pas d''apporter une <strong>pièce d''identité valide</strong></li>
                    <li style="margin-bottom: 8px;">Le test dure environ <strong>{{duration}} minutes</strong></li>
                    <li style="margin-bottom: 8px;">Apportez vos <strong>lunettes ou lentilles</strong> si vous en portez</li>
                    <li>Le règlement se fait sur place par <strong>chèque ou espèces</strong></li>
                </ul>
            </div>
            
            <p style="margin: 25px 0 15px 0;">Si vous avez des questions ou si vous devez modifier votre rendez-vous, n''hésitez pas à nous contacter.</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #1f2937; color: white; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Centre Psychotechnique Permis Expert</p>
            <p style="margin: 0; opacity: 0.8;">📞 {{phone}} | 🌐 {{website}}</p>
        </div>
    </div>
</body>
</html>',
    text_content = 'Bonjour {{first_name}} {{last_name}},

Nous confirmons votre rendez-vous pour un test psychotechnique :

DÉTAILS DU RENDEZ-VOUS
======================
Date : {{appointment_date}}
Heure : {{appointment_time}}
Durée : {{duration}} minutes
Type : {{test_type}}

LIEU DU RENDEZ-VOUS
===================
Centre : {{location}}
Adresse : {{address}}
Accès : {{location_details}}

INFORMATIONS IMPORTANTES
========================
- Merci d''arriver 15 minutes avant l''heure de votre rendez-vous
- N''oubliez pas d''apporter une pièce d''identité valide
- Le test dure environ {{duration}} minutes
- Apportez vos lunettes ou lentilles si vous en portez
- Le règlement se fait sur place par chèque ou espèces

Si vous avez des questions ou si vous devez modifier votre rendez-vous, n''hésitez pas à nous contacter.

Cordialement,
L''équipe du Centre Psychotechnique Permis Expert
Téléphone : {{phone}}
Site web : {{website}}',
    updated_at = NOW()
WHERE template_name = 'appointment_confirmation_client';

-- 2. Ajouter les nouveaux index pour optimiser les performances (surtout pour le cleanup)
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status_date ON appointments(status, appointment_date);
CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(template_name);

-- 3. Vérifier que toutes les colonnes nécessaires existent
-- (Ces colonnes devraient déjà exister, mais on s'assure qu'elles sont présentes)

-- Vérification de la structure de la table appointments
DO $$
BEGIN
    -- Vérifier si la colonne 'status' a les bonnes contraintes
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name LIKE '%appointments_status_check%'
    ) THEN
        ALTER TABLE appointments 
        ADD CONSTRAINT appointments_status_check 
        CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no_show'));
    END IF;
END $$;

-- 4. Mise à jour des templates de rappel et d'annulation (si nécessaire)
INSERT INTO email_templates (template_name, subject, html_content, text_content) VALUES
('appointment_reminder_24h',
 'Rappel : Votre rendez-vous demain - {{first_name}} {{last_name}}',
 '<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Rappel de rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0;">⏰ Rappel de rendez-vous</h1>
        </div>
        
        <p>Bonjour {{first_name}} {{last_name}},</p>
        
        <p>Nous vous rappelons que vous avez un rendez-vous <strong>demain</strong> :</p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p><strong>Date :</strong> {{appointment_date}}</p>
            <p><strong>Heure :</strong> {{appointment_time}}</p>
            <p><strong>Lieu :</strong> {{location}}</p>
        </div>
        
        <p><strong>N''oubliez pas :</strong></p>
        <ul>
            <li>Arriver 15 minutes avant l''heure</li>
            <li>Apporter votre pièce d''identité</li>
            <li>Vos lunettes/lentilles si nécessaire</li>
        </ul>
        
        <p>À bientôt !</p>
    </div>
</body>
</html>',
 'Bonjour {{first_name}} {{last_name}},

Nous vous rappelons que vous avez un rendez-vous DEMAIN :

Date : {{appointment_date}}
Heure : {{appointment_time}}
Lieu : {{location}}

N''oubliez pas :
- Arriver 15 minutes avant l''heure
- Apporter votre pièce d''identité
- Vos lunettes/lentilles si nécessaire

À bientôt !')
ON CONFLICT (template_name) DO UPDATE SET 
    html_content = EXCLUDED.html_content,
    text_content = EXCLUDED.text_content,
    updated_at = NOW();

INSERT INTO email_templates (template_name, subject, html_content, text_content) VALUES
('appointment_cancellation',
 'Annulation de votre rendez-vous - {{first_name}} {{last_name}}',
 '<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Annulation de rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0;">❌ Annulation de rendez-vous</h1>
        </div>
        
        <p>Bonjour {{first_name}} {{last_name}},</p>
        
        <p>Nous vous informons que votre rendez-vous du <strong>{{appointment_date}} à {{appointment_time}}</strong> a été annulé.</p>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p><strong>Motif :</strong> {{cancellation_reason}}</p>
        </div>
        
        <p>Pour reprendre un nouveau rendez-vous, n''hésitez pas à nous contacter ou à utiliser notre système de réservation en ligne.</p>
        
        <p>Nous nous excusons pour la gêne occasionnée.</p>
        
        <p>Cordialement,<br>L''équipe du Centre Psychotechnique Permis Expert</p>
    </div>
</body>
</html>',
 'Bonjour {{first_name}} {{last_name}},

Nous vous informons que votre rendez-vous du {{appointment_date}} à {{appointment_time}} a été annulé.

Motif : {{cancellation_reason}}

Pour reprendre un nouveau rendez-vous, n''hésitez pas à nous contacter ou à utiliser notre système de réservation en ligne.

Nous nous excusons pour la gêne occasionnée.

Cordialement,
L''équipe du Centre Psychotechnique Permis Expert')
ON CONFLICT (template_name) DO UPDATE SET 
    html_content = EXCLUDED.html_content,
    text_content = EXCLUDED.text_content,
    updated_at = NOW();

-- 5. Mise à jour terminée
SELECT 'Base de données mise à jour avec succès !' as message;
