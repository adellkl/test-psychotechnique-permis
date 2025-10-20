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
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<any>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
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
      
      // Calculer les statistiques
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
              <h2 className="text-xl font-bold text-gray-900">Historique des rendez-vous</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Chargement...</p>
              </div>
            ) : completedAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600">Aucun rendez-vous terminé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Heure</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {completedAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
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
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                            ✓ Terminé
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
