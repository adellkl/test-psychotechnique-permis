const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function deleteAllLogs() {
  console.log('🗑️  Suppression de tous les logs admin...')
  
  // Compter d'abord
  const { count, error: countError } = await supabase
    .from('admin_logs')
    .select('*', { count: 'exact', head: true })
  
  if (countError) {
    console.error('❌ Erreur lors du comptage:', countError.message)
    return
  }
  
  console.log(`📊 Nombre de logs à supprimer: ${count}`)
  
  if (count === 0) {
    console.log('✅ Aucun log à supprimer')
    return
  }
  
  // Supprimer tous les logs
  const { error: deleteError } = await supabase
    .from('admin_logs')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Condition qui matche tous les logs
  
  if (deleteError) {
    console.error('❌ Erreur lors de la suppression:', deleteError.message)
    return
  }
  
  console.log(`✅ ${count} logs supprimés avec succès!`)
}

deleteAllLogs()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Erreur:', err)
    process.exit(1)
  })
