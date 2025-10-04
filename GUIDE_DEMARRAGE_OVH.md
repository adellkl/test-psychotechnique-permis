# 🚀 Guide de Démarrage Rapide - Configuration OVH Email

## ⚡ Configuration en 3 étapes

### Étape 1 : Configurer les variables d'environnement

Créez le fichier `.env.local` à la racine du projet :

```bash
# OVH SMTP Configuration
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@votre-domaine.com
SMTP_PASS=votre_mot_de_passe

# Email Settings
FROM_EMAIL=votre-email@votre-domaine.com
ADMIN_EMAIL=adelloukal2@gmail.com

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=votre_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_supabase_anon_key
```

### Étape 2 : Tester la configuration

Exécutez le script de test :

```bash
node test-ovh-email.js
```

Vous devriez voir :
```
✅ Email sent successfully!
Message ID: <...>
```

### Étape 3 : Démarrer l'application

```bash
npm run dev
```

L'application est maintenant prête à envoyer des emails via votre compte OVH !

## 📧 Emails automatiques envoyés

| Type | Destinataire | Déclencheur |
|------|--------------|-------------|
| Confirmation | Client | Après réservation |
| Notification | Admin | Nouvelle réservation |
| Rappel | Client | 24h avant RDV |
| Annulation | Client | Annulation RDV |

## 🔑 Informations importantes

### Paramètres SMTP OVH

- **Serveur** : `ssl0.ovh.net`
- **Port 587** : STARTTLS (recommandé) - `SMTP_SECURE=false`
- **Port 465** : SSL/TLS - `SMTP_SECURE=true`

### Où trouver vos identifiants ?

1. Connectez-vous à votre espace client OVH
2. Section "Emails"
3. Sélectionnez votre domaine
4. Utilisez votre adresse email complète comme `SMTP_USER`
5. Le mot de passe est celui de votre compte email

## ❓ Problèmes courants

### ❌ Erreur d'authentification

```
Error: Invalid login
```

**Solution** : Vérifiez que `SMTP_USER` est votre adresse email complète et que `SMTP_PASS` est correct.

### ❌ Erreur de connexion

```
Error: connect ETIMEDOUT
```

**Solution** : 
- Vérifiez votre connexion internet
- Assurez-vous que le port 587 n'est pas bloqué par votre pare-feu

### ❌ Emails non reçus

**Solution** :
1. Vérifiez les spams
2. Testez avec `node test-ovh-email.js`
3. Vérifiez les logs du serveur

## 📚 Documentation complète

Pour plus de détails, consultez : [OVH_EMAIL_SETUP.md](./OVH_EMAIL_SETUP.md)

## ✅ Checklist avant production

- [ ] Variables d'environnement configurées sur l'hébergement
- [ ] Test d'envoi d'email réussi
- [ ] `.env.local` ajouté dans `.gitignore`
- [ ] Email de confirmation personnalisé
- [ ] HTTPS activé sur le domaine

## 🆘 Besoin d'aide ?

- Documentation OVH : https://docs.ovh.com/fr/emails/
- Testez avec : `node test-ovh-email.js`
- Consultez les logs : Terminal de votre serveur Next.js
