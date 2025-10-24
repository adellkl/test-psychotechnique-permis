import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { validateAppointmentForm, sanitizeFormData } from '../../../../lib/validation'
import { checkFormRateLimit } from '../../../../lib/rateLimit'
import { logSecurityEvent } from '../../../../lib/securityLogger'

/**
 * API sécurisée pour créer des rendez-vous
 * Remplace l'insertion directe Supabase côté client
 * 
 * POST /api/appointments/create
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  
  try {
    // 1. Rate limiting strict
    const rateLimit = checkFormRateLimit(request, 'appointment')
    if (!rateLimit.allowed) {
      await logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        endpoint: '/api/appointments/create',
        ip,
        blockedUntil: rateLimit.blockedUntil
      })
      
      return NextResponse.json(
        { 
          error: 'Trop de tentatives. Veuillez patienter quelques minutes.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      )
    }

    // 2. Récupérer et valider les données
    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      reason, 
      notes,
      appointment_date,
      appointment_time,
      center_id,
      honeypot // Champ piège
    } = body

    // 3. Vérification honeypot
    if (honeypot && honeypot.trim() !== '') {
      await logSecurityEvent('BOT_DETECTED', {
        endpoint: '/api/appointments/create',
        ip,
        honeypot
      })
      
      // Retourner succès pour ne pas alerter le bot
      return NextResponse.json({ 
        success: true,
        message: 'Rendez-vous créé avec succès' 
      })
    }

    // 4. Validation complète
    const validation = validateAppointmentForm({
      firstName,
      lastName,
      email,
      phone,
      reason,
      notes: notes || '',
      date: appointment_date,
      time: appointment_time
    })

    if (!validation.isValid) {
      await logSecurityEvent('VALIDATION_FAILED', {
        endpoint: '/api/appointments/create',
        ip,
        errors: validation.errors
      })
      
      return NextResponse.json(
        { 
          error: 'Données invalides',
          errors: validation.errors 
        },
        { status: 400 }
      )
    }

    // 5. Sanitization des données
    const sanitizedData = sanitizeFormData({
      firstName,
      lastName,
      email,
      phone,
      reason,
      notes: notes || ''
    })

    // 6. Vérifier que le créneau est disponible (optionnel - ne pas bloquer si pas de système de slots)
    const { data: existingSlot, error: slotError } = await supabase
      .from('available_slots')
      .select('id, is_available')
      .eq('date', appointment_date)
      .eq('time', appointment_time)
      .eq('center_id', center_id || null)
      .maybeSingle()

    // Si le système de slots n'est pas utilisé, continuer sans bloquer
    if (existingSlot && !existingSlot.is_available) {
      return NextResponse.json(
        { error: 'Ce créneau n\'est plus disponible. Veuillez sélectionner un autre créneau.' },
        { status: 409 }
      )
    }

    // 7. Vérifier les rendez-vous existants par nom/prénom
    const today = new Date().toISOString().split('T')[0]
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('id, appointment_date, appointment_time, status, email, phone')
      .ilike('first_name', sanitizedData.firstName)
      .ilike('last_name', sanitizedData.lastName)
      .in('status', ['confirmed', 'pending'])
      .gte('appointment_date', today)

    if (existingAppointments && existingAppointments.length > 0) {
      const existingRdv = existingAppointments[0]
      const rdvDate = new Date(existingRdv.appointment_date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      await logSecurityEvent('DUPLICATE_APPOINTMENT_NAME', {
        endpoint: '/api/appointments/create',
        ip,
        firstName: sanitizedData.firstName,
        lastName: sanitizedData.lastName,
        existingAppointmentId: existingRdv.id
      })
      
      return NextResponse.json(
        { 
          error: `Vous avez déjà un rendez-vous prévu le ${rdvDate} à ${existingRdv.appointment_time}. Pour prendre un nouveau rendez-vous, vous devez d'abord annuler celui-ci en utilisant le bouton d'annulation dans votre email de confirmation.`,
          existingAppointment: {
            date: rdvDate,
            time: existingRdv.appointment_time,
            status: existingRdv.status
          }
        },
        { status: 409 }
      )
    }

    // 8. Vérifier également par email (sécurité supplémentaire)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: emailDuplicates } = await supabase
      .from('appointments')
      .select('id, appointment_date, appointment_time')
      .eq('email', sanitizedData.email.toLowerCase())
      .in('status', ['confirmed', 'pending'])
      .gte('created_at', oneDayAgo)
      .limit(1)

    if (emailDuplicates && emailDuplicates.length > 0) {
      await logSecurityEvent('DUPLICATE_APPOINTMENT_EMAIL', {
        endpoint: '/api/appointments/create',
        ip,
        email: sanitizedData.email
      })
      
      return NextResponse.json(
        { error: 'Vous avez déjà effectué une réservation récente avec cet email. Veuillez patienter ou contacter le centre.' },
        { status: 409 }
      )
    }

    // 9. Créer le rendez-vous dans une transaction
    const { data: appointment, error: insertError } = await supabase
      .from('appointments')
      .insert([
        {
          first_name: sanitizedData.firstName,
          last_name: sanitizedData.lastName,
          email: sanitizedData.email.toLowerCase(),
          phone: sanitizedData.phone.replace(/\s/g, ''),
          appointment_date,
          appointment_time,
          reason: sanitizedData.reason,
          client_notes: sanitizedData.notes,
          status: 'confirmed',
          test_type: sanitizedData.reason,
          duration_minutes: 40,
          center_id: center_id || null,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Erreur insertion:', insertError)
      await logSecurityEvent('APPOINTMENT_CREATE_ERROR', {
        endpoint: '/api/appointments/create',
        ip,
        error: insertError.message
      })
      
      return NextResponse.json(
        { error: 'Erreur lors de la création du rendez-vous' },
        { status: 500 }
      )
    }

    // 10. Marquer le créneau comme indisponible (si le slot existe)
    if (existingSlot) {
      await supabase
        .from('available_slots')
        .update({ is_available: false })
        .eq('id', existingSlot.id)
    }

    // 11. Log de succès
    await logSecurityEvent('APPOINTMENT_CREATED', {
      endpoint: '/api/appointments/create',
      ip,
      appointmentId: appointment.id,
      email: sanitizedData.email
    })

    // 12. Retourner les données
    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        appointment_date,
        appointment_time,
        first_name: sanitizedData.firstName,
        last_name: sanitizedData.lastName,
        email: sanitizedData.email,
        created_at: appointment.created_at
      }
    })

  } catch (error: any) {
    console.error('Erreur création rendez-vous:', error)
    await logSecurityEvent('APPOINTMENT_CREATE_EXCEPTION', {
      endpoint: '/api/appointments/create',
      ip,
      error: error.message
    })
    
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
