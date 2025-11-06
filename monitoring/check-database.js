/**
 * Script de vérification de la base de données Supabase
 * Vérifie la connectivité et l'intégrité des données
 */

require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

async function checkDatabase() {
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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Test de connexion basique
  const connectionCheck = await testConnection(supabase);
  results.checks.push(connectionCheck);
  if (!connectionCheck.success) {
    results.status = 'error';
    results.errors.push('❌ Impossible de se connecter à la base de données');
    return results;
  }

  // Vérifier les tables principales
  const tablesCheck = await checkTables(supabase);
  results.checks.push(tablesCheck);
  if (!tablesCheck.success) {
    results.status = 'error';
    results.errors.push('❌ Problème avec les tables de la base de données');
  }

  // Vérifier l'intégrité des données
  const integrityCheck = await checkDataIntegrity(supabase);
  results.checks.push(integrityCheck);
  if (!integrityCheck.success) {
    results.status = 'warning';
    results.errors.push('⚠️  Problèmes d\'intégrité des données détectés');
  }

  // Statistiques générales
  const statsCheck = await getDatabaseStats(supabase);
  results.checks.push(statsCheck);
  results.stats = statsCheck.stats;

  return results;
}

function checkEnvironmentVariables() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  return {
    name: 'Variables d\'environnement Supabase',
    success: missing.length === 0,
    details: missing.length === 0 
      ? 'Toutes les variables sont configurées' 
      : `Variables manquantes: ${missing.join(', ')}`,
    timestamp: new Date().toISOString()
  };
}

async function testConnection(supabase) {
  try {
    // Test simple avec une requête sur la table appointments
    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .limit(1);

    if (error) throw error;

    return {
      name: 'Connexion à la base de données',
      success: true,
      details: 'Connexion établie avec succès',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      name: 'Connexion à la base de données',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function checkTables(supabase) {
  const tables = ['appointments', 'admins', 'email_templates', 'admin_activity_log'];
  const results = [];

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) throw error;

      results.push({
        table,
        accessible: true,
        count
      });
    } catch (error) {
      results.push({
        table,
        accessible: false,
        error: error.message
      });
    }
  }

  const allAccessible = results.every(r => r.accessible);

  return {
    name: 'Vérification des tables',
    success: allAccessible,
    details: allAccessible 
      ? 'Toutes les tables sont accessibles' 
      : `Tables inaccessibles: ${results.filter(r => !r.accessible).map(r => r.table).join(', ')}`,
    tables: results,
    timestamp: new Date().toISOString()
  };
}

async function checkDataIntegrity(supabase) {
  const issues = [];

  try {
    // Vérifier les rendez-vous sans email
    const { data: appointmentsWithoutEmail } = await supabase
      .from('appointments')
      .select('id')
      .or('email.is.null,email.eq.');

    if (appointmentsWithoutEmail && appointmentsWithoutEmail.length > 0) {
      issues.push(`${appointmentsWithoutEmail.length} rendez-vous sans email`);
    }

    // Vérifier les rendez-vous dans le passé avec statut "confirmed"
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { data: pastConfirmed } = await supabase
      .from('appointments')
      .select('id')
      .eq('status', 'confirmed')
      .lt('appointment_date', yesterday.toISOString().split('T')[0]);

    if (pastConfirmed && pastConfirmed.length > 0) {
      issues.push(`${pastConfirmed.length} rendez-vous passés toujours en statut "confirmed"`);
    }

    // Vérifier les templates d'email actifs
    const { data: templates } = await supabase
      .from('email_templates')
      .select('template_name, is_active')
      .eq('is_active', true);

    if (!templates || templates.length === 0) {
      issues.push('Aucun template d\'email actif trouvé');
    }

    return {
      name: 'Intégrité des données',
      success: issues.length === 0,
      details: issues.length === 0 
        ? 'Aucun problème d\'intégrité détecté' 
        : `${issues.length} problème(s) détecté(s)`,
      issues,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      name: 'Intégrité des données',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function getDatabaseStats(supabase) {
  try {
    const stats = {};

    // Compter les rendez-vous par statut
    const { data: appointments } = await supabase
      .from('appointments')
      .select('status');

    if (appointments) {
      stats.totalAppointments = appointments.length;
      stats.appointmentsByStatus = appointments.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
      }, {});
    }

    // Compter les admins
    const { count: adminCount } = await supabase
      .from('admins')
      .select('*', { count: 'exact', head: true });

    stats.totalAdmins = adminCount || 0;

    // Compter les templates actifs
    const { count: templateCount } = await supabase
      .from('email_templates')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    stats.activeEmailTemplates = templateCount || 0;

    // Dernière activité admin
    const { data: lastActivity } = await supabase
      .from('admin_activity_log')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1);

    if (lastActivity && lastActivity.length > 0) {
      stats.lastAdminActivity = lastActivity[0].created_at;
    }

    return {
      name: 'Statistiques de la base de données',
      success: true,
      stats,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      name: 'Statistiques de la base de données',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Exécution si appelé directement
if (require.main === module) {
  checkDatabase()
    .then(results => {
      console.log('\n🗄️  VÉRIFICATION DE LA BASE DE DONNÉES');
      console.log('═══════════════════════════════════════════════');
      console.log(`Timestamp: ${results.timestamp}`);
      console.log(`Status: ${results.status === 'success' ? '✅ OK' : results.status === 'warning' ? '⚠️  WARNING' : '❌ ERROR'}\n`);

      console.log('Détails des vérifications:');
      results.checks.forEach(check => {
        const status = check.success ? '✅' : '❌';
        console.log(`${status} ${check.name}`);
        console.log(`   ${check.details || check.error}`);
        
        if (check.tables) {
          check.tables.forEach(t => {
            console.log(`   - ${t.table}: ${t.accessible ? `✅ Accessible (${t.count} entrées)` : `❌ ${t.error}`}`);
          });
        }
        
        if (check.issues && check.issues.length > 0) {
          console.log('   Problèmes détectés:');
          check.issues.forEach(issue => console.log(`   - ${issue}`));
        }
      });

      if (results.stats) {
        console.log('\n📊 Statistiques:');
        console.log(`   Rendez-vous total: ${results.stats.totalAppointments || 0}`);
        if (results.stats.appointmentsByStatus) {
          Object.entries(results.stats.appointmentsByStatus).forEach(([status, count]) => {
            console.log(`   - ${status}: ${count}`);
          });
        }
        console.log(`   Administrateurs: ${results.stats.totalAdmins || 0}`);
        console.log(`   Templates email actifs: ${results.stats.activeEmailTemplates || 0}`);
        if (results.stats.lastAdminActivity) {
          console.log(`   Dernière activité admin: ${results.stats.lastAdminActivity}`);
        }
      }

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

module.exports = { checkDatabase };
