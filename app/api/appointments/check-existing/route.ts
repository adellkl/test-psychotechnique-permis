import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { sanitizeString } from '../../../../lib/validation'

/**
 * API pour vérifier si un client a déjà un rendez-vous actif
 * GET /api/appointments/check-existing?firstName=xxx&lastName=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const firstName = searchParams.get('firstName')
    const lastName = searchParams.get('lastName')

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'Prénom et nom requis' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedFirstName = sanitizeString(firstName)
    const sanitizedLastName = sanitizeString(lastName)

    if (sanitizedFirstName.length < 2 || sanitizedLastName.length < 2) {
      return NextResponse.json({
        hasExisting: false,
        message: 'Nom ou prénom trop court'
      })
    }

    // Vérifier les rendez-vous existants
    const today = new Date().toISOString().split('T')[0]
    const { data: existingAppointments, error } = await supabase
      .from('appointments')
      .select('id, appointment_date, appointment_time, status, email, phone')
      .ilike('first_name', sanitizedFirstName)
      .ilike('last_name', sanitizedLastName)
      .in('status', ['confirmed', 'pending'])
      .gte('appointment_date', today)
      .order('appointment_date', { ascending: true })
      .limit(1)

    if (error) {
      console.error('Error checking existing appointments:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la vérification' },
        { status: 500 }
      )
    }

    if (existingAppointments && existingAppointments.length > 0) {
      const existingRdv = existingAppointments[0]
      const rdvDate = new Date(existingRdv.appointment_date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      return NextResponse.json({
        hasExisting: true,
        appointment: {
          date: rdvDate,
          time: existingRdv.appointment_time,
          status: existingRdv.status
        },
        message: `Un rendez-vous existe déjà pour ${sanitizedFirstName} ${sanitizedLastName} le ${rdvDate} à ${existingRdv.appointment_time}.`
      })
    }

    return NextResponse.json({
      hasExisting: false,
      message: 'Aucun rendez-vous actif trouvé'
    })

  } catch (error) {
    console.error('Error in check-existing route:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
