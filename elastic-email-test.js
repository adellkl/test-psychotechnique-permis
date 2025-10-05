const nodemailer = require('nodemailer')
require('dotenv').config()

// Configuration SMTP Elastic Email avec différents ports
const configs = [
  {
    name: 'Port 2525 (recommandé)',
    host: 'smtp.elasticemail.com',
    port: 2525,
    secure: false,
    auth: {
      user: 'f.sebti@outlook.com',
      pass: '418736D683FA9C798142074A0AE5B0A8CFE7F'
    }
  },
  {
    name: 'Port 587 (TLS)',
    host: 'smtp.elasticemail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'f.sebti@outlook.com',
      pass: '418736D683FA9C798142074A0AE5B0A8CFE7F'
    }
  },
  {
    name: 'Port 25 (standard)',
    host: 'smtp.elasticemail.com',
    port: 25,
    secure: false,
    auth: {
      user: 'f.sebti@outlook.com',
      pass: '418736D683FA9C798142074A0AE5B0A8CFE7F'
    }
  }
]

async function testConfig(config) {
  console.log(`\n🧪 Test ${config.name}...`)
  
  const transporter = nodemailer.createTransport(config)
  
  try {
    // Test de connexion
    await transporter.verify()
    console.log(`✅ Connexion réussie pour ${config.name}`)
    
    // Test d'envoi
    const info = await transporter.sendMail({
      from: 'f.sebti@outlook.com',
      to: 'sebtifatiha@live.fr',
      subject: `Test Elastic Email - ${config.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Test Elastic Email ✅</h2>
          <p>Configuration testée: ${config.name}</p>
          <p><strong>Port:</strong> ${config.port}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `,
      text: `Test Elastic Email - ${config.name}`
    })

    console.log(`✅ Email envoyé avec succès via ${config.name}`)
    console.log(`📧 Message ID: ${info.messageId}`)
    return { success: true, config: config.name, messageId: info.messageId }
    
  } catch (error) {
    console.log(`❌ Échec pour ${config.name}: ${error.message}`)
    return { success: false, config: config.name, error: error.message }
  }
}

async function testAllConfigs() {
  console.log('🧪 Test de toutes les configurations Elastic Email...')
  
  for (const config of configs) {
    const result = await testConfig(config)
    if (result.success) {
      console.log(`\n🎉 Configuration fonctionnelle trouvée: ${result.config}`)
      return result
    }
  }
  
  console.log('\n💥 Aucune configuration ne fonctionne')
  console.log('\n📋 Vérifications nécessaires:')
  console.log('1. Le compte Elastic Email est-il activé?')
  console.log('2. L\'email f.sebti@outlook.com est-il vérifié dans Elastic Email?')
  console.log('3. Le mot de passe SMTP est-il correct?')
  console.log('4. Les paramètres SMTP sont-ils activés dans le compte?')
  
  return { success: false }
}

// Exécuter les tests
testAllConfigs()
  .then(result => {
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Erreur inattendue:', error)
    process.exit(1)
  })
