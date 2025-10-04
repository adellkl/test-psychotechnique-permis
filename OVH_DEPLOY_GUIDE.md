# 🚀 Guide de déploiement sur OVH

## Type d'hébergement recommandé

Pour une application Next.js, vous avez besoin de:
- **VPS OVH** (recommandé) - à partir de 3,50€/mois
- **Cloud Instance OVH** - plus flexible
- ❌ **Hébergement mutualisé** - Ne supporte pas Node.js

---

## Étape 1: Vérifier votre domaine sur Resend (OBLIGATOIRE)

Avant tout déploiement:

1. **Connectez-vous à Resend**: https://resend.com/login
2. **Allez dans "Domains"**: https://resend.com/domains
3. **Cliquez sur "Add Domain"**
4. **Entrez votre domaine**: `test-psychotechnique-permis.com`
5. **Copiez les enregistrements DNS fournis**
6. **Allez dans votre espace OVH** → **Domaines** → Votre domaine → **Zone DNS**
7. **Ajoutez les enregistrements Resend**:
   - Type: **TXT** → Cible: (valeur Resend)
   - Type: **MX** → Priorité: 10 → Cible: (valeur Resend)
   - Type: **CNAME** → Sous-domaine: (fourni) → Cible: (valeur Resend)
8. **Attendez la vérification** (quelques minutes à 24h)
9. **Statut = "Verified" ✅** sur Resend

---

## Étape 2: Commander et configurer un VPS OVH

### A. Commander un VPS

1. **Allez sur**: https://www.ovhcloud.com/fr/vps/
2. **Choisissez un VPS Starter** (suffisant pour commencer)
3. **Système d'exploitation**: Ubuntu 22.04 LTS
4. **Validez la commande**

### B. Accéder à votre VPS

Vous recevrez un email avec:
- IP du serveur: `123.45.67.89`
- Login: `ubuntu` ou `root`
- Mot de passe initial

Connectez-vous en SSH:
```bash
ssh ubuntu@123.45.67.89
```

---

## Étape 3: Installer Node.js et dépendances

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installer Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier l'installation
node --version  # doit afficher v20.x
npm --version

# Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2

# Installer Nginx (serveur web)
sudo apt install -y nginx

# Installer Git
sudo apt install -y git
```

---

## Étape 4: Cloner et configurer votre application

```bash
# Créer un dossier pour l'application
cd /var/www
sudo mkdir -p test-psychotechnique-permis
sudo chown -R $USER:$USER test-psychotechnique-permis
cd test-psychotechnique-permis

# Cloner votre repo (GitHub/GitLab)
git clone https://github.com/votre-username/votre-repo.git .

# Installer les dépendances
npm install

# Créer le fichier .env.production
nano .env.production
```

### Contenu du fichier .env.production:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon

# Resend (Email)
RESEND_API_KEY=re_votre_clé_api_resend
FROM_EMAIL=contact@test-psychotechnique-permis.com
ADMIN_EMAIL=adelloukal2@gmail.com

# App
NEXT_PUBLIC_APP_URL=https://test-psychotechnique-permis.com
NODE_ENV=production
```

**Sauvegardez**: `Ctrl+X` → `Y` → `Enter`

```bash
# Build l'application
npm run build

# Vérifier que le build fonctionne
npm start
# Testez sur http://VOTRE_IP:3000
# Arrêtez avec Ctrl+C
```

---

## Étape 5: Configurer PM2 pour garder l'app en ligne

```bash
# Démarrer l'application avec PM2
pm2 start npm --name "test-psycho" -- start

# Configurer PM2 pour démarrer au boot
pm2 startup
pm2 save

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs test-psycho
```

---

## Étape 6: Configurer Nginx comme reverse proxy

```bash
# Créer la configuration Nginx
sudo nano /etc/nginx/sites-available/test-psychotechnique-permis
```

### Contenu du fichier:

```nginx
server {
    listen 80;
    server_name test-psychotechnique-permis.com www.test-psychotechnique-permis.com;

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

**Sauvegardez**: `Ctrl+X` → `Y` → `Enter`

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/test-psychotechnique-permis /etc/nginx/sites-enabled/

# Supprimer le site par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

---

## Étape 7: Configurer le domaine dans OVH

1. **Connexion OVH**: https://www.ovh.com/manager/
2. **Domaines** → `test-psychotechnique-permis.com` → **Zone DNS**
3. **Modifier les enregistrements**:

### Enregistrement A (principal):
- Type: **A**
- Sous-domaine: *(vide ou @)*
- Cible: **IP_DE_VOTRE_VPS** (ex: 123.45.67.89)
- TTL: 3600

### Enregistrement A (www):
- Type: **A**
- Sous-domaine: **www**
- Cible: **IP_DE_VOTRE_VPS**
- TTL: 3600

4. **Sauvegarder** et attendre la propagation (5-30 minutes)

---

## Étape 8: Installer SSL (HTTPS) avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d test-psychotechnique-permis.com -d www.test-psychotechnique-permis.com

# Suivre les instructions (entrez votre email)
# Choisissez "2" pour rediriger automatiquement HTTP vers HTTPS

# Le certificat se renouvelle automatiquement
# Tester le renouvellement automatique:
sudo certbot renew --dry-run
```

---

## Étape 9: Tester votre application

1. ✅ **Accédez à**: https://test-psychotechnique-permis.com
2. ✅ **Testez la prise de rendez-vous**
3. ✅ **Vérifiez que l'email arrive au client**
4. ✅ **Vérifiez que l'admin reçoit la notification**
5. ✅ **Testez le dashboard**: `/admin`

---

## 🔄 Mettre à jour l'application (déploiement)

```bash
# Se connecter au VPS
ssh ubuntu@VOTRE_IP

# Aller dans le dossier
cd /var/www/test-psychotechnique-permis

# Pull les dernières modifications
git pull origin main

# Installer les nouvelles dépendances (si ajoutées)
npm install

# Rebuild l'application
npm run build

# Redémarrer l'application
pm2 restart test-psycho

# Vérifier les logs
pm2 logs test-psycho
```

---

## 🛠️ Commandes utiles

### PM2:
```bash
pm2 status              # Voir le statut
pm2 logs test-psycho    # Voir les logs en temps réel
pm2 restart test-psycho # Redémarrer l'app
pm2 stop test-psycho    # Arrêter l'app
pm2 delete test-psycho  # Supprimer l'app de PM2
```

### Nginx:
```bash
sudo systemctl status nginx    # Statut
sudo systemctl restart nginx   # Redémarrer
sudo nginx -t                  # Tester la config
sudo tail -f /var/log/nginx/error.log  # Logs d'erreur
```

### Système:
```bash
df -h              # Espace disque
free -h            # Mémoire RAM
htop               # Moniteur ressources
```

---

## 🔒 Sécurité (recommandé)

### Configurer le firewall:
```bash
# Installer UFW
sudo apt install -y ufw

# Autoriser SSH, HTTP et HTTPS
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Activer le firewall
sudo ufw enable
```

### Désactiver l'accès root:
```bash
sudo nano /etc/ssh/sshd_config
# Modifier: PermitRootLogin no
sudo systemctl restart sshd
```

---

## 🐛 Dépannage

### L'application ne démarre pas:
```bash
pm2 logs test-psycho --lines 100
```

### Erreur 502 Bad Gateway:
```bash
# Vérifier que l'app tourne
pm2 status

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Emails ne partent pas:
- Vérifiez que le domaine est **vérifié** sur Resend
- Vérifiez `.env.production` (FROM_EMAIL doit utiliser le domaine vérifié)
- Consultez: https://resend.com/emails

### Le site ne charge pas:
```bash
# Vérifier la propagation DNS
nslookup test-psychotechnique-permis.com
ping test-psychotechnique-permis.com
```

---

## 📊 Monitoring

### Installer un monitoring (optionnel):
```bash
# PM2 Plus (monitoring gratuit)
pm2 link YOUR_PM2_KEY YOUR_PM2_SECRET
```

---

## 💰 Coûts mensuels estimés

- VPS Starter OVH: **3,50€/mois**
- Domaine (si pas déjà acheté): **~10€/an**
- Resend (jusqu'à 3000 emails/mois): **Gratuit**
- Supabase (petit projet): **Gratuit**

**Total**: ~3,50€/mois + domaine

---

## ✅ Checklist finale

- [ ] VPS OVH commandé et configuré
- [ ] Node.js, PM2, Nginx installés
- [ ] Application clonée et buildée
- [ ] Variables d'environnement configurées
- [ ] PM2 lance l'application
- [ ] Nginx configuré en reverse proxy
- [ ] DNS configuré dans OVH (A records)
- [ ] SSL/HTTPS activé avec Let's Encrypt
- [ ] Domaine vérifié sur Resend
- [ ] Tests de réservation effectués
- [ ] Emails reçus par les clients ✅

---

## 📞 Support

- Documentation OVH VPS: https://docs.ovh.com/fr/vps/
- Support OVH: https://www.ovh.com/fr/support/
- Community Next.js: https://github.com/vercel/next.js/discussions
- Documentation PM2: https://pm2.keymetrics.io/docs/
