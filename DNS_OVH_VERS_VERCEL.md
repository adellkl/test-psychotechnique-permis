# 🔄 Configuration DNS OVH vers Vercel

## 📋 Vue d'ensemble

Ce guide vous permet de rediriger votre domaine **test-psychotechnique-permis.com** depuis votre ancien site OVH vers votre nouvelle application Vercel.

---

## ⚠️ IMPORTANT - Avant de commencer

1. **Déployez d'abord votre application sur Vercel** (suivez le [VERCEL_DEPLOY_GUIDE.md](./VERCEL_DEPLOY_GUIDE.md))
2. **Configurez toutes les variables d'environnement** sur Vercel
3. **Testez l'application** sur l'URL temporaire Vercel (ex: `votre-app.vercel.app`)
4. **Une fois validé**, procédez à la configuration DNS ci-dessous

---

## 🎯 Étape 1 : Ajouter le domaine sur Vercel

1. **Connectez-vous à Vercel** : https://vercel.com
2. **Allez dans votre projet** → **Settings** → **Domains**
3. **Cliquez sur "Add"**
4. **Entrez** : `test-psychotechnique-permis.com`
5. **Cliquez sur "Add"**

Vercel va vous afficher les enregistrements DNS à configurer. **Notez-les** !

---

## 🔧 Étape 2 : Configurer les DNS sur OVH

### A. Se connecter à l'espace client OVH

1. **Allez sur** : https://www.ovh.com/auth/
2. **Connectez-vous** avec vos identifiants
3. **Allez dans** : `Web Cloud` → `Noms de domaine`
4. **Sélectionnez** : `test-psychotechnique-permis.com`
5. **Cliquez sur l'onglet** : `Zone DNS`

### B. Supprimer les anciens enregistrements A et CNAME

⚠️ **IMPORTANT** : Avant d'ajouter les nouveaux, supprimez les anciens !

1. **Recherchez les enregistrements** de type **A** pointant vers l'ancien serveur
   - Cliquez sur l'icône **poubelle** 🗑️ pour chaque enregistrement A existant
   
2. **Recherchez les enregistrements** de type **CNAME** pour `www`
   - Supprimez l'ancien enregistrement CNAME pour `www`

### C. Ajouter les nouveaux enregistrements Vercel

#### 1️⃣ Enregistrement A (pour le domaine principal)

1. **Cliquez sur** : `Ajouter une entrée`
2. **Sélectionnez** : `A`
3. **Configurez** :
   ```
   Sous-domaine : (laissez vide ou mettez "@")
   TTL         : 300 (ou par défaut)
   Cible       : 76.76.21.21
   ```
4. **Cliquez sur** : `Suivant` puis `Valider`

#### 2️⃣ Enregistrement CNAME (pour www)

1. **Cliquez sur** : `Ajouter une entrée`
2. **Sélectionnez** : `CNAME`
3. **Configurez** :
   ```
   Sous-domaine : www
   TTL         : 300
   Cible       : cname.vercel-dns.com.
   ```
   ⚠️ **Important** : N'oubliez pas le point `.` à la fin !
   
4. **Cliquez sur** : `Suivant` puis `Valider`

### D. Configuration finale

Votre zone DNS OVH doit maintenant contenir :

| Type  | Sous-domaine | Cible                   |
|-------|--------------|-------------------------|
| A     | @            | 76.76.21.21            |
| CNAME | www          | cname.vercel-dns.com.  |

---

## ⏱️ Étape 3 : Attendre la propagation DNS

- **Délai** : 15 minutes à 24 heures (généralement ~1 heure)
- **Vérifier la propagation** : https://dnschecker.org/
  - Entrez `test-psychotechnique-permis.com`
  - Vérifiez que l'IP affichée est `76.76.21.21`

---

## ✅ Étape 4 : Vérifier sur Vercel

1. **Retournez sur Vercel** → Votre projet → **Settings** → **Domains**
2. **Attendez que** le domaine affiche **"Valid Configuration"** ✅
3. **Vercel configurera automatiquement HTTPS** (certificat SSL gratuit)

---

## 🧪 Étape 5 : Tester votre nouveau site

Une fois la propagation terminée :

1. **Visitez** : https://test-psychotechnique-permis.com
2. **Vérifiez** :
   - ✅ Le site charge correctement
   - ✅ HTTPS est activé (cadenas dans le navigateur)
   - ✅ La prise de rendez-vous fonctionne
   - ✅ Les emails sont envoyés
   - ✅ Le dashboard admin est accessible

---

## 🔍 Dépannage

### ❌ Le site affiche toujours l'ancien contenu

**Solutions** :
1. Videz le cache de votre navigateur (Ctrl+Shift+R ou Cmd+Shift+R)
2. Testez en navigation privée
3. Vérifiez la propagation DNS : https://dnschecker.org/
4. Attendez encore quelques heures

### ❌ Erreur "DNS_PROBE_FINISHED_NXDOMAIN"

**Solutions** :
1. Vérifiez que les enregistrements DNS sont bien configurés sur OVH
2. Attendez la propagation (jusqu'à 24h)
3. Videz le cache DNS de votre ordinateur :
   ```bash
   # Mac
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Windows
   ipconfig /flushdns
   ```

### ❌ "Invalid Configuration" sur Vercel

**Solutions** :
1. Vérifiez que l'enregistrement A pointe vers `76.76.21.21`
2. Vérifiez que le CNAME a bien le point final `.`
3. Attendez la propagation DNS

### ❌ HTTPS ne fonctionne pas

**Solutions** :
- Attendez quelques minutes après que le domaine soit validé
- Vercel génère automatiquement le certificat SSL
- Si après 1h ça ne fonctionne pas, contactez le support Vercel

---

## 📊 Vérification des DNS en ligne de commande

### Vérifier l'enregistrement A :
```bash
dig test-psychotechnique-permis.com A +short
# Devrait afficher : 76.76.21.21
```

### Vérifier l'enregistrement CNAME :
```bash
dig www.test-psychotechnique-permis.com CNAME +short
# Devrait afficher : cname.vercel-dns.com.
```

---

## 📧 Configuration Email (important !)

⚠️ **ATTENTION** : Si vous utilisez des emails avec votre domaine OVH (ex: contact@test-psychotechnique-permis.com), **NE SUPPRIMEZ PAS** les enregistrements MX !

Les enregistrements MX, TXT (SPF, DKIM) doivent rester intacts pour que vos emails continuent de fonctionner.

**Configuration Resend** :
- Pour envoyer des emails depuis Vercel, configurez Resend (voir [VERCEL_DEPLOY_GUIDE.md](./VERCEL_DEPLOY_GUIDE.md))
- Ajoutez les enregistrements DNS de Resend **EN PLUS** des enregistrements Vercel
- Les deux peuvent coexister sans problème

---

## 🎯 Checklist finale

Avant de changer les DNS, assurez-vous que :

- [ ] ✅ L'application est déployée et fonctionne sur Vercel (testée sur l'URL `.vercel.app`)
- [ ] ✅ Toutes les variables d'environnement sont configurées sur Vercel
- [ ] ✅ Les tests de réservation fonctionnent sur l'URL Vercel
- [ ] ✅ Les emails sont envoyés correctement (testés)
- [ ] ✅ Le dashboard admin est accessible et fonctionnel

Après le changement DNS :

- [ ] ✅ Enregistrement A configuré : `76.76.21.21`
- [ ] ✅ Enregistrement CNAME configuré : `cname.vercel-dns.com.`
- [ ] ✅ Propagation DNS vérifiée sur dnschecker.org
- [ ] ✅ Domaine validé sur Vercel
- [ ] ✅ HTTPS activé automatiquement
- [ ] ✅ Site accessible sur test-psychotechnique-permis.com
- [ ] ✅ Tous les tests fonctionnels passés

---

## 📞 Ressources utiles

- **Vérification DNS** : https://dnschecker.org/
- **Interface OVH** : https://www.ovh.com/manager/
- **Interface Vercel** : https://vercel.com/dashboard
- **Documentation OVH DNS** : https://docs.ovh.com/fr/domains/editer-ma-zone-dns/
- **Documentation Vercel Domains** : https://vercel.com/docs/concepts/projects/domains

---

## 💡 Astuce Pro

Pour éviter toute interruption de service :

1. **Testez d'abord** tout sur l'URL Vercel temporaire
2. **Faites le changement DNS** en dehors des heures de pointe (la nuit)
3. **Gardez** un onglet avec l'ancien site ouvert avant de changer
4. **Surveillez** la propagation avec dnschecker.org
5. **Testez** immédiatement après que la propagation soit confirmée

Bonne migration ! 🚀
