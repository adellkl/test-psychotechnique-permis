-- Script SQL pour créer la table email_templates et ajouter les templates
-- À exécuter dans Supabase SQL Editor

-- Supprimer l'ancienne table si elle existe (avec les mauvaises colonnes)
DROP TABLE IF EXISTS email_templates CASCADE;

-- Créer la table email_templates avec la bonne structure
CREATE TABLE email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name VARCHAR(255) UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter un index sur template_name pour des recherches rapides
CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(template_name);

-- Template 1: Confirmation de rendez-vous pour le client
INSERT INTO email_templates (template_name, subject, html_content, text_content) 
VALUES (
  'appointment_confirmation_client',
  '✅ Confirmation de votre rendez-vous - Test Psychotechnique',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h1 style="color: #2563eb; margin-top: 0;">✅ Rendez-vous confirmé</h1>
    
    <p>Bonjour {{first_name}} {{last_name}},</p>
    
    <p>Votre rendez-vous pour le test psychotechnique a bien été confirmé.</p>

    <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1e40af;">Détails de votre rendez-vous</h3>
      <p style="margin: 5px 0;"><strong>Date :</strong> {{appointment_date}}</p>
      <p style="margin: 5px 0;"><strong>Heure :</strong> {{appointment_time}}</p>
      <p style="margin: 5px 0;"><strong>Lieu :</strong> {{location}}</p>
      <p style="margin: 5px 0;"><strong>Adresse :</strong> {{address}}</p>
      <p style="margin: 5px 0;"><em>{{location_details}}</em></p>
    </div>

    <h3 style="color: #1f2937;">Ce que vous devez apporter :</h3>
    <ul>
      <li>Une pièce d''identité valide</li>
      <li>Votre avis de suspension/invalidation (si applicable)</li>
      <li>Lunettes ou lentilles si vous en portez habituellement</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website}}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Visiter notre site</a>
    </div>

    <p style="color: #6b7280; font-size: 14px;">Si vous avez des questions, contactez-nous au {{contact_phone}}</p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    
    <p style="font-size: 12px; color: #6b7280; text-align: center;">
      Test Psychotechnique Permis<br>
      {{address}}<br>
      Tél : {{contact_phone}}<br>
      <a href="{{website}}" style="color: #2563eb;">{{website}}</a>
    </p>
  </div>
</body>
</html>',
  'Bonjour {{first_name}} {{last_name}},

Votre rendez-vous pour le test psychotechnique a bien été confirmé.

Détails de votre rendez-vous :
- Date : {{appointment_date}}
- Heure : {{appointment_time}}
- Lieu : {{location}}
- Adresse : {{address}}
- {{location_details}}

Ce que vous devez apporter :
- Une pièce d''identité valide
- Votre avis de suspension/invalidation (si applicable)
- Lunettes ou lentilles si vous en portez habituellement

Si vous avez des questions, contactez-nous au {{contact_phone}}

Test Psychotechnique Permis
{{address}}
Tél : {{contact_phone}}
{{website}}'
)
ON CONFLICT (template_name) DO UPDATE SET
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  text_content = EXCLUDED.text_content,
  updated_at = NOW();

-- Template 2 (admin notification) supprimé

-- Template 3: Rappel 24h avant le RDV
INSERT INTO email_templates (template_name, subject, html_content, text_content)
VALUES (
  'appointment_reminder_client',
  '⏰ Rappel : Votre rendez-vous demain à {{appointment_time}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h1 style="color: #f59e0b; margin-top: 0;">⏰ Rappel de rendez-vous</h1>
    
    <p>Bonjour {{first_name}} {{last_name}},</p>
    
    <p>Nous vous rappelons que vous avez un rendez-vous demain pour votre test psychotechnique.</p>

    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #92400e;">Votre rendez-vous</h3>
      <p style="margin: 5px 0;"><strong>Date :</strong> {{appointment_date}}</p>
      <p style="margin: 5px 0;"><strong>Heure :</strong> {{appointment_time}}</p>
      <p style="margin: 5px 0;"><strong>Lieu :</strong> {{location}}</p>
      <p style="margin: 5px 0;"><strong>Adresse :</strong> {{address}}</p>
      <p style="margin: 5px 0;"><em>{{location_details}}</em></p>
    </div>

    <h3 style="color: #1f2937;">N''oubliez pas d''apporter :</h3>
    <ul>
      <li>Une pièce d''identité valide</li>
      <li>Votre avis de suspension/invalidation</li>
      <li>Lunettes ou lentilles si nécessaire</li>
    </ul>

    <p style="color: #6b7280; font-size: 14px;">Pour toute question, contactez-nous au {{contact_phone}}</p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    
    <p style="font-size: 12px; color: #6b7280; text-align: center;">
      Test Psychotechnique Permis<br>
      {{address}}<br>
      Tél : {{contact_phone}}
    </p>
  </div>
</body>
</html>',
  'Bonjour {{first_name}} {{last_name}},

Nous vous rappelons que vous avez un rendez-vous demain pour votre test psychotechnique.

Votre rendez-vous :
- Date : {{appointment_date}}
- Heure : {{appointment_time}}
- Lieu : {{location}}
- Adresse : {{address}}
- {{location_details}}

N''oubliez pas d''apporter :
- Une pièce d''identité valide
- Votre avis de suspension/invalidation
- Lunettes ou lentilles si nécessaire

Pour toute question, contactez-nous au {{contact_phone}}

Test Psychotechnique Permis
{{address}}
Tél : {{contact_phone}}'
)
ON CONFLICT (template_name) DO UPDATE SET
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  text_content = EXCLUDED.text_content,
  updated_at = NOW();

-- Template 4: Annulation de RDV
INSERT INTO email_templates (template_name, subject, html_content, text_content)
VALUES (
  'appointment_cancellation_client',
  '❌ Annulation de votre rendez-vous',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h1 style="color: #dc2626; margin-top: 0;">❌ Rendez-vous annulé</h1>
    
    <p>Bonjour {{first_name}} {{last_name}},</p>
    
    <p>Votre rendez-vous a été annulé.</p>

    <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Date :</strong> {{appointment_date}}</p>
      <p style="margin: 5px 0;"><strong>Heure :</strong> {{appointment_time}}</p>
      <p style="margin: 5px 0;"><strong>Motif :</strong> {{reason}}</p>
    </div>

    <p>Pour reprendre un nouveau rendez-vous, veuillez visiter notre site web ou nous contacter directement.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website}}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Prendre un nouveau RDV</a>
    </div>

    <p style="color: #6b7280; font-size: 14px;">Pour toute question, contactez-nous au {{contact_phone}}</p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    
    <p style="font-size: 12px; color: #6b7280; text-align: center;">
      Test Psychotechnique Permis<br>
      Tél : {{contact_phone}}<br>
      <a href="{{website}}" style="color: #2563eb;">{{website}}</a>
    </p>
  </div>
</body>
</html>',
  'Bonjour {{first_name}} {{last_name}},

Votre rendez-vous a été annulé.

- Date : {{appointment_date}}
- Heure : {{appointment_time}}
- Motif : {{reason}}

Pour reprendre un nouveau rendez-vous, veuillez visiter notre site web ou nous contacter directement.

Pour toute question, contactez-nous au {{contact_phone}}

Test Psychotechnique Permis
Tél : {{contact_phone}}
{{website}}'
)
ON CONFLICT (template_name) DO UPDATE SET
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  text_content = EXCLUDED.text_content,
  updated_at = NOW();

-- Afficher les templates créés
SELECT template_name, subject, created_at FROM email_templates ORDER BY template_name;
