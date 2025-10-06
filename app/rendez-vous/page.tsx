'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Calendar from '../../components/Calendar'
import { supabase } from '../../lib/supabase'

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

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            appointment_date: selectedDate,
            appointment_time: selectedTime,
            reason: formData.reason,
            client_notes: formData.notes,
            status: 'confirmed'
          }
        ])
        .select()

      if (error) throw error

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
            reason: formData.reason
          }),
        })

        if (!emailResponse.ok) {
          console.warn('Email sending failed, but appointment was created')
        }
      } catch (emailError) {
        console.warn('Email sending error:', emailError)
        // Continue anyway - appointment is created
      }

      setSuccess(true)
      setStep(3)
    } catch (error) {
      console.error('Error creating appointment:', error)
      alert('Erreur lors de la prise de rendez-vous. Veuillez réessayer.')
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm"
                      placeholder="Votre prénom"
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm"
                      placeholder="Votre nom"
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm"
                      placeholder="votre@email.com"
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm"
                      placeholder="06 12 34 56 78"
                    />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm"
                  >
                    <option value="">Sélectionnez un motif</option>
                    <option value="invalidation">Invalidation du permis</option>
                    <option value="suspension">Suspension du permis</option>
                    <option value="annulation">Annulation du permis</option>
                  </select>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none text-sm"
                    placeholder="Informations complémentaires, questions particulières..."
                  />
                </div>

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
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                    Créneau
                  </span>
                </div>
                <div className={`flex-1 h-1 mx-4 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                    Infos
                  </span>
                </div>
                <div className={`flex-1 h-1 mx-4 rounded ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
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
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    step >= 1 
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
                <div className={`w-0.5 h-8 ml-5 mb-6 transition-all duration-500 ${
                  step >= 2 ? 'bg-gradient-to-b from-blue-500 to-blue-600' : 'bg-gray-200'
                }`}></div>
                
                {/* Step 2 */}
                <div className="flex items-center mb-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    step >= 2 
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
                <div className={`w-0.5 h-8 ml-5 mb-6 transition-all duration-500 ${
                  step >= 3 ? 'bg-gradient-to-b from-green-500 to-emerald-500' : 'bg-gray-200'
                }`}></div>
                
                {/* Step 3 */}
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    step >= 3 
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
