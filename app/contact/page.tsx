'use client'

import { useState } from 'react'
import Link from 'next/link'
import FAQ from '../components/FAQ'

export default function ContactPage() {
  const [mapLoaded, setMapLoaded] = useState(false)

  const handleMapLoad = () => {
    setMapLoaded(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-3 sm:mb-4">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-4">
            Contactez-nous
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-200 p-3 sm:p-4 md:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-blue-900 mb-1">Créneaux supplémentaires disponibles</h3>
                <p className="text-xs sm:text-sm md:text-base text-blue-800">
                  D'autres créneaux horaires peuvent être proposés par téléphone. N'hésitez pas à nous appeler !
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Cards Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {/* Phone Card */}

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Téléphone</h3>
                  <span className="inline-block bg-green-500 text-white text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-semibold">DIRECT</span>
                </div>
              </div>
              <a href="tel:0765565379" className="text-2xl sm:text-3xl font-bold text-green-600 hover:text-green-700 transition-colors block mb-2">
                07 65 56 53 79
              </a>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Réponse immédiate • Du lundi au samedi</p>
              <a href="tel:0765565379" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all text-sm sm:text-base font-semibold flex items-center justify-center gap-2 group">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Appeler maintenant
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Email</h3>
                  <span className="inline-block bg-blue-500 text-white text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-semibold">24H/24</span>
                </div>
              </div>
              <a href="mailto:contact@test-psychotechnique-permis.com" className="text-sm sm:text-base md:text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors break-all block mb-2">
                contact@test-psychotechnique-permis.com
              </a>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Réponse sous 24h • Questions détaillées</p>
              <a href="mailto:contact@test-psychotechnique-permis.com" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all text-sm sm:text-base font-semibold flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Envoyer un email
              </a>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Horaires</h3>
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-semibold">OUVERT</span>
                </div>
              </div>
              <div className="mb-2 sm:mb-3">
                <p className="text-base sm:text-lg font-semibold text-gray-700 mb-1">Du lundi au samedi</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-600">9h00 - 19h00</p>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Fermé le dimanche • Créneaux flexibles</p>
              <div className="w-full bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl">
                <p className="text-sm font-medium text-orange-800 text-center">📞 Appelez-nous pour plus de créneaux</p>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-red-50 to-pink-50 border-b">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Notre Centre à Clichy</h2>
                  <p className="text-base sm:text-lg font-semibold text-gray-700 mb-0.5 sm:mb-1">Test Psychotechnique Permis</p>
                  <p className="text-sm sm:text-base text-gray-600 mb-2">Centre Agréé Préfecture</p>
                  <div className="flex items-start gap-2 text-gray-700 mb-2 sm:mb-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm sm:text-base font-semibold">82 Rue Henri Barbusse</p>
                      <p className="text-sm sm:text-base">92110 Clichy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs sm:text-sm md:text-base font-medium">Métro Ligne 13 - Mairie de Clichy (3 min à pied)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="relative">
              {!mapLoaded && (
                <div className="h-64 sm:h-80 bg-gray-200 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
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

            <div className="p-4 sm:p-6 bg-gray-50">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=82+Rue+Henri+Barbusse%2C+92110+Clichy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-sm sm:text-base font-semibold flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
                <span className="hidden sm:inline">Obtenir l'itinéraire Google Maps</span>
                <span className="sm:hidden">Itinéraire Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />
    </div>
  )
}
