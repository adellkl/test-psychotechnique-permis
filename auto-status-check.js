#!/usr/bin/env node

/**
 * Script de test pour l'API d'analyse automatique des statuts de RDV
 * Usage: node auto-status-check.js
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabase = createClient(
    'https://hzfpscgdyrqbplmhgwhi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'
);

async function testAutoStatusUpdate() {
    console.log('🔄 Test de l\'API d\'analyse automatique des statuts...\n');

    try {
        // 1. Vérifier les rendez-vous d'aujourd'hui avant l'analyse
        const today = new Date().toISOString().split('T')[0];
        console.log(`📅 Date d'aujourd'hui: ${today}`);

        const { data: beforeAppointments, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('appointment_date', today)
            .neq('status', 'cancelled')
            .order('appointment_time', { ascending: true });

        if (error) {
            console.error('❌ Erreur récupération RDV:', error);
            return;
        }

        console.log(`\n📋 Rendez-vous trouvés pour aujourd'hui: ${beforeAppointments.length}`);
        beforeAppointments.forEach((apt, i) => {
            console.log(`  ${i + 1}. ${apt.first_name} ${apt.last_name} - ${apt.appointment_time} - Status: ${apt.status}`);
        });

        // 2. Obtenir l'heure actuelle en France
        const now = new Date();
        const currentTime = new Intl.DateTimeFormat('fr-FR', {
            timeZone: 'Europe/Paris',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(now);

        console.log(`\n🕐 Heure actuelle (France): ${currentTime}`);

        // 3. Appeler l'API d'analyse automatique
        console.log('\n🔄 Appel de l\'API auto-status-update...');

        const response = await fetch('http://localhost:3000/api/admin/auto-status-update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('\n✅ Réponse API:', result);

        // 4. Afficher les détails des mises à jour
        if (result.updatedAppointments && result.updatedAppointments.length > 0) {
            console.log('\n📝 Détails des mises à jour:');
            result.updatedAppointments.forEach((update, i) => {
                console.log(`  ${i + 1}. ${update.clientName} (${update.appointmentTime})`);
                console.log(`     Status: ${update.currentStatus} → ${update.newStatus}`);
            });
        } else {
            console.log('\n💡 Aucune mise à jour nécessaire');
        }

        // 5. Vérifier l'état après l'analyse
        const { data: afterAppointments } = await supabase
            .from('appointments')
            .select('*')
            .eq('appointment_date', today)
            .neq('status', 'cancelled')
            .order('appointment_time', { ascending: true });

        console.log('\n📋 État des RDV après analyse:');
        afterAppointments.forEach((apt, i) => {
            const changed = beforeAppointments[i]?.status !== apt.status ? ' ⬅ CHANGÉ' : '';
            console.log(`  ${i + 1}. ${apt.first_name} ${apt.last_name} - ${apt.appointment_time} - Status: ${apt.status}${changed}`);
        });

        // 6. Statistiques
        const statusCounts = afterAppointments.reduce((acc, apt) => {
            acc[apt.status] = (acc[apt.status] || 0) + 1;
            return acc;
        }, {});

        console.log('\n📊 Statistiques par statut:');
        Object.entries(statusCounts).forEach(([status, count]) => {
            console.log(`  - ${status}: ${count}`);
        });

    } catch (error) {
        console.error('❌ Erreur durant le test:', error.message);
    }
}

// Exécuter le test
testAutoStatusUpdate()
    .then(() => {
        console.log('\n✅ Test terminé');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Erreur fatale:', error);
        process.exit(1);
    });
