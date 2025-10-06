-- ==========================================
-- TEST SIMPLE - Étape par étape
-- ==========================================

-- ÉTAPE 1: Vérifier les admins
SELECT '--- ÉTAPE 1: Admins ---' as etape;
SELECT id, email, full_name FROM admins;

-- ÉTAPE 2: Créer un rendez-vous manuellement
SELECT '--- ÉTAPE 2: Créer RDV ---' as etape;
INSERT INTO appointments (
    first_name, last_name, email, phone,
    appointment_date, appointment_time, reason, status
) VALUES (
    'TestRDV', 'Nouveau', 'test@rdv.com', '0612345678',
    CURRENT_DATE + INTERVAL '7 days', '15:00',
    'Test notification', 'confirmed'
);

-- ÉTAPE 3: Vérifier si notification créée
SELECT '--- ÉTAPE 3: Notifications créées ? ---' as etape;
SELECT id, admin_id, type, title, message, is_read, created_at 
FROM notifications 
WHERE message LIKE '%TestRDV%'
ORDER BY created_at DESC;

-- ÉTAPE 4: Si aucune notification, créer manuellement
SELECT '--- ÉTAPE 4: Créer notification manuellement ---' as etape;
INSERT INTO notifications (admin_id, type, title, message, is_read)
SELECT 
    id as admin_id,
    'appointment',
    'Test manuel',
    'Ceci est un test manuel de notification',
    false
FROM admins
LIMIT 1;

-- ÉTAPE 5: Voir toutes les notifications
SELECT '--- ÉTAPE 5: Toutes les notifications ---' as etape;
SELECT id, admin_id, type, title, message, is_read, created_at 
FROM notifications 
ORDER BY created_at DESC 
LIMIT 10;

-- ÉTAPE 6: Vérifier les politiques RLS
SELECT '--- ÉTAPE 6: RLS activé ? ---' as etape;
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'notifications';
