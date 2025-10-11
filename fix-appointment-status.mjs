import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hzfpscgdyrqbplmhgwhi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'
);

async function fixAppointment() {
  console.log('🔍 Recherche du rendez-vous de Chaoui Abdelhakim...');
  
  // Chercher le rendez-vous
  const { data: appointments, error: searchError } = await supabase
    .from('appointments')
    .select('*')
    .ilike('last_name', '%Chaoui%')
    .ilike('first_name', '%Abdelhakim%');
  
  if (searchError) {
    console.error('❌ Erreur de recherche:', searchError);
    return;
  }
  
  if (!appointments || appointments.length === 0) {
    console.log('❌ Aucun rendez-vous trouvé pour Chaoui Abdelhakim');
    return;
  }
  
  console.log(`✅ ${appointments.length} rendez-vous trouvé(s):`);
  appointments.forEach(apt => {
    console.log(`\n📋 ID: ${apt.id}`);
    console.log(`   Nom: ${apt.first_name} ${apt.last_name}`);
    console.log(`   Email: ${apt.email}`);
    console.log(`   Téléphone: ${apt.phone}`);
    console.log(`   Date: ${apt.appointment_date}`);
    console.log(`   Heure: ${apt.appointment_time}`);
    console.log(`   Statut actuel: ${apt.status}`);
    console.log(`   Motif: ${apt.reason}`);
  });
  
  // Mettre à jour tous les rendez-vous trouvés avec statut "confirmed"
  const ids = appointments.map(apt => apt.id);
  
  console.log('\n🔄 Mise à jour du statut vers "confirmed"...');
  
  const { error: updateError } = await supabase
    .from('appointments')
    .update({ status: 'confirmed' })
    .in('id', ids);
  
  if (updateError) {
    console.error('❌ Erreur de mise à jour:', updateError);
    return;
  }
  
  console.log('✅ Statut mis à jour avec succès !');
  console.log(`✅ ${ids.length} rendez-vous maintenant marqué(s) comme "confirmé"`);
}

fixAppointment();
