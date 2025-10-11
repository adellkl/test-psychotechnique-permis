import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export const dynamic = 'force-dynamic'

// Cette route peut être appelée par un cron job pour marquer automatiquement
// les rendez-vous passés comme "terminé"
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification (optionnel - ajouter un token secret)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET_TOKEN || 'your-secret-token'
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM

    // Récupérer tous les rendez-vous confirmés
    const { data: appointments, error: fetchError } = await supabase
      .from('appointments')
      .select('id, appointment_date, appointment_time')
      .eq('status', 'confirmed')

    if (fetchError) {
      console.error('Erreur récupération rendez-vous:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    const appointmentsToUpdate: string[] = []

    appointments?.forEach(apt => {
      const aptDate = apt.appointment_date
      const aptTime = apt.appointment_time.slice(0, 5)

      // Si la date est avant aujourd'hui, ou si c'est aujourd'hui mais l'heure est passée
      if (aptDate < today || (aptDate === today && aptTime < currentTime)) {
        appointmentsToUpdate.push(apt.id)
      }
    })

    if (appointmentsToUpdate.length > 0) {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .in('id', appointmentsToUpdate)

      if (updateError) {
        console.error('Erreur mise à jour:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      console.log(`✅ ${appointmentsToUpdate.length} rendez-vous marqués comme terminés`)
      
      return NextResponse.json({
        success: true,
        updated: appointmentsToUpdate.length,
        message: `${appointmentsToUpdate.length} rendez-vous marqués comme terminés`
      })
    }

    return NextResponse.json({
      success: true,
      updated: 0,
      message: 'Aucun rendez-vous à mettre à jour'
    })

  } catch (error) {
    console.error('Erreur cron job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
