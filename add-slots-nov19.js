const { createClient } = require('@supabase/supabase-js')

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement manquantes')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
    console.error('SUPABASE_KEY:', supabaseKey ? '✓' : '✗')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Créneaux à ajouter pour le 19 novembre 2025
const slots = [
    { start_time: '16:20:00', end_time: '18:20:00' },
    { start_time: '16:40:00', end_time: '18:40:00' },
    { start_time: '17:00:00', end_time: '19:00:00' },
    { start_time: '17:20:00', end_time: '19:20:00' },
    { start_time: '17:40:00', end_time: '19:40:00' },
    { start_time: '18:00:00', end_time: '20:00:00' }
]

async function addSlots() {
    console.log('🚀 Ajout des créneaux du 19 novembre 2025...\n')

    // Récupérer les centres disponibles
    const { data: centers, error: centersError } = await supabase
        .from('centers')
        .select('id, name, city')
        .eq('is_active', true)

    if (centersError) {
        console.error('❌ Erreur lors de la récupération des centres:', centersError)
        return
    }

    if (!centers || centers.length === 0) {
        console.error('❌ Aucun centre actif trouvé')
        return
    }

    console.log('📍 Centres actifs trouvés:')
    centers.forEach(c => console.log(`   - ${c.name} (${c.city}) - ID: ${c.id}`))
    console.log()

    // Trouver le centre Colombes
    const colombes = centers.find(c => c.city?.toLowerCase().includes('colombes') || c.name?.toLowerCase().includes('colombes'))

    if (!colombes) {
        console.error('❌ Centre de Colombes non trouvé')
        console.log('Centres disponibles:', centers.map(c => `${c.name} (${c.city})`).join(', '))
        console.log('Utilisation du premier centre disponible:', centers[0].name)
    }

    const centerId = colombes?.id || centers[0].id
    const centerName = colombes?.name || centers[0].name

    console.log(`✓ Utilisation du centre: ${centerName} (ID: ${centerId})\n`)

    // Préparer les créneaux à insérer
    const slotsToInsert = slots.map(slot => ({
        date: '2025-11-19',
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_available: true,
        max_appointments: 1,
        center_id: centerId,
        created_at: new Date().toISOString()
    }))

    // Insérer les créneaux
    const { data, error } = await supabase
        .from('available_slots')
        .insert(slotsToInsert)
        .select()

    if (error) {
        console.error('❌ Erreur lors de l\'insertion:', error)
        return
    }

    console.log('✅ Créneaux ajoutés avec succès!\n')
    console.log(`📊 ${data.length} créneaux insérés pour le 19 novembre 2025:\n`)
    data.forEach(slot => {
        console.log(`   ✓ ${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`)
    })

    console.log('\n🎉 Terminé! Les créneaux sont maintenant disponibles dans le calendrier.\n')
}

addSlots().catch(console.error)
