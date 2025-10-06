# 🔔 Configuration des Notifications - Guide Complet

## ✅ **Étape 1 : Exécuter le script SQL dans Supabase**

### 1.1 Ouvrir Supabase SQL Editor
1. Allez sur https://supabase.com
2. Sélectionnez votre projet
3. Cliquez sur **"SQL Editor"** dans le menu de gauche

### 1.2 Exécuter le script de mise à jour
1. Ouvrez le fichier **`update-admin-tables.sql`**
2. Copiez **TOUT** le contenu (Cmd+A puis Cmd+C)
3. Collez dans l'éditeur SQL de Supabase
4. Cliquez sur **"RUN"** (ou Cmd+Enter)

✅ **Vous devriez voir : "Success. No rows returned"**

---

## ✅ **Étape 2 : Activer Realtime sur la table notifications**

### 2.1 Dans Supabase
1. Allez dans **"Database"** → **"Replication"**
2. Cherchez la table **"notifications"**
3. Activez le toggle **"Enable Realtime"**
4. Cliquez sur **"Save"**

**OU** exécutez ce SQL :

```sql
-- Activer Realtime sur la table notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

---

## ✅ **Étape 3 : Vérifier que le trigger fonctionne**

### 3.1 Tester le trigger manuellement

Exécutez ce SQL pour simuler une nouvelle réservation :

```sql
-- Insérer un rendez-vous de test
INSERT INTO appointments (
    first_name, 
    last_name, 
    email, 
    phone, 
    appointment_date, 
    appointment_time, 
    reason, 
    status
) VALUES (
    'Test',
    'Notification',
    'test@example.com',
    '06 12 34 56 78',
    CURRENT_DATE + INTERVAL '7 days',
    '10:00',
    'Test psychotechnique',
    'confirmed'
);
```

### 3.2 Vérifier que la notification a été créée

```sql
-- Voir les notifications créées
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;
```

✅ **Vous devriez voir une nouvelle notification avec le titre "Nouveau rendez-vous"**

---

## ✅ **Étape 4 : Vérifier les politiques RLS**

### 4.1 Désactiver temporairement RLS pour tester

```sql
-- TEMPORAIREMENT désactiver RLS pour tester
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
```

⚠️ **IMPORTANT : Réactivez RLS après le test !**

```sql
-- Réactiver RLS après le test
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

### 4.2 Si ça fonctionne sans RLS

Le problème vient des politiques. Ajoutez cette politique plus permissive :

```sql
-- Politique temporaire pour permettre à tous les admins de voir toutes les notifications
DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
CREATE POLICY "Admins can view all notifications"
    ON notifications FOR SELECT
    TO authenticated
    USING (true);
```

---

## ✅ **Étape 5 : Test en temps réel**

### 5.1 Ouvrir le dashboard admin
1. Connectez-vous au dashboard admin : `http://localhost:3000/admin`
2. Ouvrez la console du navigateur (F12)
3. Regardez les logs

### 5.2 Créer un nouveau rendez-vous
1. Allez sur la page publique : `http://localhost:3000/prendre-rendez-vous`
2. Réservez un nouveau rendez-vous
3. Retournez au dashboard admin

✅ **Une notification devrait apparaître immédiatement**

---

## 🔧 **Dépannage**

### Problème : Aucune notification n'apparaît

#### Solution 1 : Vérifier les logs du navigateur
```javascript
// Dans la console du navigateur, vérifier :
console.log('Supabase client:', supabase)
```

#### Solution 2 : Vérifier la connexion Realtime
```sql
-- Dans Supabase SQL Editor
SELECT * FROM pg_stat_replication;
```

#### Solution 3 : Vérifier que le trigger existe
```sql
-- Vérifier les triggers
SELECT 
    tgname AS trigger_name,
    tgrelid::regclass AS table_name,
    proname AS function_name
FROM pg_trigger
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgname = 'trigger_notify_admins_appointment';
```

✅ **Vous devriez voir : trigger_notify_admins_appointment | appointments | notify_admins_new_appointment**

### Problème : Les notifications apparaissent mais ne sont pas en temps réel

#### Solution : Vérifier la souscription Realtime

Dans le code React, vérifiez que la souscription est active :

```typescript
// Dans NotificationSystem.tsx
useEffect(() => {
  const subscription = supabase
    .channel('notifications-realtime')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications' },
      (payload) => {
        console.log('✅ Nouvelle notification reçue:', payload.new)
        // ...
      }
    )
    .subscribe((status) => {
      console.log('📡 Realtime status:', status)
    })
}, [])
```

---

## 📋 **Checklist Finale**

- [ ] Script SQL `update-admin-tables.sql` exécuté
- [ ] Table `notifications` créée
- [ ] Table `admin_logs` créée
- [ ] Trigger `trigger_notify_admins_appointment` créé
- [ ] Realtime activé sur table `notifications`
- [ ] Politiques RLS configurées
- [ ] Test manuel réussi (INSERT dans appointments)
- [ ] Test en temps réel réussi (nouvelle réservation)

---

## 🚀 **Test Rapide**

Exécutez ce script complet dans Supabase pour tout tester :

```sql
-- Test complet
DO $$
DECLARE
    test_appointment_id UUID;
BEGIN
    -- 1. Créer un rendez-vous de test
    INSERT INTO appointments (
        first_name, last_name, email, phone, 
        appointment_date, appointment_time, reason, status
    ) VALUES (
        'Test', 'Système', 'test@test.com', '06 00 00 00 00',
        CURRENT_DATE + INTERVAL '7 days', '14:00',
        'Test automatique', 'confirmed'
    ) RETURNING id INTO test_appointment_id;
    
    -- 2. Vérifier que la notification a été créée
    IF EXISTS (
        SELECT 1 FROM notifications 
        WHERE message LIKE '%Test Système%' 
        AND created_at > NOW() - INTERVAL '10 seconds'
    ) THEN
        RAISE NOTICE '✅ SUCCESS: La notification a été créée automatiquement';
    ELSE
        RAISE NOTICE '❌ ERREUR: Aucune notification créée';
    END IF;
    
    -- 3. Nettoyer
    DELETE FROM appointments WHERE id = test_appointment_id;
    DELETE FROM notifications WHERE message LIKE '%Test Système%';
    
END $$;
```

---

**Si vous voyez "✅ SUCCESS", tout fonctionne !**
