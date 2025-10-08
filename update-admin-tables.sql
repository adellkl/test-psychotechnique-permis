-- Script SQL pour METTRE À JOUR les tables existantes
-- Utilisez ce script si la table admin_logs existe déjà

-- ============================================
-- OPTION 1: Supprimer et recréer (ATTENTION: perte de données)
-- ============================================

-- Décommenter ces lignes si vous voulez tout supprimer et recréer
-- DROP TABLE IF EXISTS admin_logs CASCADE;
-- (notifications) supprimé du schéma

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

-- Toutes les structures liées à `notifications` ont été supprimées

-- ============================================
-- Activer RLS
-- ============================================

ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
-- (notifications) RLS supprimé

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Admins can view their own logs" ON admin_logs;
DROP POLICY IF EXISTS "Allow insert logs from application" ON admin_logs;
-- (notifications) politiques supprimées

-- Recréer les politiques
CREATE POLICY "Admins can view their own logs"
    ON admin_logs FOR SELECT
    USING (admin_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Allow insert logs from application"
    ON admin_logs FOR INSERT
    WITH CHECK (true);

-- (notifications) politiques non recréées
