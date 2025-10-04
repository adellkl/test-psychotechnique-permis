# 🚀 Guide de déploiement sur Vercel

## Étape 1: Vérifier votre domaine sur Resend

Avant de déployer, vous devez vérifier un domaine sur Resend:

1. **Connectez-vous à Resend**: https://resend.com/login
2. **Allez dans "Domains"**: https://resend.com/domains
3. **Cliquez sur "Add Domain"**
4. **Entrez votre domaine**: `test-psychotechnique-permis.com`
5. **Copiez les enregistrements DNS** fournis par Resend
6. **Ajoutez-les chez votre hébergeur de domaine** (OVH, Gandi, etc.)
   - Enregistrement TXT (pour vérification)
   - Enregistrements MX (pour recevoir)
   - Enregistrement CNAME (pour DKIM)
7. **Attendez la vérification** (quelques minutes à 24h)
8. **Statut = "Verified" ✅** → Vous pouvez continuer

---

## Étape 2: Déployer sur Vercel

### A. Via l'interface Vercel (recommandé)

1. **Connectez-vous à Vercel**: https://vercel.com
2. **Cliquez sur "Add New..."** → **Project**
3. **Importez votre repository Git** (GitHub/GitLab/Bitbucket)
4. **Configurez le projet**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (racine)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### B. Via la CLI Vercel (alternatif)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

---

## Étape 3: Configurer les variables d'environnement

### Dans l'interface Vercel:

1. **Allez dans votre projet** → **Settings** → **Environment Variables**
2. **Ajoutez chaque variable** (cliquez sur "Add New"):

#### Variables Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
```

#### Variables Resend (Email):
```
RESEND_API_KEY=re_votre_clé_api_resend
FROM_EMAIL=contact@test-psychotechnique-permis.com
ADMIN_EMAIL=adelloukal2@gmail.com
```

#### Variables App:
```
NEXT_PUBLIC_APP_URL=https://test-psychotechnique-permis.com
NODE_ENV=production
```

3. **Environment**: Sélectionnez **Production**, **Preview**, et **Development**
4. **Cliquez sur "Save"** pour chaque variable

---

## Étape 4: Configurer votre domaine personnalisé

1. **Dans votre projet Vercel** → **Settings** → **Domains**
2. **Cliquez sur "Add"**
3. **Entrez votre domaine**: `test-psychotechnique-permis.com`
4. **Configurez les DNS** chez votre registrar:
   - Type: **A** → Valeur: `76.76.21.21`
   - Type: **CNAME** → Nom: `www` → Valeur: `cname.vercel-dns.com`
5. **Attendez la propagation DNS** (quelques minutes)
6. **Vercel configure automatiquement HTTPS** ✅

---

## Étape 5: Redéployer après configuration

1. **Allez dans "Deployments"**
2. **Cliquez sur les "..." du dernier déploiement**
3. **Sélectionnez "Redeploy"**
4. **Cochez "Use existing Build Cache"**
5. **Cliquez sur "Redeploy"**

Cela recharge les nouvelles variables d'environnement.

---

## Étape 6: Tester votre application

### Tests à effectuer:

1. ✅ **Homepage charge**: https://test-psychotechnique-permis.com
2. ✅ **Prise de rendez-vous fonctionne**
3. ✅ **Email de confirmation arrive au client**
4. ✅ **Email de notification arrive à l'admin**
5. ✅ **Dashboard admin accessible**: `/admin`
6. ✅ **Créneaux affichés correctement**

---

## 🔍 Dépannage

### Build Failed
- Vérifiez les logs dans Vercel
- Vérifiez que toutes les dépendances sont dans `package.json`
- Essayez: `npm install` puis `npm run build` localement

### Variables d'environnement non chargées
- Redéployez après avoir ajouté les variables
- Vérifiez qu'elles sont bien dans "Production"

### Emails ne partent pas
- Vérifiez que votre domaine est **vérifié** sur Resend
- Vérifiez `FROM_EMAIL` utilise le domaine vérifié
- Consultez les logs: https://resend.com/emails

### Erreur 500 au runtime
- Vérifiez les variables Supabase
- Vérifiez les logs: Vercel → Deployments → Votre deploy → "Functions"

---

## 📊 Monitoring

### Logs en temps réel:
```bash
vercel logs --follow
```

### Ou dans l'interface:
- Vercel Dashboard → Votre projet → **Deployments** → Cliquez sur un deploy → **Functions** (logs)

---

## 🎯 Checklist finale

- [ ] Domaine vérifié sur Resend ✅
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Application déployée sur Vercel
- [ ] Domaine personnalisé configuré
- [ ] HTTPS activé automatiquement
- [ ] Tests de réservation effectués
- [ ] Emails reçus par les clients
- [ ] Dashboard admin fonctionnel

---

## 📞 Ressources

- Documentation Vercel: https://vercel.com/docs
- Documentation Resend: https://resend.com/docs
- Support Vercel: https://vercel.com/support
- Vérification DNS: https://dnschecker.org/
