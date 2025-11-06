'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Calendar from '../../components/Calendar'
import { supabase } from '../../lib/supabase'
import { validateAppointmentForm, sanitizeFormData, checkRateLimit } from '../../lib/validation'
import HoneypotField from '../components/HoneypotField'

export default function RendezVous() {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    notes: ''
  })
  const [honeypot, setHoneypot] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [existingAppointment, setExistingAppointment] = useState<{
    date: string
    time: string
    status: string
  } | null>(null)
  const [checkingExisting, setCheckingExisting] = useState(false)

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Format automatique du téléphone
    if (name === 'phone') {
      let cleaned = value.replace(/[^0-9+]/g, '')
      
      if (cleaned.startsWith('+33')) {
        cleaned = cleaned.substring(3)
        const formatted = cleaned.match(/.{1,2}/g)?.join(' ') || cleaned
        setFormData({
          ...formData,
          [name]: '+33 ' + formatted
        })
      } else if (cleaned.startsWith('0')) {
        const formatted = cleaned.match(/.{1,2}/g)?.join(' ') || cleaned
        setFormData({
          ...formData,
          [name]: formatted
        })
      } else {
        setFormData({
          ...formData,
          [name]: value
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }

    // Vérifier les rendez-vous existants quand nom ET prénom sont remplis
    if (name === 'firstName' || name === 'lastName') {
      const firstName = name === 'firstName' ? value : formData.firstName
      const lastName = name === 'lastName' ? value : formData.lastName
      
      if (firstName.length >= 2 && lastName.length >= 2) {
        checkExistingAppointment(firstName, lastName)
      } else {
        setExistingAppointment(null)
      }
    }
  }

  const checkExistingAppointment = async (firstName: string, lastName: string) => {
    setCheckingExisting(true)
    try {
      const response = await fetch(
        `/api/appointments/check-existing?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`
      )
      const data = await response.json()
      
      if (data.hasExisting) {
        setExistingAppointment(data.appointment)
      } else {
        setExistingAppointment(null)
      }
    } catch (error) {
      console.error('Erreur vérification rendez-vous:', error)
      setExistingAppointment(null)
    } finally {
      setCheckingExisting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Bloquer si un rendez-vous existant est détecté
    if (existingAppointment) {
      setErrors({ 
        general: `Vous avez déjà un rendez-vous prévu le ${existingAppointment.date} à ${existingAppointment.time}. Veuillez l'annuler avant d'en prendre un nouveau.` 
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // 🍯 Honeypot: Si rempli, c'est un bot
    if (honeypot && honeypot.trim() !== '') {
      console.warn('🤖 Bot détecté via honeypot:', honeypot)
      setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' })
      return
    }

    // Rate limiting
    if (!checkRateLimit('appointment_submit', 5, 60000)) {
      setErrors({ general: 'Trop de tentatives. Veuillez patienter une minute.' })
      return
    }

    // Validation
    const validation = validateAppointmentForm({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      reason: formData.reason,
      notes: formData.notes,
      date: selectedDate,
      time: selectedTime
    })

    if (!validation.isValid) {
      setErrors(validation.errors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setLoading(true)

    try {
      // Utiliser l'API sécurisée au lieu de l'insertion directe Supabase
      const response = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          reason: formData.reason,
          notes: formData.notes,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          honeypot: honeypot // Champ piège pour détecter les bots
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création du rendez-vous')
      }

      const appointment = result.appointment

      // Send confirmation emails automatically
      try {
        const emailResponse = await fetch('/api/send-appointment-emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            appointment_date: selectedDate,
            appointment_time: selectedTime,
            reason: formData.reason,
            appointment_id: appointment?.id,
            created_at: appointment?.created_at
          }),
        })

        if (!emailResponse.ok) {
          console.warn('Email sending failed, but appointment was created')
        }
      } catch (emailError) {
        console.warn('Email sending error:', emailError)
      }

      setSuccess(true)
      setStep(3)
    } catch (error: any) {
      console.error('Error creating appointment:', error)
      const errorMessage = error?.message || 'Une erreur est survenue. Veuillez réessayer.'
      setErrors({ general: errorMessage })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  const formatSelectedDateTime = () => {
    if (!selectedDate || !selectedTime) return ''
    const date = new Date(selectedDate)
    return `${format(date, 'EEEE d MMMM yyyy', { locale: fr })} à ${selectedTime.slice(0, 5)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-32">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Prendre Rendez-vous
          </h1>
          <p className="text-gray-600">
            Réservez votre test psychotechnique en quelques clics. Simple, rapide et sécurisé.
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Left Panel - Content */}
          <div className="flex-1 order-2 lg:order-1">
            {/* Step 1: Calendar Selection */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre créneau</h2>
                  <p className="text-gray-600">Sélectionnez la date et l'heure qui vous conviennent</p>
                </div>

                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-800">Durée : 2h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-800">Arrivée 10min avant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-800">Pièce d'identité requise</span>
                    </div>
                  </div>
                </div>

                <Calendar
                  onSlotSelect={handleSlotSelect}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                />

                {selectedDate && selectedTime && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="font-bold text-emerald-900">Créneau sélectionné</p>
                        <p className="text-emerald-700 text-sm">{formatSelectedDateTime()}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Continuer
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Vos informations</h2>
                  <p className="text-sm text-gray-600">Complétez vos coordonnées pour finaliser la réservation</p>
                </div>

                {/* Selected slot reminder */}
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="font-bold text-emerald-900">Rendez-vous sélectionné</p>
                      <p className="text-emerald-700 text-sm">{formatSelectedDateTime()}</p>
                    </div>
                  </div>
                </div>

                {/* Error Messages */}
                {errors.general && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-red-800">{errors.general}</p>
                    </div>
                  </div>
                )}

                {/* Existing Appointment Warning */}
                {existingAppointment && (
                  <div className="mb-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-orange-900 mb-1">
                          ⚠️ Rendez-vous existant détecté
                        </h3>
                        <p className="text-sm text-orange-800 mb-2">
                          Vous avez déjà un rendez-vous prévu le <strong>{existingAppointment.date}</strong> à <strong>{existingAppointment.time}</strong>.
                        </p>
                        <p className="text-sm text-orange-800 mb-3">
                          Veuillez annuler ce rendez-vous avant d'en prendre un nouveau. Vous avez reçu un email de confirmation avec un bouton d'annulation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <a 
                            href="tel:0765565379" 
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Appeler le 07 65 56 53 79
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm ${
                          errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Votre prénom"
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Nom *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm ${
                          errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Votre nom"
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm ${
                          errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="06 12 34 56 78"
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                      Motif du test *
                    </label>
                    <select
                      id="reason"
                      name="reason"
                      required
                      value={formData.reason}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm ${
                        errors.reason ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionnez un motif</option>
                      <option value="invalidation">Invalidation du permis</option>
                      <option value="suspension">Suspension du permis</option>
                      <option value="annulation">Annulation du permis</option>
                    </select>
                    {errors.reason && (
                      <p className="text-xs text-red-600 mt-1">{errors.reason}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes ou questions (optionnel)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none text-sm ${
                        errors.notes ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Informations complémentaires, questions particulières..."
                    />
                    {errors.notes && (
                      <p className="text-xs text-red-600 mt-1">{errors.notes}</p>
                    )}
                  </div>

                  {/* 🍯 Honeypot - Champ invisible pour détecter les bots */}
                  <HoneypotField 
                    name="website"
                    value={honeypot}
                    onChange={setHoneypot}
                  />

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Retour
                    </button>

                    <button
                      type="submit"
                      disabled={loading || !!existingAppointment}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      )}
                      {loading ? 'Confirmation...' : 'Confirmer le rendez-vous'}
                      {!loading && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && success && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  Rendez-vous confirmé !
                </h2>

                <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
                  Votre rendez-vous a été confirmé pour le <span className="font-semibold text-gray-900">{formatSelectedDateTime()}</span>.
                </p>

                <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">Informations importantes</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-800 text-sm">Email de confirmation envoyé</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-800 text-sm">Arrivée 10 minutes avant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-800 text-sm">Pièce d'identité obligatoire</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-800 text-sm">Durée : environ 2 heures</span>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2 justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-800 text-sm">Paiement sur place (aucun acompte requis)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Retour à l'accueil
                  </button>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 mb-1 font-medium text-sm">
                      Besoin de modifier votre rendez-vous ?
                    </p>
                    <p className="text-gray-600 text-sm">
                      Contactez-nous au{' '}
                      <a href="tel:0765565379" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                        07 65 56 53 79
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Progress Bar */}
          <div className="w-full lg:w-80 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 lg:sticky lg:top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Progression</h3>

              {/* Mobile: Horizontal Progress */}
              <div className="flex lg:hidden justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                    Créneau
                  </span>
                </div>
                <div className={`flex-1 h-1 mx-4 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                    Infos
                  </span>
                </div>
                <div className={`flex-1 h-1 mx-4 rounded ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                    Confirmé
                  </span>
                </div>
              </div>

              {/* Desktop: Vertical Progress */}
              <div className="hidden lg:block">
                {/* Step 1 */}
                <div className="flex items-center mb-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${step >= 1
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-400'
                    }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className={`font-semibold ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                      Choisir un créneau
                    </p>
                    <p className="text-sm text-gray-500">Sélectionnez votre date</p>
                  </div>
                </div>

                {/* Connector */}
                <div className={`w-0.5 h-8 ml-5 mb-6 transition-all duration-500 ${step >= 2 ? 'bg-gradient-to-b from-blue-500 to-blue-600' : 'bg-gray-200'
                  }`}></div>

                {/* Step 2 */}
                <div className="flex items-center mb-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${step >= 2
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-400'
                    }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className={`font-semibold ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                      Vos informations
                    </p>
                    <p className="text-sm text-gray-500">Coordonnées personnelles</p>
                  </div>
                </div>

                {/* Connector */}
                <div className={`w-0.5 h-8 ml-5 mb-6 transition-all duration-500 ${step >= 3 ? 'bg-gradient-to-b from-green-500 to-emerald-500' : 'bg-gray-200'
                  }`}></div>

                {/* Step 3 */}
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${step >= 3
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-400'
                    }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className={`font-semibold ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                      Confirmation
                    </p>
                    <p className="text-sm text-gray-500">Rendez-vous confirmé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
