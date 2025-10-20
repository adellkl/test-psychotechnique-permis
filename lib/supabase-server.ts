import { createClient } from '@supabase/supabase-js'

// Configuration Supabase côté serveur avec valeurs par défaut garanties
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url_here'
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : 'https://hzfpscgdyrqbplmhgwhi.supabase.co'

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key_here'
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'

export const supabaseServer = createClient(supabaseUrl, supabaseKey)
