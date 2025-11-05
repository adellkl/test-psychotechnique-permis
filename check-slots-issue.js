#!/usr/bin/env node

/**
 * Script pour diagnostiquer le problème des créneaux affichés incorrectement
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function diagnoseSlotIssues() {
  console.log('🔍 Diagnostic des créneaux disponibles...\n')

  // 1. Vérifier tous les créneaux
  const { data: allSlots } = await supabase
    .from('available_slots')
    .select('*')
    .order('date')
    .order('start_time')

  console.log(`📊 Total des créneaux dans la base: ${allSlots?.length || 0}\n`)

  // 2. Grouper par centre
  const slotsByCenter = {}
  allSlots?.forEach(slot => {
    const centerId = slot.center_id || 'NULL'
    if (!slotsByCenter[centerId]) {
      slotsByCenter[centerId] = []
    }
    slotsByCenter[centerId].push(slot)
  })

  console.log('📍 Répartition par centre:')
  Object.keys(slotsByCenter).forEach(centerId => {
    const slots = slotsByCenter[centerId]
    const available = slots.filter(s => s.is_available).length
    const unavailable = slots.filter(s => !s.is_available).length
    
    console.log(`  Centre ID ${centerId}:`)
    console.log(`    - Total: ${slots.length}`)
    console.log(`    - Disponibles: ${available}`)
    console.log(`    - Non disponibles: ${unavailable}`)
  })

  // 3. Vérifier les rendez-vous confirmés
  const { data: appointments } = await supabase
    .from('appointments')
    .select('appointment_date, appointment_time, status, center_id')
    .in('status', ['confirmed', 'completed'])

  console.log(`\n📅 Rendez-vous confirmés/complétés: ${appointments?.length || 0}`)

  const appointmentsByCenter = {}
  appointments?.forEach(apt => {
    const centerId = apt.center_id || 'NULL'
    if (!appointmentsByCenter[centerId]) {
      appointmentsByCenter[centerId] = []
    }
    appointmentsByCenter[centerId].push(apt)
  })

  console.log('\n📍 Rendez-vous par centre:')
  Object.keys(appointmentsByCenter).forEach(centerId => {
    console.log(`  Centre ID ${centerId}: ${appointmentsByCenter[centerId].length} rendez-vous`)
  })

  // 4. Identifier les créneaux qui devraient être cachés
  console.log('\n⚠️  Créneaux qui DEVRAIENT être masqués (car rendez-vous confirmé):')
  let hiddenCount = 0
  allSlots?.forEach(slot => {
    const isBooked = appointments?.some(apt => 
      apt.appointment_date === slot.date && 
      apt.appointment_time === slot.start_time &&
      apt.center_id === slot.center_id
    )
    if (isBooked) {
      console.log(`  - ${slot.date} ${slot.start_time} (Centre ${slot.center_id})`)
      hiddenCount++
    }
  })
  console.log(`  Total: ${hiddenCount} créneaux`)

  // 5. Proposer des corrections
  console.log('\n💡 Recommandations:')
  
  const slotsWithNullCenter = allSlots?.filter(s => s.center_id === null) || []
  if (slotsWithNullCenter.length > 0) {
    console.log(`  ⚠️  ${slotsWithNullCenter.length} créneaux ont center_id = NULL`)
    console.log(`     Cela peut causer des problèmes de filtrage par centre`)
  }

  const appointmentsWithNullCenter = appointments?.filter(a => a.center_id === null) || []
  if (appointmentsWithNullCenter.length > 0) {
    console.log(`  ⚠️  ${appointmentsWithNullCenter.length} rendez-vous ont center_id = NULL`)
    console.log(`     Ces rendez-vous ne seront pas filtrés correctement`)
  }

  console.log('\n✅ Diagnostic terminé!')
}

diagnoseSlotIssues()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })
