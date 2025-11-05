'use client'

import { useState } from 'react'

interface MonitoringLog {
  timestamp: string
  overallStatus: string
  duration: number
  checks: any
}

export default function DebugLogsTab({ setToast }: any) {
  const [loading, setLoading] = useState(false)
  const [monitoringLogs, setMonitoringLogs] = useState<MonitoringLog[]>([])

  const loadMonitoringLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/debug/monitoring-logs')
      const data = await response.json()
      setMonitoringLogs(data.logs || [])
      setToast({ type: 'success', message: `${data.logs?.length || 0} logs chargés` })
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors du chargement des logs' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">📊 Logs de Monitoring</h2>
        <button
          onClick={loadMonitoringLogs}
          disabled={loading}
          className="w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
        >
          {loading ? 'Chargement...' : 'Charger les logs'}
        </button>
      </div>

      {monitoringLogs.length > 0 ? (
        <div className="space-y-2">
          {monitoringLogs.slice(0, 20).map((log, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {log.overallStatus === 'success' ? '✅' : log.overallStatus === 'warning' ? '⚠️' : '❌'}
                  </span>
                  <span className="font-bold text-sm">{log.overallStatus.toUpperCase()}</span>
                </div>
                <span className="text-xs text-gray-600">
                  {new Date(log.timestamp).toLocaleString('fr-FR')}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">Durée: {log.duration}ms</p>
              
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-1 sm:gap-2 mt-2">
                {log.checks.appHealth && (
                  <div className="text-xs">
                    <span className={log.checks.appHealth.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {log.checks.appHealth.status === 'success' ? '✅' : '❌'} Application
                    </span>
                  </div>
                )}
                {log.checks.emailService && (
                  <div className="text-xs">
                    <span className={log.checks.emailService.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {log.checks.emailService.status === 'success' ? '✅' : '❌'} Email
                    </span>
                  </div>
                )}
                {log.checks.database && (
                  <div className="text-xs">
                    <span className={log.checks.database.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {log.checks.database.status === 'success' ? '✅' : '❌'} Database
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Aucun log de monitoring disponible</p>
          <p className="text-sm mt-2">Lancez le script de monitoring pour générer des logs</p>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg text-left max-w-xl mx-auto">
            <p className="font-semibold text-sm text-blue-900 mb-1">Pour générer des logs:</p>
            <code className="text-xs bg-blue-100 p-2 rounded block">
              node monitoring/monitor.js
            </code>
          </div>
        </div>
      )}
    </div>
  )
}
