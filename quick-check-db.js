#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://hzfpscgdyrqbplmhgwhi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'
);

async function main() {
    console.log('🔍 Vérification rapide de la base de données...\n');

    // Compter les rendez-vous
    const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('❌ Erreur:', error.message);
        return;
    }

    console.log(`📊 Nombre total de rendez-vous: ${count}\n`);

    if (count === 0) {
        console.log('⚠️  LA BASE EST VIDE - Aucun rendez-vous dans la table appointments');
        console.log('\n💡 Solutions:');
        console.log('   1. Créer un rendez-vous de test via l\'interface client');
        console.log('   2. Vérifier que l\'application client fonctionne correctement');
        return;
    }

    // Récupérer quelques rendez-vous
    const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    if (fetchError) {
        console.error('❌ Erreur:', fetchError.message);
        return;
    }

    console.log('📋 Derniers rendez-vous:');
    data.forEach((apt, i) => {
        console.log(`\n${i + 1}. ${apt.first_name} ${apt.last_name}`);
        console.log(`   📧 ${apt.email}`);
        console.log(`   📞 ${apt.phone}`);
        console.log(`   📅 ${apt.appointment_date} à ${apt.appointment_time}`);
        console.log(`   📍 Centre: ${apt.center_id || 'Non défini'}`);
        console.log(`   ✅ Status: ${apt.status}`);
    });

    // Date du jour
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    console.log(`\n\n🗓️  Date du jour: ${today}`);

    const todayApts = data.filter(apt => apt.appointment_date === today);
    console.log(`📅 Rendez-vous aujourd'hui: ${todayApts.length}`);
}

main().catch(console.error);
