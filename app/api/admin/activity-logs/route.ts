import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// POST - Create a new admin log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { admin_id, admin_email, action, details, ip_address } = body

    if (!admin_id || !admin_email || !action) {
      return NextResponse.json({ 
        error: 'Missing required fields: admin_id, admin_email, action' 
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('admin_logs')
      .insert([{
        admin_id,
        admin_email,
        action,
        details: details || null,
        ip_address: ip_address || null,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      console.error('Error creating admin log:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      log: data?.[0]
    })

  } catch (error) {
    console.error('Error in admin log creation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET - Retrieve admin logs with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const adminId = searchParams.get('admin_id')
    const action = searchParams.get('action')

    let query = supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (adminId) {
      query = query.eq('admin_id', adminId)
    }

    if (action) {
      query = query.eq('action', action)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      logs: data || [],
      count: data?.length || 0
    })

  } catch (error) {
    console.error('Error fetching admin logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
