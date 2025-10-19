import { NextRequest, NextResponse } from 'next/server'
import { supabase } from './supabase'
import { getRateLimitKey, checkRateLimit, constantTimeCompare } from './security'

export interface AdminSession {
  id: string
  email: string
  full_name: string
  role: string
}

// Vérification de la session admin
export async function verifyAdminSession(request: NextRequest): Promise<{ 
  valid: boolean
  admin?: AdminSession
  error?: string 
}> {
  try {
    // Récupérer le token depuis les headers
    const authHeader = request.headers.get('authorization')
    const sessionData = request.headers.get('x-admin-session')
    
    if (!authHeader && !sessionData) {
      return { valid: false, error: 'Non authentifié' }
    }

    // Si session data est fournie, la valider
    if (sessionData) {
      try {
        const session: AdminSession = JSON.parse(sessionData)
        console.log('🔐 Vérification session admin:', { id: session.id, email: session.email })
        
        // Vérifier que la session existe en base
        const { data: admin, error } = await supabase
          .from('admins')
          .select('id, email, full_name, role')
          .eq('id', session.id)
          .eq('email', session.email)
          .single()

        if (error) {
          console.error('❌ Erreur Supabase:', error)
          return { valid: false, error: 'Session invalide' }
        }
        
        if (!admin) {
          console.error('❌ Admin non trouvé en base')
          return { valid: false, error: 'Session invalide' }
        }

        console.log('✅ Admin authentifié:', admin.email)
        return { valid: true, admin }
      } catch (e) {
        console.error('❌ Erreur parsing session:', e)
        return { valid: false, error: 'Session corrompue' }
      }
    }

    return { valid: false, error: 'Authentification requise' }
  } catch (error) {
    console.error('Error verifying admin session:', error)
    return { valid: false, error: 'Erreur de vérification' }
  }
}

// Middleware pour protéger les routes admin
export async function requireAdmin(
  request: NextRequest,
  options: {
    requireRole?: string[]
    rateLimit?: { maxRequests: number; windowMs: number }
  } = {}
): Promise<NextResponse | { admin: AdminSession }> {
  // Rate limiting spécifique admin
  if (options.rateLimit) {
    const ip = getRateLimitKey(request)
    const { allowed } = checkRateLimit(
      `admin:${ip}`,
      options.rateLimit.maxRequests,
      options.rateLimit.windowMs
    )

    if (!allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { status: 429 }
      )
    }
  }

  // Vérification de la session
  const { valid, admin, error } = await verifyAdminSession(request)

  if (!valid || !admin) {
    return NextResponse.json(
      { error: error || 'Accès non autorisé' },
      { status: 401 }
    )
  }

  // Vérification du rôle si requis
  if (options.requireRole && options.requireRole.length > 0) {
    if (!options.requireRole.includes(admin.role)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      )
    }
  }

  return { admin }
}

// Validation du mot de passe admin avec protection contre les attaques par timing
export async function validateAdminPassword(
  email: string,
  password: string
): Promise<{ valid: boolean; admin?: any; error?: string }> {
  try {
    // Rate limiting sur les tentatives de connexion
    const { allowed } = checkRateLimit(`login:${email}`, 5, 300000) // 5 tentatives par 5 minutes

    if (!allowed) {
      return { 
        valid: false, 
        error: 'Trop de tentatives de connexion. Veuillez réessayer dans 5 minutes.' 
      }
    }

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !admin) {
      // Délai constant pour éviter les attaques par timing
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 50))
      return { valid: false, error: 'Email ou mot de passe incorrect' }
    }

    // Vérification du mot de passe avec bcrypt
    const bcrypt = require('bcryptjs')
    const isValid = await bcrypt.compare(password, admin.password_hash)

    if (!isValid) {
      // Délai constant pour éviter les attaques par timing
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 50))
      return { valid: false, error: 'Email ou mot de passe incorrect' }
    }

    // Supprimer le hash du mot de passe avant de retourner
    const { password_hash, ...adminWithoutPassword } = admin

    return { valid: true, admin: adminWithoutPassword }
  } catch (error) {
    console.error('Error validating admin password:', error)
    return { valid: false, error: 'Erreur de connexion' }
  }
}

// Génération de token de session sécurisé
export function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Validation des permissions admin
export function hasPermission(admin: AdminSession, permission: string): boolean {
  const rolePermissions: Record<string, string[]> = {
    'super_admin': ['*'], // Toutes les permissions
    'admin': ['view', 'create', 'update', 'delete_own'],
    'viewer': ['view']
  }

  const permissions = rolePermissions[admin.role] || []
  return permissions.includes('*') || permissions.includes(permission)
}

// Logging sécurisé des actions admin
export async function logAdminAction(
  adminId: string,
  action: string,
  details: string,
  ip: string
): Promise<void> {
  try {
    await supabase
      .from('admin_activity_logs')
      .insert([{
        admin_id: adminId,
        action,
        details,
        ip_address: ip,
        created_at: new Date().toISOString()
      }])
  } catch (error) {
    console.error('Error logging admin action:', error)
  }
}
