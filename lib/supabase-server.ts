import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Variables Supabase manquantes')
}

// Client Supabase pour les API routes (côté serveur)
export const supabaseServer = createClient(supabaseUrl, supabaseKey)
