export interface AdminLogEntry {
  admin_id: string
  admin_email: string
  action: string
  details?: string
  ip_address?: string
}

export class AdminLogger {
  static async log(entry: AdminLogEntry) {
    try {
      const response = await fetch('/api/admin/activity-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      })

      if (!response.ok) {
        console.error('Failed to log admin activity:', await response.text())
      }
    } catch (error) {
      console.error('Error logging admin activity:', error)
    }
  }

  static async getClientIP(): Promise<string | undefined> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error('Failed to get client IP:', error)
      return undefined
    }
  }

  static readonly ACTIONS = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    UPDATE: 'UPDATE',
    CREATE_SLOT: 'CREATE_SLOT',
    UPDATE_SLOT: 'UPDATE_SLOT',
    DELETE_SLOT: 'DELETE_SLOT',
    UPDATE_APPOINTMENT: 'UPDATE_APPOINTMENT',
    DELETE_APPOINTMENT: 'DELETE_APPOINTMENT',
    VIEW_DASHBOARD: 'VIEW_DASHBOARD',
    EXPORT_DATA: 'EXPORT_DATA',
    SEND_EMAIL: 'SEND_EMAIL'
  } as const
}

export function getAdminSession() {
  if (typeof window === 'undefined') return null
  
  const session = localStorage.getItem('admin_session')
  return session ? JSON.parse(session) : null
}

export async function logAdminActivity(action: string, details?: string) {
  try {
    const admin = getAdminSession()
    if (!admin) return

    const ip = await AdminLogger.getClientIP()
    
    await AdminLogger.log({
      admin_id: admin.id || 'unknown',
      admin_email: admin.email || 'unknown@admin.com',
      action,
      details,
      ip_address: ip
    })
  } catch (error) {
    console.error('Error in logAdminActivity:', error)
  }
}
