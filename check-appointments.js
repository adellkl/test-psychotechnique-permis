const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://hzfpscgdyrqbplmhgwhi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'
);

async function checkAppointments() {
    console.log('🔍 Vérification des rendez-vous dans la base de données...\n');

    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false });

    if (error) {
        console.error('❌ Erreur:', error);
        return;
    }

    console.log('📊 Total rendez-vous dans la base:', data.length);
    console.log('');

    if (data.length === 0) {
        console.log('⚠️ Aucun rendez-vous trouvé dans la base de données');
        return;
    }

    // Date d'aujourd'hui au format YYYY-MM-DD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    console.log('🗓️ Date du jour (locale France):', today);
    console.log('');

    // Rendez-vous d'aujourd'hui
    const todayAppointments = data.filter(apt => apt.appointment_date === today);
    console.log('📅 Rendez-vous d\'aujourd\'hui:', todayAppointments.length);
    if (todayAppointments.length > 0) {
        todayAppointments.forEach((apt, i) => {
            console.log(`  ${i + 1}. ${apt.first_name} ${apt.last_name} - ${apt.appointment_time} - Status: ${apt.status} - Centre: ${apt.center_id}`);
        });
    }
    console.log('');

    // Liste complète
    console.log('📋 Liste complète des rendez-vous:');
    data.forEach((apt, i) => {
        console.log(`${i + 1}. ${apt.first_name} ${apt.last_name} - ${apt.appointment_date} à ${apt.appointment_time} - Status: ${apt.status} - Centre: ${apt.center_id}`);
    });
    console.log('');

    // Statistiques par statut
    console.log('📈 Statistiques par statut:');
    const stats = data.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
    }, {});
    Object.entries(stats).forEach(([status, count]) => {
        console.log(`  - ${status}: ${count}`);
    });
    console.log('');

    // Statistiques par centre
    console.log('🏢 Statistiques par centre:');
    const centerStats = data.reduce((acc, apt) => {
        const centerId = apt.center_id || 'Non défini';
        acc[centerId] = (acc[centerId] || 0) + 1;
        return acc;
    }, {});
    Object.entries(centerStats).forEach(([centerId, count]) => {
        console.log(`  - Centre ${centerId}: ${count}`);
    });
    console.log('');

    // Vérifier les centres disponibles
    console.log('🏢 Centres disponibles dans la base:');
    const { data: centers, error: centerError } = await supabase
        .from('centers')
        .select('*');

    if (centerError) {
        console.error('❌ Erreur lors de la récupération des centres:', centerError);
    } else {
        centers.forEach(center => {
            console.log(`  - ${center.id}: ${center.name} (${center.city})`);
        });
    }
}

checkAppointments().catch(console.error);
