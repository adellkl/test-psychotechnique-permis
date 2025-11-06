'use client'

import { useState } from 'react'

export default function DebugEmailTab({ setToast, adminEmail }: any) {
  const [loading, setLoading] = useState(false)
  const [emailData, setEmailData] = useState<any>(null)
  const [testEmailTo, setTestEmailTo] = useState(adminEmail || '')

  const runEmailCheck = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/debug/email')
      const data = await response.json()
      setEmailData(data)
      setToast({
        type: data.status === 'success' ? 'success' : 'error',
        message: `Test email: ${data.status.toUpperCase()}`
      })
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors du test email' })
    } finally {
      setLoading(false)
    }
  }

  const sendTestEmail = async () => {
    if (!testEmailTo) {
      setToast({ type: 'error', message: 'Veuillez entrer une adresse email' })
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/admin/debug/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmailTo })
      })
      const data = await response.json()
      if (data.success) {
        setToast({ type: 'success', message: `Email de test envoyé à ${testEmailTo}` })
      } else {
        setToast({ type: 'error', message: data.error || 'Échec de l\'envoi' })
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de l\'envoi' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">📧 Service Email</h2>
        <button
          onClick={runEmailCheck}
          disabled={loading}
          className="w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
        >
          {loading ? 'Vérification...' : 'Tester le service'}
        </button>
      </div>

      {emailData && (
        <div className="space-y-3">
          <div className={`p-3 rounded-lg border-l-4 ${
            emailData.status === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{emailData.status === 'success' ? '✅' : '❌'}</span>
              <span className="font-bold text-base">{emailData.status.toUpperCase()}</span>
            </div>
          </div>

          <div className="space-y-2">
            {emailData.checks?.map((check: any, index: number) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{check.success ? '✅' : '❌'}</span>
                  <span className="font-semibold text-sm">{check.name}</span>
                </div>
                <p className="text-xs text-gray-600">{check.details || check.error}</p>
                {check.transactionId && (
                  <p className="text-xs text-green-600 mt-1">Transaction ID: {check.transactionId}</p>
                )}
                {check.accountInfo && (
                  <div className="mt-1 text-xs">
                    <p className="text-gray-600">Email: {check.accountInfo.email}</p>
                    <p className="text-gray-600">Crédit: {check.accountInfo.credit}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-bold text-sm mb-2">Envoyer un email de test</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={testEmailTo}
                onChange={(e) => setTestEmailTo(e.target.value)}
                placeholder="Email destinataire"
                className="flex-1 px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendTestEmail}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-1.5 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {!emailData && (
        <div className="text-center py-12 text-gray-500">
          <p>Cliquez sur "Tester le service" pour vérifier l'envoi d'emails</p>
        </div>
      )}
    </div>
  )
}
