const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

// Configuration Supabase
const supabaseUrl = 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugLogin() {
  try {
    const email = 'sebtifatiha@live.fr'
    const password = 'Admin123!'
    
    console.log('🔍 Test de connexion avec:', email)
    
    // 1. Récupérer l'admin depuis la base
    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()
    
    if (fetchError) {
      console.error('❌ Erreur récupération admin:', fetchError)
      return
    }
    
    if (!admin) {
      console.error('❌ Admin non trouvé')
      return
    }
    
    console.log('✅ Admin trouvé:', {
      id: admin.id,
      email: admin.email,
      full_name: admin.full_name,
      has_password_hash: !!admin.password_hash,
      password_hash_length: admin.password_hash?.length
    })
    
    // 2. Tester la comparaison bcrypt
    if (!admin.password_hash) {
      console.error('❌ Pas de password_hash trouvé')
      return
    }
    
    console.log('🔐 Test de comparaison bcrypt...')
    const isValid = await bcrypt.compare(password, admin.password_hash)
    
    console.log('🔑 Résultat comparaison:', isValid ? '✅ VALIDE' : '❌ INVALIDE')
    
    if (!isValid) {
      console.log('🔧 Création d\'un nouveau hash pour test...')
      const newHash = await bcrypt.hash(password, 10)
      console.log('Nouveau hash:', newHash)
      
      const testValid = await bcrypt.compare(password, newHash)
      console.log('Test nouveau hash:', testValid ? '✅ VALIDE' : '❌ INVALIDE')
    }
    
  } catch (error) {
    console.error('💥 Erreur générale:', error)
  }
}

debugLogin()
