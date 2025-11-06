#!/bin/bash

# Script pour résoudre tous les conflits Git en faveur de v2.calendrier.acorriger

echo "Résolution de tous les conflits en faveur de v2.calendrier.acorriger..."

# Liste des fichiers avec conflits
FILES=(
  "app/a-propos/page.tsx"
  "app/page.tsx"
  "app/admin/dashboard/page.tsx"
  "app/contact/page.tsx"
  "app/prendre-rendez-vous/page.tsx"
  "app/admin/components/AddSlotModal.tsx"
  "app/admin/creneaux/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Résolution de $file..."
    git checkout --theirs "$file" 2>/dev/null || echo "Erreur avec $file"
    git add "$file" 2>/dev/null
  fi
done

echo "✅ Tous les conflits résolus !"
echo "Vous pouvez maintenant faire: git commit -m 'Merge v2.calendrier.acorriger into main'"
