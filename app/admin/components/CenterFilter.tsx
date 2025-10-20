'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Center } from '../../../lib/supabase'

interface CenterFilterProps {
  selectedCenterId: string | null
  onCenterChange: (centerId: string | null) => void
}

export default function CenterFilter({ selectedCenterId, onCenterChange }: CenterFilterProps) {
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCenters()
  }, [])

  const fetchCenters = async () => {
    try {
      const { data, error } = await supabase
        .from('centers')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setCenters(data || [])
    } catch (error) {
      console.error('Error fetching centers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 h-10 rounded-lg w-48"></div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Centre :
      </label>
      <select
        value={selectedCenterId || 'all'}
        onChange={(e) => onCenterChange(e.target.value === 'all' ? null : e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
      >
        <option value="all">Tous les centres</option>
        {centers.map((center) => (
          <option key={center.id} value={center.id}>
            {center.name}
          </option>
        ))}
      </select>
      
      {selectedCenterId && (
        <button
          onClick={() => onCenterChange(null)}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          title="Réinitialiser le filtre"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
