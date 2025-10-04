# Configuration DNS pour Resend - Test Psychotechnique Permis

## 📋 Enregistrements DNS à ajouter chez votre hébergeur

Allez dans la gestion DNS de votre domaine `test-psychotechnique-permis.com` et ajoutez ces 4 enregistrements :

### 1. MX Record (pour recevoir les emails)
```
Type: MX
Nom/Host: send
Valeur: feedback-smtp.us-east-1.amazonses.com
Priorité: 10
TTL: Auto ou 3600
```

### 2. SPF Record (autorisation d'envoi)
```
Type: TXT
Nom/Host: send
Valeur: v=spf1 include:amazonses.com ~all
TTL: Auto ou 3600
```

### 3. DKIM Record (signature des emails)
```
Type: TXT
Nom/Host: resend._domainkey.send
Valeur: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDkWcocDP5nLj4dBgK9vKo10GuacuMHtyH++qkZfu4FEjxwrlfPgxxTMYguw0qUZO6/XkTxOLjtLeGS7MEGouORws39A9e55bF8rsjfVtKBkqAys1xiFb7pFiubQRxphFzN3UIqDRdRzVNA9DjUpXzsXixbTWkRsfqKKpUGBNbOlQIDAQAB
TTL: Auto ou 3600
```

### 4. DMARC Record (politique d'authentification)
```
Type: TXT
Nom/Host: _dmarc.send
Valeur: v=DMARC1; p=none;
TTL: Auto ou 3600
```

---

## 🔧 Étapes chez votre hébergeur DNS

### Si vous êtes chez OVH :
1. Connectez-vous à votre espace client OVH
2. Allez dans "Web Cloud" > "Noms de domaine"
3. Sélectionnez `test-psychotechnique-permis.com`
4. Cliquez sur l'onglet "Zone DNS"
5. Cliquez sur "Ajouter une entrée"
6. Ajoutez chacun des 4 enregistrements ci-dessus

### Si vous êtes chez Cloudflare :
1. Connectez-vous à Cloudflare
2. Sélectionnez votre domaine
3. Allez dans "DNS" > "Records"
4. Cliquez sur "Add record"
5. Ajoutez chacun des 4 enregistrements

### Autres hébergeurs :
Cherchez "DNS Management" ou "Zone DNS" dans votre panneau de contrôle.

---

## ⏱️ Temps de propagation

- **Minimum** : 5-10 minutes
- **Maximum** : 24-48 heures
- **En moyenne** : 1-2 heures

---

## ✅ Vérifier la configuration

Une fois les DNS ajoutés, retournez sur Resend :
1. Allez sur https://resend.com/domains
2. Cliquez sur "Verify" à côté de votre domaine
3. Si tout est bon : ✅ Verified !

---

## 🚀 Activer l'envoi aux clients

Une fois le domaine vérifié sur Resend, modifiez `.env.local` :

```bash
FROM_EMAIL=noreply@send.test-psychotechnique-permis.com
ADMIN_EMAIL=f.sebti@outlook.com
```

Puis redémarrez :
```bash
npm run dev
```

**C'est tout !** Les emails partiront automatiquement aux clients ! 🎉
