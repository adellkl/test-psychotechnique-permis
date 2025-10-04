# 🔄 Guide de Migration - Remplacer le site existant

## Vue d'ensemble

Votre site actuel : **test-psychotechnique-permis.com**  
Nouvelle application : **Next.js + Supabase + Resend**

Ce guide vous aide à migrer sans perdre de données et avec un minimum de temps d'arrêt.

---

## ⚠️ AVANT DE COMMENCER

### 1. Questions importantes à clarifier :

**Sur votre hébergement actuel :**
- [ ] Quel type d'hébergement utilisez-vous ? (VPS, mutualisé, autre)
- [ ] Avez-vous accès SSH au serveur ?
- [ ] Où est hébergée votre base de données actuelle ?
- [ ] Avez-vous des rendez-vous existants à migrer ?

**Réponses :**
- Si **hébergement mutualisé** → vous devrez peut-être migrer vers un VPS
- Si **VPS OVH existant** → on peut déployer directement dessus
- Si **données à migrer** → il faudra exporter/importer dans Supabase

---

## 📊 Scénarios de migration

### Scénario A : Vous avez un VPS OVH
✅ Le plus simple - on déploie directement sur le même serveur

### Scénario B : Vous avez un hébergement mutualisé
⚠️ Il faudra commander un VPS ou utiliser Vercel

### Scénario C : Vous voulez tester d'abord
💡 Déployer sur un sous-domaine (nouveau.test-psychotechnique-permis.com)

---

## 🚀 Migration - Scénario A (VPS existant)

### Étape 1 : Sauvegarde complète de l'ancien site

```bash
# Se connecter au VPS
ssh votre-user@votre-ip

# Créer un dossier de sauvegarde
sudo mkdir -p /backup/old-site-$(date +%Y%m%d)

# Sauvegarder le site actuel
sudo cp -r /var/www/test-psychotechnique-permis /backup/old-site-$(date +%Y%m%d)/

# Sauvegarder la base de données (si MySQL/PostgreSQL local)
# MySQL :
mysqldump -u root -p nom_base > /backup/old-site-$(date +%Y%m%d)/database.sql

# PostgreSQL :
pg_dump nom_base > /backup/old-site-$(date +%Y%m%d)/database.sql

# Sauvegarder la configuration Nginx
sudo cp /etc/nginx/sites-available/* /backup/old-site-$(date +%Y%m%d)/
```

### Étape 2 : Arrêter l'ancien site

```bash
# Si ancien site utilise PM2
pm2 list
pm2 stop nom-ancien-site

# Si Apache
sudo systemctl stop apache2

# Si autre processus PHP/autre
ps aux | grep php  # trouver les processus
```

### Étape 3 : Nettoyer le dossier web

```bash
# Renommer l'ancien dossier (ne pas supprimer !)
sudo mv /var/www/test-psychotechnique-permis /var/www/test-psychotechnique-permis-OLD

# Créer le nouveau dossier
sudo mkdir -p /var/www/test-psychotechnique-permis
sudo chown -R $USER:$USER /var/www/test-psychotechnique-permis
```

### Étape 4 : Déployer la nouvelle application

```bash
cd /var/www/test-psychotechnique-permis

# Option A : Cloner depuis GitHub/GitLab
git clone https://github.com/votre-username/permis-expert.git .

# Option B : Upload depuis votre Mac
# Sur votre Mac, depuis le dossier du projet :
rsync -avz --exclude 'node_modules' --exclude '.next' ./ votre-user@votre-ip:/var/www/test-psychotechnique-permis/

# Installer les dépendances
npm install

# Créer .env.production
nano .env.production
```

**Contenu de .env.production :**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hzfpscgdyrqbplmhgwhi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA

# Resend (Email)
RESEND_API_KEY=re_DdhZzjoL_DWUXFDm8hq4dFBokVfSYgavT
FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=f.sebti@outlook.com

# App
NEXT_PUBLIC_APP_URL=https://test-psychotechnique-permis.com
NODE_ENV=production
```

```bash
# Build l'application
npm run build

# Démarrer avec PM2
pm2 start npm --name "permis-expert" -- start
pm2 save
```

### Étape 5 : Configurer/Vérifier Nginx

```bash
# Éditer la configuration Nginx
sudo nano /etc/nginx/sites-available/test-psychotechnique-permis
```

**Configuration Nginx :**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name test-psychotechnique-permis.com www.test-psychotechnique-permis.com;

    # Redirection HTTPS (sera géré par Certbot)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name test-psychotechnique-permis.com www.test-psychotechnique-permis.com;

    # Certificats SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/test-psychotechnique-permis.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/test-psychotechnique-permis.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

### Étape 6 : Vérifier SSL/HTTPS

```bash
# Si certificat SSL existe déjà, il devrait fonctionner
# Sinon, obtenir un nouveau certificat :
sudo certbot --nginx -d test-psychotechnique-permis.com -d www.test-psychotechnique-permis.com
```

### Étape 7 : Tester le nouveau site

1. Accédez à : https://test-psychotechnique-permis.com
2. Testez la navigation
3. Testez la prise de rendez-vous
4. Vérifiez que les emails arrivent

---

## 🚀 Migration - Scénario B (Hébergement mutualisé → VPS)

Si votre site actuel est sur un hébergement mutualisé, suivez le **OVH_DEPLOY_GUIDE.md** complet car vous aurez besoin d'un nouveau VPS.

**Étapes spécifiques :**

1. **Commander un VPS OVH** (voir OVH_DEPLOY_GUIDE.md)
2. **Configurer le VPS** (Node.js, PM2, Nginx)
3. **Déployer la nouvelle application**
4. **Tester sur l'IP du VPS** (http://IP:3000)
5. **Modifier la zone DNS** pour pointer vers le nouveau VPS
6. **Activer SSL**
7. **Une fois validé**, désactiver l'ancien hébergement

---

## 🧪 Migration - Scénario C (Test sur sous-domaine)

Pour tester sans toucher au site principal :

### 1. Créer un sous-domaine dans OVH

**Zone DNS :**
- Type: **A**
- Sous-domaine: **nouveau**
- Cible: **IP_DE_VOTRE_VPS**

### 2. Déployer sur le sous-domaine

```bash
# Créer un dossier séparé
sudo mkdir -p /var/www/nouveau-site
cd /var/www/nouveau-site

# Déployer l'application (comme ci-dessus)
git clone ...
npm install
npm run build

# Démarrer sur un port différent (ex: 3001)
pm2 start npm --name "nouveau-site" -- start -- -p 3001
```

### 3. Configuration Nginx pour le sous-domaine

```nginx
server {
    listen 80;
    server_name nouveau.test-psychotechnique-permis.com;

    location / {
        proxy_pass http://localhost:3001;
        # ... (même config que ci-dessus)
    }
}
```

### 4. Tester

Accédez à : http://nouveau.test-psychotechnique-permis.com

Une fois validé, migrez vers le domaine principal (Scénario A).

---

## 📦 Migration des données existantes

### Si vous avez des rendez-vous à migrer :

1. **Exporter depuis l'ancienne base :**
```sql
SELECT * FROM appointments;
-- Exportez en CSV
```

2. **Importer dans Supabase :**
- Allez sur https://supabase.com/dashboard
- Votre projet → Table Editor
- Table `appointments` → Import data
- Upload le CSV

### Si structure différente :

Créez un script de migration pour adapter les champs :
```javascript
// migrate-data.js
const oldData = require('./old-appointments.json');
const { supabase } = require('./lib/supabase');

async function migrate() {
  for (const old of oldData) {
    await supabase.from('appointments').insert({
      first_name: old.prenom,
      last_name: old.nom,
      email: old.email,
      appointment_date: old.date_rdv,
      // ... mapper les champs
    });
  }
}

migrate();
```

---

## ✅ Checklist de migration

### Avant la migration :
- [ ] Sauvegarder complètement l'ancien site
- [ ] Exporter la base de données existante
- [ ] Noter tous les identifiants (FTP, DB, etc.)
- [ ] Sauvegarder les fichiers de configuration

### Pendant la migration :
- [ ] Déployer la nouvelle application
- [ ] Configurer les variables d'environnement
- [ ] Tester l'application sur IP ou sous-domaine
- [ ] Migrer les données si nécessaire

### Après la migration :
- [ ] Vérifier que le site fonctionne (https://test-psychotechnique-permis.com)
- [ ] Tester toutes les fonctionnalités
- [ ] Vérifier l'envoi d'emails
- [ ] Tester le dashboard admin
- [ ] Vérifier le SSL/HTTPS
- [ ] Monitorer les logs (pm2 logs)

### Nettoyage (après 1 semaine de test) :
- [ ] Supprimer l'ancien site (garder backup)
- [ ] Désactiver l'ancien hébergement si VPS séparé
- [ ] Nettoyer les anciennes configs Nginx

---

## 🆘 En cas de problème

### Rollback rapide (revenir à l'ancien site) :

```bash
# Arrêter la nouvelle application
pm2 stop permis-expert

# Restaurer l'ancienne
sudo rm -rf /var/www/test-psychotechnique-permis
sudo cp -r /backup/old-site-YYYYMMDD/test-psychotechnique-permis /var/www/

# Redémarrer l'ancien service
# (selon votre config: Apache, PM2, etc.)
```

---

## 💡 Recommandations

1. **Faites la migration un jour calme** (peu de trafic)
2. **Testez d'abord sur un sous-domaine** si possible
3. **Gardez les sauvegardes pendant au moins 1 mois**
4. **Surveillez les logs** les premiers jours : `pm2 logs permis-expert`

---

## 📞 Prochaines étapes

**Dites-moi quel scénario vous correspond :**

**A.** J'ai déjà un VPS OVH → Migration directe  
**B.** J'ai un hébergement mutualisé → Besoin d'un VPS  
**C.** Je veux tester d'abord → Déploiement sur sous-domaine  

Je vous guiderai étape par étape ! 🚀
