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

  // Fetch available slots
  useEffect(() => {
    fetchAvailableSlots()
  }, [currentDate, viewMode])

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true)
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd')
      const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd')

      console.log('📅 Fetching slots for:', { startDate, endDate })
      const response = await fetch(`/api/available-slots?startDate=${startDate}&endDate=${endDate}`)
      if (!response.ok) {
        throw new Error('Failed to fetch available slots')
      }

      const data = await response.json()
      console.log('📊 Slots received:', data.slots?.length || 0, 'slots')
      console.log('📋 Slots data:', data.slots)
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

  // Generate calendar days for the full month
  const generateCalendarDays = (): CalendarDay[] => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = addDays(startOfWeek(addDays(monthEnd, 6), { weekStartsOn: 1 }), 6)
    
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    
    console.log('🗓️ Generating calendar with', availableSlots.length, 'total slots')
    
    return days.map((day: Date) => {
      const daySlots = availableSlots.filter(slot => 
        isSameDay(new Date(slot.date), day)
      )
      
      if (daySlots.length > 0) {
        console.log(`📍 ${format(day, 'yyyy-MM-dd')} has ${daySlots.length} slots`)
      }
      
      return {
        date: day,
        slots: daySlots,
        isPast: isBefore(day, new Date()) && !isToday(day),
        isCurrentMonth: isSameDay(monthStart, day) || (day >= monthStart && day <= monthEnd)
      }
    })
  }

  const days = generateCalendarDays()
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  const handleSlotClick = async (date: string, time: string) => {
    const available = await isSlotAvailable(date, time)
    if (available) {
      onSlotSelect(date, time)
    }
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

      {/* Week days header - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-700 py-3 bg-gray-50 rounded-lg">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-1 md:gap-2">
        {/* Calendar days */}
        {days.map((day: CalendarDay, index: number) => (
          <div 
            key={index} 
            className={`min-h-[100px] sm:min-h-[120px] md:min-h-[140px] border rounded-lg p-1 sm:p-2 transition-all ${
              day.isCurrentMonth 
                ? 'border-gray-200 bg-white' 
                : 'border-gray-100 bg-gray-50'
            }`}
          >
            {/* Mobile: Show day name + date */}
            <div className="md:hidden text-xs text-gray-500 mb-1">
              {format(day.date, 'EEE', { locale: fr })}
            </div>
            
            <div className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
              isToday(day.date) 
                ? 'text-blue-600 font-bold' 
                : day.isPast 
                  ? 'text-gray-400' 
                  : day.isCurrentMonth
                    ? 'text-gray-900'
                    : 'text-gray-400'
            }`}>
              {format(day.date, 'd')}
            </div>
            
            {!day.isPast && day.isCurrentMonth && day.slots.length > 0 && (
              <div className="space-y-0.5 sm:space-y-1">
                {/* Mobile: Show first 2 slots */}
                <div className="md:hidden">
                  {day.slots.slice(0, 2).map((slot: AvailableSlot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot.date, slot.start_time)}
                      className={`w-full text-xs px-1 py-0.5 mb-0.5 rounded transition-colors truncate ${
                        selectedDate === slot.date && selectedTime === slot.start_time
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      {slot.start_time.slice(0, 5)}
                    </button>
                  ))}
                  {day.slots.length > 2 && (
                    <div className="text-xs text-blue-600 text-center font-medium">
                      +{day.slots.length - 2}
                    </div>
                  )}
                </div>
                
                {/* Desktop: Show all slots */}
                <div className="hidden md:block">
                  {day.slots.map((slot: AvailableSlot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot.date, slot.start_time)}
                      className={`w-full text-xs px-1 py-1 mb-1 rounded transition-colors truncate ${
                        selectedDate === slot.date && selectedTime === slot.start_time
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      {slot.start_time.slice(0, 5)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {!day.isPast && day.isCurrentMonth && day.slots.length === 0 && (
              <div className="text-xs text-gray-400 text-center mt-2 sm:mt-4">
                —
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
          <span>Disponible</span>
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
