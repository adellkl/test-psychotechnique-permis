#!/usr/bin/env node

/**
 * Script de synchronisation des templates email vers Supabase
 * Usage: node sync-email-templates.js
 * 
 * Ce script lit les templates depuis emailTemplates.ts et les synchronise avec Supabase
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Charger le fichier .env approprié
if (fs.existsSync(path.join(__dirname, '.env.production'))) {
  require('dotenv').config({ path: '.env.production' })
  console.log('📁 Utilisation de .env.production')
} else if (fs.existsSync(path.join(__dirname, '.env.local'))) {
  require('dotenv').config({ path: '.env.local' })
  console.log('📁 Utilisation de .env.local')
} else {
  require('dotenv').config()
  console.log('📁 Utilisation de .env')
}

// Lire et parser le fichier TypeScript manuellement
function loadTemplatesFromTS() {
  const filePath = path.join(__dirname, 'lib', 'emailTemplates.ts')
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Extraire uniquement le tableau defaultEmailTemplates
  // On cherche le début et la fin du tableau
  const startMatch = content.match(/export const defaultEmailTemplates = \[/)
  if (!startMatch) {
    throw new Error('Impossible de trouver defaultEmailTemplates dans le fichier')
  }
  
  const startIndex = startMatch.index + startMatch[0].length - 1 // On garde le [
  
  // Trouver la fin du tableau (le dernier ] avant la fonction)
  let bracketCount = 0
  let endIndex = startIndex
  
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '[') bracketCount++
    if (content[i] === ']') {
      bracketCount--
      if (bracketCount === 0) {
        endIndex = i + 1
        break
      }
    }
  }
  
  // Extraire uniquement le tableau
  const arrayContent = content.substring(startIndex, endIndex)
  
  // Créer un fichier JS valide
  const jsContent = `module.exports.defaultEmailTemplates = ${arrayContent}`
  
  // Écrire temporairement en JS
  const tempFile = path.join(__dirname, '.temp-templates.js')
  fs.writeFileSync(tempFile, jsContent)
  
  try {
    // Importer le fichier JS temporaire
    const templates = require(tempFile)
    return templates.defaultEmailTemplates
  } finally {
    // Supprimer le fichier temporaire
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile)
    }
  }
}

const defaultEmailTemplates = loadTemplatesFromTS()

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erreur: Variables d\'environnement Supabase manquantes')
  console.error('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function syncTemplates() {
  console.log('🔄 Début de la synchronisation des templates email...\n')

  for (const template of defaultEmailTemplates) {
    console.log(`📧 Mise à jour: ${template.template_name}`)
    
    try {
      // Vérifier si le template existe
      const { data: existing, error: checkError } = await supabase
        .from('email_templates')
        .select('id')
        .eq('template_name', template.template_name)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existing) {
        // UPDATE si le template existe
        const { error: updateError } = await supabase
          .from('email_templates')
          .update({
            subject: template.subject,
            html_content: template.html_content,
            text_content: template.text_content,
            updated_at: new Date().toISOString()
          })
          .eq('template_name', template.template_name)

        if (updateError) {
          throw updateError
        }

        console.log(`  ✅ Template mis à jour`)
        console.log(`  📏 Longueur HTML: ${template.html_content.length} caractères`)
        console.log(`  📝 Longueur texte: ${template.text_content.length} caractères\n`)
      } else {
        // INSERT si le template n'existe pas
        const { error: insertError } = await supabase
          .from('email_templates')
          .insert({
            template_name: template.template_name,
            subject: template.subject,
            html_content: template.html_content,
            text_content: template.text_content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          throw insertError
        }

        console.log(`  ✅ Nouveau template créé`)
        console.log(`  📏 Longueur HTML: ${template.html_content.length} caractères`)
        console.log(`  📝 Longueur texte: ${template.text_content.length} caractères\n`)
      }
    } catch (error) {
      console.error(`  ❌ Erreur pour ${template.template_name}:`, error.message)
      console.error(`  Détails:`, error)
      console.log('')
    }
  }

  // Vérification finale
  console.log('📊 Vérification finale...\n')
  const { data: allTemplates, error: listError } = await supabase
    .from('email_templates')
    .select('template_name, subject, updated_at')
    .order('template_name')

  if (listError) {
    console.error('❌ Erreur lors de la vérification:', listError.message)
  } else {
    console.log('✅ Templates dans la base de données:')
    allTemplates.forEach(t => {
      console.log(`  - ${t.template_name}`)
      console.log(`    Sujet: ${t.subject}`)
      console.log(`    Mis à jour: ${new Date(t.updated_at).toLocaleString('fr-FR')}\n`)
    })
  }

  console.log('✨ Synchronisation terminée!')
}

// Exécution
syncTemplates()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })
