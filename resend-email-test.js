const { Resend } = require('resend')
require('dotenv').config()

// Configuration Resend (solution de fallback)
const resend = new Resend('re_DdhZzjoL_DWUXFDm8hq4dFBokVfSYgavT')

async function testResendEmail() {
  try {
    console.log('🧪 Test de la configuration Resend...')
    
    // Test d'envoi
    console.log('📤 Envoi de l\'email de test...')
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'sebtifatiha@live.fr',
      subject: 'Test Email - Permis Expert',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Test Email Resend ✅</h2>
          <p>Ce message confirme que la configuration Resend fonctionne correctement.</p>
          <p><strong>Service:</strong> Resend API</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>Avantages:</strong></p>
          <ul>
            <li>✅ Fonctionne immédiatement</li>
            <li>✅ Pas de configuration SMTP complexe</li>
            <li>✅ API simple et fiable</li>
            <li>✅ 100 emails/mois gratuits</li>
          </ul>
        </div>
      `,
      text: 'Test Resend réussi! Configuration email fonctionnelle.'
    })

    if (error) {
      console.error('❌ Erreur Resend:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Email envoyé avec succès!')
    console.log('📧 ID:', data.id)
    
    return { success: true, id: data.id }
  } catch (error) {
    console.error('❌ Erreur Resend:', error.message)
    return { success: false, error: error.message }
  }
}

// Exécuter le test
testResendEmail()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 Configuration Resend fonctionnelle!')
      console.log('💡 Solution recommandée : Utilisez Resend au lieu d\'Outlook SMTP')
      console.log('📧 100 emails gratuits par mois, configuration simple')
    } else {
      console.log('\n💥 Erreur avec Resend')
    }
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Erreur inattendue:', error)
    process.exit(1)
  })
