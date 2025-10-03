'use client'

import { useState } from 'react'
import FAQ from '../components/FAQ'

export default function ContactPage() {
  const [mapLoaded, setMapLoaded] = useState(false)

  const handleMapLoad = () => {
    setMapLoaded(true)
  }

  return (
    <div className="min-h-screen bg-white pt-16">

      {/* Important Notice */}
      <div className="bg-blue-50 border-b border-blue-100 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-blue-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-1">Créneaux supplémentaires disponibles</h3>
                <p className="text-sm sm:text-base text-blue-800">
                  D'autres créneaux horaires peuvent être proposés par téléphone
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Contact Cards */}
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Nos coordonnées</h2>
                <p className="text-base sm:text-lg text-gray-600">Contactez-nous facilement par téléphone ou email</p>
              </div>

              <div className="grid gap-4 sm:gap-6">
                {/* Phone Card */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Téléphone</h3>
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium w-fit">DIRECT</span>
                      </div>
                      <a href="tel:0765565379" className="text-2xl sm:text-3xl font-bold text-green-600 hover:text-green-700 transition-colors block mb-1">
                        07 65 56 53 79
                      </a>
                      <p className="text-sm sm:text-base text-green-700 font-medium">Réponse immédiate • Du lundi au samedi</p>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Email</h3>
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium w-fit">24H/24</span>
                      </div>
                      <a href="mailto:contact@test-psychotechnique-permis.com" className="text-sm sm:text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors break-all block mb-1">
                        contact@test-psychotechnique-permis.com
                      </a>
                      <p className="text-sm sm:text-base text-blue-700 font-medium">Réponse sous 24h • Questions détaillées</p>
                    </div>
                  </div>
                </div>

                {/* Hours Card */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Horaires</h3>
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium w-fit">OUVERT</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
                        <span className="text-base sm:text-lg font-semibold text-gray-700">Du lundi au samedi</span>
                        <span className="text-2xl sm:text-3xl font-bold text-orange-600">9h00 - 19h00</span>
                      </div>
                      <p className="text-sm sm:text-base text-orange-700 font-medium">Fermé le dimanche • Créneaux flexibles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6 border-b">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Test Psychotechnique Permis</h3>
                    <p className="text-base sm:text-lg font-medium text-gray-700">Centre Agréé Préfecture Clichy</p>
                    <p className="text-sm sm:text-base text-gray-600 break-words"><strong>82 Rue Henri Barbusse, 92110 Clichy</strong></p>
                    <p className="text-sm text-blue-600 font-medium">Métro Ligne 13 - Mairie de Clichy (3min)</p>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="relative">
                {!mapLoaded && (
                  <div className="h-64 sm:h-80 bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <p className="text-sm sm:text-base text-gray-500">Chargement de la carte...</p>
                    </div>
                  </div>
                )}

                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2623.8234567890123!2d2.3067890156740734!3d48.90123456789012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDU0JzA0LjQiTiAywrAxOCcyNC40IkU!5e0!3m2!1sfr!2sfr!4v1609459200000!5m2!1sfr!2sfr&q=82+Rue+Henri+Barbusse%2C+92110+Clichy"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={handleMapLoad}
                  className="w-full h-64 sm:h-80"
                ></iframe>
              </div>

              <div className="p-4 sm:p-6 bg-gray-50 border-t">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=82+Rue+Henri+Barbusse%2C+92110+Clichy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 sm:gap-3 font-medium text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                  Obtenir l'itinéraire
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white">
        <FAQ />
      </div>
    </div>
  )
}
