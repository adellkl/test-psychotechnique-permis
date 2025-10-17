import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Variables Supabase manquantes. Utilisation des valeurs par défaut.')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey)

export interface Appointment {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  test_type: string
  reason: string
  is_second_chance: boolean
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  admin_notes?: string
  client_notes?: string
  center_id: string
  created_at: string
  updated_at: string
}

export interface Center {
  id: string
  name: string
  address: string
  city: string
  postal_code: string
  phone: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AvailableSlot {
  id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
  isPending?: boolean
  max_appointments: number
  created_at?: string
}

export interface Admin {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
  updated_at: string
}
