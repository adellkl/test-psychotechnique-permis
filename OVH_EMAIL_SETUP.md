# Configuration Email OVH pour Permis Expert

Ce guide vous explique comment configurer l'envoi d'emails via SMTP OVH pour votre application.

## 📋 Prérequis

- Un compte email OVH (ex: contact@test-psychotechnique-permis.com)
- Le mot de passe de votre compte email
- Node.js et npm installés

## 🔧 Configuration

### 1. Obtenir vos identifiants SMTP OVH

Vos paramètres SMTP OVH sont :
- **Serveur SMTP** : `ssl0.ovh.net`
- **Port** : `587` (STARTTLS) ou `465` (SSL/TLS)
- **Utilisateur** : votre adresse email complète (ex: contact@test-psychotechnique-permis.com)
- **Mot de passe** : le mot de passe de votre compte email

### 2. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les informations suivantes :

```bash
# OVH SMTP Configuration
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@votre-domaine.com
SMTP_PASS=votre_mot_de_passe_email

# Email Settings
FROM_EMAIL=votre-email@votre-domaine.com
ADMIN_EMAIL=adelloukal2@gmail.com

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=votre_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_supabase_anon_key
```

### 3. Paramètres par port

#### Port 587 (STARTTLS - Recommandé)
```bash
SMTP_PORT=587
SMTP_SECURE=false
```

#### Port 465 (SSL/TLS)
```bash
SMTP_PORT=465
SMTP_SECURE=true
```

## 🧪 Test de la configuration

### Option 1 : Script de test rapide

Exécutez le script de test :

```bash
node test-ovh-email.js
```

### Option 2 : Test via l'API

1. Démarrez le serveur de développement :
```bash
npm run dev
```

2. Appelez la fonction de test depuis votre code

## 📧 Types d'emails automatisés

L'application envoie automatiquement :

1. **Confirmation de rendez-vous** - Au client après réservation
2. **Notification admin** - À l'administrateur pour chaque nouveau rendez-vous
3. **Rappel 24h avant** - Rappel automatique au client
4. **Annulation** - Notification en cas d'annulation

## 🔍 Dépannage

### Erreur d'authentification

Si vous obtenez une erreur "Invalid login", vérifiez :
- L'adresse email complète est correcte
- Le mot de passe est correct
- Pas d'espace avant ou après dans les variables d'environnement

### Erreur de connexion

Si vous obtenez une erreur de connexion :
- Vérifiez que le port est correct (587 ou 465)
- Assurez-vous que SMTP_SECURE correspond au port choisi
- Vérifiez que votre pare-feu autorise les connexions sortantes SMTP

### Emails non reçus

Si les emails ne sont pas reçus :
- Vérifiez les spams/courriers indésirables
- Vérifiez que FROM_EMAIL est une adresse valide
- Consultez les logs du serveur pour voir si l'envoi a réussi

### Erreur "Self-signed certificate"

Si vous obtenez une erreur de certificat SSL, ajoutez cette option (seulement en développement) :

```bash
SMTP_REJECT_UNAUTHORIZED=false
```

**⚠️ Ne jamais utiliser cette option en production !**

## 🌐 Différences avec Resend

### Migration depuis Resend

Le système a été migré de Resend vers OVH SMTP pour utiliser votre compte email existant :

**Avant (Resend)** :
- API Key requis
- 3,000 emails/mois gratuits
- Domaine vérifié nécessaire pour production

**Maintenant (OVH SMTP)** :
- Utilise votre compte email OVH existant
- Pas de limite artificielle (selon votre forfait OVH)
- Configuration SMTP standard

## 📝 Recommandations

### Production

Pour la production, assurez-vous de :

1. ✅ Utiliser HTTPS pour l'application
2. ✅ Protéger le fichier `.env.local` (ne jamais le committer)
3. ✅ Utiliser des variables d'environnement sécurisées sur votre hébergement
4. ✅ Tester l'envoi d'emails avant le déploiement
5. ✅ Surveiller les logs d'envoi d'emails

### Sécurité

- ❌ Ne jamais committer `.env.local` dans Git
- ❌ Ne jamais partager vos identifiants SMTP
- ✅ Utiliser un mot de passe fort pour votre compte email
- ✅ Activer l'authentification à deux facteurs sur OVH si disponible

## 🆘 Support

Si vous rencontrez des problèmes :

1. Consultez la documentation OVH : https://docs.ovh.com/fr/emails/
2. Vérifiez les logs de l'application : `npm run dev`
3. Testez la connexion SMTP avec le script de test

## 📦 Packages utilisés

- `nodemailer` : Bibliothèque Node.js pour l'envoi d'emails via SMTP
- `@types/nodemailer` : Types TypeScript pour nodemailer
