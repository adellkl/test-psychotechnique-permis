const { createClient } = require('@supabase/supabase-js')

// Configuration Supabase
const supabaseUrl = 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function getAdminCredentials() {
  try {
    console.log('🔍 Récupération des informations admin...')
    
    const { data: admin, error } = await supabase
      .from('admins')
      .select('email, full_name, created_at')
      .eq('email', 'sebtifatiha@live.fr')
      .single()
    
    if (error) {
      console.error('❌ Erreur:', error)
      return
    }
    
    if (!admin) {
      console.log('❌ Aucun admin trouvé avec cet email')
      return
    }
    
    console.log('✅ Compte admin trouvé:')
    console.log('📧 Email:', admin.email)
    console.log('👤 Nom:', admin.full_name)
    console.log('📅 Créé le:', new Date(admin.created_at).toLocaleString('fr-FR'))
    console.log('🔑 Mot de passe: Admin123!')
    console.log('\n💡 Utilisez ces identifiants pour vous connecter sur http://localhost:3001/admin')
    
  } catch (error) {
    console.error('💥 Erreur générale:', error)
  }
}

// Exécuter le script
getAdminCredentials()
