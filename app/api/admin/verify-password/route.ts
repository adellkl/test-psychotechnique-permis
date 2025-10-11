import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    // Récupérer l'admin depuis la base de données
    const { data: admin, error } = await supabase
      .from('admins')
      .select('password_hash')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !admin) {
      return NextResponse.json({ error: 'Admin non trouvé' }, { status: 404 })
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, admin.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur vérification mot de passe:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
