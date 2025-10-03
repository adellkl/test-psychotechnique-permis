'use client'

import { useState } from 'react'

interface CleanupPreview {
  appointments: Array<{
    id: string
    first_name: string
    last_name: string
    email: string
    appointment_date: string
    appointment_time: string
    status: string
    created_at: string
  }>
  count: number
  cutoffDate: string
  status: string
  olderThanDays: number
}

export default function CleanupManager() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<CleanupPreview | null>(null)
  const [cleanupStatus, setCleanupStatus] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'completed' | 'cancelled'>('completed')
  const [olderThanDays, setOlderThanDays] = useState(30)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedAppointments, setSelectedAppointments] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [showBulkConfirmation, setShowBulkConfirmation] = useState(false)

  const fetchPreview = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/cleanup?status=${selectedStatus}&olderThan=${olderThanDays}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la prévisualisation')
      }
      
      setPreview(data)
      setCleanupStatus('')
    } catch (error) {
      console.error('Error fetching preview:', error)
      setCleanupStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
      setPreview(null)
    } finally {
      setLoading(false)
    }
  }

  const executeCleanup = async () => {
    setLoading(true)
    try {
      const appointmentIds = Array.from(selectedAppointments)
      
      if (appointmentIds.length === 0) {
        setCleanupStatus('❌ Aucun rendez-vous sélectionné')
        return
      }
      
      const response = await fetch('/api/admin/cleanup', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appointmentIds })
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }
      
      setCleanupStatus(`✅ ${data.message}`)
      setPreview(null)
      setShowConfirmation(false)
      setSelectedAppointments(new Set())
      setSelectAll(false)
      
      // Refresh the page after successful cleanup
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
    } catch (error) {
      console.error('Error executing cleanup:', error)
      setCleanupStatus(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setLoading(false)
    }
  }

  const executeBulkCleanup = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/cleanup', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: selectedStatus, 
          olderThan: olderThanDays.toString() 
        })
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }
      
      setCleanupStatus(`✅ ${data.message}`)
      setPreview(null)
      setShowBulkConfirmation(false)
      setSelectedAppointments(new Set())
      setSelectAll(false)
      
      // Refresh the page after successful cleanup
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
    } catch (error) {
      console.error('Error executing bulk cleanup:', error)
      setCleanupStatus(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCleanupClick = () => {
    if (selectedAppointments.size > 0) {
      setShowConfirmation(true)
    }
  }

  const handleSelectAppointment = (appointmentId: string, checked: boolean) => {
    const newSelected = new Set(selectedAppointments)
    if (checked) {
      newSelected.add(appointmentId)
    } else {
      newSelected.delete(appointmentId)
    }
    setSelectedAppointments(newSelected)
    
    // Update select all state
    if (preview) {
      setSelectAll(newSelected.size === preview.appointments.length)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (preview) {
      if (checked) {
        const allIds = new Set(preview.appointments.map(apt => apt.id))
        setSelectedAppointments(allIds)
      } else {
        setSelectedAppointments(new Set())
      }
      setSelectAll(checked)
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'terminés'
      case 'cancelled': return 'annulés'
      default: return status
    }
  }

  return (
    <>
      {/* Cleanup Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm font-medium"
        title="Nettoyer les anciens rendez-vous"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Nettoyage
      </button>

      {/* Cleanup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Nettoyage des rendez-vous</h2>
                    <p className="text-sm text-gray-600">Supprimer les anciens rendez-vous pour optimiser l'espace</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setPreview(null)
                    setCleanupStatus('')
                    setShowConfirmation(false)
                    setShowBulkConfirmation(false)
                    setSelectedAppointments(new Set())
                    setSelectAll(false)
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Configuration */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration du nettoyage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut des rendez-vous
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as 'completed' | 'cancelled')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="completed">Terminés</option>
                      <option value="cancelled">Annulés</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plus anciens que (jours)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="365"
                      value={olderThanDays}
                      onChange={(e) => setOlderThanDays(parseInt(e.target.value) || 30)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={fetchPreview}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                    Prévisualiser
                  </button>
                  <button
                    onClick={() => setShowBulkConfirmation(true)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer directement
                  </button>
                  {selectedAppointments.size > 0 && (
                    <button
                      onClick={handleCleanupClick}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer sélectionnés ({selectedAppointments.size})
                    </button>
                  )}
                </div>
              </div>

              {/* Status Message */}
              {cleanupStatus && (
                <div className={`mb-4 p-4 rounded-lg ${cleanupStatus.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {cleanupStatus}
                </div>
              )}

              {/* Preview Results */}
              {preview && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Prévisualisation: {preview.count} rendez-vous {getStatusLabel(preview.status)} trouvés
                    </h3>
                    {preview.count > 0 && (
                      <div className="text-sm text-gray-600">
                        {selectedAppointments.size} sélectionné(s)
                      </div>
                    )}
                  </div>
                  {preview.count === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Aucun rendez-vous {getStatusLabel(preview.status)} de plus de {preview.olderThanDays} jours trouvé.
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-left">
                                <input
                                  type="checkbox"
                                  checked={selectAll}
                                  onChange={(e) => handleSelectAll(e.target.checked)}
                                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date RDV</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créé le</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {preview.appointments.map((appointment) => (
                              <tr key={appointment.id} className={`hover:bg-gray-50 ${
                                selectedAppointments.has(appointment.id) ? 'bg-red-50' : ''
                              }`}>
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedAppointments.has(appointment.id)}
                                    onChange={(e) => handleSelectAppointment(appointment.id, e.target.checked)}
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                  />
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {appointment.first_name} {appointment.last_name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{appointment.email}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {new Date(appointment.appointment_date).toLocaleDateString('fr-FR')} {appointment.appointment_time.slice(0, 5)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {new Date(appointment.created_at).toLocaleDateString('fr-FR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && preview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[10000]">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
                <p className="text-sm text-gray-600">
                  Êtes-vous sûr de vouloir supprimer définitivement {selectedAppointments.size} rendez-vous sélectionné(s) ?
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex">
                <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-yellow-800">
                  <strong>Attention :</strong> Cette action est irréversible. Les données supprimées ne pourront pas être récupérées.
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={executeCleanup}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : null}
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Cleanup Confirmation Modal */}
      {showBulkConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[10000]">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Suppression directe</h3>
                <p className="text-sm text-gray-600">
                  Supprimer TOUS les rendez-vous {getStatusLabel(selectedStatus)} de plus de {olderThanDays} jours ?
                </p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-red-800">
                  <strong>DANGER :</strong> Cette action supprimera définitivement TOUS les rendez-vous correspondant aux critères, sans prévisualisation. Cette action est irréversible.
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBulkConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={executeBulkCleanup}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : null}
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
