import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hzfpscgdyrqbplmhgwhi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'
)

console.log('🔍 Vérification Colombes...\n')

// 1. Centres
const { data: centers } = await supabase.from('centers').select('*').order('name')
console.log('📍 CENTRES:')
centers?.forEach(c => console.log(`  ${c.name} → ID: ${c.id} (${c.city})`))

// 2. Créneaux Colombes
const colombes = centers?.find(c => c.city?.includes('Colombes'))
if (colombes) {
  console.log(`\n✅ Centre Colombes: ${colombes.id}`)
  
  const { data: slots } = await supabase
    .from('available_slots')
    .select('*')
    .eq('center_id', colombes.id)
    .limit(5)
  
  console.log(`\n⏰ Créneaux Colombes (${slots?.length || 0}):`)
  slots?.forEach(s => console.log(`  ${s.date} ${s.start_time} - disponible: ${s.is_available}`))
} else {
  console.log('\n❌ Centre Colombes introuvable!')
}

// 3. Tous les créneaux
const { data: allSlots } = await supabase
  .from('available_slots')
  .select('center_id')
  .limit(100)

const centerCounts = {}
allSlots?.forEach(s => {
  centerCounts[s.center_id] = (centerCounts[s.center_id] || 0) + 1
})

console.log('\n📊 Répartition des créneaux:')
Object.entries(centerCounts).forEach(([id, count]) => {
  const center = centers?.find(c => c.id === id)
  console.log(`  ${center?.name || 'Inconnu'}: ${count} créneaux`)
})
