#!/bin/bash

echo "🧹 Nettoyage du dépôt Git..."

# Supprimer les fichiers du cache Git (sans les supprimer du disque)
echo "📦 Suppression des fichiers temporaires du cache Git..."

git rm --cached template-email-clichy.html 2>/dev/null || echo "✓ template-email-clichy.html déjà supprimé"
git rm --cached template-email-colombes.html 2>/dev/null || echo "✓ template-email-colombes.html déjà supprimé"
git rm --cached preview-email.html 2>/dev/null || echo "✓ preview-email.html déjà supprimé"
git rm --cached preview-email-colombes.html 2>/dev/null || echo "✓ preview-email-colombes.html déjà supprimé"
git rm --cached comparaison-emails.html 2>/dev/null || echo "✓ comparaison-emails.html déjà supprimé"
git rm --cached update-templates.mjs 2>/dev/null || echo "✓ update-templates.mjs déjà supprimé"
git rm --cached supabase-update-templates.txt 2>/dev/null || echo "✓ supabase-update-templates.txt déjà supprimé"
git rm --cached build-output.txt 2>/dev/null || echo "✓ build-output.txt déjà supprimé"
git rm --cached optimize-code.sh 2>/dev/null || echo "✓ optimize-code.sh déjà supprimé"

# Supprimer les fichiers .env du cache s'ils existent
echo ""
echo "🔒 Vérification des fichiers sensibles..."
git rm --cached .env.local 2>/dev/null || echo "✓ .env.local déjà ignoré"
git rm --cached .env.production 2>/dev/null || echo "✓ .env.production déjà ignoré"

echo ""
echo "✅ Nettoyage terminé!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Vérifiez les changements: git status"
echo "2. Commitez les changements: git add .gitignore && git commit -m 'chore: nettoyage du dépôt - suppression fichiers temporaires'"
echo "3. Poussez les changements: git push"
