'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Center } from '../../../lib/supabase'

interface CenterContextType {
  centers: Center[]
  selectedCenterId: string | null
  setSelectedCenterId: (id: string | null) => void
  loadingCenters: boolean
}

const CenterContext = createContext<CenterContextType | undefined>(undefined)

export function CenterProvider({ children }: { children: ReactNode }) {
  const [centers, setCenters] = useState<Center[]>([])
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null)
  const [loadingCenters, setLoadingCenters] = useState(true)

  // Charger les centres au montage
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const { data, error } = await supabase
          .from('centers')
          .select('*')
          .eq('is_active', true)
          .order('name')
        
        if (error) throw error
        setCenters(data || [])
        
        // Récupérer le centre sauvegardé ou sélectionner le premier
        const savedCenterId = localStorage.getItem('admin_selected_center_id')
        if (savedCenterId && data?.find(c => c.id === savedCenterId)) {
          setSelectedCenterId(savedCenterId)
        } else if (data && data.length > 0) {
          setSelectedCenterId(data[0].id)
        }
      } catch (error) {
        console.error('Error fetching centers:', error)
      } finally {
        setLoadingCenters(false)
      }
    }
    fetchCenters()
  }, [])

  // Sauvegarder le centre sélectionné dans localStorage
  useEffect(() => {
    if (selectedCenterId) {
      localStorage.setItem('admin_selected_center_id', selectedCenterId)
    }
  }, [selectedCenterId])

  return (
    <CenterContext.Provider value={{ centers, selectedCenterId, setSelectedCenterId, loadingCenters }}>
      {children}
    </CenterContext.Provider>
  )
}

export function useCenterContext() {
  const context = useContext(CenterContext)
  if (context === undefined) {
    throw new Error('useCenterContext must be used within a CenterProvider')
  }
  return context
}
