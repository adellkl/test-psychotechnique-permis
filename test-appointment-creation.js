// Test de création de rendez-vous avec notification admin
async function createTestAppointment() {
  console.log('🧪 Création d\'un rendez-vous de test...\n');
  
  const appointmentData = {
    first_name: 'Test',
    last_name: 'Client',
    email: 'bijey74244@fintehs.com',
    phone: '06 12 34 56 78',
    appointment_date: '2025-10-08',
    appointment_time: '12:30',
    test_type: 'Test psychotechnique standard',
    reason: 'Invalidation permis',
    is_second_chance: false,
    client_notes: 'Test de notification admin'
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData)
    });
    
    const result = await response.json();
    
    console.log('📊 Statut:', response.status);
    console.log('📄 Résultat:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Rendez-vous créé avec succès!');
      console.log('\n📧 Emails envoyés à:');
      console.log('   ✉️  Client: bijey74244@fintehs.com');
      console.log('   ✉️  Admin: sebtifatiha170617@gmail.com');
      console.log('\n💡 Vérifiez les deux boîtes mail pour confirmer la réception');
    } else {
      console.log('\n❌ Erreur lors de la création:', result.error);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('\n💡 Assurez-vous que le serveur Next.js tourne sur http://localhost:3000');
  }
}

createTestAppointment();
