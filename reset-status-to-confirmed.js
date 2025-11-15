const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://hzfpscgdyrqbplmhgwhi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'
);

async function resetStatus() {
    console.log('🔄 Remise à jour des statuts pour aujourd\'hui et les rendez-vous futurs...\n');

    // Date d'aujourd'hui
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    console.log(`📅 Date du jour: ${today}\n`);

    // Récupérer les rendez-vous completed d'aujourd'hui et futurs
    const { data: completed, error: countError } = await supabase
        .from('appointments')
        .select('id, first_name, last_name, appointment_date, appointment_time, status')
        .eq('status', 'completed')
        .gte('appointment_date', today); // Seulement aujourd'hui et après

    if (countError) {
        console.error('❌ Erreur:', countError.message);
        return;
    }

    console.log(`📊 ${completed?.length || 0} rendez-vous avec status "completed"\n`);

    if (!completed || completed.length === 0) {
        console.log('✅ Aucun rendez-vous à modifier');
        return;
    }

    // Afficher les rendez-vous qui vont être modifiés
    console.log('📋 Rendez-vous d\'aujourd\'hui et futurs qui vont être changés en "confirmed":');
    completed.forEach((apt, i) => {
        console.log(`  ${i + 1}. ${apt.first_name} ${apt.last_name} - ${apt.appointment_date} ${apt.appointment_time}`);
    });
    console.log('');

    // Mettre à jour seulement ceux d'aujourd'hui et futurs en "confirmed"
    const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('status', 'completed')
        .gte('appointment_date', today)
        .select();

    if (error) {
        console.error('❌ Erreur lors de la mise à jour:', error.message);
        return;
    }

    console.log(`✅ ${data.length} rendez-vous changés de "completed" à "confirmed"`);
    console.log('\n🎉 Terminé ! Rafraîchissez votre dashboard admin.');

    // Vérification finale
    const { data: remaining } = await supabase
        .from('appointments')
        .select('status')
        .eq('status', 'completed');

    console.log(`\n📊 Rendez-vous "completed" restants: ${remaining?.length || 0}`);
}

resetStatus().catch(console.error);
