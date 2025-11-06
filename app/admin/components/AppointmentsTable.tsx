'use client'

import { useState } from 'react'
import type { Appointment } from '../../../lib/supabase'
import CleanupManager from './CleanupManager'
import ExportButton from './ExportButton'
import SendEmailModal from './SendEmailModal'

interface AppointmentsTableProps {
  appointments: Appointment[]
  onUpdateStatus: (id: string, status: string) => void
  onDelete: (id: string) => void
  onBulkDelete: (ids: string[]) => void
}

export default function AppointmentsTable({
  appointments,
  onUpdateStatus,
  onDelete,
  onBulkDelete
}: AppointmentsTableProps) {
  const [selectedAppointments, setSelectedAppointments] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState('all')
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteAppointmentId, setDeleteAppointmentId] = useState<string | null>(null)
  const [emailAppointmentId, setEmailAppointmentId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = filter === 'all' || apt.status === filter
    const matchesSearch = !searchTerm ||
      `${apt.first_name} ${apt.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppointments(new Set(filteredAppointments.map(apt => apt.id)))
    } else {
      setSelectedAppointments(new Set())
    }
  }

  const handleSelectAppointment = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedAppointments)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedAppointments(newSelected)
  }

  const handleBulkStatusChange = (newStatus: string) => {
    selectedAppointments.forEach(id => {
      onUpdateStatus(id, newStatus)
    })
    setSelectedAppointments(new Set())
    setShowBulkActions(false)
  }

  const handleBulkDelete = () => {
    onBulkDelete(Array.from(selectedAppointments))
    setSelectedAppointments(new Set())
    setShowDeleteConfirm(false)
    setShowBulkActions(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'completed': return 'bg-gray-100 text-gray-600 border-gray-300'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return '✅ Confirmé'
      case 'in_progress': return '🔵 En cours'
      case 'completed': return '✓ Terminé'
      case 'cancelled': return '❌ Annulé'
      default: return status
    }
  }

  const isNewAppointment = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    return diffHours < 24
  }

  const isAllSelected = filteredAppointments.length > 0 && selectedAppointments.size === filteredAppointments.length

  const handleSendEmail = async (emailData: {
    appointmentId: string
    emailType: string
    customMessage?: string
    cancelReason?: string
  }) => {
    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'email')
      }

      const result = await response.json()
      console.log('✅ Email envoyé:', result)

      window.location.reload()
    } catch (error) {
      console.error('❌ Erreur:', error)
      throw error
    }
  }

  return (
    <div className="space-y-4" id="appointments-table">
      {/* Header with actions */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des rendez-vous</h2>
            <p className="text-sm text-gray-600 mt-1">{filteredAppointments.length} rendez-vous trouvés</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="confirmed">✅ Confirmés</option>
              <option value="completed">✓ Terminés</option>
              <option value="cancelled">❌ Annulés</option>
            </select>

            {/* Export & Cleanup */}
            <ExportButton appointments={appointments} />
            <CleanupManager />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, email, téléphone..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedAppointments.size > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              {selectedAppointments.size}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {selectedAppointments.size} rendez-vous sélectionné{selectedAppointments.size > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              Actions groupées
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </button>

            <button
              onClick={() => setSelectedAppointments(new Set())}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              Désélectionner
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions Menu */}
      {showBulkActions && (
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-lg">
          <p className="text-sm font-medium text-gray-700 mb-3">Changer le statut en:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleBulkStatusChange('confirmed')}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              Confirmé
            </button>
            <button
              onClick={() => handleBulkStatusChange('completed')}
              className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
            >
              Terminé
            </button>
            <button
              onClick={() => handleBulkStatusChange('cancelled')}
              className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              Annulé
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Client
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date & Heure
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Motif
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.map((appointment, index) => (
              <tr
                key={appointment.id}
                data-appointment-id={appointment.id}
                className={`hover:bg-gray-50 transition-all ${selectedAppointments.has(appointment.id) ? 'bg-blue-50' : ''
                  } ${appointment.status === 'completed' ? 'bg-gray-50 opacity-60' : ''
                  }`}
                style={{
                  opacity: 0,
                  animation: `fadeInUp 0.4s ease-out ${index * 50}ms forwards`
                }}
              >
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedAppointments.has(appointment.id)}
                    onChange={(e) => handleSelectAppointment(appointment.id, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {appointment.first_name[0]}{appointment.last_name[0]}
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.first_name} {appointment.last_name}
                      </div>
                      {appointment.is_second_chance && (
                        <div className="text-xs text-orange-600 font-medium">
                          2ème
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-xs text-gray-900">{appointment.email}</div>
                  <div className="text-xs text-gray-500">{appointment.phone}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-xs font-medium text-gray-900">
                    {new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {appointment.appointment_time.slice(0, 5)}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-xs text-gray-900 capitalize">
                    {appointment.reason}
                  </div>
                </td>
                <td className="px-3 py-3 max-w-[150px]">
                  {appointment.client_notes && appointment.client_notes.trim() !== '' ? (
                    <button
                      onClick={() => {
                        const newExpanded = new Set(expandedNotes)
                        if (newExpanded.has(appointment.id)) {
                          newExpanded.delete(appointment.id)
                        } else {
                          newExpanded.add(appointment.id)
                        }
                        setExpandedNotes(newExpanded)
                      }}
                      className="bg-yellow-50 border border-yellow-200 rounded px-2 py-1 hover:bg-yellow-100 transition-colors text-left w-full"
                    >
                      <p className={`text-xs text-gray-700 ${expandedNotes.has(appointment.id) ? '' : 'line-clamp-2'}`}>
                        {appointment.client_notes}
                      </p>
                      {appointment.client_notes.length > 50 && (
                        <span className="text-xs text-blue-600 font-medium mt-1 block">
                          {expandedNotes.has(appointment.id) ? '▲ Réduire' : '▼ Voir plus'}
                        </span>
                      )}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs italic">-</span>
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEmailAppointmentId(appointment.id)}
                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded transition-colors"
                      title="Envoyer un email"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    {appointment.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(appointment.id, 'completed')}
                          className="text-green-600 hover:text-green-900 hover:bg-green-50 p-1 rounded transition-colors"
                          title="Marquer comme terminé"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors"
                          title="Annuler"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    )}
                    {appointment.status === 'in_progress' && (
                      <button
                        onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                        className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors"
                        title="Annuler"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {appointment.status === 'cancelled' && (
                      <button
                        onClick={() => onUpdateStatus(appointment.id, 'confirmed')}
                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded transition-colors"
                        title="Restaurer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(appointment.id)}
                      className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Hidden on desktop */}
      <div className="lg:hidden space-y-4 p-4">
        {filteredAppointments.map((appointment, index) => (
          <div
            key={appointment.id}
            className={`bg-white rounded-xl shadow-md border-2 p-4 hover:shadow-lg transition-all duration-200 ${selectedAppointments.has(appointment.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              } ${appointment.status === 'completed' ? 'bg-gray-50 opacity-60' : ''
              }`}
            style={{
              opacity: 0,
              animation: `fadeInUp 0.4s ease-out ${index * 50}ms forwards`
            }}
          >
            {/* Header avec checkbox et avatar */}
            <div className="flex items-start gap-4 mb-4">
              <input
                type="checkbox"
                checked={selectedAppointments.has(appointment.id)}
                onChange={(e) => handleSelectAppointment(appointment.id, e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
              />
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                {appointment.first_name[0]}{appointment.last_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {appointment.first_name} {appointment.last_name}
                </h3>

                {/* Badges en ligne */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>

                  {appointment.is_second_chance && (
                    <span className="inline-flex items-center px-2 py-1 text-xs text-orange-600 font-semibold bg-orange-100 rounded-full">
                      ⭐ 2ème chance
                    </span>
                  )}

                  {isNewAppointment(appointment.created_at) && (
                    <span className="inline-flex items-center px-2 py-1 text-xs text-green-700 font-semibold bg-green-100 rounded-full">
                      🆕 Nouveau
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className="space-y-3 mb-4 pl-1">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-900 font-medium">
                  {new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short'
                  })}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-700">{appointment.appointment_time.slice(0, 5)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <a href={`mailto:${appointment.email}`} className="text-blue-600 hover:underline truncate">
                  {appointment.email}
                </a>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${appointment.phone}`} className="text-gray-900">
                  {appointment.phone}
                </a>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-gray-700 capitalize">{appointment.reason}</span>
              </div>

              {/* Notes Client */}
              {appointment.client_notes && appointment.client_notes.trim() !== '' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-yellow-800 mb-1">Note du client :</p>
                      <p className="text-xs text-gray-700">{appointment.client_notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-200 flex-wrap">
              <button
                onClick={() => setEmailAppointmentId(appointment.id)}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </button>
              {appointment.status === 'confirmed' && (
                <>
                  <button
                    onClick={() => onUpdateStatus(appointment.id, 'completed')}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Terminé
                  </button>
                  <button
                    onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Annuler
                  </button>
                </>
              )}
              {appointment.status === 'in_progress' && (
                <button
                  onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Annuler
                </button>
              )}
              {appointment.status === 'cancelled' && (
                <button
                  onClick={() => onUpdateStatus(appointment.id, 'confirmed')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Restaurer
                </button>
              )}
              <button
                onClick={() => setDeleteAppointmentId(appointment.id)}
                className="px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-16">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous trouvé</h3>
          <p className="text-gray-500">
            Aucun rendez-vous ne correspond aux critères sélectionnés
          </p>
        </div>
      )}

      {/* Individual Delete Confirmation Modal */}
      {deleteAppointmentId && (() => {
        const appointment = appointments.find(apt => apt.id === deleteAppointmentId)
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', margin: 0 }}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Confirmer la suppression</h3>
                  <p className="text-sm text-gray-600">
                    Supprimer le rendez-vous de ?
                  </p>
                </div>
              </div>

              {appointment && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {appointment.first_name[0]}{appointment.last_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">
                        {appointment.first_name} {appointment.last_name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })} à {appointment.appointment_time.slice(0, 5)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {appointment.email} • {appointment.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Attention :</strong> Cette action est irréversible.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteAppointmentId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    onDelete(deleteAppointmentId)
                    setDeleteAppointmentId(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Send Email Modal */}
      {emailAppointmentId && (() => {
        const appointment = appointments.find(apt => apt.id === emailAppointmentId)
        return appointment ? (
          <SendEmailModal
            appointment={appointment}
            onClose={() => setEmailAppointmentId(null)}
            onSend={handleSendEmail}
          />
        ) : null
      })()}

      {/* Bulk Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', margin: 0 }}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirmer la suppression</h3>
                <p className="text-sm text-gray-600">
                  Voulez-vous vraiment supprimer {selectedAppointments.size} rendez-vous ?
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Attention :</strong> Cette action est irréversible.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
