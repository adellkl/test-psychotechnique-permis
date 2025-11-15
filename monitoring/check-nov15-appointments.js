const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkNov15Appointments() {
    console.log('🔍 Vérification des rendez-vous du 15 novembre 2025\n')

    // 1. Récupérer TOUS les rendez-vous du 15 novembre (tous statuts)
    const { data: nov15All, error: nov15Error } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', '2025-11-15')
        .order('appointment_time')

    if (nov15Error) {
        console.error('❌ Erreur:', nov15Error)
        return
    }

    console.log(`📊 Total rendez-vous du 15 novembre: ${nov15All?.length || 0}\n`)

    if (!nov15All || nov15All.length === 0) {
        console.log('❌ AUCUN rendez-vous trouvé dans la base pour le 15 novembre !')
        console.log('⚠️  Les rendez-vous ont probablement été supprimés par erreur.')

        // Récupérer tous les rendez-vous pour voir s'il en reste
        const { data: allApts } = await supabase
            .from('appointments')
            .select('appointment_date, status')

        console.log('\n📊 Total de TOUS les rendez-vous dans la base:', allApts?.length || 0)

        if (allApts && allApts.length > 0) {
            const dates = [...new Set(allApts.map(a => a.appointment_date))].sort()
            console.log('📅 Dates présentes dans la base:', dates)
        }

        return
    }

    console.log('✅ Rendez-vous trouvés:\n')

    // Récupérer les centres
    const { data: centers } = await supabase
        .from('centers')
        .select('*')

    nov15All.forEach((apt, index) => {
        const center = centers?.find(c => c.id === apt.center_id)
        console.log(`${index + 1}. ${apt.first_name} ${apt.last_name}`)
        console.log(`   📅 Date: ${apt.appointment_date}`)
        console.log(`   ⏰ Heure: ${apt.appointment_time}`)
        console.log(`   📊 Statut: ${apt.status}`)
        console.log(`   📍 Centre: ${center?.name || 'Inconnu'} (ID: ${apt.center_id})`)
        console.log(`   📧 Email: ${apt.email}`)
        console.log(`   📞 Téléphone: ${apt.phone}`)
        console.log(`   🆔 ID: ${apt.id}`)
        console.log('')
    })

    // Grouper par statut
    const byStatus = nov15All.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1
        return acc
    }, {})

    console.log('📈 Répartition par statut:')
    Object.entries(byStatus).forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`)
    })

    // Grouper par centre
    const byCenter = nov15All.reduce((acc, apt) => {
        const center = centers?.find(c => c.id === apt.center_id)
        const centerName = center?.name || 'Inconnu'
        acc[centerName] = (acc[centerName] || 0) + 1
        return acc
    }, {})

    console.log('\n📍 Répartition par centre:')
    Object.entries(byCenter).forEach(([centerName, count]) => {
        console.log(`   ${centerName}: ${count}`)
    })
}

checkNov15Appointments()
    .then(() => {
        console.log('\n✅ Diagnostic terminé')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Erreur:', error)
        process.exit(1)
    })
