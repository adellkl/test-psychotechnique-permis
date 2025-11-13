# 🔌 API ENDPOINTS - Documentation Complète

## 📍 Base URL

**Développement** : `http://localhost:3000`  
**Production** : `https://test-psychotechnique-permis.com`

---

## 📅 APPOINTMENTS - Gestion des Rendez-vous

### GET `/api/appointments`

Récupère tous les rendez-vous avec filtres optionnels.

**Headers** : Aucun requis

**Query Parameters** :
```typescript
{
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  location?: 'clichy' | 'colombes'
  date?: string (format: YYYY-MM-DD)
  limit?: number
  offset?: number
}
```

**Réponse Success (200)** :
```json
{
  "appointments": [
    {
      "id": "uuid",
      "first_name": "Jean",
      "last_name": "Dupont",
      "email": "jean.dupont@email.com",
      "phone": "0612345678",
      "appointment_date": "2025-01-20",
      "appointment_time": "14:00",
      "location": "clichy",
      "status": "confirmed",
      "test_type": "suspension",
      "duration": 60,
      "created_at": "2025-01-13T10:00:00Z"
    }
  ],
  "total": 1
}
```

**Réponse Error** :
```json
{
  "error": "Erreur lors de la récupération des rendez-vous"
}
```

---

### POST `/api/appointments`

Crée un nouveau rendez-vous et envoie les emails de confirmation.

**Headers** :
```
Content-Type: application/json
```

**Body** :
```json
{
  "first_name": "Jean",
  "last_name": "Dupont",
  "email": "jean.dupont@email.com",
  "phone": "0612345678",
  "appointment_date": "2025-01-20",
  "appointment_time": "14:00",
  "location": "clichy",
  "test_type": "suspension",
  "duration": 60
}
```

**Validation** :
- `first_name` : requis, string, min 2 caractères
- `last_name` : requis, string, min 2 caractères
- `email` : requis, format email valide
- `phone` : requis, format téléphone français (10 chiffres)
- `appointment_date` : requis, format YYYY-MM-DD, date future
- `appointment_time` : requis, format HH:MM
- `location` : requis, 'clichy' ou 'colombes'
- `test_type` : optionnel, string
- `duration` : optionnel, number (minutes)

**Réponse Success (201)** :
```json
{
  "success": true,
  "appointmentId": "uuid",
  "message": "Rendez-vous créé avec succès"
}
```

**Effets secondaires** :
1. Insertion dans table `appointments` avec status='pending'
2. Envoi email de confirmation au client
3. Envoi email de notification à l'admin (email configuré)

**Réponse Error (400)** :
```json
{
  "error": "Données invalides",
  "details": ["Email requis", "Date invalide"]
}
```

**Réponse Error (500)** :
```json
{
  "error": "Erreur lors de la création du rendez-vous"
}
```

---

### PATCH `/api/appointments/:id`

Met à jour un rendez-vous existant.

**Headers** :
```
Content-Type: application/json
```

**URL Parameters** :
- `id` : UUID du rendez-vous

**Body** (tous les champs optionnels) :
```json
{
  "status": "confirmed",
  "appointment_date": "2025-01-21",
  "appointment_time": "15:00",
  "location": "colombes"
}
```

**Réponse Success (200)** :
```json
{
  "success": true,
  "message": "Rendez-vous mis à jour"
}
```

---

### DELETE `/api/appointments/:id`

Supprime un rendez-vous.

**URL Parameters** :
- `id` : UUID du rendez-vous

**Réponse Success (200)** :
```json
{
  "success": true,
  "message": "Rendez-vous supprimé"
}
```

**Effets secondaires** :
- Suppression cascade des notifications liées

---

## 📆 AVAILABLE SLOTS - Créneaux Disponibles

### GET `/api/available-slots`

Récupère les créneaux disponibles avec filtres.

**⚠️ IMPORTANT** : Cette route utilise `export const dynamic = 'force-dynamic'`

**Query Parameters** :
```typescript
{
  location?: 'clichy' | 'colombes'
  date?: string (format: YYYY-MM-DD)
  start_date?: string
  end_date?: string
}
```

**Réponse Success (200)** :
```json
{
  "slots": [
    {
      "id": "uuid",
      "location": "clichy",
      "date": "2025-01-20",
      "start_time": "09:00",
      "end_time": "10:00",
      "is_available": true,
      "created_at": "2025-01-13T10:00:00Z"
    }
  ]
}
```

**⚠️ PROBLÈME CONNU** :
- Le tri SQL `.order('start_time')` peut causer une erreur 500 si des valeurs NULL existent
- **Solution implémentée** : Récupération de tous les slots, puis filtrage et tri en JavaScript

**Code de la solution** :
```typescript
// Récupérer tous les slots
const { data, error } = await supabase
  .from('available_slots')
  .select('*')

if (error) throw error

// Filtrer et trier en JavaScript
const slots = data
  .filter(s => s.is_available !== false)
  .filter(s => location ? s.location === location : true)
  .filter(s => date ? s.date === date : true)
  .sort((a, b) => {
    const timeA = a.start_time || a.time || ''
    const timeB = b.start_time || b.time || ''
    return timeA.localeCompare(timeB)
  })
```

---

### POST `/api/available-slots`

Crée un nouveau créneau disponible.

**Headers** :
```
Content-Type: application/json
```

**Body** :
```json
{
  "location": "clichy",
  "date": "2025-01-20",
  "start_time": "09:00",
  "end_time": "10:00",
  "is_available": true
}
```

**Validation** :
- `location` : requis, 'clichy' ou 'colombes'
- `date` : requis, format YYYY-MM-DD
- `start_time` : requis, format HH:MM
- `end_time` : requis, format HH:MM
- `is_available` : optionnel, boolean (default: true)

**Réponse Success (201)** :
```json
{
  "success": true,
  "slotId": "uuid",
  "message": "Créneau créé"
}
```

---

### PATCH `/api/available-slots/:id`

Met à jour un créneau (typiquement pour is_available).

**URL Parameters** :
- `id` : UUID du créneau

**Body** :
```json
{
  "is_available": false
}
```

**Réponse Success (200)** :
```json
{
  "success": true,
  "message": "Créneau mis à jour"
}
```

---

## 👤 ADMIN - Authentification et Gestion

### POST `/api/admin/login`

Authentifie un administrateur.

**Headers** :
```
Content-Type: application/json
```

**Body** :
```json
{
  "email": "admin@example.com",
  "password": "VotreMotDePasse"
}
```

**Validation** :
- `email` : requis, format email
- `password` : requis, min 8 caractères

**Processus** :
1. Recherche admin par email dans table `admins`
2. Vérification du hash avec bcrypt : `bcrypt.compare(password, admin.password_hash)`
3. Mise à jour de `last_login`
4. Log dans `admin_activity_log`

**⚠️ IMPORTANT** :
- La colonne BDD est `password_hash`, PAS `password`
- Hash bcrypt format : `$2a$10$...` ou `$2b$10$...`

**Réponse Success (200)** :
```json
{
  "success": true,
  "admin": {
    "id": "uuid",
    "email": "admin@example.com",
    "full_name": "Nom Admin",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

**Réponse Error (401)** :
```json
{
  "error": "Email ou mot de passe incorrect"
}
```

**Réponse Error (403)** :
```json
{
  "error": "Compte désactivé"
}
```

---

### GET `/api/admin/list`

Récupère la liste des administrateurs (pour la liste déroulante de connexion).

**Headers** : Aucun requis

**Réponse Success (200)** :
```json
{
  "admins": [
    {
      "id": "uuid",
      "email": "admin@example.com",
      "full_name": "Nom Admin",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST `/api/admin/register`

⚠️ **DÉSACTIVÉ** - Système d'inscription administrateur désactivé pour sécurité.

**Utiliser à la place** :
```bash
node reset-admin-account.js
```

---

## 🧹 ADMIN CLEANUP - Nettoyage des Rendez-vous

### GET `/api/admin/cleanup`

Prévisualise les rendez-vous qui seront supprimés selon les critères.

**Headers** :
```
Authorization: Bearer <token>
```

**Query Parameters** :
```typescript
{
  status: 'completed' | 'cancelled'
  olderThan: number  // Nombre de jours
}
```

**Exemple** :
```
GET /api/admin/cleanup?status=completed&olderThan=30
```

**Réponse Success (200)** :
```json
{
  "appointments": [
    {
      "id": "uuid",
      "first_name": "Jean",
      "last_name": "Dupont",
      "appointment_date": "2024-12-01",
      "status": "completed"
    }
  ],
  "count": 15
}
```

---

### DELETE `/api/admin/cleanup`

Supprime les rendez-vous selon les critères OU une liste d'IDs spécifiques.

**Headers** :
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Mode 1 : Suppression par critères (bulk)**
```json
{
  "status": "completed",
  "olderThan": 30
}
```

**Mode 2 : Suppression par IDs spécifiques**
```json
{
  "appointmentIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Validation** :
- Mode 1 : `status` ET `olderThan` requis
- Mode 2 : `appointmentIds` requis (array non vide)
- `olderThan` : minimum 1 jour

**Processus** :
1. Suppression des notifications liées (cascade)
2. Suppression des rendez-vous
3. Log de l'action dans `admin_activity_log`

**Réponse Success (200)** :
```json
{
  "success": true,
  "deleted": 15,
  "message": "15 rendez-vous supprimés"
}
```

**Effets secondaires** :
- Suppression cascade des entrées dans `notifications`
- Log détaillé dans `admin_activity_log` :
  ```json
  {
    "admin_id": "uuid",
    "action": "bulk_delete_appointments",
    "details": {
      "status": "completed",
      "olderThan": 30,
      "count": 15,
      "appointmentNames": ["Jean Dupont", "Marie Martin", ...]
    }
  }
  ```

---

## 📧 EMAILS - Service d'Email

### POST `/api/send-email`

Envoie un email personnalisé (utilisé par le modal SendEmailModal).

**Headers** :
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body** :
```json
{
  "appointmentId": "uuid",
  "emailType": "cancellation",
  "cancelReason": "Raison de l'annulation",
  "customMessage": "Message personnalisé optionnel"
}
```

**Types d'email** :
- `cancellation` : Email d'annulation
- `reminder` : Rappel de rendez-vous
- `custom` : Email personnalisé

**Processus** :
1. Récupération des détails du rendez-vous
2. Sélection du template email approprié
3. Remplacement des variables du template
4. Envoi via Elastic Email API
5. Log dans `notifications`

**Réponse Success (200)** :
```json
{
  "success": true,
  "messageId": "elastic_email_message_id",
  "message": "Email envoyé"
}
```

---

## 🔐 Sécurité des API

### Authentification

**Routes publiques** (pas d'auth requise) :
- `GET /api/appointments` (lecture seule)
- `POST /api/appointments` (création rendez-vous client)
- `GET /api/available-slots`
- `POST /api/admin/login`
- `GET /api/admin/list`

**Routes protégées** (token JWT requis) :
- `PATCH /api/appointments/:id`
- `DELETE /api/appointments/:id`
- `POST /api/available-slots`
- `PATCH /api/available-slots/:id`
- `GET /api/admin/cleanup`
- `DELETE /api/admin/cleanup`
- `POST /api/send-email`

### Headers Requis pour Routes Protégées

```typescript
{
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}
```

### Validation JWT

```typescript
import { verifyToken } from '@/lib/authMiddleware'

export async function DELETE(request: NextRequest) {
  const admin = await verifyToken(request)
  
  if (!admin) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    )
  }
  
  // Suite du code...
}
```

---

## 🐛 Gestion d'Erreurs

### Format Standard des Erreurs

```json
{
  "error": "Message d'erreur principal",
  "details": "Détails supplémentaires optionnels",
  "code": "ERROR_CODE"
}
```

### Codes HTTP Utilisés

- `200` : Succès (GET, PATCH, DELETE)
- `201` : Création réussie (POST)
- `400` : Requête invalide (validation échouée)
- `401` : Non authentifié
- `403` : Non autorisé (compte désactivé)
- `404` : Ressource non trouvée
- `500` : Erreur serveur

### Logging des Erreurs

Toutes les erreurs sont loggées :
```typescript
try {
  // Code
} catch (error) {
  console.error('Erreur détaillée:', error)
  
  // Log admin si action admin
  await logAdminActivity(adminId, 'error', {
    action: 'nom_action',
    error: error.message
  })
  
  return NextResponse.json(
    { error: 'Message utilisateur convivial' },
    { status: 500 }
  )
}
```

---

## 📊 Exemples d'Utilisation

### Créer un Rendez-vous (Client)

```typescript
const response = await fetch('/api/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '0612345678',
    appointment_date: '2025-01-20',
    appointment_time: '14:00',
    location: 'clichy',
    test_type: 'suspension',
    duration: 60
  })
})

const data = await response.json()

if (response.ok) {
  console.log('Rendez-vous créé:', data.appointmentId)
  // Emails envoyés automatiquement
} else {
  console.error('Erreur:', data.error)
}
```

### Connexion Admin

```typescript
const response = await fetch('/api/admin/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'VotreMotDePasse'
  })
})

const data = await response.json()

if (response.ok) {
  // Stocker le token
  localStorage.setItem('adminToken', data.token)
  // Rediriger vers dashboard
  router.push('/admin/dashboard')
} else {
  console.error('Connexion échouée:', data.error)
}
```

### Nettoyage Bulk des Rendez-vous

```typescript
// 1. Prévisualiser
const preview = await fetch(
  '/api/admin/cleanup?status=completed&olderThan=30',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
)

const { count } = await preview.json()
console.log(`${count} rendez-vous seront supprimés`)

// 2. Confirmer et supprimer
if (confirm(`Supprimer ${count} rendez-vous ?`)) {
  const response = await fetch('/api/admin/cleanup', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'completed',
      olderThan: 30
    })
  })
  
  const { deleted } = await response.json()
  console.log(`${deleted} rendez-vous supprimés`)
}
```

### Récupérer les Créneaux Disponibles

```typescript
const response = await fetch(
  '/api/available-slots?location=clichy&date=2025-01-20'
)

const { slots } = await response.json()

slots.forEach(slot => {
  console.log(`${slot.start_time} - ${slot.end_time}`)
})
```

---

## 🔄 Rate Limiting

**Actuellement** : Pas de rate limiting implémenté

**À Implémenter** :
- Connexion admin : 5 tentatives / 15 minutes
- Création rendez-vous : 3 / heure par IP
- APIs publiques : 100 requêtes / minute par IP

---

## 📝 Notes Techniques

### Transactions Supabase

Pour les opérations multi-tables :
```typescript
// Pas de support natif des transactions dans Supabase client
// Utiliser les cascades ou gérer manuellement

// Exemple : Suppression avec cleanup
const { error: notifError } = await supabase
  .from('notifications')
  .delete()
  .eq('appointment_id', appointmentId)

if (notifError) throw notifError

const { error: apptError } = await supabase
  .from('appointments')
  .delete()
  .eq('id', appointmentId)
```

### Performance

- Utiliser `.select('column1, column2')` au lieu de `.select('*')` quand possible
- Filtrer côté serveur quand possible, côté client sinon
- Paginer les résultats pour les grandes listes

### CORS

Configuré dans `next.config.js` :
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE' }
      ]
    }
  ]
}
```

---

**Dernière mise à jour** : 2025-01-13  
**Version** : 1.0  
**Contact** : Adel Loukal
