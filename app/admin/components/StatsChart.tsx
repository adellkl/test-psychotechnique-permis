'use client'

import { useState, useEffect } from 'react'

interface DailyStat {
  date: string
  appointments: number
  confirmed: number
  completed: number
  cancelled: number
}

interface Stats {
  appointments: {
    total: number
    confirmed: number
    completed: number
    cancelled: number
    noShow: number
    completionRate: number
  }
  slots: {
    total: number
    available: number
    booked: number
    utilizationRate: number
  }
  dailyStats: DailyStat[]
  recentAppointments: any[]
}

export default function StatsChart() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/stats?period=${period}`)
      if (!response.ok) throw new Error('Failed to fetch stats')

      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <p className="text-gray-500">Impossible de charger les statistiques</p>
      </div>
    )
  }

  const maxAppointments = Math.max(...stats.dailyStats.map(d => d.appointments), 1)

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total RDV</p>
              <p className="text-2xl font-bold text-gray-900">{stats.appointments.total}</p>
              <p className="text-xs text-gray-500 mt-1">
                Taux de réussite: {stats.appointments.completionRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmés</p>
              <p className="text-2xl font-bold text-green-600">{stats.appointments.confirmed}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.appointments.total > 0 ? Math.round((stats.appointments.confirmed / stats.appointments.total) * 100) : 0}% du total
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Créneaux disponibles</p>
              <p className="text-2xl font-bold text-blue-600">{stats.slots.available}</p>
              <p className="text-xs text-gray-500 mt-1">
                Sur {stats.slots.total} créneaux
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux d'occupation</p>
              <p className="text-2xl font-bold text-purple-600">{stats.slots.utilizationRate}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.slots.booked} créneaux réservés
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
