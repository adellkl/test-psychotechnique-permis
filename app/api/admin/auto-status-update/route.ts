import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { logAdminActivity, AdminLogger } from '../../../../lib/adminLogger'

// Durée estimée d'un rendez-vous psychotechnique (en minutes)
const APPOINTMENT_DURATION = 40

interface StatusUpdate {
    id: string
    currentStatus: string
    newStatus: string
    appointmentTime: string
    clientName: string
}

export async function POST(request: NextRequest) {
    try {
        console.log('🔄 Démarrage de l\'analyse automatique des statuts...')

        // Obtenir la date et heure actuelles (France timezone)
        const now = new Date()
        const parisTime = new Intl.DateTimeFormat('fr-FR', {
            timeZone: 'Europe/Paris',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(now)

        const [datePart, timePart] = parisTime.split(' ')
        const [day, month, year] = datePart.split('/')
        const currentDate = `${year}-${month}-${day}`
        const currentTime = timePart

        console.log(`📅 Date/heure Paris: ${currentDate} ${currentTime}`)

        // Récupérer tous les rendez-vous d'aujourd'hui qui ne sont pas annulés
        const { data: appointments, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('appointment_date', currentDate)
            .neq('status', 'cancelled')
            .order('appointment_time', { ascending: true })

        if (error) {
            console.error('❌ Erreur lors de la récupération des RDV:', error)
            return NextResponse.json({ error: 'Erreur de base de données' }, { status: 500 })
        }

        if (!appointments || appointments.length === 0) {
            console.log('ℹ️ Aucun rendez-vous trouvé pour aujourd\'hui')
            return NextResponse.json({
                message: 'Aucun rendez-vous à analyser',
                updates: 0,
                currentTime: `${currentDate} ${currentTime}`
            })
        }

        console.log(`📋 ${appointments.length} rendez-vous trouvés pour analyse`)

        const updates: StatusUpdate[] = []
        const currentTimeMinutes = timeToMinutes(currentTime)

        for (const appointment of appointments) {
            const appointmentTimeMinutes = timeToMinutes(appointment.appointment_time)
            const appointmentEndMinutes = appointmentTimeMinutes + APPOINTMENT_DURATION

            let newStatus = appointment.status

            // Logique de détermination du statut (durée RDV: 40 minutes)
            if (currentTimeMinutes < appointmentTimeMinutes - 5) {
                // RDV dans plus de 5 minutes → confirmed
                newStatus = 'confirmed'
            } else if (currentTimeMinutes >= appointmentTimeMinutes && currentTimeMinutes <= appointmentEndMinutes) {
                // RDV en cours (pendant 40 minutes) → in_progress  
                newStatus = 'in_progress'
            } else if (currentTimeMinutes > appointmentEndMinutes) {
                // RDV terminé après 40 minutes → completed
                newStatus = 'completed'
            }

            // Mettre à jour seulement si le statut a changé
            if (newStatus !== appointment.status) {
                console.log(`🔄 ${appointment.first_name} ${appointment.last_name} (${appointment.appointment_time}): ${appointment.status} → ${newStatus}`)

                const { error: updateError } = await supabase
                    .from('appointments')
                    .update({
                        status: newStatus,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', appointment.id)

                if (updateError) {
                    console.error(`❌ Erreur mise à jour RDV ${appointment.id}:`, updateError)
                } else {
                    updates.push({
                        id: appointment.id,
                        currentStatus: appointment.status,
                        newStatus: newStatus,
                        appointmentTime: appointment.appointment_time,
                        clientName: `${appointment.first_name} ${appointment.last_name}`
                    })
                }
            }
        }

        // Log l'activité si des mises à jour ont été effectuées
        if (updates.length > 0) {
            console.log(`✅ ${updates.length} statuts mis à jour automatiquement`)
            await logAdminActivity(
                AdminLogger.ACTIONS.UPDATE_APPOINTMENT,
                `Mise à jour automatique de ${updates.length} statut(s) de RDV`
            )
        }

        return NextResponse.json({
            message: `Analyse terminée - ${updates.length} mise(s) à jour`,
            updates: updates.length,
            updatedAppointments: updates,
            currentTime: `${currentDate} ${currentTime}`,
            totalAppointments: appointments.length
        })

    } catch (error) {
        console.error('❌ Erreur lors de l\'analyse automatique:', error)
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}

// Convertir HH:MM en minutes depuis minuit
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
}

// Obtenir l'heure actuelle en format HH:MM (timezone France)
function getCurrentFranceTime(): string {
    const now = new Date()
    return new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(now)
}
