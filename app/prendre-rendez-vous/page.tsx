'use client'

import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Calendar from '../../components/Calendar'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import FAQ from '../components/FAQ'
import { validateAppointmentForm, sanitizeFormData, checkRateLimit } from '../../lib/validation'
import HoneypotField from '../components/HoneypotField'

interface Center {
  id: string
  name: string
  address: string
  city: string
  postal_code: string
  phone: string
  email: string
}

export default function RendezVous() {
  const [step, setStep] = useState(0) // 0 = sélection centre, 1 = calendrier, 2 = infos, 3 = confirmation
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null)
  const [centers, setCenters] = useState<Center[]>([])
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
  const [honeypot, setHoneypot] = useState('') // 🍯 Champ piège pour détecter les bots
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const continueButtonRef = useRef<HTMLButtonElement>(null)
  const personalInfoRef = useRef<HTMLDivElement>(null)

  // Charger les centres au montage du composant
  useEffect(() => {
    const fetchCenters = async () => {
      const { data, error } = await supabase
        .from('centers')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (data && !error) {
        setCenters(data)
      }
    }
    fetchCenters()
  }, [])

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Format automatique du téléphone
    if (name === 'phone') {
      // Supprimer tous les caractères non numériques sauf le +
      let cleaned = value.replace(/[^0-9+]/g, '')
      
      // Formater avec des espaces tous les 2 chiffres
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(' Form submitted')
    setErrors({})

    // 🍯 Honeypot: Si rempli, c'est un bot
    if (honeypot && honeypot.trim() !== '') {
      console.warn('🤖 Bot détecté via honeypot:', honeypot)
      setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' })
      return
    }

    if (!checkRateLimit('appointment_submit', 5, 60000)) {
      console.error(' Rate limit exceeded')
      setErrors({ general: 'Trop de tentatives. Veuillez patienter une minute.' })
      return
    }

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
          center_id: selectedCenter?.id,
          honeypot: honeypot
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création du rendez-vous')
      }

      const appointment = result.appointment

      setSuccess(true)
      setStep(3)

      fetch('/api/send-appointment-emails', {
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
          created_at: appointment?.created_at,
          center_name: selectedCenter?.name,
          center_address: selectedCenter?.address,
          center_city: selectedCenter?.city,
          center_postal_code: selectedCenter?.postal_code
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

  const handleCenterSelect = (center: Center) => {
    setSelectedCenter(center)
    setStep(1)
    scrollToTop()
  }

  const formatSelectedDateTime = () => {
    if (!selectedDate || !selectedTime) return ''
    const date = new Date(selectedDate)
    return `${format(date, 'EEEE d MMMM yyyy', { locale: fr })} à ${selectedTime.slice(0, 5)}`
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-32">
        <div className="container mx-auto px-4 py-6">
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
              Prenez rendez-vous pour votre test psychotechnique dans l'un de nos centres agréés. Réservation en ligne rapide et sécurisée.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            <div className="flex-1 order-2 lg:order-1">
              {step === 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre centre</h2>
                    <p className="text-gray-600">Sélectionnez le centre le plus proche de chez vous pour votre test psychotechnique.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {centers.map((center) => (
                      <button
                        key={center.id}
                        onClick={() => {
                          setSelectedCenter(center)
                          setStep(1)
                        }}
                        className="text-left p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{center.name}</h3>
                            <p className="text-sm text-gray-600 mb-1">{center.address}</p>
                            <p className="text-sm text-gray-600 mb-2">{center.postal_code} {center.city}</p>
                            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {center.phone}
                            </div>
                          </div>
                          <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-blue-900 text-sm sm:text-base truncate">{selectedCenter?.name}</p>
                          <p className="text-xs sm:text-sm text-blue-700 break-words">{selectedCenter?.address}, {selectedCenter?.city}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setStep(0)
                          setSelectedDate('')
                          setSelectedTime('')
                        }}
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 whitespace-nowrap self-end sm:self-auto"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Changer
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre créneau de rendez-vous</h2>
                    <p className="text-gray-600">Sélectionnez la date et l'heure de votre test psychotechnique. Disponibilités en temps réel.</p>
                  </div>

                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-800">Durée : 40 minutes</span>
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
                    centerId={selectedCenter?.id}
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
                        requestAnimationFrame(() => {
                          if (personalInfoRef.current) {
                            const elementPosition = personalInfoRef.current.getBoundingClientRect().top + window.pageYOffset
                            const offsetPosition = elementPosition - 100
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: 'smooth'
                            })
                          }
                        })
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

              {step === 2 && (
                <div ref={personalInfoRef} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Vos informations personnelles</h2>
                    <p className="text-sm text-gray-600">Complétez vos coordonnées pour finaliser votre réservation de test psychotechnique</p>
                  </div>

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

                    <HoneypotField 
                      name="website"
                      value={honeypot}
                      onChange={setHoneypot}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1)
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

              {step === 3 && success && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="relative mb-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-6 sm:mb-8 text-center px-4">
                    ✅ Rendez-vous Confirmé
                  </h2>

                  <div className="space-y-4 sm:space-y-5 max-w-2xl mx-auto px-4 sm:px-0">
                    <div className="bg-green-50 rounded-lg sm:rounded-xl p-4 sm:p-4 border-2 border-green-300 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-green-900 text-base sm:text-lg break-words">Email de confirmation envoyé</p>
                          <p className="text-xs sm:text-sm text-green-700 mt-0.5">Vérifiez votre boîte de réception</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg sm:rounded-xl p-4 sm:p-4 border-2 border-orange-300 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-5 h-5 sm:w-5 sm:h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-orange-900 text-base sm:text-lg mb-1.5 break-words">⚠️ Impossible de venir ?</p>
                          <p className="text-xs sm:text-sm text-orange-800 leading-relaxed break-words">
                            Si vous ne pouvez pas être présent(e) à votre rendez-vous, merci de <strong>contacter le centre au plus vite</strong> pour annuler. Cela permettra de libérer le créneau pour d'autres candidats. Merci de votre compréhension.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8 px-4 sm:px-0 max-w-2xl mx-auto">
                    <button
                      onClick={() => window.location.href = '/'}
                      className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Retour à l'accueil
                    </button>

                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                      <p className="text-gray-700 mb-1 font-medium text-xs sm:text-sm">
                        Besoin de modifier votre rendez-vous ?
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Contactez-nous au{' '}
                        <a href="tel:0765565379" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors whitespace-nowrap">
                          07 65 56 53 79
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-80 order-1 lg:order-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-24">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Progression</h3>

                <div className="flex lg:hidden justify-between items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${step >= 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className={`mt-1.5 text-xs sm:text-sm font-medium ${step >= 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                      Centre
                    </span>
                  </div>

                  {/* Connector 0 */}
                  <div className="relative flex-1 h-1 mx-2 sm:mx-3">
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded transition-all duration-700 ease-in-out origin-left ${step >= 1 ? 'scale-x-100' : 'scale-x-0'}`}></div>
                  </div>

                  {/* Step 1 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${step >= 1 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className={`mt-1.5 text-xs sm:text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                      Créneau
                    </span>
                  </div>

                  {/* Connector 1 */}
                  <div className="relative flex-1 h-1 mx-2 sm:mx-3">
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded transition-all duration-700 ease-in-out origin-left ${step >= 2 ? 'scale-x-100' : 'scale-x-0'}`}></div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${step >= 2 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'bg-gray-200 text-gray-400'
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
                  <div className="relative flex-1 h-1 mx-2 sm:mx-3">
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded transition-all duration-700 ease-in-out origin-left ${step >= 3 ? 'scale-x-100' : 'scale-x-0'}`}></div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${step >= 3 ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
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
                  {/* Step 0: Centre */}
                  <div className="flex items-center mb-6">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${step >= 0
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-400'
                      }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className={`font-semibold ${step >= 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                        Choisir un centre
                      </p>
                      <p className="text-sm text-gray-500">Clichy ou Colombes</p>
                    </div>
                  </div>

                  {/* Connector 0 */}
                  <div className="relative w-0.5 h-8 ml-5 mb-6">
                    <div className="absolute inset-0 bg-gray-200"></div>
                    <div className={`absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600 transition-all duration-700 ease-in-out origin-top ${step >= 1 ? 'scale-y-100' : 'scale-y-0'}`}></div>
                  </div>

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

                  {/* Connector 1 */}
                  <div className="relative w-0.5 h-8 ml-5 mb-6">
                    <div className="absolute inset-0 bg-gray-200"></div>
                    <div className={`absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600 transition-all duration-700 ease-in-out origin-top ${step >= 2 ? 'scale-y-100' : 'scale-y-0'}`}></div>
                  </div>

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

                  {/* Connector 2 */}
                  <div className="relative w-0.5 h-8 ml-5 mb-6">
                    <div className="absolute inset-0 bg-gray-200"></div>
                    <div className={`absolute inset-0 bg-gradient-to-b from-blue-500 to-emerald-500 transition-all duration-700 ease-in-out origin-top ${step >= 3 ? 'scale-y-100' : 'scale-y-0'}`}></div>
                  </div>

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
