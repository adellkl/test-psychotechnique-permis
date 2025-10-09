import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { sendConfirmationReminder } from '../../../../lib/emailService'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 [CRON] Vérification des rendez-vous non confirmés...')

    // Calculer la date/heure il y a 5 heures
    const fiveHoursAgo = new Date()
    fiveHoursAgo.setHours(fiveHoursAgo.getHours() - 5)

    // Récupérer les rendez-vous pending créés il y a plus de 5h et qui n'ont pas reçu de rappel
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('status', 'pending')
      .lt('created_at', fiveHoursAgo.toISOString())
      .is('reminder_sent_at', null)

    if (error) {
      console.error('❌ [CRON] Erreur Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!appointments || appointments.length === 0) {
      console.log('✅ [CRON] Aucun rendez-vous à rappeler')
      return NextResponse.json({ 
        success: true, 
        message: 'Aucun rendez-vous à rappeler',
        count: 0 
      })
    }

    console.log(`📧 [CRON] ${appointments.length} rendez-vous à rappeler`)

    const results = []

    for (const appointment of appointments) {
      try {
        // Envoyer le rappel
        await sendConfirmationReminder({
          first_name: appointment.first_name,
          last_name: appointment.last_name,
          email: appointment.email,
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time,
          appointment_id: appointment.id
        })

        // Marquer le rappel comme envoyé
        await supabase
          .from('appointments')
          .update({ 
            reminder_sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', appointment.id)

        results.push({
          id: appointment.id,
          email: appointment.email,
          success: true
        })

        console.log(`✅ [CRON] Rappel envoyé à ${appointment.email}`)
      } catch (emailError) {
        console.error(`❌ [CRON] Erreur pour ${appointment.email}:`, emailError)
        results.push({
          id: appointment.id,
          email: appointment.email,
          success: false,
          error: emailError instanceof Error ? emailError.message : 'Unknown error'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    console.log(`✅ [CRON] Terminé: ${successCount}/${appointments.length} rappels envoyés`)

    return NextResponse.json({
      success: true,
      message: `${successCount} rappels envoyés sur ${appointments.length}`,
      count: successCount,
      total: appointments.length,
      results
    })

  } catch (error) {
    console.error('❌ [CRON] Erreur générale:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de l\'envoi des rappels',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
