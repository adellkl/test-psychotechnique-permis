#!/usr/bin/env node

/**
 * Script de diagnostic pour vérifier les rendez-vous du centre de Clichy
 */

const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement Supabase manquantes')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Définie' : '❌ Manquante')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkClichy() {
    console.log('🔍 Vérification des centres...\n')

    // 1. Récupérer tous les centres
    const { data: centers, error: centersError } = await supabase
        .from('centers')
        .select('*')

    if (centersError) {
        console.error('❌ Erreur lors de la récupération des centres:', centersError)
        return
    }

    console.log('📍 Centres disponibles:')
    centers?.forEach(center => {
        console.log(`   - ${center.name} (ID: ${center.id})`)
        console.log(`     ${center.address}, ${center.postal_code} ${center.city}`)
    })

    // 2. Trouver le centre de Clichy
    const clichy = centers?.find(c => c.city?.toLowerCase().includes('clichy'))

    if (!clichy) {
        console.error('\n❌ Centre de Clichy non trouvé dans la base de données')
        return
    }

    console.log(`\n✅ Centre de Clichy trouvé: ${clichy.name} (ID: ${clichy.id})`)

    // 3. Récupérer tous les rendez-vous pour Clichy
    const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select('*')
        .eq('center_id', clichy.id)
        .order('appointment_date', { ascending: false })

    if (apptError) {
        console.error('❌ Erreur lors de la récupération des rendez-vous:', apptError)
        return
    }

    console.log(`\n📊 Rendez-vous pour le centre de Clichy:`)
    console.log(`   Total: ${appointments?.length || 0} rendez-vous`)

    if (appointments && appointments.length > 0) {
        // Grouper par statut
        const byStatus = appointments.reduce((acc, apt) => {
            acc[apt.status] = (acc[apt.status] || 0) + 1
            return acc
        }, {})

        console.log('\n📈 Répartition par statut:')
        Object.entries(byStatus).forEach(([status, count]) => {
            const emoji = status === 'confirmed' ? '✅' : status === 'completed' ? '✓' : status === 'cancelled' ? '❌' : '⏳'
            console.log(`   ${emoji} ${status}: ${count}`)
        })

        console.log('\n📋 Détails des rendez-vous:')
        appointments.forEach((apt, index) => {
            console.log(`\n   ${index + 1}. ${apt.first_name} ${apt.last_name}`)
            console.log(`      📅 Date: ${apt.appointment_date} à ${apt.appointment_time}`)
            console.log(`      📍 Centre: ${apt.center_id}`)
            console.log(`      📊 Statut: ${apt.status}`)
            console.log(`      📧 Email: ${apt.email}`)
            console.log(`      📱 Téléphone: ${apt.phone}`)
        })
    } else {
        console.log('   ⚠️  Aucun rendez-vous trouvé pour ce centre')
    }

    // 4. Vérifier TOUS les rendez-vous (sans filtre de centre)
    const { data: allAppointments, error: allError } = await supabase
        .from('appointments')
        .select('center_id, status')

    if (!allError && allAppointments) {
        console.log(`\n📊 Total de tous les rendez-vous dans la base: ${allAppointments.length}`)

        // Grouper par centre
        const byCenterId = allAppointments.reduce((acc, apt) => {
            const centerId = apt.center_id || 'null'
            acc[centerId] = (acc[centerId] || 0) + 1
            return acc
        }, {})

        console.log('\n📈 Répartition par centre:')
        Object.entries(byCenterId).forEach(([centerId, count]) => {
            const center = centers?.find(c => c.id === centerId)
            const centerName = center ? center.name : `ID inconnu: ${centerId}`
            console.log(`   - ${centerName}: ${count} rendez-vous`)
        })
    }
}

checkClichy()
    .then(() => {
        console.log('\n✅ Diagnostic terminé')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Erreur:', error)
        process.exit(1)
    })
