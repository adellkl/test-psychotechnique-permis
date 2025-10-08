async function testLoginAPI() {
  try {
    console.log('🔍 Test de l\'API de connexion...')
    
    const fetch = (await import('node-fetch')).default
    const response = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'sebtifatiha170617@gmail.com',
        password: 'Admin123!'
      })
    })
    
    const data = await response.json()
    
    console.log('📊 Statut de la réponse:', response.status)
    console.log('📄 Données reçues:', data)
    
    if (response.ok) {
      console.log('✅ Connexion API réussie!')
    } else {
      console.log('❌ Erreur API:', data.error)
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test API:', error.message)
  }
}

testLoginAPI()
