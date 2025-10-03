const { createClient } = require('@supabase/supabase-js');

// Configuration depuis .env.local
const supabaseUrl = 'https://hzfpscgdyrqbplmhgwhi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('🔍 Test de connexion Supabase...');
  console.log('URL:', supabaseUrl);
  console.log('Key (premiers caractères):', supabaseKey.substring(0, 20) + '...');
  
  try {
    // Test 1: Vérifier la connexion de base
    const { data, error } = await supabase
      .from('available_slots')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      console.error('Code:', error.code);
      console.error('Details:', error.details);
      return;
    }
    
    console.log('✅ Connexion Supabase réussie!');
    console.log('Données reçues:', data);
    
    // Test 2: Lister les tables disponibles
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.log('⚠️ Impossible de lister les tables:', tablesError.message);
    } else {
      console.log('📋 Tables disponibles:', tables?.map(t => t.table_name));
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

testSupabaseConnection();
