import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '⚠️ Variables Supabase manquantes. Veuillez configurer NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

export const supabase = createBrowserClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)

// Types
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
  created_at: string
  updated_at: string
}

export interface AvailableSlot {
  id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
  max_appointments: number
  created_at: string
}

export interface Admin {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
  updated_at: string
}
