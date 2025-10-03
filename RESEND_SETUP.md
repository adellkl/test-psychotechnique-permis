# Configuration Resend pour Production

## Problème actuel
L'erreur `statusCode: 403` indique que Resend en mode gratuit ne permet d'envoyer des emails qu'à votre adresse vérifiée (`f.sebti@outlook.com`).

## Solutions pour la production

### Option 1: Ajouter f.sebti@outlook.com comme adresse vérifiée

**Étapes détaillées :**
1. Se connecter sur https://resend.com avec le compte actuel
2. Aller dans **Settings** > **Verified Emails**
3. Cliquer sur **Add Email Address**
4. Saisir `f.sebti@outlook.com`
5. Resend enverra un email de vérification à cette adresse
6. Demander à F. Sebti de cliquer sur le lien de vérification dans l'email
7. Une fois vérifié, l'adresse apparaîtra dans la liste des emails vérifiés
8. Mettre à jour `.env.local`:
   ```
   FROM_EMAIL=onboarding@resend.dev
   ADMIN_EMAIL=f.sebti@outlook.com
   ```

### Option 2: Vérifier un domaine (Recommandé pour production)
1. Aller sur https://resend.com/domains
2. Ajouter votre domaine `test-psychotechnique-permis.com`
3. Configurer les enregistrements DNS requis
4. Mettre à jour `.env.local`:
   ```
   FROM_EMAIL=noreply@test-psychotechnique-permis.com
   ```

### Option 3: Utiliser le domaine Resend par défaut
Pour le développement et les tests, utiliser:
```
FROM_EMAIL=onboarding@resend.dev
```

## Configuration actuelle
- **Développement**: Emails redirigés vers `f.sebti@outlook.com`
- **Production**: Nécessite un domaine vérifié

## Étapes pour déployer
1. Vérifier le domaine sur Resend
2. Configurer les variables d'environnement de production
3. Déployer avec `NODE_ENV=production`

## Variables d'environnement requises
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@test-psychotechnique-permis.com
ADMIN_EMAIL=f.sebti@outlook.com
NODE_ENV=production
```
