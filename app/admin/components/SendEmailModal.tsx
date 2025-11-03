'use client'

import { useState } from 'react'
import type { Appointment } from '../../../lib/supabase'

interface SendEmailModalProps {
  appointment: Appointment
  onClose: () => void
  onSend: (emailData: {
    appointmentId: string
    emailType: string
    customMessage?: string
    cancelReason?: string
  }) => Promise<void>
}

export default function SendEmailModal({ appointment, onClose, onSend }: SendEmailModalProps) {
  const [emailType, setEmailType] = useState<'cancellation' | 'custom'>('cancellation')
  const [cancelReason, setCancelReason] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    setError('')
    
    // Validation
    if (emailType === 'cancellation' && !cancelReason.trim()) {
      setError('Veuillez saisir une raison d\'annulation')
      return
    }
    
    if (emailType === 'custom' && (!customSubject.trim() || !customMessage.trim())) {
      setError('Veuillez remplir le sujet et le message')
      return
    }

    setIsSending(true)
    
    try {
      await onSend({
        appointmentId: appointment.id,
        emailType,
        customMessage: emailType === 'custom' ? customMessage : undefined,
        cancelReason: emailType === 'cancellation' ? cancelReason : undefined
      })
      
      onClose()
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'email')
      console.error(err)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 border-b border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Envoyer un email</h3>
                <p className="text-sm text-blue-100">
                  {appointment.first_name} {appointment.last_name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Informations du client */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {appointment.first_name[0]}{appointment.last_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">
                  {appointment.first_name} {appointment.last_name}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  📧 {appointment.email}
                </p>
                <p className="text-xs text-gray-600">
                  📅 {new Date(appointment.appointment_date).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })} à {appointment.appointment_time.slice(0, 5)}
                </p>
              </div>
            </div>
          </div>

          {/* Type d'email */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Type d'email
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setEmailType('cancellation')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  emailType === 'cancellation'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    emailType === 'cancellation' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-5 h-5 ${emailType === 'cancellation' ? 'text-red-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${emailType === 'cancellation' ? 'text-red-900' : 'text-gray-900'}`}>
                      Annulation
                    </p>
                    <p className="text-xs text-gray-600">
                      Annuler le RDV
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setEmailType('custom')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  emailType === 'custom'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    emailType === 'custom' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-5 h-5 ${emailType === 'custom' ? 'text-blue-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${emailType === 'custom' ? 'text-blue-900' : 'text-gray-900'}`}>
                      Message personnalisé
                    </p>
                    <p className="text-xs text-gray-600">
                      Autre raison
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Formulaire d'annulation */}
          {emailType === 'cancellation' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Raison de l'annulation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Ex: Indisponibilité du psychologue, problème technique..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note :</strong> Le rendez-vous sera automatiquement marqué comme "Annulé" après l'envoi de l'email.
                </p>
              </div>
            </div>
          )}

          {/* Formulaire message personnalisé */}
          {emailType === 'custom' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sujet de l'email *
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Ex: Information importante concernant votre rendez-vous"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Saisissez votre message ici..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={isSending}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${
                emailType === 'cancellation'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSending ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Envoyer l'email
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
