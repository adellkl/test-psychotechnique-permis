'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FAQ from '../components/FAQ'

export default function ContactPage() {
  const [mapLoaded, setMapLoaded] = useState(false)

  const handleMapLoad = () => {
    setMapLoaded(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section Moderne */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        {/* Particules décoratives */}
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-3 h-3 bg-indigo-400 rounded-full"
          animate={{ y: [0, 30, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-2.5 h-2.5 bg-purple-400 rounded-full"
          animate={{ y: [0, -25, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >





          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12">

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

        {/* Split Screen Layout */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Colonne gauche - Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Téléphone */}
            <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-4 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">Téléphone</h3>
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">DIRECT</span>
                  </div>
                  <a href="tel:0765565379" className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors block mb-1">
                    07 65 56 53 79
                  </a>
                  <p className="text-sm text-gray-600 mb-3">Réponse immédiate • du lundi au samedi de 8h - 20h</p>
                  <a href="tel:0765565379" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-semibold shadow-md hover:shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Appeler maintenant
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-4 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">Email</h3>
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">24H/24</span>
                  </div>
                  <a href="mailto:contact@test-psychotechnique-permis.com" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors break-all block mb-1">
                    contact@test-psychotechnique-permis.com
                  </a>
                  <p className="text-sm text-gray-600 mb-3">Réponse sous 24h • Questions détaillées</p>
                  <a href="mailto:contact@test-psychotechnique-permis.com" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all text-sm font-semibold shadow-md hover:shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Envoyer un email
                  </a>
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-4 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">Horaires</h3>
                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">OUVERT</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">8h - 20h</p>
                  <p className="text-2xl font-bold text-orange-600 mb-2">8h - 20h</p>
                  <p className="text-sm text-gray-600 mb-3">Fermé le dimanche • Créneaux flexibles</p>
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 py-2 px-3 rounded-lg">
                    <p className="text-xs font-medium text-orange-800 text-center">📞 Appelez-nous pour plus de créneaux</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Colonne droite - Google Maps & Localisation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden">
              {/* En-tête localisation */}
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Notre Centre</h2>
                    <p className="text-sm font-semibold text-gray-700">Test Psychotechnique Permis</p>
                    <p className="text-xs text-gray-600 mb-2">Centre Agréé Préfecture</p>

                    <div className="flex items-start gap-2 text-gray-700 mb-2">
                      <svg className="w-4 h-4 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm">
                        <p className="font-semibold">82 Rue Henri Barbusse</p>
                        <p>92110 Clichy</p>
                      </div>
                    </div>

                    {/* Badge métro */}
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-2 py-1.5 rounded-lg">
                      <span className="text-base">🚇</span>
                      <div className="text-xs">
                        <p className="font-medium">Métro Ligne 13</p>
                        <p>Mairie de Clichy (3 min)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="relative">
                {!mapLoaded && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                    <div className="text-center">
                      <motion.div
                        className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </motion.div>
                      <p className="text-xs text-gray-600">Chargement de la carte...</p>
                    </div>
                  </div>
                )}

                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2623.8234567890123!2d2.3067890156740734!3d48.90123456789012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDU0JzA0LjQiTiAywrAxOCcyNC40IkU!5e0!3m2!1sfr!2sfr!4v1609459200000!5m2!1sfr!2sfr&q=82+Rue+Henri+Barbusse%2C+92110+Clichy"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={handleMapLoad}
                  className="w-full h-[300px]"
                ></iframe>
              </div>

              {/* Bouton itinéraire */}
              <div className="p-4">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=82+Rue+Henri+Barbusse%2C+92110+Clichy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                  Obtenir l'itinéraire
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />
    </div>
  )
}
