import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hzfpscgdyrqbplmhgwhi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'
);

async function findAndFixAppointment() {
  console.log('🔍 Recherche par email: eeng.chaoui@yahoo.com...');
  
  const { data: appointments, error: searchError } = await supabase
    .from('appointments')
    .select('*')
    .eq('email', 'eeng.chaoui@yahoo.com');
  
  if (searchError) {
    console.error('❌ Erreur:', searchError);
    return;
  }
  
  if (!appointments || appointments.length === 0) {
    console.log('❌ Aucun rendez-vous trouvé avec cet email');
    
    // Chercher par téléphone
    console.log('\n🔍 Recherche par téléphone: 0651867863...');
    const { data: aptsByPhone } = await supabase
      .from('appointments')
      .select('*')
      .eq('phone', '0651867863');
    
    if (!aptsByPhone || aptsByPhone.length === 0) {
      console.log('❌ Aucun rendez-vous trouvé avec ce téléphone');
      
      // Chercher rendez-vous du 14 octobre
      console.log('\n🔍 Recherche des rendez-vous du 14 octobre 2025...');
      const { data: octoberApts } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', '2025-10-14')
        .eq('appointment_time', '14:00:00');
      
      if (octoberApts && octoberApts.length > 0) {
        console.log(`\n✅ ${octoberApts.length} rendez-vous trouvé(s) le 14 oct à 14:00:`);
        octoberApts.forEach(apt => {
          console.log(`\n📋 ID: ${apt.id}`);
          console.log(`   Nom: ${apt.first_name} ${apt.last_name}`);
          console.log(`   Email: ${apt.email}`);
          console.log(`   Téléphone: ${apt.phone}`);
          console.log(`   Statut: ${apt.status}`);
          console.log(`   Motif: ${apt.reason}`);
        });
        
        // Mettre à jour
        const ids = octoberApts.map(apt => apt.id);
        console.log('\n🔄 Mise à jour vers "confirmed"...');
        await supabase
          .from('appointments')
          .update({ status: 'confirmed' })
          .in('id', ids);
        console.log('✅ Mis à jour !');
      } else {
        console.log('❌ Aucun rendez-vous trouvé le 14 oct à 14:00');
      }
      return;
    }
    
    appointments.push(...aptsByPhone);
  }
  
  console.log(`\n✅ ${appointments.length} rendez-vous trouvé(s):`);
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
  
  const ids = appointments.map(apt => apt.id);
  console.log('\n🔄 Mise à jour du statut vers "confirmed"...');
  
  const { error: updateError } = await supabase
    .from('appointments')
    .update({ status: 'confirmed' })
    .in('id', ids);
  
  if (updateError) {
    console.error('❌ Erreur:', updateError);
    return;
  }
  
  console.log('✅ Statut mis à jour avec succès !');
}

findAndFixAppointment();
