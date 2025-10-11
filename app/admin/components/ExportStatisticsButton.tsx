'use client'

import type { Appointment } from '../../../lib/supabase'

interface ExportStatisticsButtonProps {
  appointments: Appointment[]
}

export default function ExportStatisticsButton({ appointments }: ExportStatisticsButtonProps) {
  const exportStatistics = () => {
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
    const secondChanceCount = appointments.filter(a => a.is_second_chance).length
    const avgPerDay = totalAppointments > 0 ? (totalAppointments / 30).toFixed(1) : 0

    const stats = [
      ['Métrique', 'Valeur'],
      ['Total rendez-vous', totalAppointments.toString()],
      ['Taux de confirmation', `${confirmedRate}%`],
      ['Taux de réalisation', `${completedRate}%`],
      ['Taux d\'annulation', `${cancelledRate}%`],
      ['2ème chances', secondChanceCount.toString()],
      ['Moyenne par jour', avgPerDay.toString()],
      [''],
      ['Répartition par statut', ''],
      ['Confirmés', appointments.filter(a => a.status === 'confirmed').length.toString()],
      ['Terminés', appointments.filter(a => a.status === 'completed').length.toString()],
      ['Annulés', appointments.filter(a => a.status === 'cancelled').length.toString()]
    ]

    const csvContent = stats.map(row => row.map(cell => `"${cell}"`).join(';')).join('\n')
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    const date = new Date().toISOString().split('T')[0]
    
    link.setAttribute('href', url)
    link.setAttribute('download', `statistiques_${date}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={exportStatistics}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
      title="Exporter les statistiques"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span className="hidden sm:inline">Exporter stats</span>
      <span className="sm:hidden">Export</span>
    </button>
  )
}
