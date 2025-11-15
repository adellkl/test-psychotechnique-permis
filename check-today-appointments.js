#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://hzfpscgdyrqbplmhgwhi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'
);

async function checkTodayAppointments() {
    console.log('🔍 Vérification des rendez-vous du 15 novembre 2025...\n');

    const today = '2025-11-15';

    // Récupérer tous les rendez-vous du 15 novembre
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', today)
        .order('appointment_time', { ascending: true });

    if (error) {
        console.error('❌ Erreur:', error.message);
        return;
    }

    console.log(`📊 Rendez-vous trouvés pour le ${today}: ${data.length}\n`);

    if (data.length === 0) {
        console.log('⚠️  AUCUN rendez-vous trouvé pour le 15 novembre dans la base !');
        console.log('\n📧 Mais vous avez des emails de confirmation pour:');
        console.log('   - Aoued Benamrane - 19:00');
        console.log('   - Brahima KONATE - 19:20');
        console.log('   - Jawad El baghdadi - 18:40');
        console.log('   - Emily Maarek - 18:20');
        console.log('   - Rayan BANGHA - 17:40');
        console.log('   - BANGHA RAYAN - 18:00');
        console.log('\n💡 Les rendez-vous n\'ont peut-être pas été enregistrés dans la base.');

        // Chercher avec des noms similaires
        console.log('\n🔍 Recherche de ces noms dans toute la base...');
        const { data: allApts } = await supabase
            .from('appointments')
            .select('*')
            .or('last_name.ilike.%BANGHA%,last_name.ilike.%Benamrane%,last_name.ilike.%KONATE%,last_name.ilike.%baghdadi%,last_name.ilike.%Maarek%')
            .order('appointment_date', { ascending: false });

        if (allApts && allApts.length > 0) {
            console.log(`\n📋 Trouvé ${allApts.length} rendez-vous avec ces noms:`);
            allApts.forEach((apt, i) => {
                console.log(`  ${i + 1}. ${apt.first_name} ${apt.last_name} - ${apt.appointment_date} à ${apt.appointment_time} - Status: ${apt.status}`);
            });
        }

        return;
    }

    console.log('📋 Liste des rendez-vous du 15 novembre:\n');
    data.forEach((apt, i) => {
        console.log(`${i + 1}. ${apt.first_name} ${apt.last_name}`);
        console.log(`   📧 ${apt.email}`);
        console.log(`   📞 ${apt.phone}`);
        console.log(`   ⏰ ${apt.appointment_time}`);
        console.log(`   📍 Centre: ${apt.center_id}`);
        console.log(`   ✅ Status: ${apt.status}`);
        console.log('');
    });

    // Statistiques
    const stats = data.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
    }, {});

    console.log('📈 Statistiques par statut:');
    Object.entries(stats).forEach(([status, count]) => {
        console.log(`  - ${status}: ${count}`);
    });

    // Vérifier le centre Clichy
    const clichyId = '11111111-1111-1111-1111-111111111111';
    const clichyApts = data.filter(apt => apt.center_id === clichyId);
    console.log(`\n🏢 Rendez-vous pour le centre de Clichy: ${clichyApts.length}`);
}

checkTodayAppointments().catch(console.error);
