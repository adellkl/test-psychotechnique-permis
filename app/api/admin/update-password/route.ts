import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '../../../../lib/supabase-server'
import * as bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { adminId, currentPassword, newPassword } = await request.json()

    if (!adminId || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validation du nouveau mot de passe
    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' 
      }, { status: 400 })
    }

    // Vérifier le mot de passe actuel
    const { data: admin, error: fetchError } = await supabaseServer
      .from('admins')
      .select('password')
      .eq('id', adminId)
      .single()

    if (fetchError || !admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Comparer avec bcrypt
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 401 })
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Mettre à jour le mot de passe
    const { error: updateError } = await supabaseServer
      .from('admins')
      .update({
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', adminId)

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
