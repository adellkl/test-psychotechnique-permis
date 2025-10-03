-- Complete database setup for Permis Expert application
-- This file contains all necessary tables and initial data
-- Updated: 2025-01-03 with cleanup functionality support

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_logs table for activity tracking
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create available_slots table
CREATE TABLE IF NOT EXISTS available_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    max_appointments INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, start_time)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 120,
    test_type VARCHAR(100) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    is_second_chance BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no_show')),
    admin_notes TEXT,
    client_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO admins (email, full_name, role) 
VALUES ('admin@permis-expert.fr', 'Administrateur Principal', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert email templates (updated with latest versions)
INSERT INTO email_templates (template_name, subject, html_content, text_content) VALUES
('appointment_confirmation_client', 
 'Confirmation de votre rendez-vous - Test Psychotechnique',
 '<!DOCTYPE html>
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
 'Bonjour {{first_name}} {{last_name}},

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
Site web : {{website}}')
ON CONFLICT (template_name) DO UPDATE SET 
    html_content = EXCLUDED.html_content,
    text_content = EXCLUDED.text_content,
    updated_at = NOW();

INSERT INTO email_templates (template_name, subject, html_content, text_content) VALUES
('appointment_notification_admin',
 'Nouveau rendez-vous - {{first_name}} {{last_name}}',
 '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouveau rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #dc2626;">Nouveau rendez-vous</h1>
        
        <p>Un nouveau rendez-vous a été pris :</p>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #991b1b;">Détails du client</h3>
            <p><strong>Nom :</strong> {{first_name}} {{last_name}}</p>
            <p><strong>Email :</strong> {{email}}</p>
            <p><strong>Téléphone :</strong> {{phone}}</p>
            <p><strong>Date :</strong> {{appointment_date}}</p>
            <p><strong>Heure :</strong> {{appointment_time}}</p>
            <p><strong>Motif :</strong> {{reason}}</p>
        </div>
        
        <p>Connectez-vous à l''interface d''administration pour plus de détails.</p>
    </div>
</body>
</html>',
 'Nouveau rendez-vous

Un nouveau rendez-vous a été pris :

Nom : {{first_name}} {{last_name}}
Email : {{email}}
Téléphone : {{phone}}
Date : {{appointment_date}}
Heure : {{appointment_time}}
Motif : {{reason}}

Connectez-vous à l''interface d''administration pour plus de détails.')
ON CONFLICT (template_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status_date ON appointments(status, appointment_date);
CREATE INDEX IF NOT EXISTS idx_available_slots_date ON available_slots(date);
CREATE INDEX IF NOT EXISTS idx_available_slots_available ON available_slots(is_available);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(template_name);

-- Add some sample available slots for testing (next 30 days, weekdays only)
DO $$
DECLARE
    slot_date DATE;
    slot_time TIME;
    time_slots TIME[] := ARRAY['09:00', '11:00', '14:00', '16:00'];
    i INTEGER;
BEGIN
    FOR i IN 0..29 LOOP
        slot_date := CURRENT_DATE + i;
        
        -- Skip weekends
        IF EXTRACT(DOW FROM slot_date) NOT IN (0, 6) THEN
            FOREACH slot_time IN ARRAY time_slots LOOP
                INSERT INTO available_slots (date, start_time, end_time, is_available)
                VALUES (slot_date, slot_time, slot_time + INTERVAL '2 hours', true)
                ON CONFLICT (date, start_time) DO NOTHING;
            END LOOP;
        END IF;
    END LOOP;
END $$;
