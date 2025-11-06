'use client'

import { useState } from 'react'

export default function DebugTestsTab({ setToast }: any) {
  const [loading, setLoading] = useState(false)
  const [testFormData, setTestFormData] = useState({
    firstName: 'Test',
    lastName: 'Debug',
    email: 'test@example.com',
    phone: '0123456789',
    date: new Date().toISOString().split('T')[0],
    time: '10:00'
  })

  const testAppointmentForm = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: testFormData.firstName,
          lastName: testFormData.lastName,
          email: testFormData.email,
          phone: testFormData.phone,
          appointmentDate: testFormData.date,
          appointmentTime: testFormData.time,
          testType: 'Test debug',
          duration: 60,
          centerName: 'Centre de test',
          centerAddress: 'Adresse de test'
        })
      })
      const data = await response.json()
      if (response.ok) {
        setToast({ type: 'success', message: 'Rendez-vous de test créé avec succès! Vérifiez la réception de l\'email.' })
      } else {
        setToast({ type: 'error', message: data.error || 'Échec de création' })
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors du test du formulaire' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">🧪 Tests de Formulaires</h2>

      <div className="space-y-3 sm:space-y-4">
        {/* Test formulaire de rendez-vous */}
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-bold text-sm mb-2">Test de réservation de rendez-vous</h3>
          <p className="text-xs text-gray-600 mb-3">
            Ce test crée un vrai rendez-vous dans la base de données et envoie les emails de confirmation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3">
            <input
              type="text"
              value={testFormData.firstName}
              onChange={(e) => setTestFormData({ ...testFormData, firstName: e.target.value })}
              placeholder="Prénom"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={testFormData.lastName}
              onChange={(e) => setTestFormData({ ...testFormData, lastName: e.target.value })}
              placeholder="Nom"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              value={testFormData.email}
              onChange={(e) => setTestFormData({ ...testFormData, email: e.target.value })}
              placeholder="Email"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              value={testFormData.phone}
              onChange={(e) => setTestFormData({ ...testFormData, phone: e.target.value })}
              placeholder="Téléphone"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={testFormData.date}
              onChange={(e) => setTestFormData({ ...testFormData, date: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={testFormData.time}
              onChange={(e) => setTestFormData({ ...testFormData, time: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={testAppointmentForm}
            disabled={loading}
            className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? 'Création en cours...' : 'Créer un rendez-vous de test'}
          </button>
        </div>

        {/* Informations */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-sm text-blue-900 mb-1">ℹ️ Informations importantes</h4>
          <ul className="text-xs text-blue-800 space-y-0.5 list-disc list-inside">
            <li>Le rendez-vous créé sera visible dans le dashboard</li>
            <li>Des emails seront envoyés au client ET à l'admin</li>
            <li>Vérifiez votre boîte mail après le test</li>
            <li>Pensez à supprimer le rendez-vous de test après vérification</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
