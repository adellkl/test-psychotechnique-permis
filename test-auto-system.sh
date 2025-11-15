#!/bin/bash

# Script de test du système d'analyse automatique des statuts
# Teste l'API et le fonctionnement en local

echo "🚀 Test du système d'analyse automatique des statuts"
echo "=================================================="

# 1. Vérifier que le serveur Next.js tourne sur le port 3000
echo "📡 Vérification du serveur local..."

if curl -s -f http://localhost:3000 > /dev/null; then
    echo "✅ Serveur Next.js détecté sur http://localhost:3000"
else
    echo "❌ Serveur introuvable sur http://localhost:3000"
    echo "💡 Démarrez le serveur avec: npm run dev"
    exit 1
fi

# 2. Tester l'API d'analyse automatique
echo ""
echo "🔄 Test de l'API auto-status-update..."

response=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/api/admin/auto-status-update \
    -H "Content-Type: application/json" \
    -o test_response.json)

echo "📥 Code de réponse HTTP: $response"

if [ "$response" == "200" ]; then
    echo "✅ API fonctionnelle - Réponse:"
    cat test_response.json | jq '.' 2>/dev/null || cat test_response.json
    rm -f test_response.json
else
    echo "❌ Erreur API - Code: $response"
    if [ -f test_response.json ]; then
        echo "📄 Contenu de la réponse:"
        cat test_response.json
        rm -f test_response.json
    fi
fi

# 3. Tester avec Node.js si disponible
echo ""
echo "📊 Test avec script Node.js..."

if command -v node &> /dev/null; then
    if [ -f "auto-status-check.js" ]; then
        echo "🔄 Exécution du script de vérification..."
        node auto-status-check.js
    else
        echo "⚠️  Script auto-status-check.js introuvable"
    fi
else
    echo "⚠️  Node.js non disponible pour le test détaillé"
fi

echo ""
echo "✅ Test terminé"
echo ""
echo "💡 Instructions pour utiliser le système:"
echo "1. Ouvrez http://localhost:3000/admin/dashboard"
echo "2. L'analyse automatique s'exécute toutes les minutes"
echo "3. Les statuts changent selon l'heure:"
echo "   - confirmed: Avant l'heure du RDV (-5 min)"  
echo "   - in_progress: Pendant le RDV (40 min)"
echo "   - completed: Après 40 min de RDV"
echo "4. Panel 'Rendez-vous aujourd'hui' affiche confirmés ET en cours"
echo "5. Horodatage mis à jour en temps réel"
