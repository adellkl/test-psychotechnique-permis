# Configuration Email Automatique - Resend

## 🚀 Configuration Rapide

### 1. Créer un compte Resend (GRATUIT)
1. Allez sur [https://resend.com](https://resend.com)
2. Créez un compte gratuit (3,000 emails/mois)
3. Vérifiez votre email
4. Obtenez votre clé API dans le dashboard

### 2. Configuration des variables d'environnement
Copiez `.env.example` vers `.env.local` et remplissez :

```bash
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email Settings
FROM_EMAIL=noreply@votre-domaine.fr
ADMIN_EMAIL=admin@votre-domaine.fr

# Application URL
NEXT_PUBLIC_APP_URL=https://votre-domaine.fr
```

### 3. Installation des dépendances
```bash
npm install resend
```

### 4. Initialiser les templates email
```bash
# Via API call
curl -X POST http://localhost:3000/api/email/initialize-templates
```

### 5. Tester la configuration
```bash
# Via API call
curl -X POST http://localhost:3000/api/email/test
```

## 📧 Types d'emails automatiques

### ✅ Emails configurés
1. **Confirmation de rendez-vous** - Envoyé au client
2. **Notification admin** - Envoyé à l'administrateur
3. **Rappel 24h avant** - Envoyé au client
4. **Annulation** - Envoyé au client

### 🎨 Templates personnalisables
- Templates HTML avec design moderne
- Variables dynamiques ({{first_name}}, {{appointment_date}}, etc.)
- Responsive design
- Stockés en base de données pour modification facile

## 🔧 Fonctionnalités avancées

### Personnalisation des templates
Les templates sont stockés dans la table `email_templates` avec :
- `template_name` : Identifiant unique
- `subject` : Sujet avec variables
- `html_content` : Contenu HTML
- `text_content` : Version texte

### Variables disponibles
- `{{first_name}}` - Prénom
- `{{last_name}}` - Nom
- `{{email}}` - Email
- `{{phone}}` - Téléphone
- `{{appointment_date}}` - Date formatée
- `{{appointment_time}}` - Heure
- `{{location}}` - Lieu
- `{{address}}` - Adresse
- `{{reason}}` - Motif du rendez-vous

## 🚨 Dépannage

### Erreur "Cannot find module 'resend'"
```bash
npm install resend
```

### Emails non reçus
1. Vérifiez la clé API Resend
2. Vérifiez les variables d'environnement
3. Consultez les logs de l'application
4. Testez avec l'endpoint `/api/email/test`

### Domaine non vérifié
1. Dans Resend, ajoutez votre domaine
2. Configurez les enregistrements DNS
3. Ou utilisez un domaine Resend temporaire

## 📊 Limites gratuites Resend
- **3,000 emails/mois** gratuits
- Pas de limite sur les domaines
- Support complet des templates
- Analytics inclus

## 🔄 Migration depuis l'ancien système
L'ancien système SMTP reste disponible en fallback. Pour migrer complètement :

1. Configurez Resend
2. Testez les nouveaux emails
3. Supprimez les anciennes variables SMTP si souhaité

## 📈 Monitoring
- Logs détaillés dans la console
- IDs de tracking Resend
- Gestion d'erreurs robuste
- Fallback automatique si nécessaire
