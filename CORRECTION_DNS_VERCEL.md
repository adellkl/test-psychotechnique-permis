# 🔧 Correction DNS - Invalid Configuration Vercel

## ❌ Erreur actuelle

Vercel affiche "Invalid Configuration" pour :
- `test-psychotechnique-permis.com`
- `www.test-psychotechnique-permis.com`

## ✅ Solution étape par étape

### 1️⃣ Vérifier la configuration DNS actuelle

Ouvrez un terminal et exécutez :

```bash
# Vérifier le domaine principal
dig test-psychotechnique-permis.com A +short

# Vérifier le sous-domaine www
dig www.test-psychotechnique-permis.com CNAME +short
```

**Ce que vous DEVEZ obtenir** :
- Pour le domaine principal : `76.76.21.21`
- Pour www : `cname.vercel-dns.com.`

---

### 2️⃣ Configurer les DNS sur OVH (étapes détaillées)

#### A. Se connecter à OVH

1. **Allez sur** : https://www.ovh.com/manager/
2. **Connectez-vous**
3. **Menu gauche** → `Web Cloud` → `Noms de domaine`
4. **Cliquez sur** : `test-psychotechnique-permis.com`
5. **Onglet** : `Zone DNS`

#### B. Supprimer TOUS les enregistrements A existants

⚠️ **IMPORTANT** : Il ne doit rester AUCUN enregistrement A pointant vers un autre serveur

1. Cherchez **TOUS** les enregistrements de type **A**
2. Pour chaque enregistrement A (sauf ceux pour mail/smtp si vous en avez) :
   - Cliquez sur l'icône **poubelle** 🗑️
   - **Confirmez** la suppression

#### C. Supprimer l'ancien CNAME pour www

1. Cherchez l'enregistrement **CNAME** pour `www`
2. **Supprimez-le** (icône poubelle)

#### D. Ajouter le nouvel enregistrement A

1. **Cliquez sur** : `Ajouter une entrée`
2. **Sélectionnez** : `A`
3. **Remplissez EXACTEMENT** :
   ```
   Sous-domaine : (LAISSEZ VIDE ou tapez juste un point ".")
   TTL         : 60 ou 300
   Cible       : 76.76.21.21
   ```
4. **Validez**

#### E. Ajouter le nouvel enregistrement CNAME pour www

1. **Cliquez sur** : `Ajouter une entrée`
2. **Sélectionnez** : `CNAME`
3. **Remplissez EXACTEMENT** :
   ```
   Sous-domaine : www
   TTL         : 60 ou 300
   Cible       : cname.vercel-dns.com.
   ```
   ⚠️ **LE POINT À LA FIN EST OBLIGATOIRE !**
4. **Validez**

#### F. Vérifier votre zone DNS finale

Votre zone DNS doit contenir au minimum :

| Type | Sous-domaine | TTL | Cible |
|------|--------------|-----|-------|
| **A** | @ ou (vide) | 300 | 76.76.21.21 |
| **CNAME** | www | 300 | cname.vercel-dns.com. |
| MX | @ | 3600 | (vos serveurs mail OVH - ne pas toucher) |

**Gardez vos enregistrements MX, TXT, SPF, DKIM pour les emails !**

---

### 3️⃣ Forcer la mise à jour de la zone DNS

Parfois OVH met du temps à propager. Pour forcer :

1. En bas de la page Zone DNS, **cherchez** : `Appliquer la configuration`
2. Ou attendez simplement 5-15 minutes

---

### 4️⃣ Vérifier la propagation DNS

#### Option A : En ligne
- **Allez sur** : https://dnschecker.org/
- **Entrez** : `test-psychotechnique-permis.com`
- **Sélectionnez** : Type A
- **Vérifiez** que l'IP affichée est `76.76.21.21`

#### Option B : Terminal
```bash
# Test DNS A
dig test-psychotechnique-permis.com A +short
# Doit afficher : 76.76.21.21

# Test DNS CNAME
dig www.test-psychotechnique-permis.com CNAME +short
# Doit afficher : cname.vercel-dns.com.

# Test avec le serveur DNS de Google (pour vérifier propagation)
dig @8.8.8.8 test-psychotechnique-permis.com A +short
```

---

### 5️⃣ Rafraîchir sur Vercel

Une fois les DNS configurés :

1. **Allez sur Vercel** → Votre projet → **Settings** → **Domains**
2. **Cliquez sur "Refresh"** ou attendez 2-3 minutes
3. Le statut devrait passer de "Invalid Configuration" à **"Valid Configuration"** ✅

Si ça ne change pas :
- Attendez encore 10-15 minutes
- Vercel vérifie les DNS toutes les quelques minutes

---

## 🚨 Problèmes courants

### ❌ "Invalid Configuration" persiste après 1 heure

**Vérifiez** :
1. Que l'enregistrement A pointe bien vers `76.76.21.21` (pas une autre IP)
2. Qu'il n'y a pas de DOUBLE enregistrement A qui pourrait créer un conflit
3. Que le CNAME a bien le point final : `cname.vercel-dns.com.`

**Solution** : Supprimez TOUS les enregistrements A, attendez 5 min, puis ajoutez-en UN SEUL nouveau.

### ❌ "dig" ne montre pas la bonne IP

**Raison** : Cache DNS de votre ordinateur ou propagation en cours

**Solution** :
```bash
# Vider le cache DNS (Mac)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Tester avec le DNS de Google (bypass cache local)
dig @8.8.8.8 test-psychotechnique-permis.com A +short
```

### ❌ OVH ne me laisse pas supprimer un enregistrement

**Raison** : Enregistrement par défaut créé par OVH

**Solution** : 
1. Cliquez sur l'icône **crayon** (modifier) au lieu de la poubelle
2. Changez la cible pour `76.76.21.21`
3. Validez

---

## 📋 Checklist de vérification

Avant de considérer que c'est terminé :

- [ ] ✅ Tous les anciens enregistrements A supprimés ou modifiés
- [ ] ✅ UN SEUL enregistrement A pointant vers `76.76.21.21`
- [ ] ✅ Enregistrement CNAME pour `www` → `cname.vercel-dns.com.` (avec le point)
- [ ] ✅ `dig test-psychotechnique-permis.com A +short` affiche `76.76.21.21`
- [ ] ✅ `dig www.test-psychotechnique-permis.com CNAME +short` affiche `cname.vercel-dns.com.`
- [ ] ✅ Attendu 10-15 minutes pour la propagation
- [ ] ✅ Vérifié sur https://dnschecker.org/ (au moins 50% des serveurs voient la bonne IP)
- [ ] ✅ Vercel affiche "Valid Configuration" ✅

---

## ⏱️ Délais normaux

- **Configuration OVH** : Immédiat à 5 minutes
- **Propagation DNS** : 5 minutes à 4 heures (généralement 15-30 min)
- **Validation Vercel** : 2-5 minutes après propagation DNS
- **Certificat SSL Vercel** : 5-10 minutes après validation

**TOTAL** : Comptez 30 minutes à 1 heure pour que tout soit opérationnel.

---

## 💡 Astuce

Si après 1 heure ça ne fonctionne toujours pas :

1. **Supprimez le domaine sur Vercel** (Settings → Domains → Remove)
2. **Attendez 5 minutes**
3. **Ré-ajoutez le domaine** sur Vercel
4. Vercel va re-vérifier les DNS

---

## 🆘 En dernier recours

Si rien ne fonctionne après 2 heures :

**Contact Vercel Support** : https://vercel.com/help
Ou sur leur Discord : https://vercel.com/discord

Ils peuvent forcer la vérification DNS de leur côté.

---

## ✅ Une fois résolu

Quand Vercel affiche "Valid Configuration" :

1. **Attendez 5-10 min** pour le certificat SSL
2. **Visitez** : https://test-psychotechnique-permis.com
3. **Vérifiez le cadenas HTTPS** dans la barre d'adresse
4. **Testez** une réservation complète

Votre site est maintenant sur Vercel ! 🚀
