import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { validateAppointmentForm, sanitizeFormData } from '../../../../lib/validation'
import { checkFormRateLimit } from '../../../../lib/rateLimit'
import { logSecurityEvent } from '../../../../lib/securityLogger'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

  try {
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
      honeypot
    } = body

    if (honeypot && honeypot.trim() !== '') {
      await logSecurityEvent('BOT_DETECTED', {
        endpoint: '/api/appointments/create',
        ip,
        honeypot
      })

      return NextResponse.json({
        success: true,
        message: 'Rendez-vous créé avec succès'
      })
    }

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

    const sanitizedData = sanitizeFormData({
      firstName,
      lastName,
      email,
      phone,
      reason,
      notes: notes || ''
    })

    const { data: existingSlot, error: slotError } = await supabase
      .from('available_slots')
      .select('id, is_available')
      .eq('date', appointment_date)
      .eq('time', appointment_time)
      .eq('center_id', center_id || null)
      .maybeSingle()

    if (existingSlot && !existingSlot.is_available) {
      return NextResponse.json(
        { error: 'Ce créneau n\'est plus disponible. Veuillez sélectionner un autre créneau.' },
        { status: 409 }
      )
    }

    // Vérification anti-doublon : bloquer si la personne a déjà un rendez-vous actif (confirmé ou en attente)
    const { data: activeAppointments } = await supabase
      .from('appointments')
      .select('id, appointment_date, appointment_time, first_name, last_name, email, phone, status')
      .in('status', ['confirmed', 'pending'])
      .or(`email.eq.${sanitizedData.email.toLowerCase()},and(first_name.eq.${sanitizedData.firstName},last_name.eq.${sanitizedData.lastName})`)
      .limit(1)

    if (activeAppointments && activeAppointments.length > 0) {
      const existing = activeAppointments[0]
      const isSameEmail = existing.email.toLowerCase() === sanitizedData.email.toLowerCase()
      const isSameName = existing.first_name === sanitizedData.firstName && existing.last_name === sanitizedData.lastName

      await logSecurityEvent('DUPLICATE_APPOINTMENT', {
        endpoint: '/api/appointments/create',
        ip,
        email: sanitizedData.email,
        firstName: sanitizedData.firstName,
        lastName: sanitizedData.lastName,
        existingAppointmentId: existing.id,
        existingStatus: existing.status,
        duplicateType: isSameEmail && isSameName ? 'both' : isSameEmail ? 'email' : 'name'
      })

      const appointmentDate = new Date(existing.appointment_date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      let errorMessage = ''
      if (isSameEmail && isSameName) {
        errorMessage = `Vous avez déjà un rendez-vous prévu le ${appointmentDate} à ${existing.appointment_time.slice(0, 5)}.`
      } else if (isSameEmail) {
        errorMessage = `Un rendez-vous existe déjà avec cet email pour le ${appointmentDate} à ${existing.appointment_time.slice(0, 5)}.`
      } else {
        errorMessage = `Un rendez-vous existe déjà au nom de ${existing.first_name} ${existing.last_name} pour le ${appointmentDate} à ${existing.appointment_time.slice(0, 5)}.`
      }

      errorMessage += ' Pour annuler ou modifier votre rendez-vous, utilisez le lien dans votre email de confirmation ou contactez-nous au 07 65 56 53 79.'

      return NextResponse.json(
        { error: errorMessage },
        { status: 409 }
      )
    }

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

    if (existingSlot) {
      await supabase
        .from('available_slots')
        .update({ is_available: false })
        .eq('id', existingSlot.id)
    }


    await logSecurityEvent('APPOINTMENT_CREATED', {
      endpoint: '/api/appointments/create',
      ip,
      appointmentId: appointment.id,
      email: sanitizedData.email
    })


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
