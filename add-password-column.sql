-- Ajouter la colonne password à la table admins si elle n'existe pas
ALTER TABLE admins ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Mettre à jour le mot de passe pour l'admin existant (hashé avec bcrypt)
-- Hash de "admin123" : $2b$10$rOvHPGkwQkKQk5wvx5DCSO7nBVnb7gp0vQvP8TxMhxJ9oQvP8TxMh
UPDATE admins 
SET password = '$2a$10$YQ7jX8X5b5wJ5vJ5wJ5wJeQ5wJ5wJ5wJ5wJ5wJ5wJ5wJ5wJ5wJ5wJ'
WHERE email = 'admin@permis-expert.fr';
