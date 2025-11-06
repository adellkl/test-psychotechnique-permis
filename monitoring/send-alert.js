/**
 * Script d'envoi d'alertes par email
 * Utilisé pour notifier l'administrateur en cas de problème
 */

require('dotenv').config({ path: '.env.production' });

async function sendAlert(alertType, details) {
  try {
    const apiKey = process.env.ELASTIC_EMAIL_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'contact@test-psychotechnique-permis.com';
    const adminEmail = process.env.ADMIN_EMAIL || 'sebtifatiha@live.fr';

    // Déterminer le niveau de criticité et l'emoji
    const severity = {
      error: { emoji: '🚨', level: 'CRITIQUE', color: '#dc2626' },
      warning: { emoji: '⚠️', level: 'ATTENTION', color: '#f59e0b' },
      info: { emoji: 'ℹ️', level: 'INFORMATION', color: '#3b82f6' }
    };

    const config = severity[alertType] || severity.info;

    // Construire le corps de l'email
    const htmlBody = buildAlertEmail(config, details);

    const params = new URLSearchParams({
      apikey: apiKey,
      from: fromEmail,
      to: adminEmail,
      subject: `${config.emoji} [${config.level}] Alerte Monitoring - ${details.title}`,
      bodyHtml: htmlBody,
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
      throw new Error(result.error || 'Échec de l\'envoi de l\'alerte');
    }

    return {
      success: true,
      transactionId: result.data.transactionid,
      messageId: result.data.messageid
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'alerte:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function buildAlertEmail(config, details) {
  const checksList = details.checks && details.checks.length > 0
    ? details.checks.map(check => {
        const status = check.success ? '✅' : '❌';
        return `
          <div style="margin: 10px 0; padding: 10px; background: ${check.success ? '#f0fdf4' : '#fef2f2'}; border-radius: 5px;">
            <strong>${status} ${check.name}</strong><br>
            <span style="color: #666;">${check.details || check.error || 'N/A'}</span>
          </div>
        `;
      }).join('')
    : '<p>Aucun détail de vérification disponible</p>';

  const errorsList = details.errors && details.errors.length > 0
    ? `
      <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #dc2626;">Erreurs détectées:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          ${details.errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
      </div>
    `
    : '';

  const statsSection = details.stats
    ? `
      <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #374151;">Statistiques:</h3>
        <ul style="margin: 0; padding-left: 20px; color: #666;">
          ${Object.entries(details.stats).map(([key, value]) => {
            if (typeof value === 'object') {
              return `<li><strong>${key}:</strong>
                <ul>${Object.entries(value).map(([k, v]) => `<li>${k}: ${v}</li>`).join('')}</ul>
              </li>`;
            }
            return `<li><strong>${key}:</strong> ${value}</li>`;
          }).join('')}
        </ul>
      </div>
    `
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${config.color} 0%, ${adjustColor(config.color, -20)} 100%); padding: 30px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">${config.emoji}</div>
          <h1 style="margin: 0; color: white; font-size: 24px;">${config.level}</h1>
          <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
            Système de monitoring - ${details.title}
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #666;">
              <strong>Timestamp:</strong> ${details.timestamp || new Date().toISOString()}<br>
              <strong>Status:</strong> <span style="color: ${config.color};">${details.status?.toUpperCase() || 'UNKNOWN'}</span>
            </p>
          </div>

          ${details.message ? `
            <div style="margin: 20px 0;">
              <p style="color: #374151; line-height: 1.6;">${details.message}</p>
            </div>
          ` : ''}

          ${errorsList}

          <div style="margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #374151;">Résultats des vérifications:</h3>
            ${checksList}
          </div>

          ${statsSection}

          <!-- Actions recommandées -->
          <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">Actions recommandées:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
              <li>Vérifier les logs de l'application</li>
              <li>Consulter le dashboard admin</li>
              <li>Tester manuellement les fonctionnalités affectées</li>
              ${alertType === 'error' ? '<li><strong>Intervention immédiate requise</strong></li>' : ''}
            </ul>
          </div>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
            <p style="margin: 5px 0;">Système de monitoring automatique</p>
            <p style="margin: 5px 0;">Test Psychotechnique Permis</p>
            <p style="margin: 5px 0;">
              <a href="https://test-psychotechnique-permis.com/admin" style="color: #3b82f6; text-decoration: none;">
                Accéder au dashboard admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function adjustColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

// Exécution si appelé directement (test)
if (require.main === module) {
  const testDetails = {
    title: 'Test d\'alerte',
    timestamp: new Date().toISOString(),
    status: 'test',
    message: 'Ceci est un test du système d\'alerte automatique.',
    checks: [
      { name: 'Test 1', success: true, details: 'Réussi' },
      { name: 'Test 2', success: false, error: 'Échec simulé' }
    ],
    errors: ['Erreur de test 1', 'Erreur de test 2']
  };

  console.log('📧 Envoi d\'une alerte de test...');
  sendAlert('warning', testDetails)
    .then(result => {
      if (result.success) {
        console.log('✅ Alerte envoyée avec succès');
        console.log(`   Transaction ID: ${result.transactionId}`);
      } else {
        console.log('❌ Échec de l\'envoi de l\'alerte');
        console.log(`   Erreur: ${result.error}`);
      }
    });
}

module.exports = { sendAlert };
