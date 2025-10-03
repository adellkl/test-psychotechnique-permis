'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import type { Appointment } from '../../../lib/supabase'

Chart.register(...registerables)

interface StatisticsChartsProps {
  appointments: Appointment[]
}

export default function StatisticsCharts({ appointments }: StatisticsChartsProps) {
  const appointmentsByStatusRef = useRef<HTMLCanvasElement>(null)
  const appointmentsByMonthRef = useRef<HTMLCanvasElement>(null)
  const appointmentsByReasonRef = useRef<HTMLCanvasElement>(null)
  const chartInstances = useRef<Chart[]>([])

  useEffect(() => {
    // Cleanup previous charts
    chartInstances.current.forEach(chart => chart.destroy())
    chartInstances.current = []

    if (!appointmentsByStatusRef.current || !appointmentsByMonthRef.current || !appointmentsByReasonRef.current) return

    // 1. Appointments by Status
    const statusCounts = {
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      no_show: appointments.filter(a => a.status === 'no_show').length
    }

    const statusChart = new Chart(appointmentsByStatusRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Confirmés', 'Terminés', 'Annulés', 'Absents'],
        datasets: [{
          data: [statusCounts.confirmed, statusCounts.completed, statusCounts.cancelled, statusCounts.no_show],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(156, 163, 175, 0.8)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(156, 163, 175, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                const percentage = ((context.parsed / total) * 100).toFixed(1)
                return `${context.label}: ${context.parsed} (${percentage}%)`
              }
            }
          }
        }
      }
    })
    chartInstances.current.push(statusChart)

    // 2. Appointments by Month
    const monthCounts: { [key: string]: number } = {}
    appointments.forEach(apt => {
      const month = new Date(apt.appointment_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
      monthCounts[month] = (monthCounts[month] || 0) + 1
    })

    const sortedMonths = Object.keys(monthCounts).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime()
    }).slice(-6) // Last 6 months

    const monthChart = new Chart(appointmentsByMonthRef.current, {
      type: 'bar',
      data: {
        labels: sortedMonths,
        datasets: [{
          label: 'Rendez-vous',
          data: sortedMonths.map(month => monthCounts[month]),
          backgroundColor: 'rgba(147, 51, 234, 0.7)',
          borderColor: 'rgba(147, 51, 234, 1)',
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
    chartInstances.current.push(monthChart)

    // 3. Appointments by Reason
    const reasonCounts: { [key: string]: number } = {}
    appointments.forEach(apt => {
      const reason = apt.reason || 'Non spécifié'
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1
    })

    const reasonChart = new Chart(appointmentsByReasonRef.current, {
      type: 'pie',
      data: {
        labels: Object.keys(reasonCounts),
        datasets: [{
          data: Object.values(reasonCounts),
          backgroundColor: [
            'rgba(249, 115, 22, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(14, 165, 233, 0.8)',
            'rgba(34, 197, 94, 0.8)'
          ],
          borderColor: [
            'rgba(249, 115, 22, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(14, 165, 233, 1)',
            'rgba(34, 197, 94, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          }
        }
      }
    })
    chartInstances.current.push(reasonChart)

    return () => {
      chartInstances.current.forEach(chart => chart.destroy())
    }
  }, [appointments])

  const totalAppointments = appointments.length
  const confirmedRate = totalAppointments > 0 
    ? ((appointments.filter(a => a.status === 'confirmed').length / totalAppointments) * 100).toFixed(1)
    : 0
  const completedRate = totalAppointments > 0
    ? ((appointments.filter(a => a.status === 'completed').length / totalAppointments) * 100).toFixed(1)
    : 0
  const cancelledRate = totalAppointments > 0
    ? ((appointments.filter(a => a.status === 'cancelled').length / totalAppointments) * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Total RDV</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{totalAppointments}</p>
          <p className="text-xs mt-2 opacity-75">Rendez-vous enregistrés</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Taux de confirmation</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{confirmedRate}%</p>
          <p className="text-xs mt-2 opacity-75">RDV confirmés</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Taux de réalisation</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{completedRate}%</p>
          <p className="text-xs mt-2 opacity-75">RDV terminés</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Taux d'annulation</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{cancelledRate}%</p>
          <p className="text-xs mt-2 opacity-75">RDV annulés</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            Répartition par statut
          </h3>
          <div className="h-64">
            <canvas ref={appointmentsByStatusRef}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Évolution mensuelle
          </h3>
          <div className="h-64">
            <canvas ref={appointmentsByMonthRef}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            Répartition par motif
          </h3>
          <div className="h-80 flex items-center justify-center">
            <div className="w-full max-w-md h-full">
              <canvas ref={appointmentsByReasonRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
