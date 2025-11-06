/**
 * Script de vérification de la santé de l'application
 * Vérifie que l'application répond correctement
 */

const https = require('https');
const http = require('http');

const APP_URL = process.env.APP_URL || 'https://test-psychotechnique-permis.com';
const TIMEOUT = 10000; // 10 secondes

async function checkAppHealth() {
  const results = {
    timestamp: new Date().toISOString(),
    status: 'success',
    checks: [],
    errors: []
  };

  // Vérifier la page d'accueil
  const homeCheck = await checkEndpoint(`${APP_URL}/`, 'Page d\'accueil');
  results.checks.push(homeCheck);
  if (!homeCheck.success) {
    results.status = 'error';
    results.errors.push(`❌ Page d'accueil inaccessible: ${homeCheck.error}`);
  }

  // Vérifier l'API de rendez-vous
  const apiCheck = await checkEndpoint(`${APP_URL}/api/appointments`, 'API Appointments');
  results.checks.push(apiCheck);
  if (!apiCheck.success) {
    results.status = 'warning';
    results.errors.push(`⚠️  API inaccessible: ${apiCheck.error}`);
  }

  // Vérifier la page admin
  const adminCheck = await checkEndpoint(`${APP_URL}/admin`, 'Page Admin');
  results.checks.push(adminCheck);
  if (!adminCheck.success) {
    results.status = 'warning';
    results.errors.push(`⚠️  Page admin inaccessible: ${adminCheck.error}`);
  }

  // Vérifier le temps de réponse moyen
  const avgResponseTime = results.checks
    .filter(c => c.success)
    .reduce((sum, c) => sum + c.responseTime, 0) / 
    results.checks.filter(c => c.success).length;

  results.avgResponseTime = Math.round(avgResponseTime);

  if (avgResponseTime > 3000) {
    results.status = 'warning';
    results.errors.push(`⚠️  Temps de réponse lent: ${results.avgResponseTime}ms`);
  }

  return results;
}

function checkEndpoint(url, name) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, { timeout: TIMEOUT }, (res) => {
      const responseTime = Date.now() - startTime;
      
      resolve({
        name,
        url,
        success: res.statusCode >= 200 && res.statusCode < 400,
        statusCode: res.statusCode,
        responseTime,
        timestamp: new Date().toISOString()
      });

      // Consommer la réponse pour éviter les fuites mémoire
      res.resume();
    });

    req.on('error', (error) => {
      resolve({
        name,
        url,
        success: false,
        error: error.message,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name,
        url,
        success: false,
        error: 'Timeout',
        responseTime: TIMEOUT,
        timestamp: new Date().toISOString()
      });
    });
  });
}

// Exécution si appelé directement
if (require.main === module) {
  checkAppHealth()
    .then(results => {
      console.log('\n🔍 VÉRIFICATION DE LA SANTÉ DE L\'APPLICATION');
      console.log('═══════════════════════════════════════════════');
      console.log(`Timestamp: ${results.timestamp}`);
      console.log(`Status: ${results.status === 'success' ? '✅ OK' : results.status === 'warning' ? '⚠️  WARNING' : '❌ ERROR'}`);
      console.log(`Temps de réponse moyen: ${results.avgResponseTime}ms\n`);

      console.log('Détails des vérifications:');
      results.checks.forEach(check => {
        const status = check.success ? '✅' : '❌';
        console.log(`${status} ${check.name}: ${check.statusCode || 'N/A'} (${check.responseTime}ms)`);
        if (check.error) {
          console.log(`   Erreur: ${check.error}`);
        }
      });

      if (results.errors.length > 0) {
        console.log('\n⚠️  Erreurs détectées:');
        results.errors.forEach(error => console.log(`   ${error}`));
      }

      // Exit code basé sur le statut
      process.exit(results.status === 'error' ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Erreur lors de la vérification:', error);
      process.exit(1);
    });
}

module.exports = { checkAppHealth };
