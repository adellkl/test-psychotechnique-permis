#!/bin/bash

echo "🧹 Nettoyage du dépôt Git..."

# Supprimer les fichiers du cache Git (sans les supprimer physiquement)
git rm -r --cached .vscode 2>/dev/null || true
git rm --cached backup-main-commit.txt 2>/dev/null || true
git rm --cached check-slots-issue.js 2>/dev/null || true
git rm --cached clean-git-repo.sh 2>/dev/null || true
git rm --cached finalize-merge.sh 2>/dev/null || true
git rm --cached fix-env.sh 2>/dev/null || true
git rm --cached resolve-all-conflicts.sh 2>/dev/null || true
git rm --cached sync-email-templates.js 2>/dev/null || true
git rm --cached update-template-supabase.txt 2>/dev/null || true

echo "✅ Fichiers retirés du cache Git"

# Ajouter le .gitignore mis à jour
git add .gitignore

echo "📋 Fichiers à commit :"
git status --short

echo ""
echo "💾 Création du commit..."
git commit -m "🧹 Nettoyage: Suppression fichiers temporaires et scripts de dev"

echo ""
echo "✅ Nettoyage terminé!"
echo ""
echo "📤 Pour pousser les changements, exécutez :"
echo "   git push origin main"
