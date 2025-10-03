'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Appointment } from '../../../lib/supabase'
import AuthGuard, { useAdmin } from '../components/AuthGuard'
import { logAdminActivity, AdminLogger } from '../../../lib/adminLogger'
import Sidebar from '../components/Sidebar'
import EnhancedStats from '../components/EnhancedStats'
import AppointmentsTable from '../components/AppointmentsTable'
import NotificationSystem from '../components/NotificationSystem'

export default function AdminDashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}

function DashboardContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('appointments')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)

  useEffect(() => {
    // Check admin session
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) {
      window.location.href = '/admin'
      return
    }
    const adminData = JSON.parse(adminSession)
    setAdmin(adminData)
    
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
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      await fetchAppointments()
      setNotification({type: 'success', message: 'Statut mis à jour avec succès'})
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error('Error updating appointment:', error)
      setNotification({type: 'error', message: 'Erreur lors de la mise à jour'})
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
      setNotification({type: 'success', message: 'Rendez-vous supprimé avec succès'})
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error('Error deleting appointment:', error)
      setNotification({type: 'error', message: 'Erreur lors de la suppression du rendez-vous'})
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
      setNotification({type: 'success', message: `${ids.length} rendez-vous supprimés avec succès`})
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error('Error deleting appointments:', error)
      setNotification({type: 'error', message: 'Erreur lors de la suppression des rendez-vous'})
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
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        adminName={admin?.full_name || 'Admin'}
        onLogout={handleLogoutClick}
      />
      {/* Mobile-First Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/admin/creneaux"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Gérer les créneaux
              </a>
              <span className="text-sm text-gray-600">
                Connecté en tant que <span className="font-semibold">{admin?.full_name}</span>
              </span>
              <button
                onClick={handleLogoutClick}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile-Optimized Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total RDV</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Annulés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'cancelled').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Responsive Appointments */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900">Rendez-vous</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">Tous les RDV</option>
                <option value="confirmed">Confirmés</option>
                <option value="completed">Terminés</option>
                <option value="cancelled">Annulés</option>
                <option value="no_show">Absents</option>
              </select>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="block sm:hidden">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {appointment.first_name} {appointment.last_name}
                    </h3>
                    {appointment.is_second_chance && (
                      <span className="text-xs text-orange-600 font-medium">2ème chance</span>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(appointment.appointment_date).toLocaleDateString('fr-FR')} à {appointment.appointment_time.slice(0, 5)}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    {appointment.email}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {appointment.phone}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="capitalize">{appointment.reason}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {appointment.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        className="flex-1 text-green-600 hover:text-green-900 text-xs px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 font-medium"
                      >
                        ✓ Terminer
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        className="flex-1 text-red-600 hover:text-red-900 text-xs px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 font-medium"
                      >
                        ✕ Annuler
                      </button>
                    </>
                  )}
                  {appointment.status === 'cancelled' && (
                    <button
                      onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                      className="w-full text-blue-600 hover:text-blue-900 text-xs px-3 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 font-medium"
                    >
                      ↻ Restaurer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.first_name} {appointment.last_name}
                        </div>
                        {appointment.is_second_chance && (
                          <div className="text-xs text-orange-600 font-medium">
                            2ème chance
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.email}</div>
                      <div className="text-sm text-gray-500">{appointment.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
{new Date(appointment.appointment_date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.appointment_time.slice(0, 5)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {appointment.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {appointment.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              className="text-green-600 hover:text-green-900 text-xs px-2 py-1 border border-green-300 rounded hover:bg-green-50"
                            >
                              Terminer
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900 text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                            >
                              Annuler
                            </button>
                          </>
                        )}
                        {appointment.status === 'cancelled' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 border border-blue-300 rounded hover:bg-blue-50"
                          >
                            Restaurer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {appointments.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rendez-vous</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' ? 'Aucun rendez-vous trouvé.' : `Aucun rendez-vous ${getStatusLabel(filter).toLowerCase()} trouvé.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirmer la suppression</h3>
                <p className="text-sm text-gray-600">Êtes-vous sûr de vouloir supprimer {selectedAppointments.size} rendez-vous sélectionnés ?</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 backdrop-blur-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
              >
                Supprimer {selectedAppointments.size} rendez-vous
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-xl flex items-center justify-center">
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
                onClick={cancelLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 backdrop-blur-sm"
              >
                Annuler
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Notification */}
      {notification && (
        <div 
          className={`fixed top-6 right-6 min-w-[320px] max-w-md rounded-xl shadow-2xl backdrop-blur-md border transition-all duration-500 transform ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-50/95 to-emerald-50/95 border-green-300/50 text-green-900' 
              : 'bg-gradient-to-r from-red-50/95 to-rose-50/95 border-red-300/50 text-red-900'
          } animate-in slide-in-from-right-5 fade-in-0`}
          style={{ zIndex: 2147483647 }}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                notification.type === 'success' 
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
                className={`flex-shrink-0 p-1 rounded-lg transition-all duration-200 ${
                  notification.type === 'success' 
                    ? 'hover:bg-green-200/50 text-green-700' 
                    : 'hover:bg-red-200/50 text-red-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={`mt-3 h-1 rounded-full ${
              notification.type === 'success' 
                ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
                : 'bg-gradient-to-r from-red-400 to-rose-400'
            } animate-pulse`}></div>
          </div>
        </div>
      )}
    </div>
  )
}
