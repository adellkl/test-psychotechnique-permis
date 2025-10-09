// Configuration des variables d'environnement
// Ce fichier centralise toutes les variables d'environnement

export const env = {
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  
  // Email
  email: {
    apiKey: process.env.ELASTIC_EMAIL_API_KEY || '',
    from: process.env.FROM_EMAIL || 'contact@test-psychotechnique-permis.com',
    admin: process.env.ADMIN_EMAIL || 'sebtifatiha170617@gmail.com',
  },
  
  // Application
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://test-psychotechnique-permis.com',
    nodeEnv: process.env.NODE_ENV || 'production',
  },
}

// Validation des variables critiques (seulement en runtime, pas au build)
export function validateEnv() {
  if (typeof window === 'undefined') {
    // Côté serveur
    const missing: string[] = []
    
    if (!env.supabase.url) missing.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!env.supabase.anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    if (!env.email.apiKey) missing.push('ELASTIC_EMAIL_API_KEY')
    
    if (missing.length > 0) {
      console.warn(`⚠️ Variables d'environnement manquantes: ${missing.join(', ')}`)
    }
  }
}
