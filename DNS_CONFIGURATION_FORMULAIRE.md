# Configuration DNS - Valeurs à saisir dans le formulaire

## 📝 Enregistrement 1 : MX Record

```
Type: MX
Sous-domaine: send
TTL: Par défaut (ou 3600 si personnalisé)
Priorité: 10
Cible: feedback-smtp.us-east-1.amazonses.com
```

---

## 📝 Enregistrement 2 : SPF (TXT)

```
Type: TXT
Sous-domaine: send
TTL: Par défaut (ou 3600 si personnalisé)
Priorité: (laisser vide)
Cible: v=spf1 include:amazonses.com ~all
```

---

## 📝 Enregistrement 3 : DKIM (TXT)

```
Type: TXT
Sous-domaine: resend._domainkey.send
TTL: Par défaut (ou 3600 si personnalisé)
Priorité: (laisser vide)
Cible: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDkWcocDP5nLj4dBgK9vKo10GuacuMHtyH++qkZfu4FEjxwrlfPgxxTMYguw0qUZO6/XkTxOLjtLeGS7MEGouORws39A9e55bF8rsjfVtKBkqAys1xiFb7pFiubQRxphFzN3UIqDRdRzVNA9DjUpXzsXixbTWkRsfqKKpUGBNbOlQIDAQAB
```

---

## 📝 Enregistrement 4 : DMARC (TXT)

```
Type: TXT
Sous-domaine: _dmarc.send
TTL: Par défaut (ou 3600 si personnalisé)
Priorité: (laisser vide)
Cible: v=DMARC1; p=none;
```

---

## ⚠️ Notes importantes

- **Sous-domaine** : Ne PAS mettre `.test-psychotechnique-permis.com` à la fin, juste la partie avant (ex: `send`)
- **TTL** : Choisir "Par défaut" ou mettre 3600
- **Priorité** : Uniquement pour le MX (mettre 10), laisser vide pour les TXT
- **Cible** : Copier-coller exactement la valeur indiquée

## ✅ Résultat final

Une fois configurés, vos enregistrements créeront :
- `send.test-psychotechnique-permis.com` (MX + SPF)
- `resend._domainkey.send.test-psychotechnique-permis.com` (DKIM)
- `_dmarc.send.test-psychotechnique-permis.com` (DMARC)
