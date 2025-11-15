const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function restoreAppointments() {
    console.log('🔄 RESTAURATION des rendez-vous du 15 novembre 2025\n')

    // 1. Récupérer l'ID du centre de Clichy
    const { data: centers, error: centersError } = await supabase
        .from('centers')
        .select('*')

    if (centersError) {
        console.error('❌ Erreur centres:', centersError)
        return
    }

    const clichy = centers?.find(c => c.city?.toLowerCase().includes('clichy'))
    if (!clichy) {
        console.error('❌ Centre de Clichy non trouvé')
        return
    }

    console.log(`✅ Centre Clichy trouvé: ${clichy.name} (ID: ${clichy.id})\n`)

    // 2. Rendez-vous à restaurer (depuis les emails)
    const appointmentsToRestore = [
        {
            first_name: 'Brahima',
            last_name: 'KONATE',
            email: 'brahima.konate@example.com', // Email à mettre à jour si tu l'as
            phone: '06 XX XX XX XX', // Téléphone à mettre à jour
            appointment_date: '2025-11-15',
            appointment_time: '19:20:00',
            status: 'confirmed'
        },
        {
            first_name: 'Aoued',
            last_name: 'Benamrane',
            email: 'aoued.benamrane@example.com',
            phone: '06 14 52 44 15',
            appointment_date: '2025-11-15',
            appointment_time: '19:00:00',
            status: 'confirmed'
        },
        {
            first_name: 'Rayan',
            last_name: 'BANGHA',
            email: 'rayan.bangha@example.com',
            phone: '06 16 09 12 86',
            appointment_date: '2025-11-15',
            appointment_time: '17:40:00',
            status: 'confirmed'
        },
        {
            first_name: 'BANGHA',
            last_name: 'RAYAN',
            email: 'bangha.rayan@example.com',
            phone: '06 16 09 12 86',
            appointment_date: '2025-11-15',
            appointment_time: '18:00:00',
            status: 'confirmed'
        },
        {
            first_name: 'Emily',
            last_name: 'Maarek',
            email: 'emily.maarek@example.com',
            phone: '06 XX XX XX XX',
            appointment_date: '2025-11-15',
            appointment_time: '18:20:00',
            status: 'confirmed'
        },
        {
            first_name: 'Jawad',
            last_name: 'El baghdadi',
            email: 'jawad.elbaghdadi@example.com',
            phone: '06 XX XX XX XX',
            appointment_date: '2025-11-15',
            appointment_time: '18:40:00',
            status: 'confirmed'
        }
    ]

    console.log(`📋 ${appointmentsToRestore.length} rendez-vous à restaurer\n`)

    // 3. Insérer les rendez-vous
    for (const apt of appointmentsToRestore) {
        const appointmentData = {
            ...apt,
            center_id: clichy.id,
            duration_minutes: 40,
            test_type: 'Test psychotechnique',
            reason: 'Suspension de permis',
            is_second_chance: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase
            .from('appointments')
            .insert([appointmentData])
            .select()

        if (error) {
            console.error(`❌ Erreur pour ${apt.first_name} ${apt.last_name}:`, error.message)
        } else {
            console.log(`✅ Restauré: ${apt.first_name} ${apt.last_name} - ${apt.appointment_time}`)
        }
    }

    console.log('\n🎉 Restauration terminée !')

    // 4. Vérification
    const { data: verif } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', '2025-11-15')
        .eq('center_id', clichy.id)

    console.log(`\n✅ Rendez-vous du 15 novembre dans la base: ${verif?.length || 0}`)
}

restoreAppointments()
    .then(() => {
        console.log('\n✅ Script terminé')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Erreur:', error)
        process.exit(1)
    })
