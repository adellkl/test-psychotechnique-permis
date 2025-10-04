# Configuration Email Production - Resend

## 🚀 Guide pour déployer l'application avec emails fonctionnels

### Problème actuel
Resend en mode test ne permet d'envoyer des emails qu'à votre propre adresse email vérifiée. Pour envoyer à tous vos clients, vous devez **vérifier un domaine**.

---

## ✅ Étape 1: Vérifier un domaine sur Resend

### Option A: Utiliser votre domaine principal (recommandé)
Si vous avez `test-psychotechnique-permis.com`:

1. **Connectez-vous à Resend**: https://resend.com/domains
2. **Ajoutez votre domaine**: `test-psychotechnique-permis.com`
3. **Ajoutez les enregistrements DNS** fournis par Resend:
   - Type: `TXT`
   - Nom: `_resend` (ou selon instructions)
   - Valeur: (fournie par Resend)
   
   - Type: `MX`
   - Priorité: `10`
   - Valeur: (fournie par Resend)
   
   - Type: `CNAME` (pour DKIM)
   - Nom: (fourni par Resend)
   - Valeur: (fournie par Resend)

4. **Attendez la vérification** (peut prendre quelques minutes à quelques heures)
5. **Statut vérifié** ✅ → Vous pouvez envoyer des emails

### Option B: Utiliser un sous-domaine
Si vous voulez séparer les emails de réservation:

- Domaine: `reservations.test-psychotechnique-permis.com`
- Même processus que l'option A

---

## 📝 Étape 2: Configurer les variables d'environnement

Une fois votre domaine vérifié, mettez à jour votre fichier `.env.production`:

```env
# Resend Configuration
RESEND_API_KEY=re_votre_clé_api_resend
FROM_EMAIL=contact@test-psychotechnique-permis.com
ADMIN_EMAIL=adelloukal2@gmail.com

# App URL
NEXT_PUBLIC_APP_URL=https://test-psychotechnique-permis.com
```

**Remplacez:**
- `FROM_EMAIL`: utilisez votre domaine vérifié (ex: `noreply@test-psychotechnique-permis.com`)
- `ADMIN_EMAIL`: l'email où vous recevrez les notifications admin

---

## 🔧 Étape 3: Configurer Vercel/Netlify (déploiement)

### Sur Vercel:
1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez chaque variable:
   - `RESEND_API_KEY`
   - `FROM_EMAIL`
   - `ADMIN_EMAIL`
   - `NEXT_PUBLIC_APP_URL`

### Sur Netlify:
1. **Site settings** → **Environment variables**
2. Même processus

---

## 🎯 Étape 4: Recommandations d'adresses email

### Adresse FROM (expéditeur)
Bonnes pratiques:
- ✅ `noreply@test-psychotechnique-permis.com` (pas de réponse)
- ✅ `reservations@test-psychotechnique-permis.com` (si vous gérez les réponses)
- ✅ `contact@test-psychotechnique-permis.com`
- ❌ `info@gmail.com` (non autorisé)

### Adresse Admin (notifications)
- `adelloukal2@gmail.com` (votre email personnel)

---

## 📊 Étape 5: Tester en production

Une fois déployé:

1. **Créez un rendez-vous de test** avec un vrai email client
2. **Vérifiez que l'email arrive** chez le client
3. **Vérifiez la notification admin** sur votre email

---

## 🛠️ Dépannage

### "You can only send testing emails..."
→ Votre domaine n'est pas encore vérifié. Vérifiez les DNS.

### "Invalid from address"
→ Utilisez une adresse avec votre domaine vérifié.

### Les emails n'arrivent pas
1. Vérifiez les **spam/courrier indésirable**
2. Consultez les **logs Resend**: https://resend.com/emails
3. Vérifiez les variables d'environnement sur Vercel/Netlify

---

## 📞 Besoin d'aide?

- Documentation Resend: https://resend.com/docs
- Support Resend: https://resend.com/support
- Vérification DNS: https://mxtoolbox.com/
