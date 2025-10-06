'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Appointment } from '../../../lib/supabase'
import AuthGuard from '../components/AuthGuard'
import { logAdminActivity, AdminLogger } from '../../../lib/adminLogger'
import Sidebar from '../components/Sidebar'
import EnhancedStats from '../components/EnhancedStats'
import AppointmentsTable from '../components/AppointmentsTable'
import StatisticsCharts from '../components/StatisticsCharts'
import AdminSettingsContent from '../components/AdminSettingsContent'
import SearchBar, { SearchFilters } from '../components/SearchBar'
import ExportStatisticsButton from '../components/ExportStatisticsButton'

export default function AdminDashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}

function DashboardContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('appointments')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  // Initialiser avec la valeur sauvegardée ou false (ouvert par défaut)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_sidebar_collapsed')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null)

  useEffect(() => {
    // Check admin session
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) {
      window.location.href = '/admin'
      return
    }
    const adminData = JSON.parse(adminSession)
    setAdmin(adminData)

    // Check URL hash for active section
    const hash = window.location.hash.replace('#', '')
    if (hash && ['dashboard', 'appointments', 'statistics', 'settings'].includes(hash)) {
      setActiveSection(hash)
    }

    // Log dashboard view
    logAdminActivity(AdminLogger.ACTIONS.VIEW_DASHBOARD, 'Viewed admin dashboard')

    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAppointments(data || [])
      setFilteredAppointments(data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les rendez-vous selon les critères de recherche
  useEffect(() => {
    if (!searchFilters || !searchFilters.searchTerm) {
      // Filtrer uniquement par dates si spécifiées
      if (searchFilters?.dateFrom || searchFilters?.dateTo) {
        const filtered = appointments.filter(apt => {
          const aptDate = apt.appointment_date
          const fromMatch = !searchFilters.dateFrom || aptDate >= searchFilters.dateFrom
          const toMatch = !searchFilters.dateTo || aptDate <= searchFilters.dateTo
          return fromMatch && toMatch
        })
        setFilteredAppointments(filtered)
      } else {
        setFilteredAppointments(appointments)
      }
      return
    }

    const term = searchFilters.searchTerm.toLowerCase()
    const filtered = appointments.filter(apt => {
      // Filtrage par dates
      const aptDate = apt.appointment_date
      const fromMatch = !searchFilters.dateFrom || aptDate >= searchFilters.dateFrom
      const toMatch = !searchFilters.dateTo || aptDate <= searchFilters.dateTo
      
      if (!fromMatch || !toMatch) return false

      // Filtrage par terme de recherche
      const fullName = `${apt.first_name} ${apt.last_name}`.toLowerCase()
      
      switch (searchFilters.searchField) {
        case 'name':
          return fullName.includes(term)
        case 'email':
          return apt.email.toLowerCase().includes(term)
        case 'phone':
          return apt.phone?.toLowerCase().includes(term)
        case 'date':
          return apt.appointment_date.includes(term)
        case 'all':
        default:
          return (
            fullName.includes(term) ||
            apt.email.toLowerCase().includes(term) ||
            apt.phone?.toLowerCase().includes(term) ||
            apt.appointment_date.includes(term)
          )
      }
    })

    setFilteredAppointments(filtered)
  }, [searchFilters, appointments])

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters)
    logAdminActivity(AdminLogger.ACTIONS.VIEW_DASHBOARD, `Recherche rendez-vous: ${filters.searchTerm || 'filtrage par date'}`)
  }

  const handleResetSearch = () => {
    setSearchFilters(null)
    setFilteredAppointments(appointments)
  }

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      await fetchAppointments()
      setNotification({ type: 'success', message: 'Statut mis à jour avec succès' })
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error('Error updating appointment:', error)
      setNotification({ type: 'error', message: 'Erreur lors de la mise à jour' })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchAppointments()
      setNotification({ type: 'success', message: 'Rendez-vous supprimé avec succès' })
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error('Error deleting appointment:', error)
      setNotification({ type: 'error', message: 'Erreur lors de la suppression du rendez-vous' })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .in('id', ids)

      if (error) throw error

      await fetchAppointments()
      setNotification({ type: 'success', message: `${ids.length} rendez-vous supprimés avec succès` })
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error('Error deleting appointments:', error)
      setNotification({ type: 'error', message: 'Erreur lors de la suppression des rendez-vous' })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const logout = async () => {
    await logAdminActivity(AdminLogger.ACTIONS.LOGOUT, `Admin ${admin?.full_name} logged out`)
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_session_timestamp')
    window.location.href = '/admin'
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section)
          window.history.replaceState(null, '', `#${section}`)
        }}
        adminName={admin?.full_name || 'Admin'}
        onLogout={handleLogoutClick}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={(collapsed) => {
          setSidebarCollapsed(collapsed)
          // Sauvegarder la préférence
          localStorage.setItem('admin_sidebar_collapsed', JSON.stringify(collapsed))
        }}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-10 pt-16 lg:pt-0">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {activeSection === 'dashboard' && 'Vue d\'ensemble'}
                  {activeSection === 'appointments' && 'Gestion des rendez-vous'}
                  {activeSection === 'statistics' && 'Statistiques'}
                  {activeSection === 'settings' && 'Paramètres du compte'}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Bienvenue, {admin?.full_name}
                </p>
              </div>
              {activeSection === 'statistics' && (
                <ExportStatisticsButton appointments={appointments} />
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8">
              <EnhancedStats appointments={appointments} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Aperçu rapide</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total rendez-vous</span>
                      <span className="text-lg font-bold text-blue-600">{appointments.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Confirmés</span>
                      <span className="text-lg font-bold text-green-600">
                        {appointments.filter(a => a.status === 'confirmed').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Terminés</span>
                      <span className="text-lg font-bold text-purple-600">
                        {appointments.filter(a => a.status === 'completed').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Activité récente</h3>
                  <div className="space-y-3">
                    {appointments.slice(0, 5).map((apt) => (
                      <div key={apt.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {apt.first_name[0]}{apt.last_name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {apt.first_name} {apt.last_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(apt.appointment_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Section */}
          {activeSection === 'appointments' && (
            <div className="space-y-6">
              <SearchBar 
                onSearch={handleSearch}
                onReset={handleResetSearch}
              />
              
              {/* Résultats de recherche */}
              {searchFilters && (
                <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-blue-800">
                    <strong>{filteredAppointments.length}</strong> résultat{filteredAppointments.length !== 1 ? 's' : ''} trouvé{filteredAppointments.length !== 1 ? 's' : ''}
                    {searchFilters.searchTerm && ` pour "${searchFilters.searchTerm}"`}
                  </span>
                </div>
              )}

              <AppointmentsTable
                appointments={filteredAppointments}
                onUpdateStatus={updateAppointmentStatus}
                onDelete={deleteAppointment}
                onBulkDelete={handleBulkDelete}
              />
            </div>
          )}

          {/* Statistics Section */}
          {activeSection === 'statistics' && (
            <div className="space-y-6">
              <StatisticsCharts appointments={appointments} />
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <AdminSettingsContent />
          )}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirmer la déconnexion</h3>
                <p className="text-sm text-gray-600">Êtes-vous sûr de vouloir vous déconnecter ?</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 min-w-[320px] max-w-md rounded-xl shadow-2xl backdrop-blur-md border transition-all duration-500 transform ${notification.type === 'success'
              ? 'bg-gradient-to-r from-green-50/95 to-emerald-50/95 border-green-300/50 text-green-900'
              : 'bg-gradient-to-r from-red-50/95 to-rose-50/95 border-red-300/50 text-red-900'
            } animate-in slide-in-from-right-5 fade-in-0`}
          style={{ zIndex: 9998 }}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${notification.type === 'success'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-red-500 to-rose-500'
                }`}>
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-1">
                  {notification.type === 'success' ? 'Succès' : 'Erreur'}
                </p>
                <p className="text-sm opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className={`flex-shrink-0 p-1 rounded-lg transition-all duration-200 ${notification.type === 'success'
                    ? 'hover:bg-green-200/50 text-green-700'
                    : 'hover:bg-red-200/50 text-red-700'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
