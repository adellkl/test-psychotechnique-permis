const { createClient } = require('@supabase/supabase-js')

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement manquantes')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function transferSlots() {
    console.log('🔄 Transfert des créneaux du 19 novembre de Clichy vers Colombes...\n')

    // 1. Récupérer les centres
    const { data: centers, error: centersError } = await supabase
        .from('centers')
        .select('id, name, city')
        .eq('is_active', true)

    if (centersError || !centers) {
        console.error('❌ Erreur lors de la récupération des centres:', centersError)
        return
    }

    // Trouver Clichy et Colombes
    const clichy = centers.find(c => c.city?.toLowerCase().includes('clichy') || c.name?.toLowerCase().includes('clichy'))
    const colombes = centers.find(c => c.city?.toLowerCase().includes('colombes') || c.name?.toLowerCase().includes('colombes'))

    if (!clichy) {
        console.error('❌ Centre de Clichy non trouvé')
        return
    }

    if (!colombes) {
        console.error('❌ Centre de Colombes non trouvé')
        return
    }

    console.log(`📍 Centre source: ${clichy.name} (ID: ${clichy.id})`)
    console.log(`📍 Centre destination: ${colombes.name} (ID: ${colombes.id})\n`)

    // 2. Récupérer les créneaux du 19 novembre pour Clichy
    const { data: clichySlots, error: slotsError } = await supabase
        .from('available_slots')
        .select('*')
        .eq('date', '2025-11-19')
        .eq('center_id', clichy.id)

    if (slotsError) {
        console.error('❌ Erreur lors de la récupération des créneaux:', slotsError)
        return
    }

    if (!clichySlots || clichySlots.length === 0) {
        console.log('⚠️ Aucun créneau trouvé pour Clichy le 19 novembre')
        return
    }

    console.log(`✓ ${clichySlots.length} créneaux trouvés pour Clichy le 19 novembre\n`)

    // Afficher les créneaux trouvés
    console.log('📋 Créneaux à transférer:')
    clichySlots.forEach(slot => {
        console.log(`   - ${slot.start_time.slice(0, 5)} → ${slot.end_time.slice(0, 5)} (${slot.is_available ? 'disponible' : 'non disponible'})`)
    })
    console.log()

    // 3. Mettre à jour les créneaux pour qu'ils pointent vers Colombes
    const slotIds = clichySlots.map(s => s.id)

    const { data: updated, error: updateError } = await supabase
        .from('available_slots')
        .update({ center_id: colombes.id })
        .in('id', slotIds)
        .select()

    if (updateError) {
        console.error('❌ Erreur lors du transfert:', updateError)
        return
    }

    console.log(`✅ ${updated.length} créneaux transférés avec succès vers Colombes!\n`)

    console.log('📊 Résumé:')
    console.log(`   - Date: 19 novembre 2025`)
    console.log(`   - Transférés de: ${clichy.name}`)
    console.log(`   - Transférés vers: ${colombes.name}`)
    console.log(`   - Nombre de créneaux: ${updated.length}`)

    console.log('\n🎉 Terminé! Les créneaux du 19 novembre sont maintenant disponibles pour Colombes.\n')
}

transferSlots().catch(console.error)
