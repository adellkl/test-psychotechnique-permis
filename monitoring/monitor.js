#!/usr/bin/env node

/**
 * Script principal de monitoring
 * Orchestre tous les tests et envoie des alertes en cas de problème
 */

require('dotenv').config({ path: '.env.production' });
const { checkAppHealth } = require('./check-app-health');
const { checkEmailService } = require('./check-email-service');
const { checkDatabase } = require('./check-database');
const { sendAlert } = require('./send-alert');

async function runMonitoring(options = {}) {
  const {
    sendAlertOnError = true,
    sendAlertOnWarning = false,
    verbose = true
  } = options;

  console.log('\n🔍 DÉMARRAGE DU MONITORING COMPLET');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  const results = {
    timestamp: new Date().toISOString(),
    overallStatus: 'success',
    duration: 0,
    checks: {}
  };

  const startTime = Date.now();

  // 1. Vérifier la santé de l'application
  if (verbose) console.log('📱 Vérification de la santé de l\'application...');
  try {
    results.checks.appHealth = await checkAppHealth();
    if (results.checks.appHealth.status === 'error') {
      results.overallStatus = 'error';
    } else if (results.checks.appHealth.status === 'warning' && results.overallStatus === 'success') {
      results.overallStatus = 'warning';
    }
    if (verbose) {
      console.log(`   ${getStatusEmoji(results.checks.appHealth.status)} Status: ${results.checks.appHealth.status.toUpperCase()}`);
      if (results.checks.appHealth.errors.length > 0) {
        results.checks.appHealth.errors.forEach(e => console.log(`   ${e}`));
      }
    }
  } catch (error) {
    results.checks.appHealth = { status: 'error', error: error.message };
    results.overallStatus = 'error';
    if (verbose) console.log(`   ❌ Erreur: ${error.message}`);
  }

  // 2. Vérifier le service d'email
  if (verbose) console.log('\n📧 Vérification du service email...');
  try {
    results.checks.emailService = await checkEmailService();
    if (results.checks.emailService.status === 'error') {
      results.overallStatus = 'error';
    } else if (results.checks.emailService.status === 'warning' && results.overallStatus === 'success') {
      results.overallStatus = 'warning';
    }
    if (verbose) {
      console.log(`   ${getStatusEmoji(results.checks.emailService.status)} Status: ${results.checks.emailService.status.toUpperCase()}`);
      if (results.checks.emailService.errors.length > 0) {
        results.checks.emailService.errors.forEach(e => console.log(`   ${e}`));
      }
    }
  } catch (error) {
    results.checks.emailService = { status: 'error', error: error.message };
    results.overallStatus = 'error';
    if (verbose) console.log(`   ❌ Erreur: ${error.message}`);
  }

  // 3. Vérifier la base de données
  if (verbose) console.log('\n🗄️  Vérification de la base de données...');
  try {
    results.checks.database = await checkDatabase();
    if (results.checks.database.status === 'error') {
      results.overallStatus = 'error';
    } else if (results.checks.database.status === 'warning' && results.overallStatus === 'success') {
      results.overallStatus = 'warning';
    }
    if (verbose) {
      console.log(`   ${getStatusEmoji(results.checks.database.status)} Status: ${results.checks.database.status.toUpperCase()}`);
      if (results.checks.database.errors.length > 0) {
        results.checks.database.errors.forEach(e => console.log(`   ${e}`));
      }
    }
  } catch (error) {
    results.checks.database = { status: 'error', error: error.message };
    results.overallStatus = 'error';
    if (verbose) console.log(`   ❌ Erreur: ${error.message}`);
  }

  results.duration = Date.now() - startTime;

  // Afficher le résumé
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 RÉSUMÉ DU MONITORING');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Status général: ${getStatusEmoji(results.overallStatus)} ${results.overallStatus.toUpperCase()}`);
  console.log(`Durée totale: ${results.duration}ms`);
  console.log('\nStatut par composant:');
  console.log(`  📱 Application: ${getStatusEmoji(results.checks.appHealth?.status || 'error')} ${(results.checks.appHealth?.status || 'error').toUpperCase()}`);
  console.log(`  📧 Service Email: ${getStatusEmoji(results.checks.emailService?.status || 'error')} ${(results.checks.emailService?.status || 'error').toUpperCase()}`);
  console.log(`  🗄️  Base de données: ${getStatusEmoji(results.checks.database?.status || 'error')} ${(results.checks.database?.status || 'error').toUpperCase()}`);

  // Envoyer une alerte si nécessaire
  const shouldSendAlert = 
    (results.overallStatus === 'error' && sendAlertOnError) ||
    (results.overallStatus === 'warning' && sendAlertOnWarning);

  if (shouldSendAlert) {
    console.log('\n📧 Envoi d\'une alerte...');
    
    const allErrors = [];
    const allChecks = [];

    Object.values(results.checks).forEach(check => {
      if (check.errors) allErrors.push(...check.errors);
      if (check.checks) allChecks.push(...check.checks);
    });

    const alertDetails = {
      title: 'Problème détecté dans le monitoring',
      timestamp: results.timestamp,
      status: results.overallStatus,
      message: `Le monitoring a détecté ${allErrors.length} problème(s) nécessitant votre attention.`,
      checks: allChecks,
      errors: allErrors,
      stats: results.checks.database?.stats
    };

    const alertResult = await sendAlert(
      results.overallStatus === 'error' ? 'error' : 'warning',
      alertDetails
    );

    if (alertResult.success) {
      console.log(`   ✅ Alerte envoyée (Transaction ID: ${alertResult.transactionId})`);
    } else {
      console.log(`   ❌ Échec de l'envoi de l'alerte: ${alertResult.error}`);
    }
  }

  // Sauvegarder les résultats dans un fichier log
  await saveResultsToLog(results);

  console.log('\n✅ Monitoring terminé\n');

  // Exit code basé sur le statut
  return results.overallStatus === 'error' ? 1 : 0;
}

function getStatusEmoji(status) {
  const emojis = {
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  return emojis[status] || '❓';
}

async function saveResultsToLog(results) {
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const logDir = path.join(__dirname, 'logs');
    
    // Créer le dossier logs s'il n'existe pas
    try {
      await fs.access(logDir);
    } catch {
      await fs.mkdir(logDir, { recursive: true });
    }

    // Nom du fichier avec la date
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(logDir, `monitoring-${date}.json`);

    // Lire les logs existants
    let logs = [];
    try {
      const existingLogs = await fs.readFile(logFile, 'utf8');
      logs = JSON.parse(existingLogs);
    } catch {
      // Fichier n'existe pas encore
    }

    // Ajouter les nouveaux résultats
    logs.push(results);

    // Garder seulement les 100 derniers résultats
    if (logs.length > 100) {
      logs = logs.slice(-100);
    }

    // Sauvegarder
    await fs.writeFile(logFile, JSON.stringify(logs, null, 2));
    
    console.log(`📝 Résultats sauvegardés dans ${logFile}`);
  } catch (error) {
    console.error('⚠️  Impossible de sauvegarder les résultats:', error.message);
  }
}

// Gestion des arguments en ligne de commande
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    sendAlertOnError: true,
    sendAlertOnWarning: false,
    verbose: true
  };

  args.forEach(arg => {
    switch (arg) {
      case '--no-alert':
        options.sendAlertOnError = false;
        options.sendAlertOnWarning = false;
        break;
      case '--alert-on-warning':
        options.sendAlertOnWarning = true;
        break;
      case '--quiet':
      case '-q':
        options.verbose = false;
        break;
      case '--help':
      case '-h':
        console.log(`
Usage: node monitor.js [options]

Options:
  --no-alert           Ne pas envoyer d'alertes même en cas d'erreur
  --alert-on-warning   Envoyer une alerte également pour les avertissements
  --quiet, -q          Mode silencieux (moins de sortie console)
  --help, -h           Afficher cette aide

Examples:
  node monitor.js                    # Monitoring complet avec alertes sur erreurs
  node monitor.js --alert-on-warning # Alertes sur erreurs ET warnings
  node monitor.js --no-alert         # Monitoring sans envoi d'alertes
  node monitor.js --quiet            # Mode silencieux
        `);
        process.exit(0);
        break;
    }
  });

  return options;
}

// Exécution si appelé directement
if (require.main === module) {
  const options = parseArgs();
  
  runMonitoring(options)
    .then(exitCode => {
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('\n❌ ERREUR CRITIQUE LORS DU MONITORING:');
      console.error(error);
      process.exit(1);
    });
}

module.exports = { runMonitoring };
