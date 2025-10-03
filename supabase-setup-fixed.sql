-- =============================================
-- SUPABASE SQL SETUP FOR PERMIS EXPERT (FIXED)
-- =============================================

-- =============================================
-- 1. ADMINS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin (password: admin123)
INSERT INTO admins (email, password_hash, full_name) VALUES 
('admin@permis-expert.fr', '$2b$10$rOvHPGkwQkKQk5wvx5DCSO7nBVnb7gp0vQvP8TxMhxJ9oQvP8TxMh', 'Administrateur')
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- 2. APPOINTMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Client Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  
  -- Appointment Details
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 120, -- 2 hours by default
  
  -- Test Information
  test_type VARCHAR(50) DEFAULT 'psychotechnique',
  reason VARCHAR(100), -- 'invalidation', 'suspension', 'annulation'
  is_second_chance BOOLEAN DEFAULT FALSE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'confirmed', -- 'confirmed', 'completed', 'cancelled', 'no_show'
  
  -- Notes
  admin_notes TEXT,
  client_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. AVAILABLE_SLOTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS available_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  max_appointments INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. EMAIL_TEMPLATES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name VARCHAR(100) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB, -- Store template variables
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default email templates
INSERT INTO email_templates (template_name, subject, html_content, text_content, variables) VALUES 
(
  'appointment_confirmation_client',
  'Confirmation de votre rendez-vous - Test Psychotechnique',
  '<h2>Confirmation de rendez-vous</h2>
   <p>Bonjour {{first_name}} {{last_name}},</p>
   <p>Votre rendez-vous pour un test psychotechnique est confirmé :</p>
   <ul>
     <li><strong>Date :</strong> {{appointment_date}}</li>
     <li><strong>Heure :</strong> {{appointment_time}}</li>
     <li><strong>Durée :</strong> 2 heures</li>
     <li><strong>Adresse :</strong> Centre Psychotechnique, Clichy (92)</li>
   </ul>
   <p>Merci de vous présenter 10 minutes avant l''heure du rendez-vous avec une pièce d''identité.</p>
   <p>Cordialement,<br>L''équipe Permis Expert</p>',
  'Confirmation de rendez-vous\n\nBonjour {{first_name}} {{last_name}},\n\nVotre rendez-vous pour un test psychotechnique est confirmé :\n- Date : {{appointment_date}}\n- Heure : {{appointment_time}}\n- Durée : 2 heures\n- Adresse : Centre Psychotechnique, Clichy (92)\n\nMerci de vous présenter 10 minutes avant l''heure du rendez-vous avec une pièce d''identité.\n\nCordialement,\nL''équipe Permis Expert',
  '["first_name", "last_name", "appointment_date", "appointment_time"]'::jsonb
),
(
  'appointment_notification_admin',
  'Nouveau rendez-vous - {{first_name}} {{last_name}}',
  '<h2>Nouveau rendez-vous</h2>
   <p>Un nouveau rendez-vous a été pris :</p>
   <ul>
     <li><strong>Client :</strong> {{first_name}} {{last_name}}</li>
     <li><strong>Email :</strong> {{email}}</li>
     <li><strong>Téléphone :</strong> {{phone}}</li>
     <li><strong>Date :</strong> {{appointment_date}}</li>
     <li><strong>Heure :</strong> {{appointment_time}}</li>
     <li><strong>Motif :</strong> {{reason}}</li>
   </ul>',
  'Nouveau rendez-vous\n\nClient : {{first_name}} {{last_name}}\nEmail : {{email}}\nTéléphone : {{phone}}\nDate : {{appointment_date}}\nHeure : {{appointment_time}}\nMotif : {{reason}}',
  '["first_name", "last_name", "email", "phone", "appointment_date", "appointment_time", "reason"]'::jsonb
)
ON CONFLICT (template_name) DO NOTHING;

-- =============================================
-- 5. INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
CREATE INDEX IF NOT EXISTS idx_available_slots_date ON available_slots(date);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- =============================================
-- 6. FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check slot availability
CREATE OR REPLACE FUNCTION check_slot_availability(
  p_date DATE,
  p_time TIME
) RETURNS BOOLEAN AS $$
DECLARE
  slot_exists BOOLEAN;
  appointment_exists BOOLEAN;
BEGIN
  -- Check if slot exists and is available
  SELECT EXISTS(
    SELECT 1 FROM available_slots 
    WHERE date = p_date 
    AND p_time >= start_time 
    AND p_time < end_time 
    AND is_available = true
  ) INTO slot_exists;
  
  -- Check if appointment already exists at this time
  SELECT EXISTS(
    SELECT 1 FROM appointments 
    WHERE appointment_date = p_date 
    AND appointment_time = p_time 
    AND status != 'cancelled'
  ) INTO appointment_exists;
  
  RETURN slot_exists AND NOT appointment_exists;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 7. SAMPLE DATA FOR TESTING
-- =============================================

-- Add some available slots for the next 30 days (weekdays only)
DO $$
DECLARE
    day_date DATE;
    day_of_week INTEGER;
BEGIN
    FOR i IN 1..30 LOOP
        day_date := CURRENT_DATE + i;
        day_of_week := EXTRACT(DOW FROM day_date);
        
        -- Only add slots for weekdays (Monday=1 to Friday=5)
        IF day_of_week BETWEEN 1 AND 5 THEN
            -- Morning slot 9:00-11:00
            INSERT INTO available_slots (date, start_time, end_time) 
            VALUES (day_date, '09:00'::time, '11:00'::time)
            ON CONFLICT DO NOTHING;
            
            -- Afternoon slot 14:00-16:00
            INSERT INTO available_slots (date, start_time, end_time) 
            VALUES (day_date, '14:00'::time, '16:00'::time)
            ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;
END $$;
