# 🎯 Test Psychotechnique Permis

Plateforme de réservation en ligne de tests psychotechniques pour la récupération du permis de conduire.

**Site** : [https://test-psychotechnique-permis.com](https://test-psychotechnique-permis.com)

---

## 🚀 Démarrage Rapide

### Installation

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Build Production

```bash
npm run build
npm start
```

---

## 📚 Documentation

Pour une compréhension complète du projet, consultez ces fichiers **dans cet ordre** :

1. **[PROJECT-CONTEXT.md](PROJECT-CONTEXT.md)** 📖
   - Vue d'ensemble du projet
   - Configuration complète (BDD, Email, Comptes admin)
   - Standards de code
   - Variables d'environnement

2. **[ARCHITECTURE.md](ARCHITECTURE.md)** 🏗️
   - Structure technique du projet
   - Flux de données
   - Modèle de données
   - Patterns et conventions

3. **[API-ENDPOINTS.md](API-ENDPOINTS.md)** 🔌
   - Documentation complète de toutes les API
   - Exemples d'utilisation
   - Codes d'erreur
   - Authentification

4. **[DEV-NOTES.md](DEV-NOTES.md)** 📝
   - Historique des modifications
   - TODO et backlog
   - Bugs connus
   - Métriques de performance

5. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** 🐛
   - Guide de résolution des problèmes
   - Solutions aux erreurs courantes
   - Scripts de diagnostic

6. **[TASKS.txt](TASKS.txt)** ✅
   - **Fichier de travail principal**
   - Liste des modifications à faire
   - Contexte détaillé pour l'IA
   - **Utilisez ce fichier pour noter vos demandes !**

---

## 🎯 Workflow de Développement

### Pour Ajouter une Fonctionnalité

1. **Ajoutez une tâche dans `TASKS.txt`** avec tous les détails
2. Dites à l'IA : **"Regarde TASKS.txt"**
3. L'IA consultera le fichier et proposera un plan
4. Validation et développement
5. L'IA met à jour le statut dans TASKS.txt

### Pour Corriger un Bug

1. Consultez d'abord **TROUBLESHOOTING.md** (bug peut-être connu)
2. Si nouveau : ajoutez-le dans `TASKS.txt` section "BUGS À CORRIGER"
3. L'IA le prendra en charge

---

## 🛠️ Stack Technique

- **Framework** : Next.js 14+ (App Router)
- **Language** : TypeScript
- **Styling** : TailwindCSS + Framer Motion
- **Database** : Supabase (PostgreSQL)
- **Email** : Elastic Email API
- **Auth** : JWT + bcrypt

---

## 📧 Configuration Email

Configurez les variables d'environnement dans `.env.local` :

```bash
ELASTIC_EMAIL_API_KEY=votre_clé_api_elastic_email
FROM_EMAIL=contact@test-psychotechnique-permis.com
ADMIN_EMAIL=votre_email_admin
```

⚠️ **Ne jamais commit les fichiers .env dans Git !**

---

## 🗄️ Configuration Supabase

Configurez les variables d'environnement dans `.env.local` :

```bash
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

Voir `.env.example` pour la liste complète des variables requises.

---

## 👤 Gestion des Comptes Admin

**⚠️ Important** : Pas de système d'inscription admin public (sécurité).

**Pour créer un compte admin**, utilisez les scripts :

```bash
# Créer/recréer un compte admin
node reset-admin-account.js

# Vérifier les comptes existants
node check-all-admins.js
```

**Configuration** : Les informations de connexion sont gérées de manière sécurisée dans la base de données avec hachage bcrypt.

---

## 🏢 Centres de Test

### Clichy (Principal)
```
82 Rue Henri Barbusse
92110 Clichy
Tél : 07 65 56 53 79
```

### Colombes
```
14 Rue de Mantes - Pro Drive Academy
92700 COLOMBES
Tél : 0972132250
Email : reservation@mon-permis-auto.com
```

---

## 🔧 Scripts Utiles

```bash
# Monitoring
node monitoring/check-app-health.js
node monitoring/check-database.js
node monitoring/check-email-service.js

# Gestion admin
node check-all-admins.js
node reset-admin-account.js

# Tests
node test-send-email.js
```

---

## 🐛 Problèmes Courants

### Erreur 500 sur /api/available-slots

**Solution** : Le tri SQL cause des erreurs. Tri en JavaScript implémenté.  
Voir [TROUBLESHOOTING.md](TROUBLESHOOTING.md#erreur-500-sur-apiavailable-slots)

### Connexion Admin Échoue

**Vérifications** :
1. Colonne BDD = `password_hash` (pas `password`)
2. Email exact : `sebtifatiha@live.fr`
3. Mot de passe : `Admin123!`

**Solution** : `node reset-admin-account.js`

### Emails Non Envoyés

**Vérifications** :
1. API Key Elastic Email valide
2. FROM_EMAIL autorisé
3. Compte pas en mode test

---

## 📊 Structure du Projet

```
permis-expert/
├── app/                    # Next.js App Router
│   ├── admin/             # Dashboard admin
│   ├── api/               # API Routes
│   └── prendre-rendez-vous/
├── components/            # Composants réutilisables
├── lib/                   # Utilitaires et services
├── public/                # Assets statiques
├── monitoring/            # Scripts de monitoring
├── PROJECT-CONTEXT.md     # 📖 Documentation complète
├── API-ENDPOINTS.md       # 🔌 Doc API
├── TROUBLESHOOTING.md     # 🐛 Dépannage
├── DEV-NOTES.md           # 📝 Notes dev
├── ARCHITECTURE.md        # 🏗️ Architecture
└── TASKS.txt              # ✅ Fichier de travail
```

---

## 🚀 Déploiement

1. **Build** :
   ```bash
   npm run build
   ```

2. **Vérifications** :
   - [ ] Variables d'environnement configurées
   - [ ] Build sans erreurs
   - [ ] Supabase accessible
   - [ ] Elastic Email fonctionnel

3. **Deploy** :
   - Push sur la branche principale
   - Le déploiement est automatique

---

## 📞 Support

- **Développeur** : Adel Loukal
- **Admin** : sebtifatiha@live.fr
- **Centre Clichy** : 07 65 56 53 79

---

## 📄 Licence

Propriétaire : Test Psychotechnique Permis  
Tous droits réservés © 2025

---

## 💡 Conseil pour l'IA

**Avant de modifier quoi que ce soit** :

1. ✅ Lire **TASKS.txt** pour les tâches en cours
2. ✅ Consulter **PROJECT-CONTEXT.md** pour le contexte
3. ✅ Vérifier **TROUBLESHOOTING.md** pour les problèmes connus
4. ✅ Checker **API-ENDPOINTS.md** avant de modifier une API
5. ✅ Respecter les standards du projet

**Créé le** : 2025-01-13  
**Dernière mise à jour** : 2025-01-13
