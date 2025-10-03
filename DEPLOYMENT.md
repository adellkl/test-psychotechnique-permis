# Guide de Déploiement - Test Psychotechnique Permis

## 🚀 Checklist de Déploiement

### 1. Configuration des Variables d'Environnement

**Variables requises pour la production :**
```bash
# Resend Email
RESEND_API_KEY=re_DdhZzjoL_DWUXFDm8hq4dFBokVfSYgavT
FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=f.sebti@outlook.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hzfpscgdyrqbplmhgwhi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA

# Application
NEXT_PUBLIC_APP_URL=https://test-psychotechnique-permis-adhl-im3yxw4ws-adellkls-projects.vercel.app
NODE_ENV=production
```

### 2. Vérification Email Resend

**Avant le déploiement :**
1. Aller sur https://resend.com/settings/verified-emails
2. Ajouter `f.sebti@outlook.com` comme adresse vérifiée
3. F. Sebti doit cliquer sur le lien de vérification reçu par email

### 3. Base de Données Supabase

**Tables requises :**
- ✅ `appointments` - Rendez-vous clients
- ✅ `email_templates` - Templates d'emails
- ✅ `admin_activity_logs` - Logs d'activité admin

**Commande de mise à jour :**
```sql
-- Exécuter le script de mise à jour
\i supabase-update-script.sql
```

### 4. Déploiement Vercel

**Commandes :**
```bash
# Build local pour tester
npm run build

# Déploiement
vercel --prod
```

**Variables d'environnement Vercel :**
Ajouter toutes les variables listées ci-dessus dans les settings Vercel.

### 5. Tests Post-Déploiement

**À tester après déploiement :**
- [ ] Page d'accueil se charge correctement
- [ ] Prise de rendez-vous fonctionne
- [ ] Emails de confirmation envoyés
- [ ] Dashboard admin accessible
- [ ] Images chargent correctement

### 6. Monitoring

**URLs à surveiller :**
- Site principal : https://test-psychotechnique-permis-adhl-im3yxw4ws-adellkls-projects.vercel.app
- Admin : /admin/dashboard
- API emails : /api/send-appointment-emails

## 🔧 Résolution de Problèmes

### Emails ne fonctionnent pas
1. Vérifier que `f.sebti@outlook.com` est vérifiée sur Resend
2. Vérifier `RESEND_API_KEY` dans les variables d'environnement
3. Vérifier les logs Vercel pour les erreurs

### Erreurs de base de données
1. Vérifier les clés Supabase
2. Vérifier que les tables existent
3. Exécuter `supabase-update-script.sql` si nécessaire

### Images ne chargent pas
1. Vérifier que les images sont dans `/public/images/`
2. Vérifier la configuration `next.config.js`
3. Utiliser des URLs absolues si nécessaire
