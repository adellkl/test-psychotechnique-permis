/**
 * Script pour fixer le mot de passe admin
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

async function fixAdminPassword() {
  try {
    console.log('🔧 Mise à jour du mot de passe admin...\n')

    const email = 'admin@permis-expert.fr'
    const password = 'admin123'
    const fullName = 'Admin Permis Expert'

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Vérifier si l'admin existe
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
          updated_at: new Date().toISOString()
        })
        .eq('email', email.toLowerCase())

      if (error) {
        console.error('❌ Erreur lors de la mise à jour:', error.message)
        process.exit(1)
      }

      console.log('✅ Mot de passe admin mis à jour avec succès!\n')
    } else {
      // Créer un nouveau compte admin
      const { error } = await supabase
        .from('admins')
        .insert([{
          full_name: fullName,
          email: email.toLowerCase(),
          password: hashedPassword,
          created_at: new Date().toISOString()
        }])

      if (error) {
        console.error('❌ Erreur lors de la création:', error.message)
        process.exit(1)
      }

      console.log('✅ Compte administrateur créé avec succès!\n')
    }

    console.log('📝 Identifiants de connexion:')
    console.log(`   Email: ${email}`)
    console.log(`   Mot de passe: ${password}\n`)

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

fixAdminPassword()
