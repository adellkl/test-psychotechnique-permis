'use client'

import { useState } from 'react'
import { validateSlotCreation } from '../../../lib/validation'

interface AddSlotModalProps {
  isOpen: boolean
  onClose: () => void
  newSlot: { date: string; time: string }
  setNewSlot: (slot: { date: string; time: string }) => void
  onAddSingle: () => void
  onAddMultiple: () => void
  timeOptions: string[]
}

export default function AddSlotModal({
  isOpen,
  onClose,
  newSlot,
  setNewSlot,
  onAddSingle,
  onAddMultiple,
  timeOptions
}: AddSlotModalProps) {
  const [errors, setErrors] = useState<{[key: string]: string}>({})

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
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
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

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900">Options d'ajout</p>
                <p className="text-xs text-blue-700 mt-1">
                  Vous pouvez ajouter un seul créneau ou créer le même créneau pour les 7 prochains jours (jours ouvrables uniquement)
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
        </div>
      </div>
    </div>
  )
}
