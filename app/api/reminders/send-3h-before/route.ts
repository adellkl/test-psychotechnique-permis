import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendAppointmentReminder } from '@/lib/emailService'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * API pour envoyer les rappels 3 heures avant les rendez-vous
 * Cette route doit être appelée par un cron job toutes les heures
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier le secret pour sécuriser l'endpoint (pour cron jobs)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key-here'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Calculer la fenêtre de temps : entre 3h et 2h45 avant le rendez-vous
    const now = new Date()
    const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000)
    const twoHours45FromNow = new Date(now.getTime() + 2.75 * 60 * 60 * 1000)

    // Formater les dates pour la comparaison
    const targetDateStart = twoHours45FromNow.toISOString().split('T')[0]
    const targetDateEnd = threeHoursFromNow.toISOString().split('T')[0]

    console.log('🔔 [REMINDER-3H] Vérification des rendez-vous entre', twoHours45FromNow.toISOString(), 'et', threeHoursFromNow.toISOString())

    // Récupérer les rendez-vous confirmés de la date cible qui n'ont pas encore reçu le rappel 3h
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('status', 'confirmed')
      .gte('appointment_date', targetDateStart)
      .lte('appointment_date', targetDateEnd)
      .or('reminder_3h_sent.is.null,reminder_3h_sent.eq.false')

    if (error) {
      console.error('❌ [REMINDER-3H] Erreur récupération rendez-vous:', error)
      throw error
    }

    if (!appointments || appointments.length === 0) {
      console.log('ℹ️  [REMINDER-3H] Aucun rendez-vous à rappeler')
      return NextResponse.json({
        success: true,
        message: 'Aucun rendez-vous à rappeler',
        count: 0
      })
    }

    console.log(`📧 [REMINDER-3H] ${appointments.length} rappel(s) à envoyer`)

    const results = []
    let successCount = 0
    let errorCount = 0

    // Envoyer un rappel pour chaque rendez-vous
    for (const appointment of appointments) {
      try {
        // Combiner date et heure pour créer le datetime complet
        const appointmentDatetime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`)
        
        // Vérifier que le rendez-vous est bien dans la fenêtre de 2h45 à 3h
        if (appointmentDatetime < twoHours45FromNow || appointmentDatetime > threeHoursFromNow) {
          console.log(`⏭️  [REMINDER-3H] RDV ${appointment.id} hors fenêtre, ignoré`)
          continue
        }

        // Formater la date et l'heure
        const dateStr = appointment.appointment_date
        const timeStr = appointment.appointment_time

        // Envoyer l'email de rappel
        await sendAppointmentReminder({
          first_name: appointment.first_name,
          last_name: appointment.last_name,
          email: appointment.email,
          appointment_date: dateStr,
          appointment_time: timeStr,
          center_name: appointment.center_name,
          center_address: appointment.center_address,
          center_city: appointment.center_city,
          center_postal_code: appointment.center_postal_code,
        })

        // Marquer le rappel comme envoyé
        const { error: updateError } = await supabase
          .from('appointments')
          .update({ 
            reminder_3h_sent: true,
            reminder_3h_sent_at: new Date().toISOString()
          })
          .eq('id', appointment.id)

        if (updateError) {
          console.error(`⚠️  [REMINDER-3H] Erreur mise à jour appointment ${appointment.id}:`, updateError)
        }

        successCount++
        results.push({
          id: appointment.id,
          email: appointment.email,
          status: 'sent',
          message: 'Rappel envoyé avec succès'
        })

        console.log(`✅ [REMINDER-3H] Rappel envoyé à ${appointment.email} pour RDV à ${timeStr}`)
      } catch (emailError) {
        errorCount++
        console.error(`❌ [REMINDER-3H] Erreur envoi rappel pour ${appointment.email}:`, emailError)
        
        results.push({
          id: appointment.id,
          email: appointment.email,
          status: 'error',
          message: emailError instanceof Error ? emailError.message : 'Erreur inconnue'
        })
      }
    }

    console.log(`✅ [REMINDER-3H] Terminé: ${successCount} envoyés, ${errorCount} erreurs`)

    return NextResponse.json({
      success: true,
      message: `Rappels envoyés: ${successCount}/${appointments.length}`,
      totalAppointments: appointments.length,
      successCount,
      errorCount,
      results
    })
  } catch (error) {
    console.error('❌ [REMINDER-3H] Erreur globale:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'envoi des rappels',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// Version POST pour permettre des tests manuels
export async function POST(request: NextRequest) {
  return GET(request)
}
