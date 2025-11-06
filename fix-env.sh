#!/bin/bash

echo "🔧 Correction du fichier .env.production..."

# Backup
cp .env.production .env.production.backup

# Remplacer l'URL Supabase
sed -i '' 's|NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co|NEXT_PUBLIC_SUPABASE_URL=https://hzfpscgdyrqbplmhgwhi.supabase.co|g' .env.production

# Remplacer la clé Supabase
sed -i '' 's|NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here|NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA|g' .env.production

echo "✅ Fichier .env.production corrigé !"
echo ""
echo "📋 Vérification:"
cat .env.production | grep SUPABASE
