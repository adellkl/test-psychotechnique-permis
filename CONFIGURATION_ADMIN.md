# 🔐 Configuration des identifiants administrateur

## ✅ Modifications effectuées

1. **Supprimé** la section "Identifiants de test" de la page de connexion
2. **Sécurisé** l'authentification avec mot de passe stocké dans Supabase
3. **Créé** un script pour configurer vos identifiants

---

## 🚀 Configuration de vos identifiants

### Étape 1 : Exécuter le script de configuration

```bash
node setup-admin.js
```

Le script vous demandera :
- **Nom complet** : Votre nom (ex: "Farid Sebti")
- **Email** : Votre email de connexion (ex: "f.sebti@outlook.com")
- **Mot de passe** : Votre nouveau mot de passe sécurisé
- **Téléphone** : Optionnel

### Étape 2 : Vérifier dans Supabase

1. Allez sur : https://supabase.com/dashboard
2. Sélectionnez votre projet → **Table Editor** → Table **`admins`**
3. Vérifiez que votre compte est bien créé/mis à jour

---

## 🔒 Se connecter

1. Allez sur : **https://test-psychotechnique-permis.com/admin**
2. Utilisez votre **email** et **mot de passe** configurés

---

## 🔄 Modifier vos identifiants

Pour changer votre mot de passe ou email :

### Option 1 : Via le script
```bash
node setup-admin.js
```
Entrez le même email → le script mettra à jour vos informations

### Option 2 : Directement dans Supabase
1. Supabase Dashboard → Table **`admins`**
2. Cliquez sur la ligne de votre compte
3. Modifiez `password`, `email`, ou `full_name`
4. Sauvegardez

---

## ⚠️ Important - Déploiement sur Vercel

Une fois vos identifiants configurés localement :

1. **Poussez le code** sur votre dépôt Git :
   ```bash
   git add .
   git commit -m "Sécurisation authentification admin"
   git push origin main
   ```

2. **Vercel redéploiera automatiquement** votre site

3. **Les identifiants sont dans Supabase** (pas dans le code), donc ils fonctionneront automatiquement en production

---

## 🛡️ Sécurité

### Bonnes pratiques :

✅ **Utilisez un mot de passe fort** :
- Au moins 12 caractères
- Mélange de majuscules, minuscules, chiffres, symboles
- Exemple : `M0nP@ss2025!Secure`

✅ **Ne partagez jamais** vos identifiants

✅ **Changez régulièrement** votre mot de passe (tous les 3-6 mois)

❌ **N'utilisez pas** :
- `admin123`, `password`, `123456`
- Le même mot de passe que d'autres services
- Des mots du dictionnaire

---

## 📊 Structure de la table `admins`

Votre table Supabase doit avoir ces colonnes :

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Si la table n'existe pas, créez-la dans Supabase SQL Editor.

---

## 🧪 Test de connexion

Après configuration :

1. Allez sur : https://test-psychotechnique-permis.com/admin
2. Entrez votre email et mot de passe
3. Vous devriez être redirigé vers `/admin/dashboard`

Si erreur :
- Vérifiez que l'email et mot de passe sont corrects
- Vérifiez dans Supabase que le compte existe
- Vérifiez les logs dans la console du navigateur (F12)

---

## 🔍 Dépannage

### ❌ "Email ou mot de passe incorrect"

**Causes possibles** :
1. Email mal saisi (vérifiez les majuscules/minuscules)
2. Mot de passe incorrect
3. Compte admin non créé dans Supabase

**Solution** : Ré-exécutez `node setup-admin.js`

### ❌ Le script ne fonctionne pas

**Vérifiez** :
1. Fichier `.env.local` existe avec les variables Supabase
2. Package `@supabase/supabase-js` installé : `npm install`
3. Connexion internet active

### ❌ Impossible de se connecter après déploiement

**Cause** : Les identifiants sont en local uniquement

**Solution** : 
- Les identifiants sont dans Supabase (cloud)
- Ils fonctionnent automatiquement en production
- Pas besoin de configuration supplémentaire sur Vercel

---

## 📞 Support

Si vous avez besoin d'aide :
1. Vérifiez les logs Supabase
2. Consultez les logs Vercel (Deployments → Functions)
3. Vérifiez la console navigateur (F12)

Votre authentification est maintenant sécurisée ! 🔒✨
