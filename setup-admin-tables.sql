-- Script SQL pour créer les tables admin_logs et notifications
-- Base de données: Supabase PostgreSQL

-- ============================================
-- TABLE: admin_logs
-- Description: Stocke tous les logs d'activité des administrateurs
-- ============================================

CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    admin_email VARCHAR(255),
    admin_name VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_email ON admin_logs(admin_email);

-- Commentaires sur la table
COMMENT ON TABLE admin_logs IS 'Logs d''activité des administrateurs pour audit et traçabilité';
COMMENT ON COLUMN admin_logs.action IS 'Type d''action: LOGIN, LOGOUT, VIEW_DASHBOARD, UPDATE_APPOINTMENT, etc.';
COMMENT ON COLUMN admin_logs.metadata IS 'Données JSON supplémentaires sur l''action';

-- ============================================
-- TABLE: notifications
-- Description: Stocke les notifications pour les administrateurs
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

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_notifications_admin_id ON notifications(admin_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Commentaires sur la table
COMMENT ON TABLE notifications IS 'Notifications pour les administrateurs';
COMMENT ON COLUMN notifications.type IS 'Type: info, success, warning, error, appointment';
COMMENT ON COLUMN notifications.is_read IS 'Indique si la notification a été lue';
COMMENT ON COLUMN notifications.link IS 'Lien optionnel vers une ressource (ex: /admin/dashboard)';

-- ============================================
-- FONCTION: Créer une notification automatique pour nouveau RDV
-- ============================================

CREATE OR REPLACE FUNCTION notify_admins_new_appointment()
RETURNS TRIGGER AS $$
BEGIN
    -- Insérer une notification pour chaque admin
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

-- Trigger pour créer automatiquement une notification à chaque nouveau RDV
DROP TRIGGER IF EXISTS trigger_notify_admins_appointment ON appointments;
CREATE TRIGGER trigger_notify_admins_appointment
    AFTER INSERT ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION notify_admins_new_appointment();

-- ============================================
-- FONCTION: Nettoyer les anciennes notifications (> 30 jours)
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
    DELETE FROM notifications 
    WHERE is_read = TRUE 
    AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FONCTION: Nettoyer les anciens logs (> 90 jours)
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM admin_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Politique RLS (Row Level Security) pour Supabase
-- ============================================

-- Activer RLS sur les tables
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politique pour admin_logs: seuls les admins peuvent lire leurs propres logs
CREATE POLICY "Admins can view their own logs"
    ON admin_logs
    FOR SELECT
    USING (admin_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Politique pour admin_logs: permettre l'insertion depuis l'application
CREATE POLICY "Allow insert logs from application"
    ON admin_logs
    FOR INSERT
    WITH CHECK (true);

-- Politique pour notifications: les admins peuvent voir leurs propres notifications
CREATE POLICY "Admins can view their own notifications"
    ON notifications
    FOR SELECT
    USING (admin_id IN (
        SELECT id FROM admins 
        WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    ));

-- Politique pour notifications: les admins peuvent mettre à jour leurs propres notifications
CREATE POLICY "Admins can update their own notifications"
    ON notifications
    FOR UPDATE
    USING (admin_id IN (
        SELECT id FROM admins 
        WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    ));

-- Politique pour notifications: permettre l'insertion depuis l'application
CREATE POLICY "Allow insert notifications from application"
    ON notifications
    FOR INSERT
    WITH CHECK (true);

-- ============================================
-- DONNÉES DE TEST (optionnel)
-- ============================================

-- Insérer quelques logs de test
INSERT INTO admin_logs (admin_email, admin_name, action, description) VALUES
('sebtifatiha@live.fr', 'Admin', 'VIEW_DASHBOARD', 'Consulté le tableau de bord'),
('adelloukal2@gmail.com', 'Admin', 'LOGIN', 'Connexion réussie');

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Pour exécuter ce script dans Supabase:
-- 1. Allez dans votre projet Supabase
-- 2. Cliquez sur "SQL Editor" dans le menu
-- 3. Collez ce script complet
-- 4. Cliquez sur "Run" pour l'exécuter
