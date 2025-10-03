'use client'

import { useState, useEffect } from 'react'

interface LogEntry {
  id: string
  admin_id: string
  admin_email: string
  action: string
  details?: string
  ip_address?: string
  created_at: string
}

export default function ActivityLog() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const ITEMS_PER_PAGE = 20

  useEffect(() => {
    fetchLogs()
  }, [page])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const offset = page * ITEMS_PER_PAGE
      const response = await fetch(`/api/admin/logs?limit=${ITEMS_PER_PAGE}&offset=${offset}`)
      
      if (!response.ok) throw new Error('Failed to fetch logs')
      
      const data = await response.json()
      
      if (page === 0) {
        setLogs(data.logs)
      } else {
        setLogs(prev => [...prev, ...data.logs])
      }
      
      setHasMore(data.logs.length === ITEMS_PER_PAGE)
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
        )
      case 'LOGOUT':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
        )
      case 'CREATE_SLOT':
      case 'UPDATE_SLOT':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )
      case 'DELETE_SLOT':
      case 'DELETE_APPOINTMENT':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'LOGIN': return 'Connexion'
      case 'LOGOUT': return 'Déconnexion'
      case 'CREATE_SLOT': return 'Créneau créé'
      case 'UPDATE_SLOT': return 'Créneau modifié'
      case 'DELETE_SLOT': return 'Créneau supprimé'
      case 'UPDATE_APPOINTMENT': return 'RDV modifié'
      case 'DELETE_APPOINTMENT': return 'RDV supprimé'
      case 'VIEW_DASHBOARD': return 'Consultation tableau de bord'
      case 'EXPORT_DATA': return 'Export de données'
      case 'SEND_EMAIL': return 'Email envoyé'
      default: return action
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Journal d'activité</h3>
        <p className="text-sm text-gray-600">Historique des actions administratives</p>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading && page === 0 ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  {getActionIcon(log.action)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {getActionLabel(log.action)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(log.created_at)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {log.admin_email}
                    </p>
                    {log.details && (
                      <p className="text-xs text-gray-500 mt-1">
                        {log.details}
                      </p>
                    )}
                    {log.ip_address && (
                      <p className="text-xs text-gray-400 mt-1">
                        IP: {log.ip_address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && !loading && (
          <div className="p-4 text-center border-t border-gray-100">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Charger plus d'entrées
            </button>
          </div>
        )}

        {!hasMore && logs.length > 0 && (
          <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-100">
            Toutes les entrées ont été chargées
          </div>
        )}

        {logs.length === 0 && !loading && (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune activité</h3>
            <p className="mt-1 text-sm text-gray-500">Le journal d'activité est vide.</p>
          </div>
        )}
      </div>
    </div>
  )
}
