const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://hzfpscgdyrqbplmhgwhi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'
);

async function urgentCheck() {
    // 1. Compter TOUS les rendez-vous
    const { count: total } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });

    console.log(`📊 TOTAL rendez-vous dans la base: ${total}\n`);

    // 2. Rendez-vous du 15 novembre 2025
    const { data: today, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', '2025-11-15')
        .order('appointment_time', { ascending: true });

    console.log(`📅 Rendez-vous du 15 novembre 2025: ${today?.length || 0}`);

    if (today && today.length > 0) {
        console.log('\n✅ TROUVÉS :');
        today.forEach(apt => {
            console.log(`   ${apt.first_name} ${apt.last_name} - ${apt.appointment_time} - Status: ${apt.status}`);
        });
    } else {
        console.log('❌ AUCUN rendez-vous pour le 15 novembre !\n');

        // 3. Chercher les derniers rendez-vous créés
        const { data: recent } = await supabase
            .from('appointments')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        console.log('📋 Les 10 derniers rendez-vous créés:');
        recent?.forEach(apt => {
            console.log(`   ${apt.first_name} ${apt.last_name} - Date: ${apt.appointment_date} ${apt.appointment_time} - Status: ${apt.status} - Créé: ${apt.created_at}`);
        });

        // 4. Chercher par noms
        console.log('\n🔍 Recherche des noms des emails...');
        const names = ['BANGHA', 'Benamrane', 'KONATE', 'baghdadi', 'Maarek'];
        for (const name of names) {
            const { data } = await supabase
                .from('appointments')
                .select('*')
                .or(`first_name.ilike.%${name}%,last_name.ilike.%${name}%`);

            if (data && data.length > 0) {
                console.log(`\n   Trouvé "${name}":`);
                data.forEach(apt => {
                    console.log(`      ${apt.first_name} ${apt.last_name} - ${apt.appointment_date} ${apt.appointment_time} - Status: ${apt.status}`);
                });
            }
        }
    }

    // 5. Statistiques par statut
    const { data: allApts } = await supabase
        .from('appointments')
        .select('status');

    const stats = {};
    allApts?.forEach(apt => {
        stats[apt.status] = (stats[apt.status] || 0) + 1;
    });

    console.log('\n📈 Statistiques par statut:');
    Object.entries(stats).forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`);
    });
}

urgentCheck().catch(console.error);
