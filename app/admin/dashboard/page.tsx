'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Appointment } from '../../../lib/supabase'
import AuthGuard from '../components/AuthGuard'
import { useCenterContext } from '../context/CenterContext'
import { logAdminActivity, AdminLogger } from '../../../lib/adminLogger'
import Sidebar from '../components/Sidebar'
import AppointmentsTable from '../components/AppointmentsTable'
import AdminSettingsContent from '../components/AdminSettingsContent'
import SearchBar, { SearchFilters } from '../components/SearchBar'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import { sendAppointmentCancellation } from '../../../lib/emailService'

export default function AdminDashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}

function DashboardContent() {
  const { selectedCenterId, centers } = useCenterContext()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('appointments')
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type?: 'danger' | 'warning' | 'info'
  } | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null)
  const [newAppointmentsCount, setNewAppointmentsCount] = useState(0)

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) {
      window.location.href = '/admin'
      return
    }
    const adminData = JSON.parse(adminSession)
    setAdmin(adminData)

    const hash = window.location.hash.replace('#', '')
    if (hash && ['appointments', 'settings'].includes(hash)) {
      setActiveSection(hash)
    }

    logAdminActivity(AdminLogger.ACTIONS.VIEW_DASHBOARD, 'Viewed admin dashboard')
    fetchAppointments()

    const intervalId = setInterval(() => {
      fetchAppointments(true)
    }, 30000)

    return () => clearInterval(intervalId)
  }, [selectedCenterId])

  const fetchAppointments = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      }

      // Récupérer tous les rendez-vous (le filtre par statut se fait dans l'interface)
      let query = supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })

      // Filtrer par centre si sélectionné
      if (selectedCenterId) {
        query = query.eq('center_id', selectedCenterId)
      }

      const { data, error } = await query

      if (error) throw error

      if (silent && data) {
        const currentIds = new Set(appointments.map(apt => apt.id))
        const newAppointments = data.filter(apt => !currentIds.has(apt.id))

        if (newAppointments.length > 0) {
          setNewAppointmentsCount(prev => prev + newAppointments.length)
          setToast({
            type: 'info',
            message: `🔔 ${newAppointments.length} nouveau${newAppointments.length > 1 ? 'x' : ''} rendez-vous !`
          })
        }
      }

      // Afficher les rendez-vous
      setAppointments(data || [])

      // Calculer les rendez-vous d'aujourd'hui
      const today = new Date().toISOString().split('T')[0]
      let todayApts = (data || []).filter(apt => apt.appointment_date === today)
      setTodayAppointments(todayApts)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    let filtered = appointments
    // Les rendez-vous sont déjà filtrés par centre et statut dans fetchAppointments()

    if (!searchFilters || !searchFilters.searchTerm) {
      if (searchFilters?.dateFrom || searchFilters?.dateTo) {
        filtered = filtered.filter(apt => {
          const aptDate = apt.appointment_date
          const fromMatch = !searchFilters.dateFrom || aptDate >= searchFilters.dateFrom
          const toMatch = !searchFilters.dateTo || aptDate <= searchFilters.dateTo
          return fromMatch && toMatch
        })
      }
    } else {
      const term = searchFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(apt => {
        const aptDate = apt.appointment_date
        const fromMatch = !searchFilters.dateFrom || aptDate >= searchFilters.dateFrom
        const toMatch = !searchFilters.dateTo || aptDate <= searchFilters.dateTo

        if (!fromMatch || !toMatch) return false

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
    }

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
    const appointment = appointments.find(a => a.id === id)
    if (!appointment) return

    const statusLabels: { [key: string]: string } = {
      confirmed: 'confirmé',
      completed: 'terminé',
      cancelled: 'annulé'
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Modifier le statut',
      message: `Êtes-vous sûr de vouloir marquer ce rendez-vous comme "${statusLabels[status] || status}" ?\n\nClient: ${appointment.first_name} ${appointment.last_name}\nDate: ${new Date(appointment.appointment_date).toLocaleDateString('fr-FR')}\nHeure: ${appointment.appointment_time}${status === 'cancelled' ? '\n\n⚠️ Un email d\'annulation sera automatiquement envoyé au client.' : ''}`,
      type: status === 'cancelled' ? 'danger' : 'warning',
      onConfirm: async () => {
        setConfirmDialog(null)
        try {
          // Utiliser l'API sécurisée au lieu de Supabase direct
          const adminSession = localStorage.getItem('admin_session')

          if (!adminSession) {
            throw new Error('Session expirée. Veuillez vous reconnecter.')
          }

          const sessionData = JSON.parse(adminSession)
          console.log('📤 Envoi requête PUT avec session:', sessionData)

          const response = await fetch('/api/admin/appointments', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-session': adminSession
            },
            body: JSON.stringify({
              id,
              status,
              admin_notes: status === 'cancelled' ? 'Annulé par l\'administrateur' : undefined
            })
          })

          console.log('📥 Réponse API:', response.status)

          if (!response.ok) {
            const data = await response.json()
            console.error('❌ Erreur API:', data)
            throw new Error(data.error || 'Erreur lors de la mise à jour')
          }

          await fetchAppointments()

          setToast({
            type: 'success',
            message: status === 'cancelled'
              ? `Rendez-vous annulé et email envoyé au client`
              : `Rendez-vous marqué comme ${statusLabels[status]} avec succès`
          })

          await logAdminActivity(
            AdminLogger.ACTIONS.UPDATE_APPOINTMENT,
            `Rendez-vous ${appointment.first_name} ${appointment.last_name} marqué comme ${statusLabels[status]}`
          )
        } catch (error) {
          console.error('Error updating appointment:', error)
          setToast({
            type: 'error',
            message: 'Erreur lors de la mise à jour du rendez-vous'
          })
        }
      }
    })
  }

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchAppointments()
    } catch (error) {
      console.error('Error deleting appointment:', error)
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
    } catch (error) {
      console.error('Error deleting appointments:', error)
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
      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section)
          window.history.replaceState(null, '', `#${section}`)
        }}
        adminName={admin?.full_name || 'Admin'}
        onLogout={handleLogoutClick}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="bg-white shadow-sm border-b border-gray-200 z-10 pt-16 lg:pt-0">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {activeSection === 'appointments' && 'Gestion des rendez-vous'}
                  {activeSection === 'settings' && 'Paramètres du compte'}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm sm:text-base text-gray-600">
                    Bienvenue, {admin?.full_name}
                  </p>
                  {selectedCenterId && centers.length > 0 && (
                    <>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs font-semibold text-blue-700">
                          {centers.find(c => c.id === selectedCenterId)?.name}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto">
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeSection === 'appointments' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Rendez-vous aujourd&apos;hui</h2>
                      <p className="text-xs text-gray-600">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 bg-blue-600 text-white font-bold text-sm rounded-lg">
                    {todayAppointments.length}
                  </span>
                </div>

                {todayAppointments.length === 0 ? (
                  <div className="bg-white rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-base font-semibold text-gray-700 mb-1">Aucun rendez-vous aujourd&apos;hui</p>
                    <p className="text-sm text-gray-500">Profitez de cette journée calme ! 🌟</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {todayAppointments.map((apt) => {
                      const statusColors = {
                        confirmed: 'bg-green-100 text-green-800',
                        in_progress: 'bg-blue-500 text-white',
                        completed: 'bg-gray-100 text-gray-800',
                        cancelled: 'bg-red-100 text-red-800'
                      }
                      const statusLabels = {
                        confirmed: 'Confirmé',
                        in_progress: 'En cours',
                        completed: 'Terminé',
                        cancelled: 'Annulé'
                      }
                      return (
                        <button
                          key={apt.id}
                          onClick={() => {
                            // Faire défiler vers la table des rendez-vous
                            const appointmentsTable = document.getElementById('appointments-table')
                            if (appointmentsTable) {
                              appointmentsTable.scrollIntoView({ behavior: 'smooth', block: 'start' })
                              // Attendre la fin du scroll avant de surligner
                              setTimeout(() => {
                                const row = document.querySelector(`[data-appointment-id="${apt.id}"]`)
                                if (row) {
                                  // Animation de pulsation avec fond bleu
                                  row.classList.add('!bg-blue-100', 'ring-4', 'ring-blue-500', 'animate-pulse')
                                  // Arrêter l'animation après 1 seconde
                                  setTimeout(() => {
                                    row.classList.remove('animate-pulse')
                                  }, 1000)
                                  // Retirer complètement le surlignage après 3 secondes
                                  setTimeout(() => {
                                    row.classList.remove('!bg-blue-100', 'ring-4', 'ring-blue-500')
                                  }, 3000)
                                }
                              }, 500)
                            }
                          }}
                          className={`w-full bg-white rounded-lg p-3 border hover:bg-blue-50 transition-colors cursor-pointer text-left group ${apt.status === 'in_progress'
                            ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50'
                            : 'border-gray-200'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 text-white rounded px-2 py-1 text-center min-w-[60px] ${apt.status === 'in_progress' ? 'bg-blue-500' : 'bg-blue-600'
                              }`}>
                              <div className="text-lg font-bold">{apt.appointment_time}</div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                  {apt.first_name[0]}{apt.last_name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm font-bold text-gray-900 truncate">{apt.first_name} {apt.last_name}</h3>
                                  <p className="text-xs text-gray-600 truncate">{apt.phone}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex-shrink-0 flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${statusColors[apt.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                                {statusLabels[apt.status as keyof typeof statusLabels] || apt.status}
                              </span>
                              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

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

              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Tous les rendez-vous</h2>
                </div>
                <AppointmentsTable
                  appointments={filteredAppointments}
                  onUpdateStatus={updateAppointmentStatus}
                  onDelete={deleteAppointment}
                  onBulkDelete={handleBulkDelete}
                />
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <AdminSettingsContent />
          )}
        </main>
      </div>

      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
    </div>
  )
}
