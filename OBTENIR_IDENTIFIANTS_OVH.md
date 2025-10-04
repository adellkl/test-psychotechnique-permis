# 🔑 Comment obtenir vos identifiants SMTP OVH

Ce guide vous explique comment récupérer les informations nécessaires pour configurer l'envoi d'emails via OVH.

## 📋 Informations à obtenir

Vous avez besoin de :
- `SMTP_USER` : Votre adresse email complète
- `SMTP_PASS` : Le mot de passe de votre compte email
- `SMTP_HOST` : ssl0.ovh.net (déjà fourni)
- `SMTP_PORT` : 587 (déjà fourni)

---

## 🔐 Étape 1 : Accéder à votre espace client OVH

1. Allez sur : **https://www.ovh.com/manager/**
2. Connectez-vous avec vos identifiants OVH

---

## 📧 Étape 2 : Accéder à vos emails

### Dans l'espace client :

1. Dans le menu de gauche, cliquez sur **"Web Cloud"**
2. Puis sur **"E-mails"** ou **"Emails"**
3. Sélectionnez votre nom de domaine (ex: test-psychotechnique-permis.com)

Vous verrez la liste de vos adresses email existantes.

---

## 🆕 Étape 3 : Créer ou utiliser une adresse email existante

### Option A : Utiliser une adresse existante

Si vous avez déjà une adresse email (ex: contact@test-psychotechnique-permis.com) :
- Notez l'adresse complète → ce sera votre `SMTP_USER`

### Option B : Créer une nouvelle adresse email

1. Cliquez sur **"Créer une adresse e-mail"** ou **"Ajouter un compte"**
2. Choisissez un nom (ex: noreply, contact, info, rendez-vous)
3. Définissez un mot de passe fort
4. Validez la création

Adresses recommandées pour l'application :
- `noreply@test-psychotechnique-permis.com` (pas de réponse)
- `contact@test-psychotechnique-permis.com` (contact général)
- `rendez-vous@test-psychotechnique-permis.com` (spécifique RDV)

---

## 🔑 Étape 4 : Obtenir/Réinitialiser le mot de passe

### Si vous connaissez déjà le mot de passe :
- Utilisez-le directement pour `SMTP_PASS`

### Si vous ne connaissez pas le mot de passe :

1. Dans la liste des emails, cliquez sur **"..."** ou **"⋮"** à droite de votre adresse
2. Sélectionnez **"Modifier le mot de passe"** ou **"Changer le mot de passe"**
3. Entrez un nouveau mot de passe fort
4. Confirmez le changement
5. **IMPORTANT** : Notez ce mot de passe → ce sera votre `SMTP_PASS`

### Recommandations pour le mot de passe :
- Au moins 12 caractères
- Mélange de majuscules, minuscules, chiffres et caractères spéciaux
- Exemple : `Pr8$mK2!xL9nQ4`

---

## 📝 Étape 5 : Remplir votre fichier .env.local

Créez ou modifiez `.env.local` à la racine du projet :

```bash
# OVH SMTP Configuration
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@test-psychotechnique-permis.com  # ← Votre adresse email
SMTP_PASS=Pr8$mK2!xL9nQ4                           # ← Votre mot de passe

# Email Settings
FROM_EMAIL=contact@test-psychotechnique-permis.com # ← Même adresse
ADMIN_EMAIL=adelloukal2@gmail.com

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hzfpscgdyrqbplmhgwhi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA
```

---

## 🧪 Étape 6 : Tester la configuration

Exécutez le script de test :

```bash
node test-ovh-email.js
```

### Résultat attendu :
```
🧪 Testing OVH SMTP configuration...
SMTP Host: ssl0.ovh.net
SMTP Port: 587
SMTP User: contact@test-psychotechnique-permis.com
From: contact@test-psychotechnique-permis.com
To: adelloukal2@gmail.com

📧 Sending test email...
✅ Email sent successfully!
Message ID: <...@...>
```

Si vous voyez ✅, c'est bon ! Sinon, voir le dépannage ci-dessous.

---

## 🔧 Paramètres SMTP détaillés

### Configuration complète OVH :

| Paramètre | Valeur | Description |
|-----------|--------|-------------|
| **Serveur SMTP** | ssl0.ovh.net | Serveur mail OVH |
| **Port STARTTLS** | 587 | Recommandé (SMTP_SECURE=false) |
| **Port SSL/TLS** | 465 | Alternative (SMTP_SECURE=true) |
| **Authentification** | Requise | Obligatoire |
| **Utilisateur** | adresse@domaine.com | Email complet |
| **Mot de passe** | Votre mot de passe | Mot de passe du compte |

### Serveurs SMTP alternatifs OVH :
- `ssl0.ovh.net` (principal)
- `mail.ovh.net`
- Votre domaine : `mail.votre-domaine.com` (si configuré)

---

## ❌ Dépannage

### Erreur : "Invalid login" ou "Authentication failed"

**Causes possibles :**
- Adresse email incorrecte
- Mot de passe incorrect
- Espaces avant/après les identifiants

**Solutions :**
1. Vérifiez que `SMTP_USER` est l'adresse email **complète**
2. Réinitialisez le mot de passe dans l'espace client OVH
3. Vérifiez qu'il n'y a pas d'espaces dans `.env.local`

### Erreur : "Connection timeout"

**Causes possibles :**
- Pare-feu bloque le port 587
- Problème de connexion internet

**Solutions :**
1. Vérifiez votre connexion internet
2. Essayez le port 465 avec `SMTP_SECURE=true`
3. Désactivez temporairement le pare-feu pour tester

### L'email n'arrive pas

**Solutions :**
1. Vérifiez les spams/courriers indésirables
2. Attendez quelques minutes (délai possible)
3. Vérifiez que l'adresse destinataire est correcte
4. Consultez les logs du script de test

---

## 🔒 Sécurité

### ✅ À FAIRE :
- Utilisez un mot de passe fort et unique
- Ne partagez jamais vos identifiants
- Ajoutez `.env.local` dans `.gitignore`
- Utilisez des variables d'environnement en production

### ❌ À NE PAS FAIRE :
- Ne commitez JAMAIS `.env.local` dans Git
- Ne partagez pas votre mot de passe SMTP
- N'utilisez pas de mot de passe faible
- Ne hardcodez pas les identifiants dans le code

---

## 📞 Support OVH

Si vous rencontrez des problèmes :

- **Documentation OVH** : https://docs.ovh.com/fr/emails/
- **Support OVH** : https://www.ovh.com/fr/support/
- **Guide configuration mail** : https://docs.ovh.com/fr/emails/generalites-sur-les-emails-mutualises/

---

## ✅ Checklist finale

Avant de lancer l'application :

- [ ] Adresse email créée sur OVH
- [ ] Mot de passe défini et noté
- [ ] Fichier `.env.local` créé avec les bons identifiants
- [ ] Test avec `node test-ovh-email.js` réussi ✅
- [ ] Email de test reçu
- [ ] `.env.local` dans `.gitignore`

Une fois tous ces points validés, votre application est prête à envoyer des emails via OVH ! 🎉
