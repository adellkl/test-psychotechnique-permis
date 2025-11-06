import { NextRequest, NextResponse } from 'next/server'
import { supabase } from './supabase'

export interface AuthenticatedRequest extends NextRequest {
  admin?: {
    id: string
    email: string
    full_name: string
    role: string
  }
}

/**
 * Middleware d'authentification pour les routes API admin
 * Vérifie la présence et la validité du token admin
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Récupérer le token depuis les headers
    const authHeader = request.headers.get('authorization')
    const adminSession = request.headers.get('x-admin-session')
    
    if (!authHeader && !adminSession) {
      return NextResponse.json(
        { error: 'Non autorisé - Token manquant' },
        { status: 401 }
      )
    }

    // Extraire l'email depuis le header (format: "Bearer email@example.com" ou directement l'email)
    let adminEmail = adminSession
    if (authHeader) {
      adminEmail = authHeader.replace('Bearer ', '')
    }

    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Non autorisé - Token invalide' },
        { status: 401 }
      )
    }

    // Vérifier que l'admin existe dans la base de données
    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, email, full_name, role, is_active')
      .eq('email', adminEmail)
      .single()

    if (error || !admin) {
      return NextResponse.json(
        { error: 'Non autorisé - Utilisateur non trouvé' },
        { status: 401 }
      )
    }

    if (!admin.is_active) {
      return NextResponse.json(
        { error: 'Non autorisé - Compte désactivé' },
        { status: 403 }
      )
    }

    // L'authentification est réussie, retourner null pour continuer
    return null
  } catch (error) {
    console.error('Erreur middleware auth:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'authentification' },
      { status: 500 }
    )
  }
}

/**
 * Extraire les informations admin depuis la requête
 */
export async function getAdminFromRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const adminSession = request.headers.get('x-admin-session')
    
    let adminEmail = adminSession
    if (authHeader) {
      adminEmail = authHeader.replace('Bearer ', '')
    }

    if (!adminEmail) return null

    const { data: admin } = await supabase
      .from('admins')
      .select('id, email, full_name, role')
      .eq('email', adminEmail)
      .single()

    return admin
  } catch (error) {
    console.error('Erreur getAdminFromRequest:', error)
    return null
  }
}
