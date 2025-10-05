const { createClient } = require('@supabase/supabase-js')

// Configuration Supabase
const supabaseUrl = 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAllAdmins() {
  try {
    console.log('🔍 Vérification de tous les comptes admin...')
    
    const { data: admins, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erreur:', error)
      return
    }
    
    console.log(`📊 Nombre total d'admins: ${admins.length}`)
    console.log('\n📋 Liste des comptes admin:')
    
    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. Admin ID: ${admin.id}`)
      console.log(`   📧 Email: ${admin.email}`)
      console.log(`   👤 Nom: ${admin.full_name}`)
      console.log(`   📞 Téléphone: ${admin.phone || 'Non renseigné'}`)
      console.log(`   🔐 Hash présent: ${admin.password_hash ? '✅ Oui' : '❌ Non'}`)
      console.log(`   📅 Créé le: ${new Date(admin.created_at).toLocaleString('fr-FR')}`)
      console.log(`   🔄 Modifié le: ${new Date(admin.updated_at).toLocaleString('fr-FR')}`)
    })
    
  } catch (error) {
    console.error('💥 Erreur générale:', error)
  }
}

checkAllAdmins()
