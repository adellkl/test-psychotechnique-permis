require('dotenv').config()

// Utiliser fetch natif de Node.js (disponible depuis Node 18+)
const fetch = globalThis.fetch

// Configuration Elastic Email API
const ELASTIC_EMAIL_API_KEY = process.env.ELASTIC_EMAIL_API_KEY || 'B0D3C9F949F85DF5B9045463F6B4A04C1194929A06D05B8B972AAC0B14682CEFB03CA8FA79579D005F264103C6C92987'
const ELASTIC_EMAIL_API_URL = 'https://api.elasticemail.com/v2/email/send'

async function testElasticEmailAPI() {
  try {
    console.log('🧪 Test de l\'API Elastic Email...')
    
    const formData = new FormData()
    formData.append('apikey', ELASTIC_EMAIL_API_KEY)
    formData.append('from', 'adelloukal2@gmail.com')
    formData.append('to', 'adelloukal2@gmail.com')
    formData.append('subject', 'Test API Elastic Email - Permis Expert')
    formData.append('bodyHtml', `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Test API Elastic Email ✅</h2>
        <p>Ce message confirme que l'API Elastic Email fonctionne correctement.</p>
        <p><strong>Service:</strong> Elastic Email API v2</p>
        <p><strong>Clé API:</strong> ${ELASTIC_EMAIL_API_KEY.substring(0, 20)}...</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
      </div>
    `)
    formData.append('bodyText', 'Test API Elastic Email réussi!')

    console.log('📤 Envoi de l\'email via l\'API...')
    
    const response = await fetch(ELASTIC_EMAIL_API_URL, {
      method: 'POST',
      body: formData
    })

    console.log('📡 Statut de la réponse:', response.status)
    
    const result = await response.text()
    console.log('📋 Réponse de l\'API:', result)

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} - ${result}`)
    }

    if (result.includes('error') || result.includes('Error')) {
      throw new Error(`Erreur Elastic Email: ${result}`)
    }

    console.log('✅ Email envoyé avec succès!')
    console.log('📧 Transaction ID:', result.trim())
    
    return { success: true, transactionId: result.trim() }
  } catch (error) {
    console.error('❌ Erreur lors du test API:', error.message)
    return { success: false, error: error.message }
  }
}

// Exécuter le test
testElasticEmailAPI()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 Test API réussi! Elastic Email API est configuré correctement.')
      console.log('🔧 Vous pouvez maintenant utiliser l\'API dans votre application.')
    } else {
      console.log('\n💥 Test API échoué:', result.error)
      console.log('\n📋 Vérifications:')
      console.log('1. La clé API est-elle valide?')
      console.log('2. Le compte Elastic Email est-il activé?')
      console.log('3. L\'email expéditeur est-il vérifié?')
    }
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Erreur inattendue:', error)
    process.exit(1)
  })
