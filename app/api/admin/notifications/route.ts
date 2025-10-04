import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '../../../../lib/supabase-server'

// GET - Récupérer toutes les notifications d'un admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 })
    }

    let query = supabaseServer
      .from('notifications')
      .select('*')
      .eq('admin_id', adminId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      notifications: data || [],
      unreadCount: data?.filter(n => !n.is_read).length || 0
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Marquer comme lu
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, adminId, markAllRead } = body

    if (markAllRead && adminId) {
      // Marquer toutes comme lues
      const { error } = await supabaseServer
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('admin_id', adminId)
        .eq('is_read', false)
        .eq('is_deleted', false)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'All notifications marked as read' })
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    // Marquer une notification comme lue
    const { error } = await supabaseServer
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', notificationId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer définitivement une notification
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')
    const adminId = searchParams.get('adminId')
    const deleteAll = searchParams.get('deleteAll') === 'true'

    if (deleteAll && adminId) {
      // Supprimer toutes les notifications lues
      const { error } = await supabaseServer
        .from('notifications')
        .delete()
        .eq('admin_id', adminId)
        .eq('is_read', true)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'All read notifications deleted' })
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    // Supprimer une notification spécifique
    const { error } = await supabaseServer
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
