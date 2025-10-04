/**
 * Script pour configurer les identifiants administrateur
 * Exécutez ce script pour créer ou mettre à jour votre compte admin
 */

const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erreur: Variables SUPABASE manquantes dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupAdmin() {
  console.log('🔧 Configuration de l\'administrateur...\n')

  // Demandez les informations
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (query) => new Promise((resolve) => readline.question(query, resolve))

  try {
    console.log('Entrez les informations du compte administrateur:\n')
    
    const fullName = await question('Nom complet: ')
    const email = await question('Email: ')
    const password = await question('Mot de passe: ')
    const phone = await question('Téléphone (optionnel): ')

    console.log('\n📝 Création/Mise à jour du compte admin...')

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Vérifier si un admin existe déjà
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (existingAdmin) {
      // Mettre à jour l'admin existant
      const { error } = await supabase
        .from('admins')
        .update({
          full_name: fullName,
          password: hashedPassword,
          phone: phone || null,
          updated_at: new Date().toISOString()
        })
        .eq('email', email.toLowerCase())

      if (error) {
        console.error('❌ Erreur lors de la mise à jour:', error.message)
        process.exit(1)
      }

      console.log('✅ Compte administrateur mis à jour avec succès!\n')
    } else {
      // Créer un nouveau compte admin
      const { error } = await supabase
        .from('admins')
        .insert([{
          full_name: fullName,
          email: email.toLowerCase(),
          password: hashedPassword,
          phone: phone || null,
          created_at: new Date().toISOString()
        }])

      if (error) {
        console.error('❌ Erreur lors de la création:', error.message)
        process.exit(1)
      }

      console.log('✅ Compte administrateur créé avec succès!\n')
    }

    console.log('📋 Informations de connexion:')
    console.log(`   Email: ${email}`)
    console.log(`   Mot de passe: ${password}`)
    console.log('\n🔒 Conservez ces informations en lieu sûr!\n')

  } catch (error) {
    console.error('❌ Erreur:', error.message)
  } finally {
    readline.close()
  }
}

setupAdmin()
