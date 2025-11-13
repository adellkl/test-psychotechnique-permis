# 🐛 TROUBLESHOOTING - Guide de Résolution des Problèmes

## 🎯 Index Rapide

- [Erreurs API](#erreurs-api)
- [Problèmes de Base de Données](#problèmes-de-base-de-données)
- [Problèmes d'Email](#problèmes-demail)
- [Erreurs de Build](#erreurs-de-build)
- [Problèmes d'Authentification](#problèmes-dauthentification)
- [Problèmes de Performance](#problèmes-de-performance)
- [Erreurs Supabase](#erreurs-supabase)

---

## 🔌 Erreurs API

### Erreur 500 sur `/api/available-slots`

**Symptômes** :
```
Error: Database error when fetching slots
Status: 500
```

**Cause** :
- Tri SQL sur la colonne `start_time` qui peut contenir des valeurs NULL
- Filtre `.eq('is_available', true)` qui peut causer des problèmes

**Solution Appliquée** :
```typescript
// ❌ Ne pas faire
const { data } = await supabase
  .from('available_slots')
  .select('*')
  .eq('is_available', true)
  .order('start_time')  // ⚠️ Erreur si NULL

// ✅ Solution
const { data } = await supabase
  .from('available_slots')
  .select('*')

// Filtrer et trier en JavaScript
const slots = data
  .filter(s => s.is_available !== false)
  .filter(s => location ? s.location === location : true)
  .sort((a, b) => {
    const timeA = a.start_time || a.time || ''
    const timeB = b.start_time || b.time || ''
    return timeA.localeCompare(timeB)
  })
```

**Fichier concerné** : `/app/api/available-slots/route.ts`

**Vérification** :
```bash
# Tester l'endpoint
curl http://localhost:3000/api/available-slots?location=clichy
```

---

### Erreur "Cannot find module './948.js'"

**Symptômes** :
```
Error: Cannot find module './948.js'
Module not found
```

**Cause** :
- Cache Next.js corrompu dans `.next/`
- Build incomplet ou interrompu

**Solution** :
```bash
# Supprimer le cache
rm -rf .next

# Nettoyer le cache npm
npm cache clean --force

# Rebuild
npm run build
```

**Si le problème persiste** :
```bash
# Réinstaller les dépendances
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

---

### Erreur "Dynamic server usage"

**Symptômes** :
```
Error: Dynamic server usage: Route /api/available-slots couldn't be rendered statically
because it used `headers` or `params`
```

**Cause** :
- Route API qui utilise `headers()`, `cookies()`, ou `searchParams`
- Next.js essaie de la rendre statiquement

**Solution** :
Ajouter au début du fichier de route :
```typescript
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // ...
}
```

**Fichiers concernés** :
- `/app/api/available-slots/route.ts`
- Toutes les routes API qui lisent des headers/params

---

## 💾 Problèmes de Base de Données

### Erreur "Infinite recursion detected in policy"

**Symptômes** :
```
Error: infinite recursion detected in policy for relation "admins"
```

**Cause** :
- Politiques RLS (Row Level Security) qui s'auto-référencent
- Utilisation de `auth.uid()` dans une politique qui vérifie la même table

**Solution Appliquée** :
```sql
-- ❌ Politique problématique
CREATE POLICY "Admins can read admins"
ON admins FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM admins  -- ⚠️ Récursion !
    WHERE id = auth.uid()
  )
);

-- ✅ Solution : Politique simplifiée
DROP POLICY IF EXISTS "Enable all for admins" ON admins;
CREATE POLICY "Enable all for admins" 
ON admins FOR ALL 
USING (true);  -- Sécurité gérée côté Next.js
```

**Fichier de correction** : `FIX-COMPLET-SUPABASE.sql`

**Commande** :
```bash
# Exécuter le script SQL dans Supabase Dashboard
# SQL Editor > New Query > Coller le contenu de FIX-COMPLET-SUPABASE.sql
```

---

### Erreur "Column password does not exist"

**Symptômes** :
```
Error: column "password" does not exist
Hint: Perhaps you meant to reference the column "admins.password_hash"
```

**Cause** :
- Code qui cherche la colonne `password`
- BDD utilise `password_hash`

**Solution** :
```typescript
// ❌ Code incorrect
const admin = await supabase
  .from('admins')
  .select('id, email, password')  // ⚠️ 'password' n'existe pas

// ✅ Code correct
const admin = await supabase
  .from('admins')
  .select('id, email, password_hash')  // ✓ Colonne correcte
```

**Vérification dans Supabase** :
```sql
-- Vérifier la structure de la table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'admins';

-- Résultat attendu :
-- password_hash | character varying
```

---

### Base de Données Non Accessible

**Symptômes** :
```
Error: Failed to connect to Supabase
Connection timeout
```

**Diagnostic** :
```bash
# Tester la connexion
node monitoring/check-database.js
```

**Vérifications** :
1. **URL correcte** dans `.env.local` :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://hzfpscgdyrqbplmhgwhi.supabase.co
   ```

2. **Anon Key valide** :
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Projet Supabase actif** :
   - Aller sur https://app.supabase.com
   - Vérifier que le projet n'est pas en pause

**Solution si projet en pause** :
- Dashboard Supabase > Settings > General
- Cliquer sur "Resume project"
- Attendre 1-2 minutes

---

## 📧 Problèmes d'Email

### Emails Non Envoyés

**Symptômes** :
- Rendez-vous créé mais pas d'email reçu
- Erreur silencieuse dans les logs

**Diagnostic** :
```bash
# Tester le service email
node test-send-email.js
```

**Vérifications** :

1. **API Key Elastic Email valide** :
   ```bash
   # Dans .env.local ou .env.production
   ELASTIC_EMAIL_API_KEY=B0D3C9F949F85DF5B9045463F6B4A04C1194929A06D05B8B972AAC0B14682CEFB03CA8FA79579D005F264103C6C92987
   ```

2. **From Email autorisé** :
   ```bash
   FROM_EMAIL=contact@test-psychotechnique-permis.com
   ```
   - Vérifier dans Elastic Email Dashboard > Manage Senders
   - L'email doit être vérifié ✓

3. **Compte pas en mode test** :
   - Si en mode test, emails limités à une seule adresse
   - Vérifier dans Elastic Email Dashboard > Settings

**Logs à vérifier** :
```typescript
// Dans la console serveur
console.log('Email envoyé:', {
  to: email,
  transactionId: result.TransactionID,
  messageId: result.MessageID
})
```

**Solution si erreur API** :
```bash
# Vérifier le statut du service
curl -X POST https://api.elasticemail.com/v2/email/send \
  -d "apikey=VOTRE_CLE" \
  -d "from=contact@test-psychotechnique-permis.com" \
  -d "to=test@email.com" \
  -d "subject=Test"
```

---

### Erreur "Sender not verified"

**Symptômes** :
```
Error: The sender address is not verified
```

**Solution** :
1. Aller sur Elastic Email Dashboard
2. Settings > Manage Senders
3. Ajouter l'adresse `contact@test-psychotechnique-permis.com`
4. Vérifier via le lien envoyé par email

**Pour un domaine personnalisé** :
- Settings > Domains
- Ajouter `test-psychotechnique-permis.com`
- Configurer DNS (SPF, DKIM)

---

### Templates Email Non Trouvés

**Symptômes** :
```
Error: Template not found in Elastic Email
```

**Vérification** :
- Elastic Email Dashboard > Templates
- Vérifier présence de :
  - `appointment_confirmation_client`
  - `appointment_notification_admin`

**Solution** :
Les templates sont gérés dans le code (`lib/emailTemplates.ts`), pas dans Elastic Email.

Si besoin de recréer :
```typescript
// lib/emailTemplates.ts
export const templates = {
  appointment_confirmation_client: {
    subject: 'Confirmation de votre rendez-vous',
    html: `...`
  }
}
```

---

## 🔨 Erreurs de Build

### Erreur "optimizeCss" avec Critters

**Symptômes** :
```
Error: critters failed to optimize CSS
```

**Solution** :
Désactiver l'optimisation CSS dans `next.config.js` :
```javascript
module.exports = {
  experimental: {
    optimizeCss: false  // Désactiver si problèmes avec critters
  }
}
```

---

### Erreur "metadataBase is required"

**Symptômes** :
```
Warning: metadataBase is required for Open Graph images
```

**Solution** :
Ajouter dans `app/layout.tsx` :
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://test-psychotechnique-permis.com'),
  // ...
}
```

---

### Erreur Images Unsplash

**Symptômes** :
```
Error: Invalid src prop (images.unsplash.com)
Hostname not configured under images in next.config.js
```

**Solution** :
Ajouter dans `next.config.js` :
```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
}
```

---

## 🔐 Problèmes d'Authentification

### Connexion Admin Échoue

**Symptômes** :
```
Error: Email ou mot de passe incorrect
```

**Diagnostic** :

1. **Vérifier l'email exact** :
   ```bash
   node check-all-admins.js
   ```

2. **Vérifier la colonne BDD** :
   ```sql
   SELECT email, password_hash 
   FROM admins 
   WHERE email = '[votre-email-admin]';
   ```
   - Doit retourner un hash bcrypt : `$2a$10$...`

3. **Tester le hash bcrypt** :
   ```javascript
   const bcrypt = require('bcryptjs')
   
   const hash = '[Hash depuis la BDD]'
   const password = '[Mot de passe à tester]'
   
   bcrypt.compare(password, hash).then(result => {
     console.log('Hash valide:', result)  // Doit être true
   })
   ```

**Solution si hash invalide** :
```bash
# Recréer le compte admin
node reset-admin-account.js
```

**Solution si colonne incorrecte** :
```sql
-- Vérifier que la colonne s'appelle password_hash
ALTER TABLE admins ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Si colonne password existe, copier vers password_hash
UPDATE admins SET password_hash = password WHERE password_hash IS NULL;
```

---

### Token JWT Expiré

**Symptômes** :
```
Error: Token expired
Status: 401
```

**Solution** :
```typescript
// Côté client : Supprimer le token et redemander connexion
localStorage.removeItem('adminToken')
router.push('/admin')

// Côté serveur : Augmenter la durée d'expiration
import jwt from 'jsonwebtoken'

const token = jwt.sign(
  { adminId: admin.id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }  // 7 jours au lieu de 24h
)
```

---

### Compte Admin Désactivé

**Symptômes** :
```
Error: Compte désactivé
Status: 403
```

**Solution** :
```sql
-- Réactiver le compte
UPDATE admins 
SET is_active = true 
WHERE email = 'sebtifatiha@live.fr';
```

---

## ⚡ Problèmes de Performance

### Animations Lentes / Saccadées

**Symptômes** :
- Transitions lentes au chargement de page
- Animations qui lag
- CPU élevé

**Solutions** :

1. **Ajouter willChange pour GPU** :
   ```typescript
   <motion.div
     style={{ willChange: 'opacity, transform' }}
     animate={{ opacity: 1, y: 0 }}
   >
   ```

2. **Mémoriser les composants lourds** :
   ```typescript
   const memoizedBubbles = useMemo(() => (
     <Bubbles count={5} />
   ), [])
   ```

3. **Réduire le nombre d'éléments animés** :
   ```typescript
   // ❌ Trop d'éléments
   {Array.from({ length: 20 }).map((_, i) => <AnimatedBubble />)}
   
   // ✅ Nombre réduit
   {Array.from({ length: 5 }).map((_, i) => <AnimatedBubble />)}
   ```

4. **Support prefers-reduced-motion** :
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

**Fichiers concernés** :
- `components/ModernHero.tsx`
- `components/PageTransition.tsx`
- `components/Navigation.tsx`

---

### Temps de Chargement Long

**Diagnostic** :
```bash
npm run build
npm start

# Analyser le bundle
npm run analyze  # Si configuré
```

**Solutions** :

1. **Code splitting** :
   ```typescript
   import dynamic from 'next/dynamic'
   
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     ssr: false,
     loading: () => <Spinner />
   })
   ```

2. **Images optimisées** :
   ```typescript
   import Image from 'next/image'
   
   <Image
     src="/photo.jpg"
     width={800}
     height={600}
     priority={false}  // Pas de chargement prioritaire si below the fold
     loading="lazy"
   />
   ```

3. **Requêtes optimisées** :
   ```typescript
   // ❌ Récupère toutes les colonnes
   .select('*')
   
   // ✅ Sélectionne uniquement ce qui est nécessaire
   .select('id, first_name, last_name, email, appointment_date')
   ```

---

## 🔍 Erreurs Supabase

### Erreur CORS

**Symptômes** :
```
Access to fetch at 'https://...supabase.co' has been blocked by CORS policy
```

**Solution** :
- Vérifier URL autorisées dans Supabase Dashboard
- Settings > API > URL Configuration
- Ajouter `http://localhost:3000` pour dev
- Ajouter `https://test-psychotechnique-permis.com` pour prod

---

### Erreur "Row Level Security"

**Symptômes** :
```
Error: new row violates row-level security policy
```

**Solution** :
```sql
-- Vérifier les politiques RLS
SELECT * FROM pg_policies WHERE tablename = 'appointments';

-- Option 1 : Désactiver RLS temporairement (dev uniquement)
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- Option 2 : Créer une politique permissive
CREATE POLICY "Enable all for service role"
ON appointments FOR ALL
USING (true);
```

---

### Erreur "Function search_path is mutable"

**Symptômes** :
```
Error: function ... search_path is mutable
Security: Functions should have immutable search_path
```

**Solution** :
```sql
-- Corriger toutes les fonctions
ALTER FUNCTION function_name() SET search_path = public, pg_temp;

-- Ou recréer avec le bon search_path
CREATE OR REPLACE FUNCTION function_name()
RETURNS ...
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- ...
END;
$$;
```

---

## 🛠️ Outils de Diagnostic

### Scripts de Monitoring

```bash
# Santé globale de l'application
node monitoring/check-app-health.js

# État de la base de données
node monitoring/check-database.js

# Service d'email
node monitoring/check-email-service.js

# Vérifier les créneaux Colombes
node check-colombes-slots.mjs
```

### Logs à Vérifier

**Console serveur (terminal)** :
```bash
npm run dev
# Observer les logs en temps réel
```

**Logs Supabase** :
- Dashboard > Logs > API Logs
- Filtrer par niveau (Error, Warning)

**Logs Elastic Email** :
- Dashboard > Reports > Email Log
- Vérifier statut de délivrance

### Tests Manuels

```bash
# Test endpoint appointments
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@email.com"}'

# Test connexion admin
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"VotreMotDePasse"}'

# Test créneaux disponibles
curl http://localhost:3000/api/available-slots?location=clichy
```

---

## 🚨 Procédure d'Urgence

### Site Down en Production

1. **Vérifier le serveur** :
   ```bash
   curl https://test-psychotechnique-permis.com
   ```

2. **Vérifier Supabase** :
   - app.supabase.com > Project Status
   - Vérifier si projet en pause

3. **Rollback si nécessaire** :
   ```bash
   git log --oneline  # Trouver le dernier commit stable
   git revert HEAD    # Annuler le dernier commit
   git push origin main
   ```

4. **Contacter le support** :
   - Hébergeur (si problème serveur)
   - Supabase (si problème BDD)
   - Elastic Email (si problème emails)

---

### Base de Données Corrompue

1. **Backup immédiat** :
   - Supabase Dashboard > Database > Backups
   - Créer un backup manuel

2. **Restaurer depuis backup** :
   - Sélectionner le dernier backup stable
   - Restore

3. **Vérifier l'intégrité** :
   ```sql
   SELECT COUNT(*) FROM appointments;
   SELECT COUNT(*) FROM admins;
   SELECT COUNT(*) FROM available_slots;
   ```

---

## 📞 Support

### Contacts Techniques

- **Développeur** : Adel Loukal
- **Admin Principal** : sebtifatiha@live.fr
- **Support Supabase** : https://supabase.com/support
- **Support Elastic Email** : support@elasticemail.com

### Documentation Externe

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Elastic Email API](https://elasticemail.com/developers/api-documentation)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

**Dernière mise à jour** : 2025-01-13  
**Version** : 1.0  
**Mainteneur** : Adel Loukal
