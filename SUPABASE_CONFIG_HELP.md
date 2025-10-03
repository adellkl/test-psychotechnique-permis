# 🔧 Configuration Supabase

## Problème actuel
La clé API Supabase dans `.env.local` n'est pas valide, ce qui empêche la connexion à la base de données.

## Solution

### 1. Récupérer votre vraie clé API Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Ouvrez votre projet : **hzfpscgdyrqbplmhgwhi**
4. Allez dans **Settings** → **API**
5. Copiez la clé **"anon public"** (commence par `eyJ...`)

### 2. Mettre à jour `.env.local`

Ouvrez le fichier `.env.local` et remplacez la ligne :
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Par votre vraie clé copiée depuis Supabase.

### 3. Redémarrer l'application

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer :
npm run dev
```

## Vérification

Une fois configuré, vous devriez pouvoir vous connecter avec :
- **Email** : admin@permis-expert.fr
- **Mot de passe** : admin123

## Structure actuelle de .env.local

```env
RESEND_API_KEY=re_DukMs63z_Ck4c7BBQ87c7Gu8V4qAgPgeW
FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=contact@test-psychotechnique-permis.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hzfpscgdyrqbplmhgwhi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA
```
