-- ==========================================
-- DIAGNOSTIC COMPLET DES NOTIFICATIONS
-- ==========================================

-- 1. Vérifier que la table notifications existe
SELECT 'Table notifications existe' AS check_name, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') 
            THEN '✅ OUI' ELSE '❌ NON' END AS result;

-- 2. Vérifier que la table admins a des données
SELECT 'Nombre d''admins' AS check_name, 
       COUNT(*)::text || ' admin(s)' AS result 
FROM admins;

-- 3. Afficher les admins
SELECT 'Liste des admins:' AS info;
SELECT id, email, full_name FROM admins;

-- 4. Vérifier que le trigger existe
SELECT 'Trigger existe' AS check_name,
       CASE WHEN EXISTS (
           SELECT 1 FROM pg_trigger 
           WHERE tgname = 'trigger_notify_admins_appointment'
       ) THEN '✅ OUI' ELSE '❌ NON' END AS result;

-- 5. Vérifier que la fonction existe
SELECT 'Fonction existe' AS check_name,
       CASE WHEN EXISTS (
           SELECT 1 FROM pg_proc 
           WHERE proname = 'notify_admins_new_appointment'
       ) THEN '✅ OUI' ELSE '❌ NON' END AS result;

-- 6. Compter les notifications existantes
SELECT 'Nombre de notifications' AS check_name,
       COUNT(*)::text || ' notification(s)' AS result
FROM notifications;

-- 7. Afficher les dernières notifications
SELECT 'Dernières notifications:' AS info;
SELECT id, type, title, message, is_read, created_at 
FROM notifications 
ORDER BY created_at DESC 
LIMIT 5;

-- ==========================================
-- TEST MANUEL : Créer un RDV et vérifier
-- ==========================================

DO $$
DECLARE
    test_apt_id UUID;
    notification_count INT;
    admin_count INT;
BEGIN
    -- Compter les admins
    SELECT COUNT(*) INTO admin_count FROM admins;
    
    IF admin_count = 0 THEN
        RAISE NOTICE '❌ PROBLÈME: Aucun admin dans la table admins!';
        RAISE NOTICE 'Solution: Créer un compte admin d''abord';
    ELSE
        RAISE NOTICE '✅ OK: % admin(s) trouvé(s)', admin_count;
    END IF;
    
    -- Créer un rendez-vous de test
    RAISE NOTICE '📝 Création d''un rendez-vous de test...';
    
    INSERT INTO appointments (
        first_name, last_name, email, phone,
        appointment_date, appointment_time, reason, status
    ) VALUES (
        'Test', 'Diagnostic', 'test@diagnostic.com', '0600000000',
        CURRENT_DATE + INTERVAL '7 days', '14:00',
        'Test automatique', 'confirmed'
    ) RETURNING id INTO test_apt_id;
    
    RAISE NOTICE '✅ Rendez-vous créé: %', test_apt_id;
    
    -- Attendre un instant
    PERFORM pg_sleep(0.5);
    
    -- Compter les notifications créées
    SELECT COUNT(*) INTO notification_count 
    FROM notifications 
    WHERE message LIKE '%Test Diagnostic%'
    AND created_at > NOW() - INTERVAL '10 seconds';
    
    IF notification_count > 0 THEN
        RAISE NOTICE '✅ SUCCESS: % notification(s) créée(s) automatiquement!', notification_count;
    ELSE
        RAISE NOTICE '❌ ERREUR: Aucune notification créée par le trigger';
        RAISE NOTICE 'Le trigger existe mais ne fonctionne pas correctement';
    END IF;
    
    -- Nettoyer
    DELETE FROM appointments WHERE id = test_apt_id;
    DELETE FROM notifications WHERE message LIKE '%Test Diagnostic%';
    
    RAISE NOTICE '🧹 Nettoyage effectué';
    
END $$;
