#!/bin/bash

echo "🚀 Optimisation intelligente du code en cours..."

find app/components -type f -name "*.tsx" | while read file; do
    echo "Optimisation de $file..."
    
    perl -i -pe 's/\s*\/\*.*?\*\/\s*//gs' "$file"
    
    perl -i -pe 's/^(\s*)\/\/(?!\/)[^\n]*$/$1/gm' "$file"
    
    perl -i -0777 -pe 's/\n{3,}/\n\n/g' "$file"
done

echo "✅ Optimisation terminée!"
echo "📊 Fichiers optimisés dans app/components"
