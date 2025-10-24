import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import * as bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await request.json()

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    // Validation du nouveau mot de passe
    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' 
      }, { status: 400 })
    }

    // Récupérer l'admin par email
    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, password_hash')
      .eq('email', email.toLowerCase())
      .single()

    if (fetchError || !admin) {
      return NextResponse.json({ error: 'Admin non trouvé' }, { status: 404 })
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password_hash)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 401 })
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Mettre à jour le mot de passe
    const { error: updateError } = await supabase
      .from('admins')
      .update({
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', admin.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
