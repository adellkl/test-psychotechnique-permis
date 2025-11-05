'use client'

import { useState } from 'react'

interface HealthCheck {
  timestamp: string
  status: 'success' | 'warning' | 'error'
  checks: any[]
  errors: string[]
  avgResponseTime?: number
}

export default function DebugHealthTab({ setToast }: any) {
  const [loading, setLoading] = useState(false)
  const [healthData, setHealthData] = useState<HealthCheck | null>(null)

  const runHealthCheck = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/debug/health')
      const data = await response.json()
      setHealthData(data)
      setToast({
        type: data.status === 'success' ? 'success' : 'error',
        message: `Vérification terminée: ${data.status.toUpperCase()}`
      })
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de la vérification' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">🏥 Santé de l'Application</h2>
        <button
          onClick={runHealthCheck}
          disabled={loading}
          className="w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
        >
          {loading ? 'Vérification...' : 'Lancer la vérification'}
        </button>
      </div>

      {healthData && (
        <div className="space-y-3">
          <div className={`p-3 rounded-lg border-l-4 ${
            healthData.status === 'success' ? 'bg-green-50 border-green-500' :
            healthData.status === 'warning' ? 'bg-yellow-50 border-yellow-500' :
            'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">
                {healthData.status === 'success' ? '✅' : healthData.status === 'warning' ? '⚠️' : '❌'}
              </span>
              <span className="font-bold text-base">{healthData.status.toUpperCase()}</span>
            </div>
            <p className="text-xs text-gray-600">
              Timestamp: {new Date(healthData.timestamp).toLocaleString('fr-FR')}
            </p>
            {healthData.avgResponseTime && (
              <p className="text-xs text-gray-600">
                Temps de réponse moyen: {healthData.avgResponseTime}ms
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-sm">Détails des vérifications:</h3>
            {healthData.checks.map((check, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{check.success ? '✅' : '❌'}</span>
                  <span className="font-semibold text-sm">{check.name}</span>
                </div>
                {check.url && <p className="text-xs text-gray-600">URL: {check.url}</p>}
                {check.statusCode && <p className="text-xs text-gray-600">Status: {check.statusCode}</p>}
                {check.responseTime && <p className="text-xs text-gray-600">Temps: {check.responseTime}ms</p>}
                {check.error && <p className="text-xs text-red-600">Erreur: {check.error}</p>}
              </div>
            ))}
          </div>

          {healthData.errors.length > 0 && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <h3 className="font-bold text-sm text-red-800 mb-1">Erreurs détectées:</h3>
              <ul className="list-disc list-inside space-y-0.5">
                {healthData.errors.map((error, index) => (
                  <li key={index} className="text-xs text-red-700">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!healthData && (
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <p className="text-xs sm:text-sm px-4">Cliquez sur "Lancer la vérification" pour tester la santé de l'application</p>
        </div>
      )}
    </div>
  )
}
