// Test de l'API Elastic Email depuis la production
async function testProductionEmail() {
  try {
    console.log('🧪 Test Elastic Email API depuis la production...');
    
    const formData = new FormData();
    formData.append('apikey', 'B0D3C9F949F85DF5B9045463F6B4A04C1194929A06D05B8B972AAC0B14682CEFB03CA8FA79579D005F264103C6C92987');
    formData.append('from', 'adelloukal2@gmail.com');
    formData.append('to', 'sebtifatiha@live.fr');
    formData.append('subject', 'Test Production - Elastic Email');
    formData.append('bodyHtml', '<h1>Test depuis la production</h1><p>Si vous recevez cet email, l\'API Elastic Email fonctionne depuis votre serveur de production.</p>');
    formData.append('bodyText', 'Test depuis la production - API Elastic Email fonctionnelle');
    
    const response = await fetch('https://api.elasticemail.com/v2/email/send', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.text();
    console.log('📊 Status:', response.status);
    console.log('📧 Résultat:', result);
    
    if (response.ok) {
      const data = JSON.parse(result);
      console.log('✅ Email envoyé avec succès !');
      console.log('📧 Transaction ID:', data.data?.transactionid);
    } else {
      console.log('❌ Erreur:', result);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testProductionEmail();
