-- ==========================================
-- SETUP COMPLET SUPABASE
-- Crée toutes les tables dans le bon ordre
-- ==========================================

-- ÉTAPE 1 : Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ÉTAPE 2 : TABLES DE BASE
-- ==========================================

-- Table admins (AVEC password_hash)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table admin_logs
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE CASCADE,
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table available_slots
CREATE TABLE IF NOT EXISTS public.available_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    max_appointments INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, start_time)
);

-- Table appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 120,
    test_type VARCHAR(100) DEFAULT 'Test psychotechnique',
    status VARCHAR(50) DEFAULT 'confirmed',
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table email_templates
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    variables TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ÉTAPE 3 : INDEX
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created ON public.appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_admin ON public.notifications(admin_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(admin_id, is_read) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- ÉTAPE 4 : ACTIVER RLS
-- ==========================================

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 5 : POLITIQUES RLS (simples, sans récursion)
-- ==========================================

-- Accès complet pour toutes les tables (sécurité gérée côté Next.js)
CREATE POLICY "admins_full_access" ON public.admins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "admin_logs_full_access" ON public.admin_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "available_slots_full_access" ON public.available_slots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "appointments_full_access" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "email_templates_full_access" ON public.email_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "notifications_full_access" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- ÉTAPE 6 : FONCTIONS
-- ==========================================

-- Fonction update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Triggers update_updated_at
DROP TRIGGER IF EXISTS update_admins_updated_at ON public.admins;
CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON public.admins
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction créer notification
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
        admin_id, type, title, message, data, created_at
    ) VALUES (
        p_admin_id, p_type, p_title, p_message, p_data, NOW()
    )
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$;

-- ÉTAPE 7 : TRIGGERS NOTIFICATIONS
-- ==========================================

-- Trigger nouveau rendez-vous
CREATE OR REPLACE FUNCTION public.notify_new_appointment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin RECORD;
BEGIN
    FOR v_admin IN SELECT id FROM public.admins LOOP
        PERFORM public.create_notification(
            v_admin.id,
            'new_appointment',
            'Nouveau rendez-vous',
            format('Nouveau RDV : %s %s le %s à %s', 
                NEW.first_name, NEW.last_name, 
                NEW.appointment_date::TEXT, NEW.appointment_time::TEXT
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

DROP TRIGGER IF EXISTS trigger_new_appointment ON public.appointments;
CREATE TRIGGER trigger_new_appointment
    AFTER INSERT ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_new_appointment();

-- Trigger changement statut
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
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        v_status_label := CASE NEW.status
            WHEN 'confirmed' THEN 'confirmé'
            WHEN 'completed' THEN 'terminé'
            WHEN 'cancelled' THEN 'annulé'
            WHEN 'no_show' THEN 'absent'
            ELSE NEW.status
        END;
        
        FOR v_admin IN SELECT id FROM public.admins LOOP
            PERFORM public.create_notification(
                v_admin.id,
                'status_change',
                'Statut modifié',
                format('RDV de %s %s : %s', 
                    NEW.first_name, NEW.last_name, v_status_label
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

DROP TRIGGER IF EXISTS trigger_status_change ON public.appointments;
CREATE TRIGGER trigger_status_change
    AFTER UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_status_change();

-- ÉTAPE 8 : CRÉER ADMIN PAR DÉFAUT
-- ==========================================

DELETE FROM public.admins WHERE email = 'f.sebti@outlook.com';

INSERT INTO public.admins (
    email, password_hash, full_name, phone, role, created_at, updated_at
) VALUES (
    'f.sebti@outlook.com',
    '$2a$10$N9qo8uLOickgx2ZoXn/vuKoZHGKp.VhH8NfPJhKLGJhBFQhKqLWwm',
    'Admin Principal',
    '07 65 56 53 79',
    'admin',
    NOW(),
    NOW()
);

-- ÉTAPE 9 : VÉRIFICATIONS
-- ==========================================

SELECT 'Tables créées:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

SELECT 'Admin créé:' as info;
SELECT email, full_name, created_at FROM public.admins;

-- ==========================================
-- ✅ SETUP TERMINÉ
-- 
-- Identifiants admin :
-- Email: f.sebti@outlook.com
-- Password: Admin123!
-- 
-- Tables créées :
-- - admins (avec password_hash)
-- - admin_logs
-- - available_slots
-- - appointments
-- - email_templates
-- - notifications
-- 
-- Notifications automatiques activées pour :
-- - Nouveaux rendez-vous
-- - Changements de statut
-- ==========================================
