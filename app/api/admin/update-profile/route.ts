import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import * as bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { adminId, currentPassword, updates } = await request.json()

    if (!adminId || !currentPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Vérifier le mot de passe actuel
    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('*')
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

    // Mettre à jour les informations
    const { error: updateError } = await supabase
      .from('admins')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', adminId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Retourner les nouvelles données (sans le mot de passe)
    const updatedAdmin = { ...admin, ...updates }
    const { password: _password, ...adminWithoutPassword } = updatedAdmin

    return NextResponse.json({ 
      success: true, 
      admin: adminWithoutPassword 
    })
  } catch (error) {
    console.error('Error updating admin profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
