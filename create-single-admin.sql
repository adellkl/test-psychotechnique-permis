-- Script pour créer un seul compte administrateur principal
-- Supprime tous les comptes existants et crée un compte unique

-- 1. Supprimer tous les comptes admin existants
DELETE FROM admins;

-- 2. Créer le compte admin principal unique
INSERT INTO admins (
    id,
    email,
    password_hash,
    full_name,
    phone,
    created_at,
    updated_at,
    is_active
) VALUES (
    gen_random_uuid(),
    'sebtifatiha@live.fr',
    '$2a$10$N9qo8uLOickgx2ZoXn/vuKoZHGKp.VhH8NfPJhKLGJhBFQhKqLWwm', -- Hash pour "Admin123!"
    'Administrateur Principal',
    NULL,
    NOW(),
    NOW(),
    true
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    full_name = EXCLUDED.full_name,
    updated_at = NOW(),
    is_active = true;

-- 3. Vérifier que le compte a été créé
SELECT 
    id,
    email,
    full_name,
    created_at,
    is_active
FROM admins 
WHERE email = 'sebtifatiha@live.fr';

-- 4. Compter le nombre total d'admins (doit être 1)
SELECT COUNT(*) as total_admins FROM admins;
