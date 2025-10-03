import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// GET - Fetch appointments with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (startDate) {
      query = query.gte('appointment_date', startDate)
    }
    if (endDate) {
      query = query.lte('appointment_date', endDate)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ appointments: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update appointment status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, admin_notes } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const updateData: any = { 
      status, 
      updated_at: new Date().toISOString() 
    }
    
    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ appointment: data[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete appointment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Appointment deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
