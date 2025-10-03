import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { validateSlotCreation, sanitizeString, isValidFutureDate, isValidTime } from '../../../../lib/validation'

// GET - Fetch available slots
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = supabase
      .from('available_slots')
      .select('*')
      .order('date')
      .order('start_time')

    if (startDate) {
      query = query.gte('date', startDate)
    }
    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ slots: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new slot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, start_time, end_time, is_available = true } = body

    // Validate required fields
    if (!date || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate date and time
    const validation = validateSlotCreation({ date, time: start_time })
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 })
    }

    // Additional validation for end_time
    if (!isValidTime(end_time)) {
      return NextResponse.json({ error: 'Invalid end time format' }, { status: 400 })
    }

    // Sanitize inputs (dates and times are already validated)
    const sanitizedDate = sanitizeString(date)
    const sanitizedStartTime = sanitizeString(start_time)
    const sanitizedEndTime = sanitizeString(end_time)

    const { data, error } = await supabase
      .from('available_slots')
      .insert([{
        date: sanitizedDate,
        start_time: sanitizedStartTime,
        end_time: sanitizedEndTime,
        is_available,
        max_appointments: 1
      }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ slot: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update slot
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, is_available } = body

    if (!id) {
      return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 })
    }

    // Validate ID format (should be UUID)
    if (typeof id !== 'string' || id.length < 10) {
      return NextResponse.json({ error: 'Invalid slot ID format' }, { status: 400 })
    }

    // Validate is_available is boolean
    if (typeof is_available !== 'boolean') {
      return NextResponse.json({ error: 'is_available must be a boolean' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('available_slots')
      .update({ is_available })
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ slot: data[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete slot
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 })
    }

    // Validate ID format
    if (id.length < 10) {
      return NextResponse.json({ error: 'Invalid slot ID format' }, { status: 400 })
    }

    const { error } = await supabase
      .from('available_slots')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Slot deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
