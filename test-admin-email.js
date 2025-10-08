// Test d'envoi d'email à l'adresse admin
// Pour vérifier que les emails sont bien envoyés à sebtifatiha170617@gmail.com

const nodemailer = require('nodemailer');

// Configuration SMTP Outlook
const outlookTransporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.OUTLOOK_EMAIL || 'sebtifatiha@live.fr',
    pass: process.env.OUTLOOK_APP_PASSWORD || 'klozfurpuolscefm'
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  },
  requireTLS: true
});

async function testAdminEmail() {
  console.log('🚀 Test d\'envoi d\'email à l\'adresse admin...');
  console.log(`📧 De: contact@test-psychotechnique-permis.com`);
  console.log(`📧 À: sebtifatiha170617@gmail.com`);

  try {
    const info = await outlookTransporter.sendMail({
      from: 'contact@test-psychotechnique-permis.com',
      to: 'sebtifatiha170617@gmail.com',
      subject: 'Test Email - Nouvelle adresse admin',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb;">Test Email - Nouvelle Adresse Admin ✅</h1>
              <p>Bonjour,</p>
              <p>Ceci est un email de test pour vérifier que les emails sont bien envoyés à la nouvelle adresse admin.</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Informations de test :</h3>
                <ul>
                  <li><strong>Adresse admin :</strong> sebtifatiha170617@gmail.com</li>
                  <li><strong>Date du test :</strong> ${new Date().toLocaleString('fr-FR')}</li>
                  <li><strong>Service :</strong> Elastic Email API</li>
                </ul>
              </div>
              <p>Si vous recevez cet email sur <strong>sebtifatiha170617@gmail.com</strong>, cela signifie que la configuration est <strong style="color: #10b981;">opérationnelle</strong> ! ✅</p>
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
      `,
      text: 'Test email pour vérifier que les emails sont bien envoyés à l\'adresse admin sebtifatiha170617@gmail.com'
    });

    console.log('✅ Email de test envoyé avec succès !');
    console.log('📬 Message ID:', info.messageId);
    console.log('\n🎉 Vérifiez la boîte email sebtifatiha170617@gmail.com');

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de test:');
    console.error(error.message);

    if (error.message.includes('535') || error.message.includes('Authentication unsuccessful')) {
      console.error('\n💡 Problème d\'authentification Outlook détecté');
      console.error('- Vérifiez que l\'authentification à deux facteurs est activée');
      console.error('- Régénérez le mot de passe d\'application');
      console.error('- Vérifiez que SMTP est activé dans les paramètres Outlook');
    }
  }
}

// Lancer le test
testAdminEmail();
