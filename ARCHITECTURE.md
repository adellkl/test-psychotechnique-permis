# 🏗️ ARCHITECTURE - Structure Technique

## 🎯 Vue d'Ensemble

**Type** : Application Web Full-Stack  
**Architecture** : Server-Side Rendering (SSR) + API Routes  
**Pattern** : MVC adapté pour Next.js App Router

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (React)                    │
│  Next.js 14 App Router + TailwindCSS + Framer Motion│
└─────────────────┬───────────────────────────────────┘
                  │
                  │ HTTP/HTTPS
                  │
┌─────────────────▼───────────────────────────────────┐
│              API ROUTES (Next.js)                    │
│  /api/appointments, /api/admin, /api/available-slots│
└────────┬──────────────────────────────┬─────────────┘
         │                              │
         │                              │
┌────────▼────────────┐      ┌──────────▼─────────────┐
│  SUPABASE (BDD)     │      │  ELASTIC EMAIL (API)   │
│  PostgreSQL         │      │  Service d'envoi       │
└─────────────────────┘      └────────────────────────┘
```

---

## 📁 Structure des Dossiers

```
permis-expert/
├── app/                          # Next.js App Router
│   ├── admin/                    # Zone administrateur
│   │   ├── components/           # Composants admin uniquement
│   │   │   ├── CleanupManager.tsx
│   │   │   ├── AppointmentList.tsx
│   │   │   └── SendEmailModal.tsx
│   │   ├── context/              # Contextes React
│   │   │   └── AuthContext.tsx   # Authentification admin
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard principal
│   │   └── page.tsx              # Page de connexion
│   │
│   ├── api/                      # API Routes
│   │   ├── appointments/
│   │   │   └── route.ts          # CRUD rendez-vous
│   │   ├── available-slots/
│   │   │   └── route.ts          # Gestion créneaux
│   │   └── admin/
│   │       ├── login/route.ts
│   │       ├── list/route.ts
│   │       └── cleanup/route.ts
│   │
│   ├── prendre-rendez-vous/
│   │   └── page.tsx              # Page de réservation
│   ├── contact/page.tsx
│   ├── a-propos/page.tsx
│   ├── layout.tsx                # Layout racine
│   └── page.tsx                  # Page d'accueil
│
├── components/                   # Composants réutilisables
│   ├── Calendar.tsx              # Calendrier de réservation
│   ├── ModernHero.tsx            # Section héro
│   ├── Navigation.tsx            # Menu navigation
│   └── PageTransition.tsx        # Transitions pages
│
├── lib/                          # Bibliothèques et utilitaires
│   ├── supabase.ts               # Client Supabase
│   ├── emailService.ts           # Service emails
│   ├── emailTemplates.ts         # Templates HTML
│   ├── adminAuth.ts              # Auth admin
│   ├── adminLogger.ts            # Logging
│   └── authMiddleware.ts         # Middleware JWT
│
├── public/                       # Assets statiques
│   ├── images/
│   ├── Illustrations/
│   └── sitemap.xml
│
├── monitoring/                   # Scripts de monitoring
│   ├── check-app-health.js
│   ├── check-database.js
│   └── check-email-service.js
│
├── PROJECT-CONTEXT.md            # Documentation projet
├── API-ENDPOINTS.md              # Doc API
├── TROUBLESHOOTING.md            # Guide dépannage
├── DEV-NOTES.md                  # Notes dev
├── ARCHITECTURE.md               # Ce fichier
└── README.md                     # Instructions
```

---

## 🔄 Flux de Données

### Réservation Client

```
1. Client remplit formulaire (/prendre-rendez-vous)
   └─→ Composant Calendar.tsx
       └─→ Fetch GET /api/available-slots
           └─→ Supabase: SELECT available_slots

2. Client soumet réservation
   └─→ POST /api/appointments
       ├─→ Validation données
       ├─→ Supabase: INSERT appointments
       ├─→ Elastic Email: Confirmation client
       ├─→ Elastic Email: Notification admin
       └─→ Supabase: INSERT notifications

3. Client reçoit confirmation
   └─→ Email avec détails RDV
```

### Connexion Admin

```
1. Admin entre email + password (/admin)
   └─→ POST /api/admin/login
       ├─→ Supabase: SELECT admins WHERE email
       ├─→ bcrypt.compare(password, hash)
       ├─→ jwt.sign({ adminId })
       ├─→ Supabase: UPDATE last_login
       └─→ Supabase: INSERT admin_activity_log

2. Admin stocke token JWT
   └─→ localStorage.setItem('adminToken')

3. Admin accède dashboard
   └─→ GET /admin/dashboard
       └─→ AuthContext vérifie token
           └─→ Affiche interface si valide
```

### Nettoyage Bulk

```
1. Admin ouvre CleanupManager
   └─→ Sélectionne critères (status + olderThan)
       └─→ GET /api/admin/cleanup?status=...
           └─→ Supabase: SELECT appointments WHERE...
               └─→ Affiche preview

2. Admin confirme suppression
   └─→ DELETE /api/admin/cleanup
       ├─→ Vérification token JWT
       ├─→ Supabase: DELETE notifications WHERE...
       ├─→ Supabase: DELETE appointments WHERE...
       ├─→ Supabase: INSERT admin_activity_log
       └─→ Retour nombre supprimés

3. Interface mise à jour
   └─→ Refresh liste rendez-vous
```

---

## 🧩 Composants Clés

### Calendar.tsx

**Rôle** : Affichage et sélection des créneaux disponibles

**Props** :
```typescript
{
  location: 'clichy' | 'colombes'
  onSelect: (slot) => void
}
```

**État** :
```typescript
const [selectedDate, setSelectedDate] = useState<Date>()
const [slots, setSlots] = useState<Slot[]>([])
const [loading, setLoading] = useState(false)
```

**Logique** :
1. Fetch slots depuis API au changement de date
2. Filtrage par disponibilité
3. Tri par heure
4. Affichage en grille

---

### ModernHero.tsx

**Rôle** : Section héro animée de la page d'accueil

**Optimisations** :
- `useMemo()` pour variants
- `willChange: 'opacity, transform'`
- Réduction bubbles (8 → 5)
- Protection SSR avec `isMounted`

**Structure** :
```tsx
<div className="relative overflow-hidden">
  <BackgroundAnimations />
  <HeroContent>
    <motion.h1 variants={titleVariants} />
    <motion.p variants={subtitleVariants} />
    <motion.div variants={buttonVariants}>
      <CTAButton />
    </motion.div>
  </HeroContent>
</div>
```

---

### Navigation.tsx

**Rôle** : Menu de navigation responsive

**États** :
```typescript
const [isOpen, setIsOpen] = useState(false)  // Mobile menu
const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
```

**Transitions** :
- Desktop : Hover avec fade-in 200ms
- Mobile : Slide from right avec spring animation
- Overlay : Fade 200ms avec willChange: 'opacity'

---

## 🔌 API Routes

### Structure Type

```typescript
// /app/api/[endpoint]/route.ts

export const dynamic = 'force-dynamic'  // Si utilise headers/params

export async function GET(request: NextRequest) {
  try {
    // 1. Extraction params/query
    const { searchParams } = new URL(request.url)
    const param = searchParams.get('param')
    
    // 2. Vérification auth si route protégée
    const admin = await verifyToken(request)
    if (!admin) return unauthorized()
    
    // 3. Validation
    if (!param) return badRequest('Param requis')
    
    // 4. Logique métier
    const data = await supabase...
    
    // 5. Réponse
    return NextResponse.json({ data }, { status: 200 })
    
  } catch (error) {
    console.error('Erreur:', error)
    return serverError()
  }
}

export async function POST(request: NextRequest) {
  // Structure similaire
}
```

---

## 💾 Modèle de Données

### Schéma Supabase

```sql
-- Rendez-vous
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  location VARCHAR(50) NOT NULL CHECK (location IN ('clichy', 'colombes')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  test_type VARCHAR(100),
  duration INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créneaux disponibles
CREATE TABLE available_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Administrateurs
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Journal d'activité
CREATE TABLE admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Index Importants

```sql
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_location ON appointments(location);
CREATE INDEX idx_appointments_email ON appointments(email);
CREATE INDEX idx_available_slots_date ON available_slots(date, location);
CREATE INDEX idx_admin_activity_created ON admin_activity_log(created_at);
```

---

## 🔐 Sécurité

### Authentification Admin

**Mécanisme** : JWT (JSON Web Tokens)

```typescript
// Génération token (login)
const token = jwt.sign(
  { adminId: admin.id, email: admin.email },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
)

// Vérification token (middleware)
export async function verifyToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1]
  if (!token) return null
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded
  } catch {
    return null
  }
}
```

### Hachage Mots de Passe

```typescript
import bcrypt from 'bcryptjs'

// Création hash
const hash = await bcrypt.hash(password, 10)  // 10 salt rounds

// Vérification
const isValid = await bcrypt.compare(password, hash)
```

### Validation Entrées

```typescript
// Exemple validation email
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Exemple validation téléphone
function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10
}
```

---

## 📧 Service Email

### Architecture

```
emailService.ts (orchestration)
    ├─→ emailTemplates.ts (templates HTML)
    └─→ Elastic Email API v2 (envoi)
```

### Flux d'Envoi

```typescript
async function sendEmail(to: string, template: string, variables: object) {
  // 1. Récupération template
  const emailTemplate = templates[template]
  
  // 2. Remplacement variables
  let html = emailTemplate.html
  Object.entries(variables).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value)
  })
  
  // 3. Préparation requête
  const formData = new FormData()
  formData.append('apikey', process.env.ELASTIC_EMAIL_API_KEY)
  formData.append('from', process.env.FROM_EMAIL)
  formData.append('to', to)
  formData.append('subject', emailTemplate.subject)
  formData.append('bodyHtml', html)
  
  // 4. Envoi via API
  const response = await fetch('https://api.elasticemail.com/v2/email/send', {
    method: 'POST',
    body: formData
  })
  
  // 5. Parsing réponse
  const result = await response.json()
  
  return {
    success: result.success,
    transactionId: result.data?.transactionid,
    messageId: result.data?.messageid
  }
}
```

---

## 🎨 Styling

### TailwindCSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',    // Bleu principal
        secondary: '#10b981',  // Vert secondaire
        danger: '#ef4444'      // Rouge danger
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
```

### Framer Motion Patterns

```typescript
// Variants réutilisables
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Utilisation
<motion.div variants={staggerContainer}>
  {items.map(item => (
    <motion.div key={item.id} variants={fadeInUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## ⚡ Performance

### Optimisations Appliquées

1. **Images** : `next/image` avec lazy loading
2. **Code splitting** : Routes automatiquement splitées
3. **Mémorisation** : `useMemo` pour composants lourds
4. **GPU** : `willChange` sur éléments animés
5. **CSS** : Purge TailwindCSS en production
6. **Fonts** : `next/font` pour optimisation

### Métriques Cibles

- First Contentful Paint < 1.8s
- Time to Interactive < 3.8s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

---

**Dernière mise à jour** : 2025-01-13  
**Version** : 1.0  
**Mainteneur** : Adel Loukal
