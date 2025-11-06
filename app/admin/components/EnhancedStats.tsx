'use client'

import { useMemo } from 'react'
import type { Appointment } from '../../../lib/supabase'

interface EnhancedStatsProps {
  appointments: Appointment[]
}

export default function EnhancedStats({ appointments }: EnhancedStatsProps) {
  const stats = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeekStart = new Date(today)
    thisWeekStart.setDate(today.getDate() - today.getDay())
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const confirmed = appointments.filter(a => a.status === 'confirmed')
    const completed = appointments.filter(a => a.status === 'completed')
    const cancelled = appointments.filter(a => a.status === 'cancelled')

    const todayAppointments = appointments.filter(a => {
      const aptDate = new Date(a.appointment_date)
      return aptDate >= today && aptDate < new Date(today.getTime() + 86400000)
    })

    const thisWeekAppointments = appointments.filter(a => {
      const aptDate = new Date(a.appointment_date)
      return aptDate >= thisWeekStart
    })

    const thisMonthAppointments = appointments.filter(a => {
      const aptDate = new Date(a.created_at)
      return aptDate >= thisMonthStart
    })

    const lastMonthAppointments = appointments.filter(a => {
      const aptDate = new Date(a.created_at)
      return aptDate >= lastMonthStart && aptDate <= lastMonthEnd
    })

    const monthGrowth = lastMonthAppointments.length > 0
      ? ((thisMonthAppointments.length - lastMonthAppointments.length) / lastMonthAppointments.length) * 100
      : 0

    const completionRate = appointments.length > 0
      ? (completed.length / appointments.length) * 100
      : 0

    const cancellationRate = appointments.length > 0
      ? (cancelled.length / appointments.length) * 100
      : 0

    return {
      total: appointments.length,
      confirmed: confirmed.length,
      completed: completed.length,
      cancelled: cancelled.length,
      today: todayAppointments.length,
      thisWeek: thisWeekAppointments.length,
      thisMonth: thisMonthAppointments.length,
      lastMonth: lastMonthAppointments.length,
      monthGrowth,
      completionRate,
      cancellationRate
    }
  }, [appointments])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Total</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-white/80">Ce mois:</span>
            <span className="font-semibold">{stats.thisMonth}</span>
          </div>
          {stats.monthGrowth !== 0 && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${stats.monthGrowth > 0 ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
              <svg className={`w-4 h-4 ${stats.monthGrowth > 0 ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="font-semibold">{Math.abs(stats.monthGrowth).toFixed(0)}%</span>
            </div>
          )}
        </div>
      </div>


      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Confirmés</p>
            <p className="text-3xl font-bold">{stats.confirmed}</p>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-white/80">Aujourd'hui:</span>
            <span className="font-semibold">{stats.today}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">Cette semaine:</span>
            <span className="font-semibold">{stats.thisWeek}</span>
          </div>
        </div>
      </div>


      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Terminés</p>
            <p className="text-3xl font-bold">{stats.completed}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/80">Taux de complétion:</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <span className="font-semibold">{stats.completionRate.toFixed(0)}%</span>
          </div>
        </div>
      </div>


      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Annulés</p>
            <p className="text-3xl font-bold">{stats.cancelled}</p>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-white/80">Taux d'annulation:</span>
            <span className="font-semibold">{stats.cancellationRate.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
