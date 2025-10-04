-- ==========================================
-- SYSTÈME DE NOTIFICATIONS DYNAMIQUES
-- ==========================================
-- Table pour gérer les notifications en temps réel
-- Suppression définitive possible
-- ==========================================

-- ÉTAPE 1 : CRÉER LA TABLE NOTIFICATIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'new_appointment', 'status_change', 'cancellation', 'reminder', 'system'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Données additionnelles (appointment_id, etc.)
    is_read BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_notifications_admin ON public.notifications(admin_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(admin_id, is_read) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);


-- ÉTAPE 2 : ACTIVER RLS
-- ==========================================

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politique : Admins peuvent tout faire sur leurs notifications
CREATE POLICY "notifications_full_access"
ON public.notifications
FOR ALL
USING (true)
WITH CHECK (true);


-- ÉTAPE 3 : FONCTION POUR CRÉER DES NOTIFICATIONS
-- ==========================================

CREATE OR REPLACE FUNCTION public.create_notification(
    p_admin_id UUID,
    p_type VARCHAR,
    p_title VARCHAR,
    p_message TEXT,
    p_data JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        admin_id,
        type,
        title,
        message,
        data,
        created_at
    ) VALUES (
        p_admin_id,
        p_type,
        p_title,
        p_message,
        p_data,
        NOW()
    )
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$;


-- ÉTAPE 4 : TRIGGER POUR NOUVEAU RENDEZ-VOUS
-- ==========================================

CREATE OR REPLACE FUNCTION public.notify_new_appointment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin RECORD;
BEGIN
    -- Créer notification pour tous les admins
    FOR v_admin IN SELECT id FROM public.admins LOOP
        PERFORM public.create_notification(
            v_admin.id,
            'new_appointment',
            'Nouveau rendez-vous',
            format('Nouveau RDV : %s %s le %s à %s', 
                NEW.first_name, 
                NEW.last_name, 
                NEW.appointment_date::TEXT,
                NEW.appointment_time::TEXT
            ),
            jsonb_build_object(
                'appointment_id', NEW.id,
                'client_name', NEW.first_name || ' ' || NEW.last_name,
                'appointment_date', NEW.appointment_date,
                'appointment_time', NEW.appointment_time
            )
        );
    END LOOP;
    
    RETURN NEW;
END;
$$;

-- Attacher trigger à la table appointments
DROP TRIGGER IF EXISTS trigger_new_appointment ON public.appointments;
CREATE TRIGGER trigger_new_appointment
    AFTER INSERT ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_new_appointment();


-- ÉTAPE 5 : TRIGGER POUR CHANGEMENT DE STATUT
-- ==========================================

CREATE OR REPLACE FUNCTION public.notify_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin RECORD;
    v_status_label TEXT;
BEGIN
    -- Si le statut a changé
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Traduire le statut
        v_status_label := CASE NEW.status
            WHEN 'confirmed' THEN 'confirmé'
            WHEN 'completed' THEN 'terminé'
            WHEN 'cancelled' THEN 'annulé'
            WHEN 'no_show' THEN 'absent'
            ELSE NEW.status
        END;
        
        -- Créer notification pour tous les admins
        FOR v_admin IN SELECT id FROM public.admins LOOP
            PERFORM public.create_notification(
                v_admin.id,
                'status_change',
                'Statut modifié',
                format('RDV de %s %s : %s', 
                    NEW.first_name, 
                    NEW.last_name, 
                    v_status_label
                ),
                jsonb_build_object(
                    'appointment_id', NEW.id,
                    'client_name', NEW.first_name || ' ' || NEW.last_name,
                    'old_status', OLD.status,
                    'new_status', NEW.status
                )
            );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Attacher trigger
DROP TRIGGER IF EXISTS trigger_status_change ON public.appointments;
CREATE TRIGGER trigger_status_change
    AFTER UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_status_change();


-- ÉTAPE 6 : TRIGGER POUR SUPPRESSION RENDEZ-VOUS
-- ==========================================

CREATE OR REPLACE FUNCTION public.notify_appointment_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin RECORD;
BEGIN
    -- Créer notification pour tous les admins
    FOR v_admin IN SELECT id FROM public.admins LOOP
        PERFORM public.create_notification(
            v_admin.id,
            'cancellation',
            'Rendez-vous supprimé',
            format('RDV supprimé : %s %s (%s)', 
                OLD.first_name, 
                OLD.last_name,
                OLD.appointment_date::TEXT
            ),
            jsonb_build_object(
                'client_name', OLD.first_name || ' ' || OLD.last_name,
                'appointment_date', OLD.appointment_date,
                'appointment_time', OLD.appointment_time,
                'status', OLD.status
            )
        );
    END LOOP;
    
    RETURN OLD;
END;
$$;

-- Attacher trigger
DROP TRIGGER IF EXISTS trigger_appointment_deletion ON public.appointments;
CREATE TRIGGER trigger_appointment_deletion
    BEFORE DELETE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_appointment_deletion();


-- ÉTAPE 7 : FONCTIONS UTILITAIRES
-- ==========================================

-- Marquer comme lu
CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE public.notifications
    SET is_read = true,
        read_at = NOW()
    WHERE id = p_notification_id;
END;
$$;

-- Supprimer définitivement
CREATE OR REPLACE FUNCTION public.delete_notification(p_notification_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    DELETE FROM public.notifications
    WHERE id = p_notification_id;
END;
$$;

-- Marquer toutes comme lues
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(p_admin_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE public.notifications
    SET is_read = true,
        read_at = NOW()
    WHERE admin_id = p_admin_id
    AND is_read = false
    AND is_deleted = false;
END;
$$;

-- Supprimer toutes les notifications lues (nettoyage)
CREATE OR REPLACE FUNCTION public.cleanup_old_notifications(p_days INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM public.notifications
    WHERE is_read = true
    AND created_at < NOW() - (p_days || ' days')::INTERVAL;
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$;


-- ÉTAPE 8 : VÉRIFICATIONS
-- ==========================================

-- Vérifier la table
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'notifications'
ORDER BY ordinal_position;

-- Vérifier les triggers
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table = 'appointments'
ORDER BY trigger_name;

-- Compter les notifications
SELECT COUNT(*) as total_notifications FROM public.notifications;

-- ==========================================
-- ✅ SYSTÈME DE NOTIFICATIONS CRÉÉ
-- 
-- UTILISATION :
-- 1. Exécuter ce script dans Supabase SQL Editor
-- 2. Les notifications se créent automatiquement pour :
--    - Nouveaux rendez-vous
--    - Changements de statut
--    - Suppressions de rendez-vous
-- 3. API pour gérer les notifications :
--    - GET : Récupérer notifications non lues
--    - PUT : Marquer comme lu
--    - DELETE : Supprimer définitivement
-- ==========================================
