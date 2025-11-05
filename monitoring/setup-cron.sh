#!/bin/bash

###############################################################################
# Script de configuration du monitoring automatique via cron
# Ce script configure des tâches cron pour exécuter le monitoring régulièrement
###############################################################################

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    Configuration du Monitoring Automatique (Cron)         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"

# Obtenir le chemin absolu du dossier monitoring
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
NODE_PATH=$(which node)

echo -e "${YELLOW}Configuration détectée:${NC}"
echo -e "  Dossier projet: ${GREEN}$PROJECT_DIR${NC}"
echo -e "  Node.js: ${GREEN}$NODE_PATH${NC}"
echo -e "  Dossier monitoring: ${GREEN}$SCRIPT_DIR${NC}\n"

# Vérifier que Node.js est installé
if [ ! -x "$NODE_PATH" ]; then
    echo -e "${RED}❌ Erreur: Node.js n'est pas installé ou introuvable${NC}"
    exit 1
fi

# Créer le dossier logs s'il n'existe pas
mkdir -p "$SCRIPT_DIR/logs"

# Créer un wrapper script pour faciliter l'exécution cron
cat > "$SCRIPT_DIR/run-monitoring.sh" << EOF
#!/bin/bash
cd "$PROJECT_DIR"
export PATH="$PATH"
export NODE_ENV=production
"$NODE_PATH" "$SCRIPT_DIR/monitor.js" >> "$SCRIPT_DIR/logs/cron.log" 2>&1
EOF

chmod +x "$SCRIPT_DIR/run-monitoring.sh"

echo -e "${GREEN}✅ Script wrapper créé: run-monitoring.sh${NC}\n"

# Proposer différentes fréquences
echo -e "${YELLOW}Choisissez la fréquence de monitoring:${NC}"
echo "  1) Toutes les 5 minutes (recommandé pour la production)"
echo "  2) Toutes les 15 minutes"
echo "  3) Toutes les 30 minutes"
echo "  4) Toutes les heures"
echo "  5) Toutes les 6 heures"
echo "  6) Une fois par jour à 9h"
echo "  7) Configuration personnalisée"
echo "  8) Ne pas configurer de cron (sortir)"
echo ""
read -p "Votre choix [1-8]: " choice

case $choice in
    1)
        CRON_SCHEDULE="*/5 * * * *"
        DESCRIPTION="toutes les 5 minutes"
        ;;
    2)
        CRON_SCHEDULE="*/15 * * * *"
        DESCRIPTION="toutes les 15 minutes"
        ;;
    3)
        CRON_SCHEDULE="*/30 * * * *"
        DESCRIPTION="toutes les 30 minutes"
        ;;
    4)
        CRON_SCHEDULE="0 * * * *"
        DESCRIPTION="toutes les heures"
        ;;
    5)
        CRON_SCHEDULE="0 */6 * * *"
        DESCRIPTION="toutes les 6 heures"
        ;;
    6)
        CRON_SCHEDULE="0 9 * * *"
        DESCRIPTION="tous les jours à 9h"
        ;;
    7)
        echo -e "\n${YELLOW}Entrez votre expression cron (format: minute heure jour mois jour_semaine):${NC}"
        read -p "Expression cron: " CRON_SCHEDULE
        DESCRIPTION="personnalisée: $CRON_SCHEDULE"
        ;;
    8)
        echo -e "\n${BLUE}Configuration annulée. Vous pouvez exécuter manuellement:${NC}"
        echo -e "  ${GREEN}$SCRIPT_DIR/run-monitoring.sh${NC}\n"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Choix invalide${NC}"
        exit 1
        ;;
esac

# Créer l'entrée cron
CRON_COMMAND="$CRON_SCHEDULE $SCRIPT_DIR/run-monitoring.sh"

echo -e "\n${YELLOW}Configuration cron:${NC}"
echo -e "  Fréquence: ${GREEN}$DESCRIPTION${NC}"
echo -e "  Commande: ${GREEN}$CRON_COMMAND${NC}\n"

# Vérifier si une entrée cron existe déjà
if crontab -l 2>/dev/null | grep -q "run-monitoring.sh"; then
    echo -e "${YELLOW}⚠️  Une tâche cron existe déjà pour le monitoring${NC}"
    read -p "Voulez-vous la remplacer? (y/n): " replace
    if [ "$replace" != "y" ]; then
        echo -e "${BLUE}Configuration annulée${NC}"
        exit 0
    fi
    # Supprimer l'ancienne entrée
    crontab -l 2>/dev/null | grep -v "run-monitoring.sh" | crontab -
    echo -e "${GREEN}✅ Ancienne tâche supprimée${NC}"
fi

# Ajouter la nouvelle entrée cron
(crontab -l 2>/dev/null; echo "$CRON_COMMAND") | crontab -

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Tâche cron configurée avec succès!${NC}\n"
    
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                     CONFIGURATION TERMINÉE                 ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"
    
    echo -e "${YELLOW}Informations utiles:${NC}"
    echo -e "  📋 Voir les tâches cron: ${GREEN}crontab -l${NC}"
    echo -e "  📝 Logs du monitoring: ${GREEN}$SCRIPT_DIR/logs/${NC}"
    echo -e "  🔧 Modifier le cron: ${GREEN}crontab -e${NC}"
    echo -e "  🗑️  Supprimer le cron: ${GREEN}crontab -l | grep -v run-monitoring.sh | crontab -${NC}"
    echo -e "  ▶️  Test manuel: ${GREEN}$SCRIPT_DIR/run-monitoring.sh${NC}\n"
    
    echo -e "${GREEN}Le monitoring s'exécutera automatiquement $DESCRIPTION${NC}\n"
else
    echo -e "${RED}❌ Erreur lors de la configuration du cron${NC}"
    exit 1
fi
