'use client'

import { useState, useEffect, useMemo } from 'react'
import { validateSlotCreation } from '../../../lib/validation'

interface AddSlotModalProps {
  isOpen: boolean
  onClose: () => void
  newSlot: { date: string; time: string }
  setNewSlot: (slot: { date: string; time: string }) => void
  onAddSingle: () => void
  onAddMultiple: () => void
  onAddBulk?: (startDate: string, endDate: string, times: string[], workdaysOnly: boolean) => void
}

const generateTimeOptions = (intervalMinutes: number): string[] => {
  const options: string[] = []
  const startHour = 8 // 8h du matin
  const endHour = 18 // 18h (6h du soir)
  const totalMinutes = (endHour - startHour) * 60

  if (intervalMinutes <= 0 || !Number.isFinite(intervalMinutes)) {
    return []
  }

  for (let minutes = 0; minutes < totalMinutes; minutes += intervalMinutes) {
    const hour = startHour + Math.floor(minutes / 60)
    const minute = minutes % 60
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    options.push(timeString)
  }

  return options
}

export default function AddSlotModal({
  isOpen,
  onClose,
  newSlot,
  setNewSlot,
  onAddSingle,
  onAddMultiple,
  onAddBulk
}: AddSlotModalProps) {
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [mode, setMode] = useState<'single' | 'bulk'>('single')
  const [bulkConfig, setBulkConfig] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    selectedTimes: [] as string[],
    workdaysOnly: true,
    intervalMinutes: 20
  })

  // Générer les options d'horaires de manière optimisée
  const timeOptions = useMemo(() =>
    generateTimeOptions(bulkConfig.intervalMinutes),
    [bulkConfig.intervalMinutes]
  )

  // Reset des erreurs quand on change de mode
  useEffect(() => {
    setErrors({})
  }, [mode])

  // Validation des données
  const validateBulkConfig = () => {
    if (!bulkConfig.startDate || !bulkConfig.endDate) {
      return 'Veuillez sélectionner les dates de début et de fin'
    }
    if (bulkConfig.selectedTimes.length === 0) {
      return 'Veuillez sélectionner au moins un horaire'
    }
    if (new Date(bulkConfig.startDate) > new Date(bulkConfig.endDate)) {
      return 'La date de début doit être avant la date de fin'
    }
    return null
  }

  const handleAddSingle = () => {
    setErrors({})
    const validation = validateSlotCreation({ date: newSlot.date, time: newSlot.time })
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    onAddSingle()
  }

  const handleAddMultiple = () => {
    setErrors({})
    const validation = validateSlotCreation({ date: newSlot.date, time: newSlot.time })
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    onAddMultiple()
  }

  const handleAddBulk = () => {
    setErrors({})
    const validationError = validateBulkConfig()
    if (validationError) {
      setErrors({ date: validationError })
      return
    }
    if (onAddBulk) {
      onAddBulk(bulkConfig.startDate, bulkConfig.endDate, bulkConfig.selectedTimes, bulkConfig.workdaysOnly)
    }
  }

  const toggleTime = (time: string) => {
    if (!time || typeof time !== 'string') return

    setBulkConfig(prev => ({
      ...prev,
      selectedTimes: prev.selectedTimes.includes(time)
        ? prev.selectedTimes.filter(t => t !== time)
        : [...prev.selectedTimes, time].sort()
    }))
  }

  const toggleAllTimes = () => {
    if (bulkConfig.selectedTimes.length === timeOptions.length) {
      // Tout désélectionner
      setBulkConfig(prev => ({ ...prev, selectedTimes: [] }))
    } else {
      // Tout sélectionner
      setBulkConfig(prev => ({ ...prev, selectedTimes: [...timeOptions] }))
    }
  }

  const calculateTotalSlots = (): number => {
    if (!bulkConfig.startDate || !bulkConfig.endDate || bulkConfig.selectedTimes.length === 0) return 0

    try {
      const start = new Date(bulkConfig.startDate)
      const end = new Date(bulkConfig.endDate)

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0

      let count = 0
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (bulkConfig.workdaysOnly && (d.getDay() === 0 || d.getDay() === 6)) continue
        count += bulkConfig.selectedTimes.length
      }

      return count
    } catch (error) {
      return 0
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-white">Nouveau créneau</h3>
              <p className="text-blue-100 text-sm mt-1">Ajoutez un ou plusieurs créneaux</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Mode Toggle */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setMode('single')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${mode === 'single' ? 'bg-white text-blue-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              Mode simple
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${mode === 'bulk' ? 'bg-white text-purple-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              Ajout en masse
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Error Messages */}
          {(errors.date || errors.time) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  {errors.date && <p className="text-sm font-medium text-red-800">{errors.date}</p>}
                  {errors.time && <p className="text-sm font-medium text-red-800">{errors.time}</p>}
                </div>
              </div>
            </div>
          )}

          {mode === 'single' ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date du créneau
                </label>
                <input
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => {
                    setNewSlot({ ...newSlot, date: e.target.value })
                    setErrors(prev => ({ ...prev, date: '' }))
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Heure de début
                </label>
                <select
                  value={newSlot.time}
                  onChange={(e) => {
                    setNewSlot({ ...newSlot, time: e.target.value })
                    setErrors(prev => ({ ...prev, time: '' }))
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.time ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">Durée automatique : 2 heures</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Options d'ajout</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Ajoutez un seul créneau ou créez le même créneau pour les 7 prochains jours ouvrables
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddSingle}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter 1 créneau
                  </div>
                </button>
                <button
                  onClick={handleAddMultiple}
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Ajouter pour 7 jours
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={bulkConfig.startDate}
                    onChange={(e) => {
                      setBulkConfig({ ...bulkConfig, startDate: e.target.value })
                      setErrors(prev => ({ ...prev, date: '' }))
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                      errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={bulkConfig.endDate}
                    onChange={(e) => {
                      setBulkConfig({ ...bulkConfig, endDate: e.target.value })
                      setErrors(prev => ({ ...prev, date: '' }))
                    }}
                    min={bulkConfig.startDate}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                      errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sélectionnez les horaires ({bulkConfig.selectedTimes.length} sélectionné{bulkConfig.selectedTimes.length > 1 ? 's' : ''})
                  </label>
                  <button
                    type="button"
                    onClick={toggleAllTimes}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                      bulkConfig.selectedTimes.length === timeOptions.length
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {bulkConfig.selectedTimes.length === timeOptions.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border-2 border-gray-200 rounded-xl">
                  {timeOptions.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => toggleTime(time)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        bulkConfig.selectedTimes.includes(time)
                          ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {errors.time && <p className="text-sm text-red-600 mt-2">{errors.time}</p>}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="workdaysOnly"
                    checked={bulkConfig.workdaysOnly}
                    onChange={(e) => setBulkConfig({ ...bulkConfig, workdaysOnly: e.target.checked })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <label htmlFor="workdaysOnly" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Jours ouvrables uniquement (Lun-Ven)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <label className="text-sm font-medium text-blue-900 cursor-pointer">
                    Intervalle entre créneaux
                  </label>
                </div>
                <select
                  value={bulkConfig.intervalMinutes}
                  onChange={(e) => setBulkConfig({ ...bulkConfig, intervalMinutes: parseInt(e.target.value) })}
                  className="px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
                >
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 heure</option>
                </select>
              </div>

              {calculateTotalSlots() > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{calculateTotalSlots()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-purple-900">Total de créneaux à créer</p>
                      <p className="text-xs text-purple-700">
                        {bulkConfig.selectedTimes.length} horaire{bulkConfig.selectedTimes.length > 1 ? 's' : ''} × plusieurs jours
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddBulk}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Créer {calculateTotalSlots()} créneaux
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
