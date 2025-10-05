import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Récupération de la liste des admins...')

    // Récupérer tous les admins avec leurs informations de base
    const { data: admins, error } = await supabase
      .from('admins')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.log('❌ [ERROR] Erreur lors de la récupération:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des administrateurs' },
        { status: 500 }
      )
    }

    console.log(`✅ [SUCCESS] ${admins.length} admins récupérés`)

    return NextResponse.json({
      success: true,
      admins: admins,
      count: admins.length
    })

  } catch (error) {
    console.log('💥 [FATAL ERROR] Erreur générale:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
