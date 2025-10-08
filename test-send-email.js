// Test d'envoi d'email avec Elastic Email API
// Pour vérifier que la configuration fonctionne en production

const ELASTIC_EMAIL_API_KEY = 'B0D3C9F949F85DF5B9045463F6B4A04C1194929A06D05B8B972AAC0B14682CEFB03CA8FA79579D005F264103C6C92987';
const FROM_EMAIL = 'contact@test-psychotechnique-permis.com';
const TO_EMAIL = 'sebtifatiha170617@gmail.com';

async function sendTestEmail() {
  console.log('🚀 Envoi d\'un email de test...');
  console.log(`📧 De: ${FROM_EMAIL}`);
  console.log(`📧 À: ${TO_EMAIL}`);
  
  try {
    // Préparer les données pour Elastic Email API v2
    const formData = new URLSearchParams();
    formData.append('apikey', ELASTIC_EMAIL_API_KEY);
    formData.append('from', FROM_EMAIL);
    formData.append('fromName', 'Test Psychotechnique Permis');
    formData.append('to', TO_EMAIL);
    formData.append('subject', 'Email de test - Configuration Elastic Email');
    formData.append('bodyHtml', `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Test de Configuration Email ✅</h1>
            <p>Bonjour,</p>
            <p>Ceci est un email de test pour vérifier que la configuration Elastic Email fonctionne correctement.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Informations de configuration :</h3>
              <ul>
                <li><strong>Service :</strong> Elastic Email API</li>
                <li><strong>Expéditeur :</strong> ${FROM_EMAIL}</li>
                <li><strong>Destinataire :</strong> ${TO_EMAIL}</li>
                <li><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</li>
              </ul>
            </div>
            <p>Si vous recevez cet email, cela signifie que la configuration est <strong style="color: #10b981;">opérationnelle</strong> ! ✅</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.test-psychotechnique-permis.com/" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Visiter notre site web</a>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              Test Psychotechnique Permis<br>
              82 Rue Henri Barbusse, 92110 Clichy<br>
              Tél : 07 65 56 53 79<br>
              <a href="https://test-psychotechnique-permis.com">test-psychotechnique-permis.com</a>
            </p>
          </div>
        </body>
      </html>
    `);
    formData.append('bodyText', 'Ceci est un email de test pour vérifier la configuration Elastic Email.');

    // Envoyer la requête à Elastic Email
    const response = await fetch('https://api.elasticemail.com/v2/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    
    if (result.success) {
      console.log('✅ Email envoyé avec succès !');
      console.log('📬 Transaction ID:', result.data?.transactionid || 'N/A');
      console.log('📬 Message ID:', result.data?.messageid || 'N/A');
      console.log('\n🎉 Vérifiez la boîte email sebtifatiha170617@gmail.com');
    } else {
      throw new Error(`Échec de l'envoi: ${result.error || 'Erreur inconnue'}`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:');
    console.error(error.message);
    
    if (error.message.includes('404') || error.message.includes('401')) {
      console.error('\n💡 Suggestions:');
      console.error('- Vérifiez que la clé API est correcte');
      console.error('- Vérifiez que le domaine est vérifié dans Elastic Email');
    }
  }
}

// Lancer le test
sendTestEmail();
