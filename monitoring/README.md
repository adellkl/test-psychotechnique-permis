# 🔍 Système de Monitoring et Debug - Test Psychotechnique Permis

## 📋 Vue d'ensemble

Système complet de surveillance automatique et d'interface de debug pour monitorer la santé de l'application, le service d'emails et la base de données.

## 🎯 Fonctionnalités

### 1. Scripts de Monitoring Automatique (monitoring/)
- ✅ **check-app-health.js** : Vérifie la disponibilité des pages et APIs
- 📧 **check-email-service.js** : Teste le service Elastic Email
- 🗄️ **check-database.js** : Vérifie Supabase et l'intégrité des données
- 🚨 **send-alert.js** : Envoie des alertes par email en cas de problème
- 🎯 **monitor.js** : Script principal qui orchestre tous les tests
- ⚙️ **setup-cron.sh** : Configuration des tâches automatiques

### 2. Interface Admin de Debug (/admin/debug)
Interface web complète accessible uniquement aux administrateurs avec 5 onglets:

#### 🏥 Santé de l'Application
- Vérification de la disponibilité des pages (accueil, admin, etc.)
- Test des endpoints API
- Mesure des temps de réponse
- Détection des pages inaccessibles

#### 📧 Service Email
- Test de la configuration Elastic Email
- Vérification de l'API Key
- Consultation du crédit restant
- Envoi d'emails de test personnalisés

#### 🗄️ Base de Données
- Test de connexion Supabase
- Vérification de l'accessibilité des tables
- Contrôle d'intégrité des données
- Statistiques en temps réel (nombre de RDV, admins, templates)

#### 📊 Logs de Monitoring
- Consultation des logs historiques
- Affichage des 50 derniers tests
- Statuts de chaque composant
- Temps d'exécution des vérifications

#### 🧪 Tests
- Création de rendez-vous de test
- Test complet du formulaire de réservation
- Vérification de l'envoi d'emails automatique

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Fichier `.env.production` :

```env
# Elastic Email (pour les alertes)
ELASTIC_EMAIL_API_KEY=votre_cle_api
FROM_EMAIL=contact@test-psychotechnique-permis.com
ADMIN_EMAIL=sebtifatiha@live.fr

# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase

# URL de l'application
APP_URL=https://test-psychotechnique-permis.com
NEXT_PUBLIC_APP_URL=https://test-psychotechnique-permis.com
```

## 📖 Utilisation

### A. Scripts en ligne de commande

#### Test manuel unique

```bash
# Monitoring complet avec alertes
node monitoring/monitor.js

# Sans envoi d'alertes
node monitoring/monitor.js --no-alert

# Avec alertes sur warnings
node monitoring/monitor.js --alert-on-warning

# Mode silencieux
node monitoring/monitor.js --quiet
```

#### Tests individuels

```bash
# Test de l'application
node monitoring/check-app-health.js

# Test du service email
node monitoring/check-email-service.js

# Test de la base de données
node monitoring/check-database.js

# Test d'envoi d'alerte
node monitoring/send-alert.js
```

### B. Configuration automatique (Cron)

```bash
# Lancer le script de configuration
chmod +x monitoring/setup-cron.sh
./monitoring/setup-cron.sh
```

Le script vous propose plusieurs fréquences :
- ⚡ Toutes les 5 minutes (recommandé pour la production)
- 📅 Toutes les 15/30 minutes
- 🕐 Toutes les heures
- 📆 Une fois par jour

#### Gestion des tâches cron

```bash
# Voir les tâches configurées
crontab -l

# Modifier les tâches
crontab -e

# Supprimer le monitoring automatique
crontab -l | grep -v run-monitoring.sh | crontab -
```

### C. Interface Web Admin

1. **Accès** : https://votresite.com/admin/debug
   - Connexion requise avec compte administrateur
   - Email: sebtifatiha@live.fr
   - Mot de passe: Admin123!

2. **Navigation** :
   - Cliquez sur l'icône "Debug" dans la sidebar
   - Utilisez les onglets pour naviguer entre les tests

3. **Actions** :
   - Cliquez sur "Lancer la vérification" pour tester un composant
   - Envoyez des emails de test avec votre adresse
   - Créez des rendez-vous de test pour valider le flux complet

## 📊 Logs et Résultats

### Emplacement des logs

```
monitoring/logs/
├── monitoring-2025-01-05.json    # Logs du jour
├── monitoring-2025-01-04.json    # Logs historiques
└── cron.log                       # Logs des exécutions cron
```

### Format des logs

```json
{
  "timestamp": "2025-01-05T10:30:00.000Z",
  "overallStatus": "success",
  "duration": 1523,
  "checks": {
    "appHealth": {
      "status": "success",
      "checks": [...],
      "errors": []
    },
    "emailService": {...},
    "database": {...}
  }
}
```

## 🚨 Alertes par Email

### Quand sont-elles envoyées ?

- **Automatiquement** : En cas d'erreur détectée (status: error)
- **Optionnellement** : Sur warnings avec `--alert-on-warning`

### Contenu de l'alerte

Les emails d'alerte contiennent :
- 🎯 Niveau de criticité (CRITIQUE/ATTENTION/INFO)
- 📅 Timestamp de la détection
- ✅❌ Résultats détaillés de chaque vérification
- 📊 Statistiques de la base de données
- 💡 Actions recommandées

## 🔧 Maintenance

### Nettoyage des anciens logs

```bash
# Garder uniquement les 7 derniers jours
find monitoring/logs -name "monitoring-*.json" -mtime +7 -delete
```

### Vérifier que le cron fonctionne

```bash
# Voir les logs récents
tail -f monitoring/logs/cron.log

# Forcer une exécution manuelle
monitoring/run-monitoring.sh
```

### Résolution de problèmes

#### Le script ne s'exécute pas

```bash
# Vérifier les permissions
chmod +x monitoring/monitor.js
chmod +x monitoring/run-monitoring.sh

# Vérifier le chemin Node.js
which node
```

#### Pas d'alertes reçues

```bash
# Tester l'envoi d'email manuellement
node monitoring/send-alert.js

# Vérifier les variables d'environnement
env | grep EMAIL
```

#### Interface web inaccessible

- Vérifier que vous êtes connecté en tant qu'admin
- Vider le cache du navigateur
- Vérifier les logs du serveur Next.js

## 📈 Métriques Surveillées

### Application
- ✅ Disponibilité des pages (/, /admin, etc.)
- ⚡ Temps de réponse (< 3000ms recommandé)
- 🔗 Status HTTP des endpoints API

### Service Email
- 📧 Configuration API Key valide
- 💳 Crédit disponible sur Elastic Email
- ✉️ Capacité d'envoi d'emails

### Base de Données
- 🔌 Connectivité Supabase
- 📋 Accessibilité des tables
- 🔍 Intégrité des données
- 📊 Statistiques (RDV, admins, templates)

## 🎨 Personnalisation

### Modifier la fréquence des tests

Éditez `monitoring/monitor.js` :

```javascript
const TIMEOUT = 10000; // 10 secondes par test
```

### Ajouter de nouveaux tests

1. Créez un nouveau fichier dans `monitoring/`
2. Exportez une fonction async qui retourne `{ status, checks, errors }`
3. Importez-la dans `monitor.js`
4. Ajoutez l'appel dans la fonction `runMonitoring()`

### Personnaliser les alertes

Éditez `monitoring/send-alert.js` pour modifier :
- Le template HTML des emails
- Les couleurs et styles
- Le contenu des messages

## 🔐 Sécurité

- ✅ L'interface de debug nécessite une authentification admin
- ✅ Les API keys ne sont jamais exposées dans les logs
- ✅ Les scripts utilisent les variables d'environnement
- ✅ Logs stockés localement uniquement

## 📞 Support

En cas de problème :
1. Consultez les logs : `monitoring/logs/`
2. Testez manuellement : `node monitoring/monitor.js`
3. Vérifiez l'interface web : `/admin/debug`
4. Contactez l'administrateur système

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025  
**Créé pour** : Test Psychotechnique Permis
