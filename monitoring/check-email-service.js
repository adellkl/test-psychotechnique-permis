/**
 * Script de vérification du service d'envoi d'emails
 * Test l'envoi via Elastic Email API
 */

require('dotenv').config({ path: '.env.production' });

async function checkEmailService() {
  const results = {
    timestamp: new Date().toISOString(),
    status: 'success',
    checks: [],
    errors: []
  };

  // Vérifier les variables d'environnement
  const envCheck = checkEnvironmentVariables();
  results.checks.push(envCheck);
  if (!envCheck.success) {
    results.status = 'error';
    results.errors.push('❌ Variables d\'environnement manquantes');
    return results;
  }

  // Test d'envoi d'email de monitoring
  const emailCheck = await testEmailSending();
  results.checks.push(emailCheck);
  if (!emailCheck.success) {
    results.status = 'error';
    results.errors.push(`❌ Échec d'envoi d'email: ${emailCheck.error}`);
  }

  // Vérifier l'API Elastic Email
  const apiCheck = await checkElasticEmailAPI();
  results.checks.push(apiCheck);
  if (!apiCheck.success) {
    results.status = 'warning';
    results.errors.push(`⚠️  API Elastic Email: ${apiCheck.error}`);
  }

  return results;
}

function checkEnvironmentVariables() {
  const requiredVars = [
    'ELASTIC_EMAIL_API_KEY',
    'FROM_EMAIL',
    'ADMIN_EMAIL'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  return {
    name: 'Variables d\'environnement',
    success: missing.length === 0,
    details: missing.length === 0 
      ? 'Toutes les variables sont configurées' 
      : `Variables manquantes: ${missing.join(', ')}`,
    timestamp: new Date().toISOString()
  };
}

async function testEmailSending() {
  try {
    const apiKey = process.env.ELASTIC_EMAIL_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL;

    const params = new URLSearchParams({
      apikey: apiKey,
      from: fromEmail,
      to: adminEmail,
      subject: '[MONITORING] Test automatique du service email',
      bodyHtml: `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #2563eb;">✅ Test de monitoring réussi</h2>
            <p>Ce message confirme que le service d'envoi d'emails fonctionne correctement.</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Message automatique du système de monitoring
            </p>
          </body>
        </html>
      `,
      isTransactional: 'true'
    });

    const response = await fetch('https://api.elasticemail.com/v2/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Échec de l\'envoi');
    }

    return {
      name: 'Envoi d\'email de test',
      success: true,
      details: `Email envoyé avec succès (Transaction ID: ${result.data.transactionid})`,
      transactionId: result.data.transactionid,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      name: 'Envoi d\'email de test',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function checkElasticEmailAPI() {
  try {
    const apiKey = process.env.ELASTIC_EMAIL_API_KEY;
    
    // Vérifier le statut de l'API avec un appel simple
    const response = await fetch(`https://api.elasticemail.com/v2/account/load?apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();

    return {
      name: 'API Elastic Email',
      success: data.success === true,
      details: data.success ? 'API accessible et fonctionnelle' : 'API non accessible',
      accountInfo: data.success ? {
        email: data.data.email,
        credit: data.data.credit
      } : null,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      name: 'API Elastic Email',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Exécution si appelé directement
if (require.main === module) {
  checkEmailService()
    .then(results => {
      console.log('\n📧 VÉRIFICATION DU SERVICE EMAIL');
      console.log('═══════════════════════════════════════════════');
      console.log(`Timestamp: ${results.timestamp}`);
      console.log(`Status: ${results.status === 'success' ? '✅ OK' : '❌ ERROR'}\n`);

      console.log('Détails des vérifications:');
      results.checks.forEach(check => {
        const status = check.success ? '✅' : '❌';
        console.log(`${status} ${check.name}`);
        console.log(`   ${check.details || check.error}`);
        if (check.transactionId) {
          console.log(`   Transaction ID: ${check.transactionId}`);
        }
        if (check.accountInfo) {
          console.log(`   Compte: ${check.accountInfo.email}`);
          console.log(`   Crédit: ${check.accountInfo.credit}`);
        }
      });

      if (results.errors.length > 0) {
        console.log('\n⚠️  Erreurs détectées:');
        results.errors.forEach(error => console.log(`   ${error}`));
      }

      process.exit(results.status === 'error' ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Erreur lors de la vérification:', error);
      process.exit(1);
    });
}

module.exports = { checkEmailService };
