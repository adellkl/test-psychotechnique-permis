'use client'

import { useState, useEffect, useCallback } from 'react'

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void
  onReset: () => void
}

export interface SearchFilters {
  searchTerm: string
  searchField: 'all' | 'name' | 'email' | 'phone' | 'date'
  dateFrom?: string
  dateTo?: string
}

export default function SearchBar({ onSearch, onReset }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState<SearchFilters['searchField']>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  // Recherche en temps réel avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({
        searchTerm: searchTerm.trim(),
        searchField,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined
      })
    }, 300) // Debounce de 300ms

    return () => clearTimeout(timer)
  }, [searchTerm, searchField, dateFrom, dateTo, onSearch])

  const handleSearch = () => {
    onSearch({
      searchTerm: searchTerm.trim(),
      searchField,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined
    })
  }

  const handleReset = () => {
    setSearchTerm('')
    setSearchField('all')
    setDateFrom('')
    setDateTo('')
    onReset()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2 text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="font-semibold">Recherche avancée</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          {isExpanded ? 'Réduire' : 'Options avancées'}
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Recherche rapide */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Input de recherche - pleine largeur sur mobile */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Rechercher par nom, email, téléphone..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Ligne avec select et boutons - responsive */}
        <div className="flex gap-2">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as SearchFilters['searchField'])}
            className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
          >
            <option value="all">Tous</option>
            <option value="name">Nom</option>
            <option value="email">Email</option>
            <option value="phone">Tél</option>
            <option value="date">Date</option>
          </select>

          <button
            onClick={handleSearch}
            className="hidden sm:flex px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium items-center justify-center"
          >
            Rechercher
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap"
          >
            <span className="hidden sm:inline">Réinitialiser</span>
            <span className="sm:hidden">Reset</span>
          </button>
        </div>
      </div>

      {/* Options avancées */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            💡 <strong>Astuce :</strong> Laissez le champ de recherche vide et utilisez les dates pour filtrer par période
          </div>
        </div>
      )}
    </div>
  )
}
