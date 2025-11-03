import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { validateSlotCreation, sanitizeString, isValidTime } from '../../../../lib/validation'
import { requireAdmin } from '../../../../lib/adminAuth'
import { getRateLimitKey } from '../../../../lib/security'


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


export async function POST(request: NextRequest) {
  try {

    const authResult = await requireAdmin(request, {
      rateLimit: { maxRequests: 20, windowMs: 60000 }
    })

    if (authResult instanceof NextResponse) return authResult
    const { admin } = authResult

    const body = await request.json()
    const { date, start_time, end_time, is_available = true } = body

    if (!date || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }


    const validation = validateSlotCreation({ date, time: start_time })
    if (!validation.isValid) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 })
    }

    if (!isValidTime(end_time)) {
      return NextResponse.json({ error: 'Invalid end time format' }, { status: 400 })
    }


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
        center_id: '11111111-1111-1111-1111-111111111111',
        max_appointments: 1
      }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }


    const ip = getRateLimitKey(request)
    const { logAdminAction } = await import('../../../../lib/adminAuth')
    await logAdminAction(admin.id, 'CREATE_SLOT', `Created slot for ${sanitizedDate} at ${sanitizedStartTime}`, ip)

    return NextResponse.json({ slot: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


export async function PUT(request: NextRequest) {
  try {

    const authResult = await requireAdmin(request, {
      rateLimit: { maxRequests: 20, windowMs: 60000 }
    })

    if (authResult instanceof NextResponse) return authResult
    const { admin } = authResult

    const body = await request.json()
    const { id, is_available } = body

    if (!id) {
      return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 })
    }


    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid slot ID format' }, { status: 400 })
    }

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


    const ip = getRateLimitKey(request)
    const { logAdminAction } = await import('../../../../lib/adminAuth')
    await logAdminAction(admin.id, 'UPDATE_SLOT', `Updated slot ${id} availability to ${is_available}`, ip)

    return NextResponse.json({ slot: data[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


export async function DELETE(request: NextRequest) {
  try {

    const authResult = await requireAdmin(request, {
      requireRole: ['super_admin', 'admin'],
      rateLimit: { maxRequests: 10, windowMs: 60000 }
    })

    if (authResult instanceof NextResponse) return authResult
    const { admin } = authResult

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 })
    }


    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid slot ID format' }, { status: 400 })
    }

    const { error } = await supabase
      .from('available_slots')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }


    const ip = getRateLimitKey(request)
    const { logAdminAction } = await import('../../../../lib/adminAuth')
    await logAdminAction(admin.id, 'DELETE_SLOT', `Deleted slot ${id}`, ip)

    return NextResponse.json({ message: 'Slot deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
