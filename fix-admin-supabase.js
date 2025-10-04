/**
 * Script pour ajouter la colonne password et configurer l'admin
 */

const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erreur: Variables SUPABASE manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAdmin() {
  try {
    console.log('🔧 Configuration du compte admin...\n')

    const email = 'admin@permis-expert.fr'
    const password = 'admin123'
    const fullName = 'Admin Permis Expert'

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('📝 Mot de passe hashé:', hashedPassword, '\n')

    // Vérifier si l'admin existe
    const { data: existingAdmin, error: selectError } = await supabase
      .from('admins')
      .select('id, email, full_name')
      .eq('email', email.toLowerCase())
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('❌ Erreur lors de la vérification:', selectError.message)
      process.exit(1)
    }

    if (existingAdmin) {
      console.log('✅ Admin trouvé:', existingAdmin.email)
      console.log('\n⚠️  IMPORTANT: Allez sur Supabase et exécutez cette requête SQL:\n')
      console.log('-- Dans Table Editor > admins, ajoutez la colonne password (type: text)')
      console.log('-- Ou exécutez dans SQL Editor:\n')
      console.log('ALTER TABLE admins ADD COLUMN IF NOT EXISTS password TEXT;\n')
      console.log(`UPDATE admins SET password = '${hashedPassword}' WHERE email = '${email.toLowerCase()}';\n`)
    } else {
      console.log('⚠️  Aucun admin trouvé. Créez d\'abord un admin dans Supabase avec ces colonnes:')
      console.log('  - email: admin@permis-expert.fr')
      console.log('  - full_name: Admin Permis Expert')
      console.log('  - password: (ajoutez la colonne type TEXT)')
      console.log(`\nPuis exécutez: UPDATE admins SET password = '${hashedPassword}' WHERE email = 'admin@permis-expert.fr';\n`)
    }

    console.log('📝 Identifiants de connexion:')
    console.log(`   Email: ${email}`)
    console.log(`   Mot de passe: ${password}\n`)

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

fixAdmin()
