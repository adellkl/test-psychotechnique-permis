'use client'

import { format, isSameDay, isPast, parse, isBefore, startOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'

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

interface SlotsCalendarProps {
  weekDays: Date[]
  timeSlots: TimeSlot[]
  onToggleAvailability: (id: string, currentStatus: boolean) => void
  onDeleteSlot: (id: string) => void
}

export default function SlotsCalendar({
  weekDays,
  timeSlots,
  onToggleAvailability,
  onDeleteSlot
}: SlotsCalendarProps) {
  const getSlotsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const now = new Date()
    const today = format(now, 'yyyy-MM-dd')
    
    return timeSlots.filter(slot => {
      if (slot.date !== dateStr) return false
      
      // Garder tous les créneaux d'aujourd'hui
      if (slot.date === today) {
        return true
      }
      
      // Pour les autres jours, ne garder que les créneaux futurs
      const slotDateTime = parse(
        `${slot.date} ${slot.start_time}`,
        'yyyy-MM-dd HH:mm',
        new Date()
      )
      return !isPast(slotDateTime)
    })
  }

  const getSlotStyle = (slot: TimeSlot) => {
    if (slot.is_booked) {
      return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 hover:shadow-md'
    }
    if (!slot.is_available) {
      return 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 hover:shadow-md'
    }
    return 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:shadow-md'
  }

  const getStatusIcon = (slot: TimeSlot) => {
    if (slot.is_booked) {
      return (
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )
    }
    if (!slot.is_available) {
      return (
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )
    }
    return (
      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
      {weekDays.map((day, index) => {
        const daySlots = getSlotsForDate(day)
        const isToday = isSameDay(day, new Date())
        const isPastDay = isBefore(startOfDay(day), startOfDay(new Date()))
        const availableCount = daySlots.filter(slot => slot.is_available && !slot.is_booked).length
        const bookedCount = daySlots.filter(slot => slot.is_booked).length
        
        return (
          <div key={index} className={`bg-white rounded-2xl shadow-lg border overflow-hidden ${
            isPastDay ? 'opacity-50 border-gray-300' : 'border-gray-200'
          }`}>
            {/* Day Header */}
            <div className={`p-4 border-b ${
              isPastDay
                ? 'bg-gray-200 border-gray-300'
                : isToday 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-600' 
                : 'bg-gradient-to-r from-gray-50 to-gray-100'
            }`}>
              <div className="text-center">
                <h3 className={`font-bold text-lg ${
                  isPastDay ? 'text-gray-500' : isToday ? 'text-white' : 'text-gray-900'
                }`}>
                  {format(day, 'EEEE', { locale: fr })}
                </h3>
                <p className={`text-sm font-medium ${
                  isPastDay ? 'text-gray-400' : isToday ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {format(day, 'dd MMMM', { locale: fr })}
                </p>
              </div>
              {!isPastDay && (
                <div className="flex gap-2 mt-3 justify-center">
                  {availableCount > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {availableCount}
                    </span>
                  )}
                  {bookedCount > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-sm">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {bookedCount}
                    </span>
                  )}
                </div>
              )}
              {isPastDay && (
                <div className="flex gap-2 mt-3 justify-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-400 text-white shadow-sm">
                    Jour passé
                  </span>
                </div>
              )}
            </div>
            
            {/* Slots */}
            <div className="p-3 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto custom-scrollbar">
              {daySlots.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Aucun créneau</p>
                </div>
              ) : (
                daySlots.map((slot) => {
                  const slotDateTime = parse(
                    `${slot.date} ${slot.start_time}`,
                    'yyyy-MM-dd HH:mm',
                    new Date()
                  )
                  const isSlotPast = isPast(slotDateTime)
                  
                  return (
                  <div
                    key={slot.id}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isPastDay || isSlotPast 
                        ? 'bg-gray-100 border-gray-300 opacity-60' 
                        : getSlotStyle(slot)
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(slot)}
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{slot.start_time}</div>
                        <div className="text-xs text-gray-600">→ {slot.end_time}</div>
                      </div>
                    </div>
                    
                    {slot.is_booked && (
                      <div className="mt-2 p-2 bg-white/70 rounded-lg">
                        <p className="font-semibold text-sm text-orange-900 truncate">{slot.client_name}</p>
                        <p className="text-xs text-orange-700 capitalize">{slot.booking_status}</p>
                      </div>
                    )}
                    
                    {!slot.is_available && !slot.is_booked && (
                      <p className="text-xs font-medium text-red-600 mt-2">Créneau désactivé</p>
                    )}
                    
                    {!isPastDay && !isSlotPast && (
                      <div className="flex gap-2 mt-3">
                        {!slot.is_booked && (
                          <button
                            onClick={() => onToggleAvailability(slot.id, slot.is_available)}
                            className={`px-2.5 py-2.5 rounded-lg transition-all shadow-md flex items-center justify-center flex-shrink-0 ${
                              slot.is_available 
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                            }`}
                            title={slot.is_available ? 'Désactiver (SVJ)' : 'Activer'}
                          >
                            {slot.is_available ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteSlot(slot.id)}
                          className="px-2.5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center flex-shrink-0"
                          title="Supprimer"
                          disabled={slot.is_booked}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {(isPastDay || isSlotPast) && (
                      <div className="mt-3 text-center">
                        <span className="text-xs text-gray-500 font-medium">Créneau passé</span>
                      </div>
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
  )
}
