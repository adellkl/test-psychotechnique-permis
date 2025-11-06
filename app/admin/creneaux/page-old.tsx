'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import AuthGuard from '../components/AuthGuard'
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns'
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
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSlot, setNewSlot] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00'
  })

  const timeOptions = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00'
  ]

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
    } catch (error) {
      console.error('Error adding time slot:', error)
      alert('Erreur lors de l\'ajout du créneau: ' + (error as any).message)
    }
  }

  const deleteTimeSlot = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) return

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

      fetchTimeSlots()
    } catch (error) {
      console.error('Error deleting time slot:', error)
      alert('Erreur lors de la suppression du créneau')
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
    } catch (error) {
      console.error('Error updating availability:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const addMultipleSlots = async () => {
    const slotsToAdd = []
    const startDate = new Date(newSlot.date)


    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i)
      const dateStr = format(currentDate, 'yyyy-MM-dd')

      // Skip weekends if desired
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue

      // Calculate end time (2 hours later)
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

      setShowAddForm(false)
      fetchTimeSlots()
      alert(`${slotsToAdd.length} créneaux ajoutés avec succès`)
    } catch (error) {
      console.error('Error adding multiple slots:', error)
      alert('Erreur lors de l\'ajout des créneaux: ' + (error as any).message)
    }
  }

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }

  const getSlotsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return timeSlots.filter(slot => slot.date === dateStr)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Créneaux</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un créneau
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Week Navigation */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, -7))}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <h2 className="text-lg font-semibold text-gray-900">
              Semaine du {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'dd MMMM yyyy', { locale: fr })}
            </h2>

            <button
              onClick={() => setSelectedDate(addDays(selectedDate, 7))}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded flex items-center justify-center">
                <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-gray-700">Réservé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded flex items-center justify-center">
                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </div>
              <span className="text-gray-700">Désactivé</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 lg:gap-4">
            {getWeekDays().map((day, index) => {
              const daySlots = getSlotsForDate(day)
              const isToday = isSameDay(day, new Date())
              const availableCount = daySlots.filter(slot => slot.is_available && !slot.is_booked).length
              const bookedCount = daySlots.filter(slot => slot.is_booked).length

              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className={`p-3 border-b ${isToday ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200' : 'bg-gray-50'}`}>
                    <div className="text-center">
                      <h3 className={`font-semibold text-xs xl:text-sm ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                        {format(day, 'EEE', { locale: fr })}
                      </h3>
                      <p className={`text-xs xl:text-sm font-medium ${isToday ? 'text-blue-700' : 'text-gray-600'}`}>
                        {format(day, 'dd/MM', { locale: fr })}
                      </p>
                    </div>
                    <div className="flex flex-col xl:flex-row gap-1 xl:gap-2 mt-2">
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {availableCount}
                      </span>
                      {bookedCount > 0 && (
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {bookedCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-2 xl:p-4 space-y-2 xl:space-y-3 min-h-[250px] xl:min-h-[300px] max-h-[350px] xl:max-h-[400px] overflow-y-auto">
                    {daySlots.length === 0 ? (
                      <div className="text-center py-6 xl:py-8">
                        <svg className="mx-auto h-6 w-6 xl:h-8 xl:w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 text-xs xl:text-sm">Aucun créneau</p>
                      </div>
                    ) : (
                      daySlots.map((slot) => {
                        const getSlotStyle = () => {
                          if (slot.is_booked) {
                            return 'bg-orange-50 border-orange-200 text-orange-900'
                          }
                          if (!slot.is_available) {
                            return 'bg-red-50 border-red-200 text-red-800'
                          }
                          return 'bg-green-50 border-green-200 text-green-800'
                        }

                        const getStatusIcon = () => {
                          if (slot.is_booked) {
                            return (
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            )
                          }
                          if (!slot.is_available) {
                            return (
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                              </svg>
                            )
                          }
                          return (
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )
                        }

                        return (
                          <div
                            key={slot.id}
                            className={`p-2 xl:p-3 rounded-lg border transition-all hover:shadow-sm ${getSlotStyle()}`}
                          >
                            <div className="flex items-center justify-between mb-1 xl:mb-2">
                              <div className="flex items-center gap-1 xl:gap-2">
                                <div className="w-3 h-3 xl:w-4 xl:h-4">
                                  {getStatusIcon()}
                                </div>
                                <span className="font-semibold text-xs xl:text-sm">{slot.start_time}</span>
                              </div>
                              <div className="flex gap-0.5 xl:gap-1">
                                {!slot.is_booked && (
                                  <button
                                    onClick={() => toggleAvailability(slot.id, slot.is_available)}
                                    className={`p-1 xl:p-1.5 rounded-md transition-colors ${slot.is_available
                                        ? 'text-green-600 hover:bg-green-100'
                                        : 'text-red-600 hover:bg-red-100'
                                      }`}
                                    title={slot.is_available ? 'Désactiver' : 'Activer'}
                                  >
                                    <svg className="w-3 h-3 xl:w-3.5 xl:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d={slot.is_available ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"}
                                      />
                                    </svg>
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteTimeSlot(slot.id)}
                                  className="p-1 xl:p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                  title="Supprimer"
                                  disabled={slot.is_booked}
                                >
                                  <svg className="w-3 h-3 xl:w-3.5 xl:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            {slot.is_booked && (
                              <div className="text-xs">
                                <p className="font-medium text-orange-800 truncate">{slot.client_name}</p>
                                <p className="text-orange-600 capitalize text-xs">{slot.booking_status}</p>
                              </div>
                            )}
                            {!slot.is_available && !slot.is_booked && (
                              <p className="text-xs text-red-600">Désactivé</p>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ajouter un créneau</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                <select
                  value={newSlot.time}
                  onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>


              <div className="flex gap-3 pt-4">
                <button
                  onClick={addTimeSlot}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Ajouter ce créneau
                </button>
                <button
                  onClick={addMultipleSlots}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Ajouter pour 7 jours
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
