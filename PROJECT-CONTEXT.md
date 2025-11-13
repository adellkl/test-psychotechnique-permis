# 🎯 PROJECT CONTEXT - Test Psychotechnique Permis

## 📌 Informations Générales

**Nom du projet** : Test Psychotechnique Permis  
**Domaine** : https://test-psychotechnique-permis.com  
**Type** : Plateforme de réservation de tests psychotechniques pour permis de conduire  
**Statut** : ✅ Production active  
**Propriétaire** : Sebti Fatiha (sebtifatiha@live.fr)

## 🏗️ Architecture Technique

### Stack Principal

```
Frontend : Next.js 14+ (App Router)
Language : TypeScript + React
Styling : TailwindCSS + Framer Motion
Database : Supabase (PostgreSQL)
Email : Elastic Email API
Hosting : Production (Domaine OVH)
```

### Versions Importantes

- **Next.js** : 14+ avec App Router (pas Pages Router)
- **React** : 18+ avec hooks modernes
- **Node.js** : Version LTS recommandée
- **TypeScript** : Strict mode activé

## 🗄️ Base de Données Supabase

### Connexion

```
URL : https://[votre-projet].supabase.co
Anon Key : [Votre clé anon Supabase]
```

**⚠️ Les vraies valeurs sont dans `.env.local` (non versionné)**

### Tables Principales

#### 1. `appointments` - Rendez-vous clients
```typescript
{
  id: uuid (PK)
  first_name: string
  last_name: string
  email: string
  phone: string
  appointment_date: date
  appointment_time: time
  location: string ('clichy' | 'colombes')
  status: string ('pending' | 'confirmed' | 'completed' | 'cancelled')
  test_type: string
  duration: integer (minutes)
  created_at: timestamp
}
```

**Statuts possibles** :
- `pending` : En attente de confirmation
- `confirmed` : Confirmé
- `completed` : Terminé
- `cancelled` : Annulé

#### 2. `available_slots` - Créneaux disponibles
```typescript
{
  id: uuid (PK)
  location: string ('clichy' | 'colombes')
  date: date
  start_time: time
  end_time: time
  is_available: boolean
  created_at: timestamp
}
```

**IMPORTANT** : 
- Le tri SQL sur `start_time` peut causer des erreurs 500 si des valeurs NULL existent
- **Solution** : Récupérer tous les slots puis trier en JavaScript

#### 3. `admins` - Comptes administrateurs
```typescript
{
  id: uuid (PK)
  email: string (unique)
  password_hash: string  // ⚠️ PAS 'password', utiliser 'password_hash'
  full_name: string
  role: string
  is_active: boolean
  created_at: timestamp
  last_login: timestamp
}
```

**⚠️ CRITIQUE** : 
- La colonne s'appelle `password_hash`, PAS `password`
- Toujours utiliser bcrypt avec 10 salt rounds minimum
- Hash format : `$2a$10$...`

#### 4. `admin_activity_log` - Journal d'activité
```typescript
{
  id: uuid (PK)
  admin_id: uuid (FK -> admins)
  action: string
  details: jsonb
  ip_address: string
  created_at: timestamp
}
```

#### 5. `notifications` - Notifications système
```typescript
{
  id: uuid (PK)
  appointment_id: uuid (FK -> appointments)
  type: string
  sent_at: timestamp
  created_at: timestamp
}
```

### Politiques RLS (Row Level Security)

**IMPORTANT** : Les politiques sont **simplifiées** pour éviter les récursions infinies :
- Accès complet aux tables pour éviter les problèmes de récursion
- Sécurité gérée côté Next.js API
- **NE PAS** utiliser `auth.uid()` dans les politiques (cause des récursions)

## 📧 Système d'Email - Elastic Email

### Configuration Actuelle

```
Service : Elastic Email API v2
API Key : [Votre clé API Elastic Email]
Plan : PAYANT (20€/mois)
From Email : contact@test-psychotechnique-permis.com
Admin Email : [Votre email admin]
```

**⚠️ Les vraies valeurs sont dans `.env.local` ou `.env.production` (non versionnés)**

### Templates d'Email Actifs

1. **appointment_confirmation_client**
   - Envoyé automatiquement au client après réservation
   - Variables : first_name, last_name, email, phone, appointment_date, appointment_time, location, address, location_details, contact_phone, website

2. **appointment_notification_admin**
   - Envoyé automatiquement à l'admin après réservation
   - Destinataire : Email admin configuré
   - Variables identiques au template client

### Configuration DNS (OVH)

```
SPF : v=spf1 include:_spf.elasticemail.com include:mx.ovh.com ~all
DKIM : Configuré pour api._domainkey
CNAME bounce : bounce → bounces.elasticemail.net
```

### Adresses Email Créées (OVH)

- contact@test-psychotechnique-permis.com - **Email expéditeur principal**
- reservation@test-psychotechnique-permis.com
- [Autres emails configurés selon besoins]

## 🏢 Centres de Test

### Centre Clichy (Principal)

```
Nom : Centre Agréé Clichy
Adresse : 82 Rue Henri Barbusse, 92110 Clichy
Téléphone : 07 65 56 53 79
Code location : 'clichy'
```

**Détails d'accès** :
- Métro ligne 13 : Mairie de Clichy
- Bus : lignes 54, 74, 137, 166, 167, 274, 341
- Parking public à proximité

### Centre Colombes

```
Nom : Pro Drive Academy
Adresse : 14 Rue de Mantes, 92700 COLOMBES
Téléphone : 0972132250
Email : reservation@mon-permis-auto.com
Code location : 'colombes'
```

**Détails d'accès** :
- Transilien J : Colombes
- Bus : lignes 175, 276, 304
- Parking gratuit sur place

## 👤 Comptes Administrateur

### Gestion des Comptes Admin

**⚠️ IMPORTANT** :
- Système d'inscription administrateur **DÉSACTIVÉ** (sécurité)
- Pas de création de compte via interface web
- Utiliser les scripts de gestion pour créer de nouveaux admins
- Les identifiants sont gérés de manière sécurisée dans la base de données avec hachage bcrypt

### Scripts de Gestion Admin

```bash
# Vérifier tous les comptes admin
node check-all-admins.js

# Créer/recréer un compte admin
node reset-admin-account.js

# Récupérer les identifiants
node get-admin-password.js
```

## 🔐 Variables d'Environnement

### Fichiers de Configuration

- `.env.example` : Template avec toutes les variables
- `.env.local` : Développement local (non versionné)
- `.env.production` : Production (non versionné)

### Variables Requises

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[votre-projet].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Votre clé anon]

# Elastic Email
ELASTIC_EMAIL_API_KEY=[Votre clé API Elastic Email]
FROM_EMAIL=contact@test-psychotechnique-permis.com
ADMIN_EMAIL=[Votre email admin]

# Application
NEXT_PUBLIC_APP_URL=https://test-psychotechnique-permis.com
```

**⚠️ Consultez `.env.example` pour voir toutes les variables. Ne jamais commit les fichiers `.env` !**

## 📁 Structure du Projet

```
/app                          # Next.js App Router
  /admin                      # Dashboard administrateur
    /components               # Composants admin
    /context                  # Contexte React (AuthContext)
    page.tsx                  # Page de connexion admin
    dashboard/page.tsx        # Dashboard principal
  /api                        # API Routes
    /appointments             # CRUD rendez-vous
    /available-slots          # Créneaux disponibles
    /admin                    # API admin (login, cleanup, etc.)
  /prendre-rendez-vous        # Page de réservation client
  /contact                    # Page contact
  /a-propos                   # Page à propos
  layout.tsx                  # Layout principal
  page.tsx                    # Page d'accueil

/components                   # Composants réutilisables
  Calendar.tsx                # Calendrier de réservation
  ModernHero.tsx              # Section héro page d'accueil
  Navigation.tsx              # Menu de navigation
  PageTransition.tsx          # Transitions entre pages

/lib                          # Bibliothèques et utilitaires
  supabase.ts                 # Client Supabase
  emailService.ts             # Service d'envoi d'emails
  adminAuth.ts                # Authentification admin
  adminLogger.ts              # Logging activités admin
  emailTemplates.ts           # Templates HTML emails
  authMiddleware.ts           # Middleware de sécurité

/public                       # Assets statiques
  /images                     # Images du site
  /Illustrations              # Illustrations SVG
  sitemap.xml                 # Sitemap SEO
  robots.txt                  # Robots SEO

/monitoring                   # Scripts de monitoring
  check-app-health.js         # Santé de l'application
  check-database.js           # État de la BDD
  check-email-service.js      # Test service email
```

## 🎨 Standards de Code

### React / Next.js

1. **'use client' Directive**
   - **TOUJOURS** en première ligne pour les composants interactifs
   - Requis pour : useState, useEffect, useContext, événements onClick, etc.

2. **App Router (pas Pages Router)**
   - Routes dans `/app` directory
   - Utiliser `page.tsx` pour les pages
   - Utiliser `layout.tsx` pour les layouts
   - API Routes dans `/app/api`

3. **Routes API Dynamiques**
   ```typescript
   // Ajouter pour les endpoints qui lisent params/headers
   export const dynamic = 'force-dynamic'
   ```

4. **Métadonnées SEO**
   ```typescript
   export const metadata = {
     metadataBase: new URL('https://test-psychotechnique-permis.com'),
     title: '...',
     description: '...'
   }
   ```

### TypeScript

1. **Types stricts**
   - Éviter `any`, utiliser types spécifiques
   - Interfaces pour les objets complexes
   - Types exportés dans `/lib/types.ts` ou localement

2. **Imports**
   - Toujours en haut du fichier
   - Groupés par catégorie (React, Next, lib, components, types)

### Styling

1. **TailwindCSS**
   - Framework CSS principal
   - Utiliser les classes utilitaires
   - Responsive avec préfixes : `md:`, `lg:`, etc.

2. **Animations**
   - Framer Motion pour animations complexes
   - Utiliser `willChange: 'opacity, transform'` pour GPU
   - Support `prefers-reduced-motion` pour accessibilité

3. **Performance**
   ```typescript
   // Mémoriser les composants lourds
   const memoizedComponent = useMemo(() => (
     <HeavyComponent />
   ), [dependencies])
   ```

### Images

```typescript
import Image from 'next/image'

// Toujours utiliser next/image
<Image
  src="/images/photo.jpg"
  alt="Description précise"
  width={800}
  height={600}
  priority={isAboveFold}
/>
```

## 🔒 Sécurité

### Mots de Passe

- **JAMAIS** en dur dans le code
- Toujours bcrypt avec 10+ rounds
- Colonne BDD : `password_hash` (pas `password`)

### API Routes

```typescript
// Toujours valider les entrées
if (!email || !password) {
  return NextResponse.json(
    { error: 'Données manquantes' },
    { status: 400 }
  )
}

// Gestion d'erreurs complète
try {
  // Logique
} catch (error) {
  console.error('Erreur:', error)
  return NextResponse.json(
    { error: 'Erreur serveur' },
    { status: 500 }
  )
}
```

### Logging

- Logger toutes les actions critiques
- Utiliser `adminLogger` pour les actions admin
- Format : `{ admin_id, action, details, ip_address }`

## 🚀 Workflow de Développement

### Lancement Local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Serveur disponible sur http://localhost:3000
```

### Build Production

```bash
# Build
npm run build

# Tester le build
npm start

# Vérifier aucune erreur de compilation
```

### Scripts Utiles

```bash
# Test email
node test-send-email.js

# Vérifier comptes admin
node check-all-admins.js

# Monitoring
node monitoring/check-app-health.js
```

## 🐛 Problèmes Connus & Solutions

### Erreur 500 sur /api/available-slots

**Cause** : Tri SQL sur colonnes NULL ou filtre `is_available`

**Solution** :
```typescript
// ❌ Ne pas faire
const { data } = await supabase
  .from('available_slots')
  .select('*')
  .eq('is_available', true)
  .order('start_time')

// ✅ Faire
const { data } = await supabase
  .from('available_slots')
  .select('*')

// Filtrer et trier en JavaScript
const slots = data
  .filter(s => s.is_available !== false)
  .sort((a, b) => a.start_time.localeCompare(b.start_time))
```

### Connexion Admin Échoue

**Vérifications** :
1. Colonne BDD est `password_hash` (pas `password`)
2. Hash bcrypt valide (commence par `$2a$` ou `$2b$`)
3. Email exact (sensible à la casse)

**Solution** :
```bash
node reset-admin-account.js
```

### Emails Non Envoyés

**Vérifications** :
1. `ELASTIC_EMAIL_API_KEY` valide
2. `FROM_EMAIL` autorisé dans Elastic Email
3. Logs dans console serveur
4. Compte non en mode test

### Build Next.js Échoue

**Solutions** :
```bash
# Supprimer le cache
rm -rf .next
npm cache clean --force

# Réinstaller
rm -rf node_modules
npm install

# Rebuild
npm run build
```

## 📊 Monitoring

### Health Checks

```bash
# Santé globale
node monitoring/check-app-health.js

# Base de données
node monitoring/check-database.js

# Service email
node monitoring/check-email-service.js
```

### Métriques à Surveiller

- Temps de réponse API < 1s
- Taux d'erreur < 1%
- Emails délivrés > 99%
- Espace disque BDD
- Logs d'erreurs

## 🎯 Fonctionnalités Principales

### Pour les Clients

1. **Réservation de rendez-vous**
   - Sélection du centre (Clichy ou Colombes)
   - Choix de la date et de l'heure
   - Formulaire de coordonnées
   - Confirmation par email immédiate

2. **Informations**
   - Détails des centres de test
   - Procédures et documents requis
   - Tarifs et durée
   - Contact

### Pour les Administrateurs

1. **Dashboard**
   - Liste de tous les rendez-vous
   - Filtres par statut, date, centre
   - Recherche par nom, email, téléphone

2. **Gestion des créneaux**
   - Ajout de créneaux disponibles
   - Activation/désactivation
   - Par centre et par date

3. **Nettoyage**
   - Suppression individuelle ou bulk
   - Filtres par statut et ancienneté
   - Prévisualisation avant suppression
   - Logs d'activité

4. **Emails**
   - Envoi manuel d'emails
   - Templates personnalisés
   - Notifications automatiques

## 📝 Notes de Développement

### Dernières Modifications

- ✅ Migration vers Elastic Email API (plan payant)
- ✅ Simplification des politiques RLS Supabase
- ✅ Optimisation des animations (GPU, mémorisation)
- ✅ Ajout fonctionnalité de nettoyage bulk
- ✅ Correction erreur 500 sur available-slots

### TODO / Améliorations Futures

- [ ] Système de rappel automatique 24h avant
- [ ] Export des rendez-vous en CSV
- [ ] Statistiques et analytics
- [ ] Gestion des congés/fermetures
- [ ] Multi-langue (FR/EN)

### Conventions de Commit

```
feat: Nouvelle fonctionnalité
fix: Correction de bug
refactor: Refactorisation
docs: Documentation
style: Formatage
perf: Performance
test: Tests
chore: Tâches diverses
```

## 🔗 Liens Utiles

- **Site Production** : https://test-psychotechnique-permis.com
- **Supabase Dashboard** : https://app.supabase.com/project/hzfpscgdyrqbplmhgwhi
- **Elastic Email Dashboard** : https://elasticemail.com/account
- **Admin Panel** : https://test-psychotechnique-permis.com/admin

---

**Dernière mise à jour** : 2025-01-13  
**Version du document** : 1.0  
**Mainteneur** : Adel Loukal
