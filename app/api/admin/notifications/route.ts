import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '../../../../lib/supabase-server'

// GET - Lister les notifications (avec pagination et filtres simples)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const isReadParam = searchParams.get('is_read')

    let query = supabaseServer
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (isReadParam === 'true') {
      query = query.eq('is_read', true)
    } else if (isReadParam === 'false') {
      query = query.eq('is_read', false)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ notifications: data || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Créer une notification manuelle (utile pour tests ou cas spéciaux)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { admin_id, type, title, message, link, metadata } = body

    if (!admin_id || !title || !message) {
      return NextResponse.json({ error: 'admin_id, title et message sont requis' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('notifications')
      .insert([
        {
          admin_id,
          type: type || 'info',
          title,
          message,
          link: link || null,
          metadata: metadata || {},
        }
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ notification: data?.[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Marquer des notifications comme lues
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, markAsRead } = body as { ids: string[]; markAsRead?: boolean }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids est requis et doit contenir au moins un id' }, { status: 400 })
    }

    const readFlag = markAsRead !== false
    const updatePayload: Record<string, any> = { is_read: readFlag }
    if (readFlag) {
      updatePayload.read_at = new Date().toISOString()
    } else {
      updatePayload.read_at = null
    }

    const { data, error } = await supabaseServer
      .from('notifications')
      .update(updatePayload)
      .in('id', ids)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ updated: data?.length || 0, notifications: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer des notifications
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body as { ids: string[] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids est requis et doit contenir au moins un id' }, { status: 400 })
    }

    const { error } = await supabaseServer
      .from('notifications')
      .delete()
      .in('id', ids)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ deleted: ids.length, success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


