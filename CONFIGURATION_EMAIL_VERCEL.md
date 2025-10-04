# 📧 Configuration Email Resend pour Vercel

## 📋 Vue d'ensemble

Pour envoyer des emails depuis Vercel, vous devez :
1. Configurer votre domaine sur Resend
2. Ajouter les enregistrements DNS email sur OVH
3. Configurer les variables d'environnement sur Vercel

---

## 🔧 Étape 1 : Configurer Resend

### A. Créer/Se connecter au compte Resend

1. **Allez sur** : https://resend.com/login
2. **Connectez-vous** (ou créez un compte gratuit)

### B. Ajouter votre domaine

1. **Allez dans** : https://resend.com/domains
2. **Cliquez sur** : `Add Domain`
3. **Entrez** : `test-psychotechnique-permis.com`
4. **Cliquez sur** : `Add`

Resend va vous afficher **3 types d'enregistrements DNS à configurer** :

---

## 📝 Étape 2 : Configurer les DNS Email sur OVH

Retournez dans votre **Zone DNS OVH** et ajoutez ces enregistrements :

### 1️⃣ Enregistrement TXT (Vérification du domaine)

Resend vous donne un enregistrement comme :

```
Type  : TXT
Nom   : @ ou (vide)
Valeur: resend_verify=xxxxxxxxxxxxx
```

**Sur OVH** :
1. `Ajouter une entrée` → Type **TXT**
2. Sous-domaine : (laissez vide)
3. Valeur : Copiez la valeur fournie par Resend
4. Validez

### 2️⃣ Enregistrement TXT (DKIM - Signature email)

Resend vous donne un enregistrement comme :

```
Type  : TXT
Nom   : resend._domainkey
Valeur: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN... (une longue chaîne)
```

**Sur OVH** :
1. `Ajouter une entrée` → Type **TXT**
2. Sous-domaine : `resend._domainkey`
3. Valeur : Copiez la longue valeur DKIM fournie par Resend
4. Validez

### 3️⃣ Enregistrement MX (Optionnel - pour recevoir des emails)

⚠️ **ATTENTION** : Si vous avez déjà des emails OVH (ex: contact@test-psychotechnique-permis.com), **NE MODIFIEZ PAS** vos enregistrements MX existants !

Si vous n'utilisez PAS d'emails OVH et voulez recevoir avec Resend :

```
Type    : MX
Nom     : @ ou (vide)
Priorité: 10
Cible   : feedback-smtp.us-east-1.amazonses.com
```

**MAIS** : Si vous avez déjà des emails OVH → **IGNOREZ cette étape**

---

## ⏱️ Étape 3 : Attendre la vérification Resend

1. **Retournez sur Resend** : https://resend.com/domains
2. **Attendez** que le statut passe à **"Verified"** ✅ (5 min à 24h)
3. Vous pouvez cliquer sur **"Verify Records"** pour forcer la vérification

---

## 🔑 Étape 4 : Configurer les variables d'environnement sur Vercel

### A. Récupérer votre API Key Resend

1. **Sur Resend** : https://resend.com/api-keys
2. **Créez une nouvelle clé** (ou utilisez celle existante) : `re_DdhZzjoL_DWUXFDm8hq4dFBokVfSYgavT`
3. **Copiez-la**

### B. Ajouter les variables sur Vercel

1. **Allez sur Vercel** → Votre projet → **Settings** → **Environment Variables**
2. **Ajoutez ces 3 variables** :

#### Variable 1 : RESEND_API_KEY
```
Name : RESEND_API_KEY
Value: re_DdhZzjoL_DWUXFDm8hq4dFBokVfSYgavT
```
Environment : **Production**, **Preview**, **Development**

#### Variable 2 : FROM_EMAIL
```
Name : FROM_EMAIL
Value: contact@test-psychotechnique-permis.com
```
⚠️ **Doit utiliser votre domaine vérifié sur Resend !**

Environment : **Production**, **Preview**, **Development**

#### Variable 3 : ADMIN_EMAIL
```
Name : ADMIN_EMAIL
Value: f.sebti@outlook.com
```
Environment : **Production**, **Preview**, **Development**

### C. Variables complètes pour Vercel

Voici toutes les variables que vous devez avoir :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hzfpscgdyrqbplmhgwhi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA

# Resend Email
RESEND_API_KEY=re_DdhZzjoL_DWUXFDm8hq4dFBokVfSYgavT
FROM_EMAIL=contact@test-psychotechnique-permis.com
ADMIN_EMAIL=f.sebti@outlook.com

# App
NEXT_PUBLIC_APP_URL=https://test-psychotechnique-permis.com
NODE_ENV=production
```

---

## 🔄 Étape 5 : Redéployer sur Vercel

Après avoir ajouté les variables :

1. **Vercel** → **Deployments**
2. **Dernier déploiement** → `...` → **Redeploy**
3. Cochez **"Use existing Build Cache"**
4. Cliquez sur **Redeploy**

Cela charge les nouvelles variables d'environnement.

---

## ✅ Étape 6 : Tester l'envoi d'emails

### A. Via votre application

1. Allez sur : https://test-psychotechnique-permis.com/prendre-rendez-vous
2. Réservez un rendez-vous test
3. Vérifiez que vous recevez :
   - ✅ Email de confirmation au client
   - ✅ Email de notification à l'admin (f.sebti@outlook.com)

### B. Vérifier les logs sur Resend

1. **Allez sur** : https://resend.com/emails
2. Vous verrez tous les emails envoyés avec leur statut

---

## 🎯 Configuration DNS finale sur OVH

Votre Zone DNS doit contenir :

### DNS Vercel (déjà fait)
| Type | Sous-domaine | Cible |
|------|--------------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com. |

### DNS Resend (à ajouter)
| Type | Sous-domaine | Valeur |
|------|--------------|--------|
| TXT | @ | resend_verify=xxxxx... |
| TXT | resend._domainkey | p=MIGfMA0GCSq... |

### DNS Email OVH (à garder si vous les avez)
| Type | Sous-domaine | Cible |
|------|--------------|-------|
| MX | @ | mx0.mail.ovh.net (priorité 1) |
| MX | @ | mx1.mail.ovh.net (priorité 5) |
| ... | ... | ... |

---

## 🚨 Important : Emails OVH vs Resend

### Scénario 1 : Vous avez déjà des emails OVH

Si vous utilisez **contact@test-psychotechnique-permis.com** chez OVH :

- ✅ **Gardez vos MX OVH** pour recevoir
- ✅ **Ajoutez Resend** pour envoyer depuis l'application
- ✅ Les deux peuvent coexister sans problème

### Scénario 2 : Pas d'emails OVH

Si vous n'utilisez pas d'emails avec ce domaine :

- ✅ Ajoutez simplement les enregistrements Resend
- ✅ Utilisez `contact@test-psychotechnique-permis.com` dans votre app

---

## 📧 Types d'emails envoyés automatiquement

L'application envoie automatiquement :

| Email | Destinataire | Déclencheur |
|-------|--------------|-------------|
| **Confirmation** | Client | Après réservation |
| **Notification** | f.sebti@outlook.com | Nouvelle réservation |
| **Rappel 24h** | Client | 24h avant RDV |
| **Annulation** | Client | Annulation RDV |

---

## 🔍 Dépannage

### ❌ Emails ne partent pas

**Vérifiez** :
1. Domaine **"Verified"** sur Resend
2. `FROM_EMAIL` utilise le domaine vérifié
3. Variables d'environnement bien configurées sur Vercel
4. Application redéployée après ajout des variables
5. Logs Vercel : Deployments → Functions

### ❌ Domaine non vérifié sur Resend après 24h

**Solutions** :
1. Vérifiez les enregistrements DNS sur OVH
2. Utilisez : https://mxtoolbox.com/SuperTool.aspx
3. Cliquez sur "Verify Records" dans Resend
4. Attendez la propagation DNS complète

### ❌ Emails arrivent en spam

**Solutions** :
1. Vérifiez que DKIM est configuré (enregistrement TXT resend._domainkey)
2. Ajoutez un enregistrement SPF (TXT) :
   ```
   v=spf1 include:amazonses.com ~all
   ```
3. Ajoutez DMARC (optionnel) :
   ```
   Type : TXT
   Nom  : _dmarc
   Valeur: v=DMARC1; p=none; rua=mailto:f.sebti@outlook.com
   ```

---

## ✅ Checklist finale

- [ ] Compte Resend créé
- [ ] Domaine test-psychotechnique-permis.com ajouté sur Resend
- [ ] Enregistrements DNS email ajoutés sur OVH (TXT verification + DKIM)
- [ ] Domaine "Verified" ✅ sur Resend
- [ ] Variables RESEND_API_KEY, FROM_EMAIL, ADMIN_EMAIL sur Vercel
- [ ] Application redéployée sur Vercel
- [ ] Test de réservation effectué
- [ ] Email de confirmation reçu par le client
- [ ] Email de notification reçu par l'admin

---

## 📞 Ressources

- **Resend Dashboard** : https://resend.com/
- **Documentation Resend** : https://resend.com/docs
- **Test DNS** : https://mxtoolbox.com/
- **Vérification emails** : https://resend.com/emails

Vos emails fonctionneront automatiquement une fois Resend configuré ! 📧✨
