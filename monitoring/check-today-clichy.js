const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables Supabase manquantes')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTodayClichyAppointments() {
    const today = new Date().toISOString().split('T')[0]
    console.log(`📅 Date d'aujourd'hui : ${today}\n`)

    // 1. Récupérer le centre de Clichy
    const { data: centers, error: centersError } = await supabase
        .from('centers')
        .select('*')

    if (centersError) {
        console.error('❌ Erreur centres:', centersError)
        return
    }

    console.log('📍 Centres disponibles:')
    centers?.forEach(c => {
        console.log(`   - ${c.name} (ID: ${c.id}) - ${c.city}`)
    })

    const clichy = centers?.find(c => c.city?.toLowerCase().includes('clichy'))
    if (!clichy) {
        console.error('\n❌ Centre de Clichy non trouvé')
        return
    }

    console.log(`\n✅ Centre Clichy trouvé: ${clichy.name} (ID: ${clichy.id})\n`)

    // 2. Récupérer TOUS les rendez-vous d'aujourd'hui (sans filtre statut)
    const { data: allToday, error: allError } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', today)

    console.log(`📊 TOUS les rendez-vous d'aujourd'hui (tous centres): ${allToday?.length || 0}`)

    if (allToday && allToday.length > 0) {
        console.log('\n📋 Détails:')
        allToday.forEach(apt => {
            const centerMatch = centers?.find(c => c.id === apt.center_id)
            console.log(`   - ${apt.first_name} ${apt.last_name}`)
            console.log(`     Centre ID: ${apt.center_id} (${centerMatch?.name || 'Inconnu'})`)
            console.log(`     Statut: ${apt.status}`)
            console.log(`     Heure: ${apt.appointment_time}`)
        })
    }

    // 3. Filtrer pour Clichy seulement
    const clichyToday = allToday?.filter(apt => apt.center_id === clichy.id)
    console.log(`\n🎯 Rendez-vous d'aujourd'hui pour CLICHY: ${clichyToday?.length || 0}`)

    if (clichyToday && clichyToday.length > 0) {
        console.log('\n📋 Détails Clichy:')
        clichyToday.forEach(apt => {
            console.log(`   - ${apt.first_name} ${apt.last_name}`)
            console.log(`     Statut: ${apt.status}`)
            console.log(`     Heure: ${apt.appointment_time}`)
        })

        // Grouper par statut
        const byStatus = clichyToday.reduce((acc, apt) => {
            acc[apt.status] = (acc[apt.status] || 0) + 1
            return acc
        }, {})

        console.log('\n📈 Répartition par statut:')
        Object.entries(byStatus).forEach(([status, count]) => {
            console.log(`   ${status}: ${count}`)
        })
    }

    // 4. Vérifier ce que la requête du dashboard retournerait
    console.log('\n🔍 Test de la requête du dashboard:')
    const { data: dashboardQuery, error: dashError } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', 'confirmed')
        .eq('center_id', clichy.id)
        .order('appointment_date', { ascending: false })

    if (dashError) {
        console.error('❌ Erreur requête dashboard:', dashError)
    } else {
        console.log(`✅ Requête dashboard retourne: ${dashboardQuery?.length || 0} rendez-vous`)

        if (dashboardQuery && dashboardQuery.length > 0) {
            console.log('\n📋 Rendez-vous retournés:')
            dashboardQuery.forEach(apt => {
                console.log(`   - ${apt.first_name} ${apt.last_name} - ${apt.appointment_date} ${apt.appointment_time}`)
            })
        }
    }

    // 5. Compter les rendez-vous d'aujourd'hui confirmés pour Clichy
    const todayConfirmedClichy = clichyToday?.filter(apt => apt.status === 'confirmed')
    console.log(`\n✅ Rendez-vous d'AUJOURD'HUI "confirmed" pour Clichy: ${todayConfirmedClichy?.length || 0}`)
}

checkTodayClichyAppointments()
    .then(() => {
        console.log('\n✅ Diagnostic terminé')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Erreur:', error)
        process.exit(1)
    })
