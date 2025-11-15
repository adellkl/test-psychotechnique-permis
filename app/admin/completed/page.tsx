'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Appointment } from '../../../lib/supabase'
import AuthGuard from '../components/AuthGuard'
import { useCenterContext } from '../context/CenterContext'
import Sidebar from '../components/Sidebar'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function CompletedAppointments() {
  return (
    <AuthGuard>
      <CompletedContent />
    </AuthGuard>
  )
}

function CompletedContent() {
  const { selectedCenterId, centers } = useCenterContext()
  const [completedAppointments, setCompletedAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<any>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPeriod, setFilterPeriod] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0
  })

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) {
      window.location.href = '/admin'
      return
    }
    const adminData = JSON.parse(adminSession)
    setAdmin(adminData)
    fetchCompletedAppointments()
  }, [selectedCenterId])

  const fetchCompletedAppointments = async () => {
    try {
      setLoading(true)

      let query = supabase
        .from('appointments')
        .select('*')
        .eq('status', 'completed')
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false })

      if (selectedCenterId) {
        query = query.eq('center_id', selectedCenterId)
      }

      const { data, error } = await query

      if (error) throw error

      setCompletedAppointments(data || [])
      setFilteredAppointments(data || [])

      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      const weekStart = startOfWeek.toISOString().split('T')[0]
      const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

      setStats({
        total: data?.length || 0,
        thisMonth: data?.filter(apt => apt.appointment_date >= monthStart).length || 0,
        thisWeek: data?.filter(apt => apt.appointment_date >= weekStart).length || 0,
        today: data?.filter(apt => apt.appointment_date === today).length || 0
      })
    } catch (error) {
      console.error('Error fetching completed appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_session_timestamp')
    window.location.href = '/admin'
  }

  const selectedCenter = centers.find(c => c.id === selectedCenterId)

  const handleSectionChange = (section: string) => {
    if (section === 'appointments') {
      window.location.href = '/admin/dashboard'
    } else if (section === 'settings') {
      window.location.href = '/admin/dashboard#settings'
    }
  }

  // Filtrage et recherche
  useEffect(() => {
    let filtered = [...completedAppointments]

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(apt =>
        apt.first_name.toLowerCase().includes(query) ||
        apt.last_name.toLowerCase().includes(query) ||
        apt.email.toLowerCase().includes(query) ||
        apt.phone.includes(query)
      )
    }

    // Filtre par période
    if (filterPeriod !== 'all') {
      const now = new Date()
      // Réinitialiser l'heure pour une comparaison de date pure
      now.setHours(0, 0, 0, 0)

      filtered = filtered.filter(apt => {
        if (!apt.appointment_date) return false

        const appointmentDate = new Date(apt.appointment_date + 'T00:00:00')
        appointmentDate.setHours(0, 0, 0, 0)

        if (filterPeriod === 'today') {
          return appointmentDate.getTime() === now.getTime()
        } else if (filterPeriod === 'week') {
          const startOfWeek = new Date(now)
          startOfWeek.setDate(now.getDate() - now.getDay())
          startOfWeek.setHours(0, 0, 0, 0)
          return appointmentDate >= startOfWeek
        } else if (filterPeriod === 'month') {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          startOfMonth.setHours(0, 0, 0, 0)
          return appointmentDate >= startOfMonth
        } else if (filterPeriod === 'last3months') {
          const threeMonthsAgo = new Date(now)
          threeMonthsAgo.setMonth(now.getMonth() - 3)
          threeMonthsAgo.setHours(0, 0, 0, 0)
          return appointmentDate >= threeMonthsAgo
        }

        return true
      })
    }

    setFilteredAppointments(filtered)
  }, [searchQuery, filterPeriod, completedAppointments])

  // Sélection des rendez-vous
  const handleSelectAll = () => {
    if (selectedIds.size === filteredAppointments.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredAppointments.map(apt => apt.id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  // Suppression des historiques
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return

    setDeleting(true)
    try {
      const idsToDelete = Array.from(selectedIds)

      // Supprimer les notifications associées d'abord
      const { error: notifError } = await supabase
        .from('notifications')
        .delete()
        .in('appointment_id', idsToDelete)

      if (notifError) {
        console.error('Error deleting notifications:', notifError)
      }

      // Supprimer les rendez-vous
      const { error } = await supabase
        .from('appointments')
        .delete()
        .in('id', idsToDelete)

      if (error) throw error

      alert(`${idsToDelete.length} rendez-vous supprimé(s) avec succès`)
      setSelectedIds(new Set())
      setShowDeleteModal(false)
      await fetchCompletedAppointments()
    } catch (error) {
      console.error('Error deleting appointments:', error)
      alert('Erreur lors de la suppression des rendez-vous')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteAll = async () => {
    if (filteredAppointments.length === 0) return

    setDeleting(true)
    try {
      const idsToDelete = filteredAppointments.map(apt => apt.id)

      // Supprimer les notifications associées
      await supabase
        .from('notifications')
        .delete()
        .in('appointment_id', idsToDelete)

      // Supprimer les rendez-vous
      const { error } = await supabase
        .from('appointments')
        .delete()
        .in('id', idsToDelete)

      if (error) throw error

      alert(`${idsToDelete.length} rendez-vous supprimé(s) avec succès`)
      setSelectedIds(new Set())
      setShowDeleteAllModal(false)
      await fetchCompletedAppointments()
    } catch (error) {
      console.error('Error deleting all appointments:', error)
      alert('Erreur lors de la suppression des rendez-vous')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection="completed"
        onSectionChange={handleSectionChange}
        adminName={admin?.full_name || 'Admin'}
        onLogout={handleLogout}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="bg-white shadow-sm border-b border-gray-200 z-10 pt-16 lg:pt-0">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Rendez-vous Terminés</h1>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  {selectedCenter ? `${selectedCenter.name} - ${selectedCenter.city}` : 'Tous les centres'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold mb-1">{stats.total}</p>
              <p className="text-sm opacity-90">Total terminés</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-3xl font-bold mb-1">{stats.thisMonth}</p>
              <p className="text-sm opacity-90">Ce mois-ci</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold mb-1">{stats.thisWeek}</p>
              <p className="text-sm opacity-90">Cette semaine</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-3xl font-bold mb-1">{stats.today}</p>
              <p className="text-sm opacity-90">Aujourd'hui</p>
            </div>
          </div>

          {/* Liste des rendez-vous terminés */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Historique des rendez-vous</h2>

                {/* Actions de suppression */}
                <div className="flex gap-2">
                  {selectedIds.size > 0 && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                      disabled={deleting}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer ({selectedIds.size})
                    </button>
                  )}
                  <button
                    onClick={() => setShowDeleteAllModal(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium flex items-center gap-2"
                    disabled={deleting || filteredAppointments.length === 0}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Tout supprimer
                  </button>
                </div>
              </div>

              {/* Barre de recherche et filtres */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recherche */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher (nom, email, téléphone...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Filtre par période */}
                <div>
                  <select
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Toutes les périodes</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois-ci</option>
                    <option value="last3months">3 derniers mois</option>
                  </select>
                </div>
              </div>

              {/* Compteur de résultats */}
              <div className="mt-4 text-sm text-gray-600">
                {filteredAppointments.length} rendez-vous trouvé(s)
                {searchQuery || filterPeriod !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setFilterPeriod('all')
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Réinitialiser les filtres
                  </button>
                ) : null}
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Chargement...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600">
                  {searchQuery || filterPeriod !== 'all'
                    ? 'Aucun rendez-vous ne correspond aux critères de recherche'
                    : 'Aucun rendez-vous terminé'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedIds.size === filteredAppointments.length && filteredAppointments.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Heure</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Centre</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAppointments.map((apt) => {
                      const appointmentCenter = centers.find(c => c.id === apt.center_id)
                      return (
                        <tr
                          key={apt.id}
                          className={`hover:bg-gray-50 transition-colors ${selectedIds.has(apt.id) ? 'bg-red-50' : ''
                            }`}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(apt.id)}
                              onChange={() => handleSelectOne(apt.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {format(new Date(apt.appointment_date), 'dd MMMM yyyy', { locale: fr })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{apt.appointment_time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{apt.first_name} {apt.last_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{apt.email}</div>
                            <div className="text-sm text-gray-500">{apt.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{appointmentCenter?.name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{appointmentCenter?.city || ''}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                              ✓ Terminé
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de confirmation de suppression sélectionnée */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer <strong>{selectedIds.size} rendez-vous</strong> terminé(s) ?
              <br />
              <span className="text-red-600 font-semibold">Cette action est irréversible.</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Suppression...
                  </>
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression totale */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmer la suppression
            </h3>

            <p className="text-gray-600 mb-6">
              Supprimer {filteredAppointments.length} rendez-vous ?
              <br />
              <span className="text-sm text-gray-500">Cette action est irréversible.</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Suppression...
                  </>
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
