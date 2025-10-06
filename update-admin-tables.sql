-- Script SQL pour METTRE À JOUR les tables existantes
-- Utilisez ce script si les tables admin_logs et notifications existent déjà

-- ============================================
-- OPTION 1: Supprimer et recréer (ATTENTION: perte de données)
-- ============================================

-- Décommenter ces lignes si vous voulez tout supprimer et recréer
-- DROP TABLE IF EXISTS admin_logs CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;

-- ============================================
-- OPTION 2: Ajouter les colonnes manquantes (RECOMMANDÉ)
-- ============================================

-- Ajouter la colonne metadata à admin_logs si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'admin_logs' AND column_name = 'metadata'
    ) THEN
        ALTER TABLE admin_logs ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
END $$;

-- Ajouter d'autres colonnes manquantes si nécessaire
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'admin_logs' AND column_name = 'ip_address'
    ) THEN
        ALTER TABLE admin_logs ADD COLUMN ip_address INET;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'admin_logs' AND column_name = 'user_agent'
    ) THEN
        ALTER TABLE admin_logs ADD COLUMN user_agent TEXT;
    END IF;
END $$;

-- ============================================
-- Créer les index s'ils n'existent pas
-- ============================================

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_email ON admin_logs(admin_email);

-- ============================================
-- Créer la table notifications si elle n'existe pas
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notifications_admin_id ON notifications(admin_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- ============================================
-- Fonction de notification automatique
-- ============================================

CREATE OR REPLACE FUNCTION notify_admins_new_appointment()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (admin_id, type, title, message, link, metadata)
    SELECT 
        a.id,
        'appointment',
        'Nouveau rendez-vous',
        'Un nouveau rendez-vous a été réservé par ' || NEW.first_name || ' ' || NEW.last_name,
        '/admin/dashboard',
        jsonb_build_object(
            'appointment_id', NEW.id,
            'client_name', NEW.first_name || ' ' || NEW.last_name,
            'appointment_date', NEW.appointment_date,
            'appointment_time', NEW.appointment_time
        )
    FROM admins a;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_admins_appointment ON appointments;
CREATE TRIGGER trigger_notify_admins_appointment
    AFTER INSERT ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION notify_admins_new_appointment();

-- ============================================
-- Activer RLS
-- ============================================

ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Admins can view their own logs" ON admin_logs;
DROP POLICY IF EXISTS "Allow insert logs from application" ON admin_logs;
DROP POLICY IF EXISTS "Admins can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow insert notifications from application" ON notifications;

-- Recréer les politiques
CREATE POLICY "Admins can view their own logs"
    ON admin_logs FOR SELECT
    USING (admin_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Allow insert logs from application"
    ON admin_logs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view their own notifications"
    ON notifications FOR SELECT
    USING (admin_id IN (
        SELECT id FROM admins 
        WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    ));

CREATE POLICY "Admins can update their own notifications"
    ON notifications FOR UPDATE
    USING (admin_id IN (
        SELECT id FROM admins 
        WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    ));

CREATE POLICY "Allow insert notifications from application"
    ON notifications FOR INSERT
    WITH CHECK (true);
