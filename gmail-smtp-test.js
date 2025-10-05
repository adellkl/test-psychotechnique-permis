const nodemailer = require('nodemailer')
require('dotenv').config()

// Configuration SMTP Gmail (alternative plus simple)
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adelloukal2@gmail.com', // Remplacez par votre Gmail
    pass: 'bxwqfjfsxmhfaqen' // Mot de passe d'application Gmail
  }
})

async function testGmailSMTP() {
  try {
    console.log('🧪 Test de la configuration Gmail SMTP...')
    
    // Test de connexion
    console.log('🔗 Vérification de la connexion...')
    await gmailTransporter.verify()
    console.log('✅ Connexion SMTP réussie!')
    
    // Test d'envoi
    console.log('📤 Envoi de l\'email de test...')
    const info = await gmailTransporter.sendMail({
      from: 'adelloukal2@gmail.com',
      to: 'adelloukal2@gmail.com', // Test en s'envoyant à soi-même
      subject: 'Test SMTP Gmail - Permis Expert',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Test SMTP Gmail ✅</h2>
          <p>Ce message confirme que la configuration SMTP Gmail fonctionne correctement.</p>
          <p><strong>Service:</strong> Gmail SMTP</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>Avantages:</strong></p>
          <ul>
            <li>✅ Gratuit</li>
            <li>✅ Plus simple à configurer</li>
            <li>✅ Très fiable</li>
            <li>✅ Interface plus claire</li>
          </ul>
        </div>
      `,
      text: 'Test SMTP Gmail réussi! Configuration email fonctionnelle.'
    })

    console.log('✅ Email envoyé avec succès!')
    console.log('📧 Message ID:', info.messageId)
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Erreur SMTP Gmail:', error.message)
    
    if (error.code === 'EAUTH') {
      console.log('\n🔑 CONFIGURATION GMAIL REQUISE:')
      console.log('1. Allez sur https://myaccount.google.com/security')
      console.log('2. Activez l\'authentification à deux facteurs')
      console.log('3. Cherchez "Mots de passe des applications"')
      console.log('4. Générez un mot de passe pour "Mail"')
      console.log('5. Utilisez ce mot de passe dans la configuration')
    }
    
    return { success: false, error: error.message }
  }
}

// Exécuter le test
testGmailSMTP()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 Configuration Gmail SMTP fonctionnelle!')
      console.log('💰 Solution 100% GRATUITE et SIMPLE!')
    } else {
      console.log('\n💥 Configuration Gmail requise')
    }
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Erreur inattendue:', error)
    process.exit(1)
  })
