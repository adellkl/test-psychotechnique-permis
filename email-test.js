const { testEmailConfiguration } = require('./lib/emailService.ts')

async function testEmail() {
  try {
    console.log('🧪 Test de la configuration email...')
    
    const result = await testEmailConfiguration()
    
    if (result.success) {
      console.log('✅ Email de test envoyé avec succès!')
      console.log('📧 ID du message:', result.id)
    } else {
      console.log('❌ Échec de l\'envoi du test email')
      console.log('Erreur:', result.error)
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test:', error)
  }
}

testEmail()
