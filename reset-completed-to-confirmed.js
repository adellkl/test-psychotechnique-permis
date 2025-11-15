#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://hzfpscgdyrqbplmhgwhi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'
);

async function resetCompletedToConfirmed() {
    console.log('🔄 Changement de tous les rendez-vous "completed" en "confirmed"...\n');

    // Compter les rendez-vous completed
    const { data: completedApts, error: countError } = await supabase
        .from('appointments')
        .select('id, first_name, last_name, appointment_date, appointment_time')
        .eq('status', 'completed');

    if (countError) {
        console.error('❌ Erreur:', countError.message);
        return;
    }

    console.log(`📊 Nombre de rendez-vous "completed" trouvés: ${completedApts.length}\n`);

    if (completedApts.length === 0) {
        console.log('✅ Aucun rendez-vous à modifier');
        return;
    }

    console.log('📋 Rendez-vous qui vont être modifiés:');
    completedApts.forEach((apt, i) => {
        console.log(`  ${i + 1}. ${apt.first_name} ${apt.last_name} - ${apt.appointment_date} à ${apt.appointment_time}`);
    });
    console.log('');

    // Mettre à jour tous les rendez-vous completed en confirmed
    const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('status', 'completed')
        .select();

    if (error) {
        console.error('❌ Erreur lors de la mise à jour:', error.message);
        return;
    }

    console.log(`✅ ${data.length} rendez-vous ont été changés de "completed" à "confirmed"`);
    console.log('\n🎉 Terminé ! Rafraîchissez votre dashboard admin.');
}

resetCompletedToConfirmed().catch(console.error);
