import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '../../../../lib/supabase-server'
import * as bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    // Récupérer l'admin
    const { data: admin, error: fetchError } = await supabaseServer
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (fetchError || !admin) {
      console.error('Admin not found:', fetchError)
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    // Vérifier que le mot de passe existe
    if (!admin.password_hash) {
      console.error('Password hash is missing for admin:', admin.email)
      return NextResponse.json({ error: 'Compte non configuré. Utilisez le script setup-admin.js' }, { status: 500 })
    }

    // Comparer le mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    // Retourner les données admin (sans le mot de passe)
    const { password_hash: _, password: __, ...adminData } = admin

    return NextResponse.json({ 
      success: true, 
      admin: adminData
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
