import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { logAdminActivity, AdminLogger } from '../../../../lib/adminLogger'


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const olderThan = searchParams.get('olderThan') || '30'

        const days = parseInt(olderThan)
        if (isNaN(days) || days < 0) {
            return NextResponse.json({
                error: 'olderThan parameter must be a number >= 0'
            }, { status: 400 })
        }

        if (days === 0) {
            const cutoffDate = new Date() 

            const { count: totalCount, error: countError } = await supabase
                .from('admin_logs')
                .select('*', { count: 'exact', head: true })

            if (countError) {
                return NextResponse.json({ error: countError.message }, { status: 500 })
            }

            const { data: logs, error } = await supabase
                .from('admin_logs')
                .select('id, admin_id, action, details, created_at')
                .order('created_at', { ascending: false })
                .limit(100)

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({
                logs: logs || [],
                count: totalCount || 0,
                previewCount: logs?.length || 0,
                cutoffDate: cutoffDate.toISOString().split('T')[0],
                olderThanDays: days
            })
        }

        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)

        const { count: totalCount, error: countError } = await supabase
            .from('admin_logs')
            .select('*', { count: 'exact', head: true })
            .lte('created_at', cutoffDate.toISOString())

        if (countError) {
            return NextResponse.json({ error: countError.message }, { status: 500 })
        }

        const { data: logs, error } = await supabase
            .from('admin_logs')
            .select('id, admin_id, action, details, created_at')
            .lte('created_at', cutoffDate.toISOString())
            .order('created_at', { ascending: false })
            .limit(100)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            logs: logs || [],
            count: totalCount || 0, 
            previewCount: logs?.length || 0, 
            cutoffDate: cutoffDate.toISOString().split('T')[0],
            olderThanDays: days
        })

    } catch (error) {
        console.error('Error in logs cleanup preview:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json()
        const { olderThan } = body

        if (!olderThan) {
            return NextResponse.json({
                error: 'olderThan parameter is required'
            }, { status: 400 })
        }

        const days = parseInt(olderThan)
        if (isNaN(days) || days < 0) {
            return NextResponse.json({
                error: 'olderThan parameter must be a number >= 0'
            }, { status: 400 })
        }

        if (days === 0) {
            const { count: logsCount, error: countError } = await supabase
                .from('admin_logs')
                .select('*', { count: 'exact', head: true })

            if (countError) {
                console.error('Error counting logs:', countError)
                return NextResponse.json({ error: countError.message }, { status: 500 })
            }

            if (!logsCount || logsCount === 0) {
                return NextResponse.json({
                    message: 'No logs found',
                    deletedCount: 0
                })
            }

            const { error: deleteError } = await supabase
                .from('admin_logs')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000')

            if (deleteError) {
                console.error('Error deleting logs:', deleteError)
                return NextResponse.json({ error: deleteError.message }, { status: 500 })
            }

            try {
                await logAdminActivity(
                    AdminLogger.ACTIONS.DELETE_APPOINTMENT,
                    `Cleaned up all ${logsCount} admin logs`
                )
            } catch (logError) {
                console.error('Logging error (non-blocking):', logError)
            }

            return NextResponse.json({
                message: `Successfully deleted all ${logsCount} admin logs`,
                deletedCount: logsCount,
                cutoffDate: new Date().toISOString().split('T')[0]
            })
        }

        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)

        const { count: logsCount, error: countError } = await supabase
            .from('admin_logs')
            .select('*', { count: 'exact', head: true })
            .lte('created_at', cutoffDate.toISOString())

        if (countError) {
            console.error('Error counting logs:', countError)
            return NextResponse.json({ error: countError.message }, { status: 500 })
        }

        if (!logsCount || logsCount === 0) {
            return NextResponse.json({
                message: 'No logs found matching the criteria',
                deletedCount: 0
            })
        }

        const { error: deleteError } = await supabase
            .from('admin_logs')
            .delete()
            .lte('created_at', cutoffDate.toISOString())

        if (deleteError) {
            console.error('Error deleting logs:', deleteError)
            return NextResponse.json({ error: deleteError.message }, { status: 500 })
        }

                    try {
            await logAdminActivity(
                AdminLogger.ACTIONS.DELETE_APPOINTMENT,
                `Cleaned up ${logsCount} admin logs older than ${days} days`
            )
        } catch (logError) {
            console.error('Logging error (non-blocking):', logError)
        }

        return NextResponse.json({
            message: `Successfully deleted ${logsCount} admin logs`,
            deletedCount: logsCount,
            cutoffDate: cutoffDate.toISOString().split('T')[0]
        })

    } catch (error) {
        console.error('Error in logs cleanup operation:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
