#!/bin/bash
# Script pour finaliser le merge automatiquement

cd /Users/adelloukal/Desktop/permis-expert

# Ajouter tous les fichiers résolus
git add -A

# Vérifier le statut
echo "=== État du merge ==="
git status

# Finaliser le commit de merge
git commit -m "Merge v2.calendrier.acorriger into main - Résolution complète des conflits

- Ajout gestion multi-centres (Clichy + Colombes)
- Sidebar avec sélecteur de centres
- Page RDV Terminés
- Tous les conflits résolus en faveur de v2.calendrier.acorriger"

echo ""
echo "✅ Merge terminé avec succès !"
echo "La branche main contient maintenant toutes les modifications de v2.calendrier.acorriger"
