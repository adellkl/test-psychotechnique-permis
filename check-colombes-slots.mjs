import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkData() {
  console.log('🔍 Vérification des centres et créneaux...\n')

  // 1. Vérifier les centres
  console.log('📍 === CENTRES ===')
  const { data: centers, error: centersError } = await supabase
    .from('centers')
    .select('*')
    .order('name')

  if (centersError) {
    console.error('❌ Erreur centres:', centersError)
  } else {
    console.log(`✅ ${centers.length} centres trouvés:`)
    centers.forEach(center => {
      console.log(`  - ${center.name} (ID: ${center.id})`)
      console.log(`    ${center.address}, ${center.postal_code} ${center.city}`)
      console.log(`    Active: ${center.is_active}`)
    })
  }

  // 2. Vérifier les créneaux pour Colombes
  console.log('\n⏰ === CRÉNEAUX POUR COLOMBES ===')
  
  // Trouver l'ID du centre Colombes
  const colombesCenter = centers?.find(c => 
    c.city?.toLowerCase().includes('colombes') || 
    c.name?.toLowerCase().includes('colombes') ||
    c.name?.toLowerCase().includes('2e chance')
  )

  if (!colombesCenter) {
    console.log('⚠️  Centre Colombes non trouvé dans la base!')
    console.log('   Vérifiez que le centre existe et est actif.')
  } else {
    console.log(`✅ Centre Colombes trouvé: ${colombesCenter.name} (ID: ${colombesCenter.id})`)
    
    // Récupérer les créneaux pour ce centre
    const { data: slots, error: slotsError } = await supabase
      .from('available_slots')
      .select('*')
      .eq('center_id', colombesCenter.id)
      .order('date')
      .order('start_time')

    if (slotsError) {
      console.error('❌ Erreur créneaux:', slotsError)
    } else {
      console.log(`\n📊 ${slots.length} créneaux trouvés pour Colombes:`)
      
      if (slots.length === 0) {
        console.log('⚠️  AUCUN CRÉNEAU TROUVÉ!')
        console.log('   → Les créneaux ont peut-être été créés avec un center_id différent')
      } else {
        // Grouper par date
        const slotsByDate = {}
        slots.forEach(slot => {
          if (!slotsByDate[slot.date]) {
            slotsByDate[slot.date] = []
          }
          slotsByDate[slot.date].push(slot)
        })

        Object.keys(slotsByDate).sort().forEach(date => {
          const dateSlots = slotsByDate[date]
          console.log(`\n  📅 ${date} (${dateSlots.length} créneaux):`)
          dateSlots.forEach(slot => {
            const status = slot.is_available ? '✅ Disponible' : '❌ Indisponible'
            console.log(`     ${slot.start_time} - ${slot.end_time} ${status}`)
          })
        })
      }
    }
  }

  // 3. Vérifier TOUS les créneaux (sans filtre de centre)
  console.log('\n🔍 === TOUS LES CRÉNEAUX (sans filtre) ===')
  const { data: allSlots, error: allSlotsError } = await supabase
    .from('available_slots')
    .select('id, date, start_time, center_id, is_available')
    .order('date')
    .limit(20)

  if (allSlotsError) {
    console.error('❌ Erreur:', allSlotsError)
  } else {
    console.log(`📊 ${allSlots.length} premiers créneaux (tous centres):`)
    allSlots.forEach(slot => {
      const centerInfo = centers?.find(c => c.id === slot.center_id)
      const centerName = centerInfo ? centerInfo.name : `ID inconnu: ${slot.center_id}`
      const status = slot.is_available ? '✅' : '❌'
      console.log(`  ${status} ${slot.date} ${slot.start_time} - ${centerName}`)
    })
  }

  // 4. Vérifier les créneaux sans center_id
  console.log('\n⚠️  === CRÉNEAUX SANS CENTER_ID ===')
  const { data: orphanSlots, error: orphanError } = await supabase
    .from('available_slots')
    .select('id, date, start_time')
    .is('center_id', null)
    .limit(10)

  if (orphanError) {
    console.error('❌ Erreur:', orphanError)
  } else if (orphanSlots && orphanSlots.length > 0) {
    console.log(`⚠️  ${orphanSlots.length} créneaux trouvés SANS center_id!`)
    orphanSlots.forEach(slot => {
      console.log(`  - ${slot.date} ${slot.start_time}`)
    })
    console.log('\n💡 Ces créneaux ne seront pas visibles dans le calendrier client!')
  } else {
    console.log('✅ Aucun créneau orphelin trouvé')
  }

  console.log('\n✅ Vérification terminée!')
}

checkData().catch(console.error)
