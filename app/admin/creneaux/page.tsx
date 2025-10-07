'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import AuthGuard from '../components/AuthGuard'
import Sidebar from '../components/Sidebar'
import SlotsCalendar from '../components/SlotsCalendar'
import AddSlotModal from '../components/AddSlotModal'
import { format, addDays, startOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale'
import { logAdminActivity, AdminLogger } from '../../../lib/adminLogger'

interface TimeSlot {
  id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
  is_booked?: boolean
  appointment_id?: string
  client_name?: string
  booking_status?: string
}

export default function TimeSlotManagement() {
  return (
    <AuthGuard>
      <TimeSlotContent />
    </AuthGuard>
  )
}

function TimeSlotContent() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddForm, setShowAddForm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [activeSection, setActiveSection] = useState('slots')
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week')
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'booked' | 'disabled'>('all')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  // Initialiser avec la valeur sauvegardée ou false (ouvert par défaut)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_sidebar_collapsed')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })
  const [newSlot, setNewSlot] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00'
  })

  const timeOptions = [
    '08:00', '08:20', '08:40', '09:00', '09:20', '09:40',
    '10:00', '10:20', '10:40', '11:00', '11:20', '11:40',
    '12:00', '12:20', '12:40', '13:00', '13:20', '13:40',
    '14:00', '14:20', '14:40', '15:00', '15:20', '15:40',
    '16:00', '16:20', '16:40', '17:00', '17:20', '17:40',
    '18:00', '18:20', '18:40', '19:00', '19:20', '19:40',
    '20:00', '20:20', '20:40', '21:00'
  ]

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) {
      window.location.href = '/admin'
      return
    }
    const adminData = JSON.parse(adminSession)
    setAdmin(adminData)
    
    logAdminActivity(AdminLogger.ACTIONS.VIEW_DASHBOARD, 'Viewed slots management')
  }, [])

  useEffect(() => {
    fetchTimeSlots()
  }, [selectedDate])

  const fetchTimeSlots = async () => {
    try {
      setLoading(true)
      const startDate = format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd')
      const endDate = format(addDays(startOfWeek(selectedDate, { weekStartsOn: 1 }), 6), 'yyyy-MM-dd')

      const { data: slots, error: slotsError } = await supabase
        .from('available_slots')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')
        .order('start_time')

      if (slotsError) throw slotsError

      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, appointment_date, appointment_time, first_name, last_name, status')
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate)
        .in('status', ['confirmed', 'completed'])

      if (appointmentsError) throw appointmentsError

      const bookedSlotsMap = new Map()
      appointments?.forEach(apt => {
        const key = `${apt.appointment_date}_${apt.appointment_time}`
        bookedSlotsMap.set(key, {
          appointment_id: apt.id,
          client_name: `${apt.first_name} ${apt.last_name}`,
          status: apt.status
        })
      })

      const enrichedSlots = slots?.map(slot => {
        const key = `${slot.date}_${slot.start_time}`
        const bookingInfo = bookedSlotsMap.get(key)
        return {
          ...slot,
          is_booked: !!bookingInfo,
          appointment_id: bookingInfo?.appointment_id,
          client_name: bookingInfo?.client_name,
          booking_status: bookingInfo?.status
        }
      }) || []

      setTimeSlots(enrichedSlots)
    } catch (error) {
      console.error('Error fetching time slots:', error)
      setNotification({type: 'error', message: 'Erreur lors du chargement des créneaux'})
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const addTimeSlot = async () => {
    try {
      const [hours, minutes] = newSlot.time.split(':').map(Number)
      const endHours = hours + 2
      const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

      const { error } = await supabase
        .from('available_slots')
        .insert([{
          date: newSlot.date,
          start_time: newSlot.time,
          end_time: endTime,
          is_available: true
        }])

      if (error) throw error
      
      await logAdminActivity(
        AdminLogger.ACTIONS.CREATE_SLOT,
        `Created slot for ${newSlot.date} at ${newSlot.time}`
      )
      
      setShowAddForm(false)
      setNewSlot({
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '09:00'
      })
      fetchTimeSlots()
      setNotification({type: 'success', message: 'Créneau ajouté avec succès'})
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error('Error adding time slot:', error)
      setNotification({type: 'error', message: 'Erreur lors de l\'ajout du créneau'})
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const addMultipleSlots = async () => {
    const slotsToAdd = []
    const startDate = new Date(newSlot.date)
    
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i)
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue
      
      const [hours, minutes] = newSlot.time.split(':').map(Number)
      const endHours = hours + 2
      const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      
      slotsToAdd.push({
        date: dateStr,
        start_time: newSlot.time,
        end_time: endTime,
        is_available: true
      })
    }

    try {
      const { error } = await supabase
        .from('available_slots')
        .insert(slotsToAdd)

      if (error) throw error
      
      await logAdminActivity(
        AdminLogger.ACTIONS.CREATE_SLOT,
        `Created ${slotsToAdd.length} slots starting from ${newSlot.date}`
      )
      
      setShowAddForm(false)
      fetchTimeSlots()
      setNotification({type: 'success', message: `${slotsToAdd.length} créneaux ajoutés avec succès`})
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error('Error adding multiple slots:', error)
      setNotification({type: 'error', message: 'Erreur lors de l\'ajout des créneaux'})
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const addBulkSlots = async (startDate: string, endDate: string, times: string[], workdaysOnly: boolean) => {
    const slotsToAdd: Array<{date: string, start_time: string, end_time: string, is_available: boolean}> = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    // Iterate through all dates in the range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      // Skip weekends if workdaysOnly is true
      if (workdaysOnly && (d.getDay() === 0 || d.getDay() === 6)) continue
      
      const dateStr = format(d, 'yyyy-MM-dd')
      
      // Add a slot for each selected time
      times.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number)
        const endHours = hours + 2
        const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        
        slotsToAdd.push({
          date: dateStr,
          start_time: time,
          end_time: endTime,
          is_available: true
        })
      })
    }

    try {
      const { error } = await supabase
        .from('available_slots')
        .insert(slotsToAdd)

      if (error) throw error
      
      await logAdminActivity(
        AdminLogger.ACTIONS.CREATE_SLOT,
        `Bulk created ${slotsToAdd.length} slots from ${startDate} to ${endDate}`
      )
      
      setShowAddForm(false)
      fetchTimeSlots()
      setNotification({type: 'success', message: `${slotsToAdd.length} créneaux créés avec succès!`})
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error('Error adding bulk slots:', error)
      setNotification({type: 'error', message: 'Erreur lors de la création en masse'})
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const deleteTimeSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('available_slots')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await logAdminActivity(
        AdminLogger.ACTIONS.DELETE_SLOT,
        `Deleted slot with ID: ${id}`
      )
      
      setDeleteConfirmId(null)
      fetchTimeSlots()
      setNotification({type: 'success', message: 'Créneau supprimé avec succès'})
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error('Error deleting time slot:', error)
      setNotification({type: 'error', message: 'Erreur lors de la suppression'})
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('available_slots')
        .update({ is_available: !currentStatus })
        .eq('id', id)

      if (error) throw error
      
      await logAdminActivity(
        AdminLogger.ACTIONS.UPDATE_SLOT,
        `Updated slot ${id} availability to ${!currentStatus}`
      )
      
      fetchTimeSlots()
      setNotification({type: 'success', message: 'Disponibilité mise à jour'})
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error('Error updating availability:', error)
      setNotification({type: 'error', message: 'Erreur lors de la mise à jour'})
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const logout = async () => {
    await logAdminActivity(AdminLogger.ACTIONS.LOGOUT, `Admin ${admin?.full_name} logged out`)
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_session_timestamp')
    window.location.href = '/admin'
  }

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }

  const getFilteredSlots = () => {
    let filtered = timeSlots
    
    if (filterStatus === 'available') {
      filtered = timeSlots.filter(s => s.is_available && !s.is_booked)
    } else if (filterStatus === 'booked') {
      filtered = timeSlots.filter(s => s.is_booked)
    } else if (filterStatus === 'disabled') {
      filtered = timeSlots.filter(s => !s.is_available && !s.is_booked)
    }
    
    return filtered
  }

  const stats = {
    total: timeSlots.length,
    available: timeSlots.filter(s => s.is_available && !s.is_booked).length,
    booked: timeSlots.filter(s => s.is_booked).length,
    disabled: timeSlots.filter(s => !s.is_available && !s.is_booked).length
  }

  if (loading && timeSlots.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement des créneaux...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={(section) => {
          // Navigation vers le dashboard
          if (section === 'dashboard' || section === 'appointments' || section === 'statistics' || section === 'settings') {
            window.location.href = `/admin/dashboard#${section}`
          }
        }}
        adminName={admin?.full_name || 'Admin'}
        onLogout={() => setShowLogoutConfirm(true)}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={(collapsed) => {
          setSidebarCollapsed(collapsed)
          // Sauvegarder la préférence
          localStorage.setItem('admin_sidebar_collapsed', JSON.stringify(collapsed))
        }}
      />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        <header className="bg-white shadow-sm border-b border-gray-200 z-10 pt-16 lg:pt-0">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Gestion des Créneaux</h1>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  Semaine du {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3">
                {/* Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
                >
                  <option value="all">Tous les créneaux</option>
                  <option value="available">Disponibles</option>
                  <option value="booked">Réservés</option>
                  <option value="disabled">Désactivés</option>
                </select>

                {/* View Mode Toggle - Hidden on mobile */}
                <div className="hidden sm:flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      viewMode === 'week' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      viewMode === 'list' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nouveau créneau
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Disponibles</p>
                  <p className="text-3xl font-bold">{stats.available}</p>
                </div>
                <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Réservés</p>
                  <p className="text-3xl font-bold">{stats.booked}</p>
                </div>
                <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Désactivés</p>
                  <p className="text-3xl font-bold">{stats.disabled}</p>
                </div>
                <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 font-semibold rounded-xl hover:from-blue-200 hover:to-purple-200 transition-all"
              >
                Aujourd'hui
              </button>
              
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendar or List View */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : viewMode === 'week' ? (
            <SlotsCalendar
              weekDays={getWeekDays()}
              timeSlots={getFilteredSlots()}
              onToggleAvailability={toggleAvailability}
              onDeleteSlot={(id) => setDeleteConfirmId(id)}
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              {/* Desktop Table - Hidden on mobile */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Heure</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredSlots().map((slot) => (
                      <tr key={slot.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {format(new Date(slot.date), 'dd/MM/yyyy', { locale: fr })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {slot.start_time} - {slot.end_time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {slot.is_booked ? (
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-300">
                              Réservé
                            </span>
                          ) : !slot.is_available ? (
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-300">
                              Désactivé
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                              Disponible
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {slot.client_name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            {!slot.is_booked && (
                              <button
                                onClick={() => toggleAvailability(slot.id, slot.is_available)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                  slot.is_available
                                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                }`}
                              >
                                {slot.is_available ? 'Désactiver' : 'Activer'}
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteConfirmId(slot.id)}
                              disabled={slot.is_booked}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards - Hidden on desktop */}
              <div className="lg:hidden">
                {getFilteredSlots().map((slot) => (
                  <div
                    key={slot.id}
                    className="p-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-bold text-gray-900">
                            {format(new Date(slot.date), 'dd/MM/yyyy', { locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-700 font-medium">
                            {slot.start_time} - {slot.end_time}
                          </span>
                        </div>
                        {slot.client_name && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm text-gray-600">{slot.client_name}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        {slot.is_booked ? (
                          <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-300">
                            Réservé
                          </span>
                        ) : !slot.is_available ? (
                          <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-300">
                            Désactivé
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                            Disponible
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!slot.is_booked && (
                        <button
                          onClick={() => toggleAvailability(slot.id, slot.is_available)}
                          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            slot.is_available
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {slot.is_available ? 'Désactiver' : 'Activer'}
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirmId(slot.id)}
                        disabled={slot.is_booked}
                        className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
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
            </div>
          )}
        </main>
      </div>

      <AddSlotModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        newSlot={newSlot}
        setNewSlot={setNewSlot}
        onAddSingle={addTimeSlot}
        onAddMultiple={addMultipleSlots}
        onAddBulk={addBulkSlots}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirmer la suppression</h3>
                <p className="text-sm text-gray-600">Êtes-vous sûr de vouloir supprimer ce créneau ?</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Attention :</strong> Cette action est irréversible.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => deleteTimeSlot(deleteConfirmId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

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

      {notification && (
        <div 
          className={`fixed top-6 right-6 min-w-[320px] max-w-md rounded-xl shadow-2xl backdrop-blur-md border transition-all duration-500 transform z-[9998] ${
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
          </div>
        </div>
      )}
    </div>
  )
}
