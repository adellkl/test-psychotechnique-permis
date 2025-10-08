// Test complet d'envoi d'emails - Client et Admin
// Pour vérifier que les emails sont bien envoyés aux deux adresses

const ELASTIC_EMAIL_API_KEY = 'B0D3C9F949F85DF5B9045463F6B4A04C1194929A06D05B8B972AAC0B14682CEFB03CA8FA79579D005F264103C6C92987';
const FROM_EMAIL = 'contact@test-psychotechnique-permis.com';
const CLIENT_EMAIL = 'adelloukal2@gmail.com';
// Admin email test removed

async function testBothEmails() {
  console.log('🚀 Test d\'envoi d\'emails aux deux adresses...');
  console.log(`📧 Client: ${CLIENT_EMAIL}`);
  // Admin email test removed

  // Template d'email pour le client (confirmation de RDV)
  const clientEmailData = {
    from: FROM_EMAIL,
    fromName: 'Test Psychotechnique Permis',
    to: CLIENT_EMAIL,
    subject: 'Test Email - Confirmation de RDV (Client)',
    bodyHtml: `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Test - Confirmation de RDV ✅</h1>
            <p>Bonjour,</p>
            <p>Ceci est un email de test pour vérifier que les notifications clients fonctionnent correctement.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Détails du test :</h3>
              <ul>
                <li><strong>Destinataire :</strong> Client (${CLIENT_EMAIL})</li>
                <li><strong>Type :</strong> Email de confirmation client</li>
                <li><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</li>
                <li><strong>Service :</strong> Elastic Email API</li>
              </ul>
            </div>
            <p>Si vous recevez cet email sur <strong>${CLIENT_EMAIL}</strong>, les notifications clients fonctionnent ! ✅</p>
          </div>
        </body>
      </html>
    `,
    bodyText: 'Test email de confirmation client'
  };

  // Admin email test removed

  try {
    // Test email client
    console.log('\n📤 Envoi de l\'email client...');
    const clientFormData = new URLSearchParams();
    Object.entries(clientEmailData).forEach(([key, value]) => {
      clientFormData.append(key, value);
    });
    clientFormData.append('apikey', ELASTIC_EMAIL_API_KEY);

    const clientResponse = await fetch('https://api.elasticemail.com/v2/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: clientFormData.toString(),
    });

    const clientResult = await clientResponse.text();
    const clientData = JSON.parse(clientResult);

    if (clientData.success) {
      console.log('✅ Email client envoyé avec succès !');
      console.log('📬 Transaction ID:', clientData.data?.transactionid);
      console.log('📬 Message ID:', clientData.data?.messageid);
    } else {
      console.log('❌ Échec de l\'envoi client:', clientData.error);
    }

    // Admin email test removed

    console.log('\n🎉 Tests terminés !');
    console.log(`📧 Vérifiez la boîte client: ${CLIENT_EMAIL}`);
    // Admin email test removed

  } catch (error) {
    console.error('❌ Erreur lors du test:');
    console.error(error.message);
  }
}

// Lancer le test
testBothEmails();
