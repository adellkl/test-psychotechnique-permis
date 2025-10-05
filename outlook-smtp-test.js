const nodemailer = require('nodemailer')
require('dotenv').config()

// Configuration SMTP Outlook avec options supplémentaires
const outlookTransporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
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
  requireTLS: true,
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000
})

async function testOutlookSMTP() {
  try {
    console.log('🧪 Test de la configuration Outlook SMTP...')
    
    // Test de connexion
    console.log('🔗 Vérification de la connexion...')
    await outlookTransporter.verify()
    console.log('✅ Connexion SMTP réussie!')
    
    // Test d'envoi
    console.log('📤 Envoi de l\'email de test...')
    const info = await outlookTransporter.sendMail({
      from: 'sebtifatiha@live.fr',
      to: 'sebtifatiha@live.fr', // Test en s'envoyant à soi-même
      subject: 'Test SMTP Outlook - Permis Expert',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Test SMTP Outlook ✅</h2>
          <p>Ce message confirme que la configuration SMTP Outlook fonctionne correctement.</p>
          <p><strong>Service:</strong> Outlook SMTP (smtp-mail.outlook.com:587)</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>Avantages:</strong></p>
          <ul>
            <li>✅ Gratuit</li>
            <li>✅ Pas de limite de destinataires</li>
            <li>✅ Utilise votre vraie adresse email</li>
            <li>✅ Fiable et professionnel</li>
          </ul>
        </div>
      `,
      text: 'Test SMTP Outlook réussi! Configuration email fonctionnelle.'
    })

    console.log('✅ Email envoyé avec succès!')
    console.log('📧 Message ID:', info.messageId)
    console.log('📤 Réponse:', info.response)
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Erreur SMTP Outlook:', error.message)
    
    if (error.code === 'EAUTH') {
      console.log('\n🔑 CONFIGURATION REQUISE:')
      console.log('1. Allez sur https://account.microsoft.com/security')
      console.log('2. Activez l\'authentification à deux facteurs')
      console.log('3. Générez un "mot de passe d\'application"')
      console.log('4. Utilisez ce mot de passe dans OUTLOOK_APP_PASSWORD')
      console.log('5. Assurez-vous que SMTP est activé dans les paramètres Outlook')
    }
    
    return { success: false, error: error.message }
  }
}

// Exécuter le test
testOutlookSMTP()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 Configuration Outlook SMTP fonctionnelle!')
      console.log('💰 Solution 100% GRATUITE trouvée!')
      console.log('📧 Vous pouvez maintenant envoyer des emails à tous vos clients.')
    } else {
      console.log('\n💥 Configuration requise pour Outlook SMTP')
      console.log('📋 Suivez les étapes ci-dessus pour configurer le mot de passe d\'application')
    }
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Erreur inattendue:', error)
    process.exit(1)
  })
