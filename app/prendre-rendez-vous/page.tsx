'use client'

import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Calendar from '../../components/Calendar'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import FAQ from '../components/FAQ'
import { validateAppointmentForm, sanitizeFormData, checkRateLimit } from '../../lib/validation'

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
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const continueButtonRef = useRef<HTMLButtonElement>(null)
  const personalInfoRef = useRef<HTMLDivElement>(null)

  // Scroll automatique désactivé - l'utilisateur scroll manuellement

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(' Form submitted')
    setErrors({})

    // Rate limiting check (5 attempts per minute)
    if (!checkRateLimit('appointment_submit', 5, 60000)) {
      console.error(' Rate limit exceeded')
      setErrors({ general: 'Trop de tentatives. Veuillez patienter une minute.' })
      return
    }

    // Validate form data
    console.log(' Validating form data:', { formData, selectedDate, selectedTime })
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

    console.log(' Validation result:', validation)

    if (!validation.isValid) {
      console.error(' Validation failed:', validation.errors)
      setErrors(validation.errors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    console.log(' Validation passed, creating appointment...')

    setLoading(true)

    try {
      // Sanitize all inputs
      const sanitizedData = sanitizeFormData(formData)
      // Create appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            first_name: sanitizedData.firstName,
            last_name: sanitizedData.lastName,
            email: sanitizedData.email.toLowerCase(),
            phone: sanitizedData.phone.replace(/\s/g, ''),
            appointment_date: selectedDate,
            appointment_time: selectedTime,
            reason: sanitizedData.reason,
            client_notes: sanitizedData.notes,
            status: 'confirmed'
          }
        ])
        .select()

      if (error) throw error

      // Immediately show success and move to confirmation step
      setSuccess(true)
      setStep(3)
      scrollToTop()

      // Send confirmation emails in background (non-blocking)
      fetch('/api/send-appointment-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: sanitizedData.firstName,
          last_name: sanitizedData.lastName,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          reason: sanitizedData.reason
        }),
      }).then(async (emailResponse) => {
        if (!emailResponse.ok) {
          console.warn('Email sending failed, but appointment was created')
          const errorData = await emailResponse.json()
          console.error('Email error details:', errorData)
        } else {
          const emailResult = await emailResponse.json()
          console.log(' Emails sent successfully:', emailResult)
        }
      }).catch((emailError) => {
        console.warn('Email sending error:', emailError)
        // Continue anyway - appointment is created
      })
    } catch (error: any) {
      console.error(' Appointment creation error:', error)
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6" aria-label="Fil d'Ariane">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Accueil
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-blue-600">Prendre Rendez-vous</span>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Réservation Test Psychotechnique Permis
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              Prenez rendez-vous pour votre test psychotechnique dans notre centre agréé à Clichy. Réservation en ligne rapide et sécurisée.
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre créneau de rendez-vous</h2>
                    <p className="text-gray-600">Sélectionnez la date et l'heure de votre test psychotechnique à Clichy. Disponibilités en temps réel.</p>
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
                      ref={continueButtonRef}
                      onClick={() => {
                        setStep(2)
                        // Scroll doux vers la section infos personnelles
                        setTimeout(() => {
                          if (personalInfoRef.current) {
                            const elementPosition = personalInfoRef.current.getBoundingClientRect().top + window.pageYOffset
                            const offsetPosition = elementPosition - 100
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: 'smooth'
                            })
                          }
                        }, 100)
                      }}
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
                <div ref={personalInfoRef} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Vos informations personnelles</h2>
                    <p className="text-sm text-gray-600">Complétez vos coordonnées pour finaliser votre réservation de test psychotechnique</p>
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
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-red-800">{errors.general}</p>
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
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm ${errors.reason ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none text-sm ${errors.notes ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        placeholder="Informations complémentaires, questions particulières..."
                      />
                      {errors.notes && (
                        <p className="text-xs text-red-600 mt-1">{errors.notes}</p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1)
                          scrollToTop()
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
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
                    Test Psychotechnique Réservé avec Succès
                  </h2>

                  <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
                    Votre rendez-vous pour le test psychotechnique du permis a été confirmé pour le <span className="font-semibold text-gray-900">{formatSelectedDateTime()}</span> dans notre centre agréé à Clichy.
                  </p>

                  <div className="space-y-6">
                    {/* Email confirmation status */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">Email de confirmation envoyé</p>
                          <p className="text-sm text-green-600">Vérifiez votre boîte de réception</p>
                        </div>
                      </div>
                    </div>

                    {/* Important information - Mobile responsive */}
                    <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
                      <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Informations importantes
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 sm:gap-3 p-3 bg-white rounded-lg">
                          <div className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm sm:text-base text-blue-800">Arrivée 10 minutes avant votre rendez-vous</span>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3 p-3 bg-white rounded-lg">
                          <div className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm sm:text-base text-blue-800">Pièce d'identité obligatoire (carte d'identité ou passeport)</span>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3 p-3 bg-white rounded-lg">
                          <div className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm sm:text-base text-blue-800">Durée : environ 2 heures (tests + entretien)</span>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3 p-3 bg-white rounded-lg">
                          <div className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm sm:text-base text-blue-800">Paiement sur place (aucun acompte requis)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mt-8">
                    <button
                      onClick={() => window.location.href = '/'}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-24">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Progression</h3>

                {/* Mobile: Horizontal Progress */}
                <div className="flex lg:hidden justify-between items-center">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${
                      step >= 1 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className={`mt-1.5 text-xs sm:text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                      Créneau
                    </span>
                  </div>

                  {/* Connector 1 */}
                  <div className={`flex-1 h-1 mx-2 sm:mx-3 rounded transition-all duration-300 ${
                    step >= 2 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-200'
                  }`}></div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${
                      step >= 2 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className={`mt-1.5 text-xs sm:text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                      Infos
                    </span>
                  </div>

                  {/* Connector 2 */}
                  <div className={`flex-1 h-1 mx-2 sm:mx-3 rounded transition-all duration-300 ${
                    step >= 3 ? 'bg-gradient-to-r from-blue-500 to-emerald-500' : 'bg-gray-200'
                  }`}></div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${
                      step >= 3 ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={`mt-1.5 text-xs sm:text-sm font-medium ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
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




      <FAQ />
    </>
  )
}
