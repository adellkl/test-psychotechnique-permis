# 🛠️ Stack Technique - Test Psychotechnique Permis

## 📋 Informations Générales
- **Nom du projet** : Test Psychotechnique Permis
- **Version** : 1.0.0
- **Type** : Application web full-stack
- **Site web** : https://test-psychotechnique-permis.com

---

## 🎯 Framework Principal

### **Next.js 14.2.3**
- Framework React avec Server-Side Rendering (SSR)
- App Router (nouvelle architecture)
- Génération de pages statiques et dynamiques
- Optimisation des images avec `next/image`
- API Routes intégrées
- Support TypeScript natif

---

## 💻 Frontend

### **Core Technologies**
| Technologie | Version | Description |
|------------|---------|-------------|
| **React** | 18.2.0 | Bibliothèque UI |
| **React DOM** | 18.2.0 | Rendu DOM |
| **TypeScript** | 5.3.3 | Typage statique |

### **Styling & UI**
| Technologie | Version | Description |
|------------|---------|-------------|
| **Tailwind CSS** | 3.3.3 | Framework CSS utility-first |
| **PostCSS** | 8.4.31 | Transformation CSS |
| **Autoprefixer** | 10.4.16 | Préfixes CSS automatiques |
| **Framer Motion** | 12.23.22 | Animations et transitions |

### **Composants & Visualisation**
| Technologie | Version | Description |
|------------|---------|-------------|
| **React Calendar** | 6.0.0 | Sélecteur de dates |
| **Chart.js** | 4.5.0 | Graphiques et statistiques |
| **React ChartJS 2** | 5.3.0 | Wrapper React pour Chart.js |

---

## 🔧 Backend & Database

### **Base de Données**
| Technologie | Description |
|------------|-------------|
| **Supabase** | Backend-as-a-Service (BaaS) |
| **PostgreSQL** | Base de données relationnelle |
| **@supabase/supabase-js** | Client JavaScript (v2.58.0) |
| **@supabase/ssr** | Support Server-Side Rendering (v0.5.1) |

### **Authentification & Sécurité**
| Technologie | Version | Description |
|------------|---------|-------------|
| **bcryptjs** | 3.0.2 | Hachage de mots de passe |

---

## 📧 Service d'Email

### **Providers**
| Service | Description | Status |
|---------|-------------|--------|
| **Resend** | Service d'envoi d'emails (principal) | ✅ Actif |
| **Elastic Email** | Service d'envoi alternatif | ✅ Backup |
| **Nodemailer** | Bibliothèque SMTP Node.js | ✅ Disponible |

### **Dépendances**
| Technologie | Version | Description |
|------------|---------|-------------|
| **resend** | 6.1.2 | SDK Resend |
| **nodemailer** | 7.0.6 | Client SMTP |
| **@types/nodemailer** | 7.0.2 | Types TypeScript |

---

## 🛠️ Utilities & Helpers

### **Utilitaires**
| Technologie | Version | Description |
|------------|---------|-------------|
| **date-fns** | 4.1.0 | Manipulation de dates |
| **dotenv** | 17.2.3 | Variables d'environnement |
| **node-fetch** | 3.3.2 | Client HTTP pour Node.js |

---

## 📦 Structure du Projet

```
permis-expert/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── admin/                # Routes admin
│   │   ├── appointments/         # Gestion rendez-vous
│   │   ├── available-slots/      # Créneaux disponibles
│   │   └── email/                # Envoi d'emails
│   ├── components/               # Composants React
│   │   ├── Navigation.tsx
│   │   ├── ModernHero.tsx
│   │   ├── PageTransition.tsx
│   │   └── CookieConsent.tsx
│   ├── admin/                    # Dashboard admin
│   ├── styles/                   # Styles CSS
│   ├── globals.css               # Styles globaux
│   └── layout.tsx                # Layout principal
├── lib/                          # Bibliothèques utilitaires
│   ├── supabase-server.ts        # Client Supabase SSR
│   ├── emailService.ts           # Service email
│   ├── emailTemplates.ts         # Templates HTML
│   └── adminLogger.ts            # Logs admin
├── public/                       # Assets statiques
│   └── images/                   # Images et logos
├── .env.local                    # Variables d'environnement (dev)
├── .env.production               # Variables d'environnement (prod)
├── next.config.js                # Configuration Next.js
├── tailwind.config.js            # Configuration Tailwind
└── tsconfig.json                 # Configuration TypeScript
```

---

## 🗄️ Base de Données (Supabase/PostgreSQL)

### **Tables Principales**
- **appointments** : Rendez-vous des clients
- **admins** : Comptes administrateurs
- **admin_logs** : Journaux d'activité admin
- **admin_notifications** : Notifications admin
- **email_templates** : Templates d'emails

### **Fonctionnalités**
- Row Level Security (RLS)
- Triggers automatiques
- Indexes de performance
- Functions SQL personnalisées

---

## 🌐 Services Externes

### **Infrastructure**
| Service | Utilisation |
|---------|-------------|
| **Vercel / Netlify** | Hébergement et déploiement |
| **GitHub** | Gestion de version |
| **Supabase Cloud** | Base de données hébergée |

### **Email**
| Service | Description | Status |
|---------|-------------|--------|
| **Resend** | Service d'envoi d'emails (principal) | ✅ Actif |
| **Elastic Email** | Service d'envoi alternatif | ✅ Backup |

### **Domaine**
- **Domaine principal** : test-psychotechnique-permis.com
- **DNS** : OVH
- **SSL** : Automatique (Let's Encrypt)

---

## 🔐 Variables d'Environnement

### **Required Environment Variables**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Email Service
FROM_EMAIL=
ADMIN_EMAIL=

# Application
NEXT_PUBLIC_APP_URL=
```

---

## 🎨 Design System

### **Couleurs Principales**
- **Primary Navy** : #1e3a8a
- **Primary Blue** : #3b82f6
- **Success Green** : #059669
- **Warning Amber** : #d97706
- **Error Red** : #dc2626

### **Typographie**
- **Font System** : -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Weights** : 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### **Animations**
- Framer Motion pour transitions fluides
- GPU acceleration avec `willChange`
- Support `prefers-reduced-motion`

---

## 📊 Fonctionnalités Principales

### **Frontend**
- ✅ Système de réservation en ligne
- ✅ Calendrier interactif
- ✅ Animations fluides et modernes
- ✅ Design responsive (mobile-first)
- ✅ SEO optimisé
- ✅ Cookie consent RGPD

### **Backend**
- ✅ API RESTful avec Next.js API Routes
- ✅ Authentification admin sécurisée (bcrypt)
- ✅ Dashboard administrateur complet
- ✅ Système de notifications
- ✅ Logs d'activité
- ✅ Cleanup automatique des données

### **Email**
- ✅ Confirmation de rendez-vous automatique
- ✅ Notification admin
- ✅ Rappels 24h avant
- ✅ Templates HTML professionnels
- ✅ Variables dynamiques

---

## 🚀 Performance

### **Optimisations**
- Code splitting automatique (Next.js)
- Images optimisées avec `next/image`
- Static Generation pour pages publiques
- Server Components React
- CSS minifié et optimisé
- Animations GPU-accelerated

### **Metrics**
- First Load JS : ~87.1 kB (shared)
- 33 pages générées
- Build time : ~30-40 secondes

---

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev          # Démarrer le serveur de développement

# Production
npm run build        # Build optimisé pour production
npm run start        # Démarrer le serveur de production

# Qualité
npm run lint         # Vérifier le code avec ESLint
```

---

## 👥 Configuration Admin

### **Comptes Administrateurs**
- Authentification sécurisée avec bcrypt
- Hash : bcrypt avec 10 rounds de salage
- Tables : `admins`, `admin_logs`, `admin_notifications`
- Gestion des sessions sécurisée

---

## 📄 License & Contact

- **License** : Propriétaire
- **Contact** : 07 65 56 53 79
- **Email** : contact@test-psychotechnique-permis.com
- **Adresse** : 82 Rue Henri Barbusse, 92110 Clichy

---

**Dernière mise à jour** : Octobre 2025
