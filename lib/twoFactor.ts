import crypto from 'crypto'
import { supabase } from './supabase'

interface TwoFactorCode {
  code: string
  email: string
  createdAt: number
  expiresAt: number
  attempts: number
}


const twoFactorCodes = new Map<string, TwoFactorCode>()


setInterval(() => {
  const now = Date.now()
  twoFactorCodes.forEach((data, key) => {
    if (data.expiresAt < now) {
      twoFactorCodes.delete(key)
    }
  })
}, 60 * 1000)


function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createTwoFactorCode(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const code = generateTwoFactorCode()
    const now = Date.now()
    const expiresAt = now + 10 * 60 * 1000
    twoFactorCodes.set(email, {
      code,
      email,
      createdAt: now,
      expiresAt,
      attempts: 0
    })

    console.log(`📧 Code 2FA pour ${email}: ${code}`)

    await supabase
      .from('two_factor_codes')
      .upsert({
        email,
        code,
        created_at: new Date(now).toISOString(),
        expires_at: new Date(expiresAt).toISOString(),
        used: false
      })

    return { success: true }
  } catch (error) {
    console.error('Erreur création code 2FA:', error)
    return { success: false, error: 'Erreur lors de la génération du code' }
  }
}

export function verifyTwoFactorCode(email: string, code: string): {
  valid: boolean
  error?: string
} {
  const data = twoFactorCodes.get(email)

  if (!data) {
    return { valid: false, error: 'Code non trouvé ou expiré' }
  }

  if (data.expiresAt < Date.now()) {
    twoFactorCodes.delete(email)
    return { valid: false, error: 'Code expiré' }
  }

  if (data.attempts >= 3) {
    twoFactorCodes.delete(email)
    return { valid: false, error: 'Trop de tentatives. Demandez un nouveau code.' }
  }

  data.attempts++

  if (data.code !== code) {
    return { valid: false, error: `Code incorrect (${3 - data.attempts} tentatives restantes)` }
  }
  twoFactorCodes.delete(email)

  supabase
    .from('two_factor_codes')
    .update({ used: true })
    .eq('email', email)
    .eq('code', code)
    .then(() => { }, (err: Error) => console.error('Erreur mise à jour 2FA:', err))

  return { valid: true }
}

export async function isTwoFactorEnabled(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('two_factor_enabled')
      .eq('email', email)
      .single()

    if (error || !data) return false

    return data.two_factor_enabled === true
  } catch (error) {
    console.error('Erreur vérification 2FA:', error)
    return false
  }
}

export async function enableTwoFactor(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('admins')
      .update({ two_factor_enabled: true })
      .eq('email', email)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erreur activation 2FA:', error)
    return { success: false, error: 'Erreur lors de l\'activation du 2FA' }
  }
}

export async function disableTwoFactor(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('admins')
      .update({ two_factor_enabled: false })
      .eq('email', email)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erreur désactivation 2FA:', error)
    return { success: false, error: 'Erreur lors de la désactivation du 2FA' }
  }
}

export async function cleanupOldTwoFactorCodes(): Promise<number> {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('two_factor_codes')
      .delete()
      .lt('created_at', oneHourAgo)
      .select()

    if (error) throw error

    return data?.length || 0
  } catch (error) {
    console.error('Erreur nettoyage codes 2FA:', error)
    return 0
  }
}
