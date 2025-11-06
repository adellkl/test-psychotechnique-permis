/**
 * EXEMPLE D'UTILISATION DU MIDDLEWARE D'AUTHENTIFICATION
 * 
 * Ce fichier montre comment sécuriser une route API admin avec :
 * 1. Vérification d'authentification
 * 2. Rate limiting
 * 3. Protection CSRF
 * 
 * Pour appliquer à toutes les routes admin, copiez ce pattern dans chaque route.ts
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getAdminFromRequest } from '../../../../lib/authMiddleware'
import { checkApiRateLimit } from '../../../../lib/rateLimit'
import { checkCSRF } from '../../../../lib/csrf'
import { supabase } from '../../../../lib/supabase'

export async function GET(request: NextRequest) {
  // 1. Vérifier l'authentification
  const authError = await requireAuth(request)
  if (authError) return authError

  // 2. Rate limiting
  const rateLimit = checkApiRateLimit(request, 'appointments')
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        error: 'Trop de requêtes. Veuillez patienter.',
        resetTime: rateLimit.resetTime 
      },
      { status: 429 }
    )
  }

  // 3. Récupérer les informations admin
  const admin = await getAdminFromRequest(request)
  if (!admin) {
    return NextResponse.json(
      { error: 'Impossible de récupérer les informations admin' },
      { status: 401 }
    )
  }

  try {
    // Votre logique métier ici
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ 
      appointments: data,
      admin: admin.email 
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // 1. Vérifier l'authentification
  const authError = await requireAuth(request)
  if (authError) return authError

  // 2. Vérifier le token CSRF (pour les mutations)
  const csrfCheck = checkCSRF(request)
  if (!csrfCheck.valid) {
    return NextResponse.json(
      { error: csrfCheck.error },
      { status: 403 }
    )
  }

  // 3. Rate limiting
  const rateLimit = checkApiRateLimit(request, 'appointments-create')
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        error: 'Trop de requêtes. Veuillez patienter.',
        resetTime: rateLimit.resetTime 
      },
      { status: 429 }
    )
  }

  // 4. Récupérer les informations admin
  const admin = await getAdminFromRequest(request)
  if (!admin) {
    return NextResponse.json(
      { error: 'Impossible de récupérer les informations admin' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    // Votre logique de création ici
    const { data, error } = await supabase
      .from('appointments')
      .insert([body])
      .select()

    if (error) throw error

    return NextResponse.json({ 
      success: true,
      appointment: data[0],
      createdBy: admin.email 
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  // Même pattern que POST
  const authError = await requireAuth(request)
  if (authError) return authError

  const csrfCheck = checkCSRF(request)
  if (!csrfCheck.valid) {
    return NextResponse.json({ error: csrfCheck.error }, { status: 403 })
  }

  const rateLimit = checkApiRateLimit(request, 'appointments-update')
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Trop de requêtes', resetTime: rateLimit.resetTime },
      { status: 429 }
    )
  }

  const admin = await getAdminFromRequest(request)
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json({ 
      success: true,
      appointment: data[0],
      updatedBy: admin.email 
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  // Même pattern que POST/PUT
  const authError = await requireAuth(request)
  if (authError) return authError

  const csrfCheck = checkCSRF(request)
  if (!csrfCheck.valid) {
    return NextResponse.json({ error: csrfCheck.error }, { status: 403 })
  }

  const rateLimit = checkApiRateLimit(request, 'appointments-delete')
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Trop de requêtes', resetTime: rateLimit.resetTime },
      { status: 429 }
    )
  }

  const admin = await getAdminFromRequest(request)
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ 
      success: true,
      deletedBy: admin.email 
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
