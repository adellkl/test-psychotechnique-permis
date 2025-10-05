const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

// Configuration Supabase
const supabaseUrl = 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function resetAdminAccount() {
  try {
    console.log('🔄 Suppression de tous les comptes admin existants...')
    
    // 1. Supprimer tous les comptes admin
    const { error: deleteError } = await supabase
      .from('admins')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (deleteError) {
      console.error('❌ Erreur lors de la suppression:', deleteError)
      return
    }
    
    console.log('✅ Tous les comptes admin supprimés')
    
    // 2. Créer le hash du mot de passe
    console.log('🔐 Création du hash pour le mot de passe...')
    const password = 'Admin123!'
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    // 3. Créer le compte admin unique
    console.log('👤 Création du compte admin principal...')
    const { data: newAdmin, error: insertError } = await supabase
      .from('admins')
      .insert([
        {
          email: 'sebtifatiha@live.fr',
          password_hash: hashedPassword,
          full_name: 'Administrateur Principal',
          phone: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
    
    if (insertError) {
      console.error('❌ Erreur lors de la création:', insertError)
      return
    }
    
    console.log('✅ Compte admin créé avec succès!')
    console.log('📧 Email:', 'sebtifatiha@live.fr')
    console.log('🔑 Mot de passe stocké dans la base de données avec hash sécurisé')
    
    // 4. Vérifier le compte créé
    const { data: admins, error: countError } = await supabase
      .from('admins')
      .select('*')
    
    if (countError) {
      console.error('❌ Erreur lors de la vérification:', countError)
      return
    }
    
    console.log(`\n📊 Nombre total d'admins: ${admins.length}`)
    console.log('👤 Admin créé:', admins[0])
    
  } catch (error) {
    console.error('💥 Erreur générale:', error)
  }
}

// Exécuter le script
resetAdminAccount()
