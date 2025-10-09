'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, isToday, isPast, startOfWeek, addDays, isBefore } from 'date-fns'
import { fr } from 'date-fns/locale'
import { supabase, AvailableSlot } from '../lib/supabase'

interface CalendarProps {
  onSlotSelect: (date: string, time: string) => void
  selectedDate?: string
  selectedTime?: string
}

interface CalendarDay {
  date: Date
  slots: AvailableSlot[]
  isPast: boolean
  isCurrentMonth: boolean
}

export default function Calendar({ onSlotSelect, selectedDate, selectedTime }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDateState, setSelectedDateState] = useState<Date | null>(null)
  const [selectedTimeState, setSelectedTimeState] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'week' | 'month'>('month')
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())

  // Fetch available slots
  useEffect(() => {
    fetchAvailableSlots()
  }, [currentDate, viewMode])

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true)
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd')
      const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd')

      const response = await fetch(`/api/available-slots?startDate=${startDate}&endDate=${endDate}`)
      if (!response.ok) {
        throw new Error('Failed to fetch available slots')
      }

      const data = await response.json()
      setAvailableSlots(data.slots || [])
    } catch (error) {
      console.error('Error fetching slots:', error)
      setAvailableSlots([])
    } finally {
      setLoading(false)
    }
  }

  // Check if slot is available and not booked
  const isSlotAvailable = async (date: string, time: string) => {
    const { data } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', date)
      .eq('appointment_time', time)
      .neq('status', 'cancelled')

    return !data || data.length === 0
  }

  // Generate calendar days - only show days with available slots
  const generateCalendarDays = (): CalendarDay[] => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    
    // Group slots by date
    const slotsByDate = new Map<string, AvailableSlot[]>()
    availableSlots.forEach(slot => {
      const dateKey = slot.date
      if (!slotsByDate.has(dateKey)) {
        slotsByDate.set(dateKey, [])
      }
      slotsByDate.get(dateKey)!.push(slot)
    })
    
    // Only create calendar days for dates with slots that are not in the past
    const days: CalendarDay[] = []
    slotsByDate.forEach((slots, dateStr) => {
      const day = new Date(dateStr)
      
      // Only include if the date is today or in the future
      if (!isBefore(day, new Date()) || isToday(day)) {
        days.push({
          date: day,
          slots: slots,
          isPast: isBefore(day, new Date()) && !isToday(day),
          isCurrentMonth: day >= monthStart && day <= monthEnd
        })
      }
    })
    
    // Sort by date
    return days.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const days = generateCalendarDays()
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  const handleSlotClick = async (date: string, time: string) => {
    const available = await isSlotAvailable(date, time)
    if (available) {
      onSlotSelect(date, time)
    }
  }

  const toggleDayExpansion = (dateStr: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev)
      if (newSet.has(dateStr)) {
        newSet.delete(dateStr)
      } else {
        newSet.add(dateStr)
      }
      return newSet
    })
  }

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          disabled={isBefore(startOfMonth(subMonths(currentDate, 1)), startOfMonth(new Date()))}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline text-sm text-gray-600">Mois précédent</span>
        </button>

        <h3 className="text-xl font-bold text-gray-900 capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: fr })}
        </h3>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="hidden sm:inline text-sm text-gray-600">Mois suivant</span>
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid - Only days with available slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {/* Available days only */}
        {days.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-2">Aucun créneau disponible ce mois-ci</p>
            <p className="text-sm text-gray-500">Essayez le mois suivant ou contactez-nous au 07 65 56 53 79</p>
          </div>
        ) : (
          days.map((day: CalendarDay, index: number) => (
            <div 
              key={index} 
              className="border-2 border-blue-200 bg-white rounded-xl p-3 sm:p-4 transition-all hover:shadow-lg hover:border-blue-400"
            >
              {/* Date header */}
              <div className="mb-3 pb-2 border-b border-gray-200">
                <div className="text-xs sm:text-sm text-gray-500 mb-0.5">
                  {format(day.date, 'EEEE', { locale: fr })}
                </div>
                <div className={`text-lg sm:text-xl font-bold ${
                  isToday(day.date) ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(day.date, 'd MMMM', { locale: fr })}
                </div>
              </div>

              {day.slots.length > 0 && (
                <div className="space-y-2 sm:space-y-2.5">
                  {/* Show first 3 slots or all if expanded */}
                  <div className="space-y-2">
                    {(expandedDays.has(format(day.date, 'yyyy-MM-dd')) ? day.slots : day.slots.slice(0, 3)).map((slot: AvailableSlot) => (
                      <div key={slot.id} className="relative">
                        <button
                          onClick={() => handleSlotClick(slot.date, slot.start_time)}
                          disabled={slot.isPending}
                          className={`w-full text-sm sm:text-base px-3 py-2.5 sm:py-2 rounded-lg transition-all font-medium ${
                            selectedDate === slot.date && selectedTime === slot.start_time
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                              : slot.isPending
                              ? 'bg-orange-50 text-orange-700 border border-orange-300 cursor-not-allowed opacity-75'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span>{slot.start_time.slice(0, 5)}</span>
                            {slot.isPending && (
                              <span className="text-xs">⏳</span>
                            )}
                          </div>
                        </button>
                        {slot.isPending && (
                          <div className="text-xs text-orange-600 text-center mt-1 font-medium">
                            Réservé - En attente
                          </div>
                        )}
                      </div>
                    ))}
                    {day.slots.length > 3 && (
                      <button
                        onClick={() => toggleDayExpansion(format(day.date, 'yyyy-MM-dd'))}
                        className="w-full text-sm text-blue-600 text-center font-semibold py-2 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 mt-1.5"
                      >
                        {expandedDays.has(format(day.date, 'yyyy-MM-dd'))
                          ? '↑ Réduire'
                          : `↓ Voir tous (${day.slots.length})`
                        }
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-50 border border-orange-300 rounded"></div>
          <span>⏳ En attente de confirmation</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span>Sélectionné</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <span>Indisponible</span>
        </div>
      </div>
    </div>
  )
}
