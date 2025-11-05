'use client'

import { useState } from 'react'

export default function DebugDatabaseTab({ setToast }: any) {
  const [loading, setLoading] = useState(false)
  const [databaseData, setDatabaseData] = useState<any>(null)

  const runDatabaseCheck = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/debug/database')
      const data = await response.json()
      setDatabaseData(data)
      setToast({
        type: data.status === 'success' ? 'success' : 'error',
        message: `Vérification BDD: ${data.status.toUpperCase()}`
      })
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de la vérification BDD' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">🗄️ Base de Données</h2>
        <button
          onClick={runDatabaseCheck}
          disabled={loading}
          className="w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
        >
          {loading ? 'Vérification...' : 'Vérifier la BDD'}
        </button>
      </div>

      {databaseData && (
        <div className="space-y-3">
          <div className={`p-3 rounded-lg border-l-4 ${
            databaseData.status === 'success' ? 'bg-green-50 border-green-500' :
            databaseData.status === 'warning' ? 'bg-yellow-50 border-yellow-500' :
            'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">
                {databaseData.status === 'success' ? '✅' : databaseData.status === 'warning' ? '⚠️' : '❌'}
              </span>
              <span className="font-bold text-base">{databaseData.status.toUpperCase()}</span>
            </div>
          </div>

          <div className="space-y-2">
            {databaseData.checks?.map((check: any, index: number) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{check.success ? '✅' : '❌'}</span>
                  <span className="font-semibold text-sm">{check.name}</span>
                </div>
                <p className="text-xs text-gray-600">{check.details || check.error}</p>
                
                {check.tables && (
                  <div className="mt-2 space-y-1">
                    {check.tables.map((table: any, idx: number) => (
                      <div key={idx} className="text-xs">
                        <span className={table.accessible ? 'text-green-600' : 'text-red-600'}>
                          {table.accessible ? '✅' : '❌'} {table.table}: {table.accessible ? `${table.count} entrées` : table.error}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {check.issues && check.issues.length > 0 && (
                  <div className="mt-2 text-xs text-yellow-700">
                    <p className="font-semibold">Problèmes détectés:</p>
                    <ul className="list-disc list-inside">
                      {check.issues.map((issue: string, idx: number) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {databaseData.stats && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-sm text-blue-900 mb-2">📊 Statistiques</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-semibold text-blue-800">Rendez-vous total:</p>
                  <p className="text-xl font-bold text-blue-600">{databaseData.stats.totalAppointments || 0}</p>
                </div>
                {databaseData.stats.appointmentsByStatus && (
                  <div>
                    <p className="font-semibold text-blue-800">Par statut:</p>
                    {Object.entries(databaseData.stats.appointmentsByStatus).map(([status, count]: [string, any]) => (
                      <p key={status} className="text-blue-600 text-xs">{status}: {count}</p>
                    ))}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-blue-800">Administrateurs:</p>
                  <p className="text-xl font-bold text-blue-600">{databaseData.stats.totalAdmins || 0}</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-800">Templates email:</p>
                  <p className="text-xl font-bold text-blue-600">{databaseData.stats.activeEmailTemplates || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!databaseData && (
        <div className="text-center py-12 text-gray-500">
          <p>Cliquez sur "Vérifier la BDD" pour tester la base de données</p>
        </div>
      )}
    </div>
  )
}
