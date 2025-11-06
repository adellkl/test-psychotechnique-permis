'use client'

import type { Appointment } from '../../../lib/supabase'

interface ExportButtonProps {
  appointments: Appointment[]
}

export default function ExportButton({ appointments }: ExportButtonProps) {
  const exportToCSV = () => {
    const headers = [
      'Date RDV',
      'Heure',
      'Prénom',
      'Nom',
      'Email',
      'Téléphone',
      'Motif',
      'Statut',
      '2ème chance',
      'Date de création'
    ]

    const rows = appointments.map(apt => [
      apt.appointment_date,
      apt.appointment_time,
      apt.first_name,
      apt.last_name,
      apt.email,
      apt.phone,
      apt.reason,
      getStatusLabel(apt.status),
      apt.is_second_chance ? 'Oui' : 'Non',
      new Date(apt.created_at).toLocaleString('fr-FR')
    ])

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n')

    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    const date = new Date().toISOString().split('T')[0]
    
    link.setAttribute('href', url)
    link.setAttribute('download', `rendez-vous_${date}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé'
      case 'completed': return 'Terminé'
      case 'cancelled': return 'Annulé'
      default: return status
    }
  }

  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
      title="Exporter en CSV"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span className="hidden sm:inline">Exporter</span>
      <span className="sm:hidden">CSV</span>
    </button>
  )
}
