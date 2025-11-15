const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkSlots() {
    console.log('🔍 Diagnostic des créneaux du 15 novembre 2025\n')

    // 1. Récupérer les centres
    const { data: centers } = await supabase.from('centers').select('*')
    const clichy = centers?.find(c => c.city?.toLowerCase().includes('clichy'))

    if (!clichy) {
        console.error('❌ Centre Clichy non trouvé')
        return
    }

    console.log(`✅ Centre Clichy: ${clichy.name} (ID: ${clichy.id})\n`)

    // 2. Récupérer les rendez-vous du 15 novembre
    const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', '2025-11-15')
        .eq('center_id', clichy.id)
        .order('appointment_time')

    console.log(`📊 Rendez-vous du 15 novembre pour Clichy: ${appointments?.length || 0}\n`)

    if (appointments) {
        appointments.forEach(apt => {
            const statusIcon = apt.status === 'confirmed' ? '✅' : apt.status === 'cancelled' ? '❌' : '⏸️'
            console.log(`${statusIcon} ${apt.appointment_time} - ${apt.first_name} ${apt.last_name} (${apt.status})`)
        })
    }

    // 3. Récupérer les créneaux disponibles du 15 novembre
    const { data: slots } = await supabase
        .from('available_slots')
        .select('*')
        .eq('date', '2025-11-15')
        .eq('center_id', clichy.id)
        .order('start_time')

    console.log(`\n📅 Créneaux dans available_slots pour le 15 novembre: ${slots?.length || 0}\n`)

    if (slots && slots.length > 0) {
        slots.forEach(slot => {
            const availIcon = slot.is_available !== false ? '✅' : '❌'
            console.log(`${availIcon} ${slot.start_time || slot.time} - is_available: ${slot.is_available}`)
        })
    } else {
        console.log('⚠️  AUCUN créneau trouvé dans available_slots pour cette date !')
    }

    // 4. Simuler ce que l'API retournerait
    console.log('\n🔍 Simulation de l\'API /api/available-slots:\n')

    // Récupérer les rendez-vous confirmés
    const confirmedAppointments = appointments?.filter(apt => apt.status === 'confirmed') || []
    console.log(`🔒 ${confirmedAppointments.length} rendez-vous "confirmed" qui bloquent des créneaux:`)
    confirmedAppointments.forEach(apt => {
        console.log(`   - ${apt.appointment_time}`)
    })

    // Créer la liste des créneaux bloqués
    const bookedSlots = new Set(
        confirmedAppointments.map(apt => `2025-11-15_${apt.appointment_time}`)
    )

    // Filtrer les créneaux disponibles
    const availableSlots = slots?.filter(slot => {
        const time = slot.start_time || slot.time
        const slotKey = `2025-11-15_${time}`
        const isNotBooked = !bookedSlots.has(slotKey)
        const isAvailable = slot.is_available !== false
        return isNotBooked && isAvailable
    })

    console.log(`\n✅ ${availableSlots?.length || 0} créneaux qui devraient être retournés au client:\n`)
    if (availableSlots) {
        availableSlots.forEach(slot => {
            console.log(`   ✓ ${slot.start_time || slot.time}`)
        })
    }

    // 5. Vérifier les créneaux des rendez-vous cancelled
    const cancelledAppointments = appointments?.filter(apt => apt.status === 'cancelled') || []
    console.log(`\n❌ ${cancelledAppointments.length} rendez-vous "cancelled":`)

    cancelledAppointments.forEach(apt => {
        console.log(`\n   🕐 Heure: ${apt.appointment_time}`)

        // Vérifier si un créneau existe pour cette heure
        const slotExists = slots?.find(s => {
            const time = s.start_time || s.time
            return time === apt.appointment_time
        })

        if (slotExists) {
            console.log(`   ✅ Créneau existe dans available_slots`)
            console.log(`      - is_available: ${slotExists.is_available}`)
            console.log(`      - ${slotExists.is_available !== false ? '✓ Devrait être visible' : '✗ Masqué (is_available=false)'}`)
        } else {
            console.log(`   ❌ AUCUN créneau correspondant dans available_slots !`)
            console.log(`   ⚠️  Il faut créer ce créneau dans la table pour qu'il soit visible`)
        }
    })
}

checkSlots()
    .then(() => {
        console.log('\n✅ Diagnostic terminé')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Erreur:', error)
        process.exit(1)
    })
