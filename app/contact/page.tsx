'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FAQ from '../components/FAQ'

export default function ContactPage() {
  const [selectedCenter, setSelectedCenter] = useState<'clichy' | 'colombes'>('clichy')

  const centers = {
    clichy: {
      name: 'Centre de Clichy',
      address: '82 Rue Henri Barbusse',
      city: '92110 Clichy',
      phone: '07 65 56 53 79',
      email: 'contact@test-psychotechnique-permis.com',
      metro: 'Métro Ligne 13 - Mairie de Clichy (3 min)',
      lat: 48.9042,
      lng: 2.3068
    },
    colombes: {
      name: 'Pro Drive Academy',
      address: '14 Rue de Mantes',
      city: '92700 Colombes',
      phone: '09 72 13 22 50',
      email: 'reservation@mon-permis-auto.com',
      metro: 'Proche des transports en commun',
      lat: 48.9225,
      lng: 2.2531
    }
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
          {/* Colonne gauche - Informations du centre sélectionné */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="h-[500px] flex flex-col"
          >
            {/* Informations du centre sélectionné */}
            <motion.div
              key={selectedCenter}
              initial={false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 h-full flex flex-col justify-center"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${selectedCenter === 'clichy' ? 'bg-blue-500' : 'bg-purple-500'} rounded-xl flex items-center justify-center shadow-lg`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{centers[selectedCenter].name}</h3>
                    <p className="text-sm text-gray-600">Centre Agréé Préfecture</p>
                    <p className="text-sm text-purple-600 font-semibold">👩‍⚕️ Psychologue certifiée</p>
                  </div>
                </div>

                <motion.div
                  className="space-y-5"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">{centers[selectedCenter].address}</p>
                      <p className="text-gray-600">{centers[selectedCenter].city}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex items-center gap-3 p-4 bg-green-50 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${centers[selectedCenter].phone.replace(/\s/g, '')}`} className="text-xl font-bold text-green-600 hover:text-green-700">
                      {centers[selectedCenter].phone}
                    </a>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${centers[selectedCenter].email}`} className="text-sm text-blue-600 hover:text-blue-700 break-all font-semibold">
                      {centers[selectedCenter].email}
                    </a>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg"
                  >
                    <span className="text-2xl">🚇</span>
                    <p className="text-base text-gray-700 font-medium">{centers[selectedCenter].metro}</p>
                  </motion.div>

                  <motion.a
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(centers[selectedCenter].address + ', ' + centers[selectedCenter].city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg group mt-4"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                    </svg>
                    Obtenir l'itinéraire
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>

          </motion.div>

          {/* Colonne droite - Carte Interactive */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden">
              {/* En-tête */}
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">Nos 2 Centres</h2>
                    <p className="text-sm text-gray-600">Cliquez sur un point pour voir les détails</p>
                  </div>
                </div>
              </div>

              {/* Google Maps avec zone 92 entourée */}
              <div className="relative h-[500px] rounded-xl overflow-hidden">
                {/* Carte centrée sur les Hauts-de-Seine (92) */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83962!2d2.2531!3d48.8566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fec70fb1d8d%3A0x40b82c3688c9460!2sHauts-de-Seine!5e0!3m2!1sfr!2sfr!4v1609459200000!5m2!1sfr!2sfr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>


                {/* Points cliquables superposés - Positions précises sur les adresses */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Point Clichy - 82 Rue Henri Barbusse, 92110 Clichy */}
                  <button
                    onClick={() => setSelectedCenter('clichy')}
                    className={`absolute top-[50%] left-[62%] transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto transition-all duration-300 hover:scale-110 ${selectedCenter === 'clichy' ? 'scale-125' : 'scale-100'
                      }`}
                    title="Centre de Clichy - 82 Rue Henri Barbusse"
                    type="button"
                  >
                    <div className="relative">
                      {/* Marqueur animé */}
                      <div className="relative">
                        <div className={`w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-xl transition-all duration-300 ${selectedCenter === 'clichy' ? 'ring-4 ring-blue-300' : ''
                          }`}>
                          {selectedCenter === 'clichy' && (
                            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
                          )}
                        </div>
                      </div>
                      <div className={`absolute -bottom-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-xl font-bold border-2 border-white transition-all duration-300 ${selectedCenter === 'clichy' ? 'opacity-100 scale-100' : 'opacity-80 scale-90'
                        }`}>
                        Clichy
                      </div>
                    </div>
                  </button>

                  {/* Point Colombes - 14 Rue de Mantes, 92700 Colombes */}
                  <button
                    onClick={() => setSelectedCenter('colombes')}
                    className={`absolute top-[46%] left-[42%] transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto transition-all duration-300 hover:scale-110 ${selectedCenter === 'colombes' ? 'scale-125' : 'scale-100'
                      }`}
                    title="Pro Drive Academy - 14 Rue de Mantes, Colombes"
                    type="button"
                  >
                    <div className="relative">
                      {/* Marqueur animé */}
                      <div className="relative">
                        <div className={`w-8 h-8 bg-purple-600 rounded-full border-4 border-white shadow-xl transition-all duration-300 ${selectedCenter === 'colombes' ? 'ring-4 ring-purple-300' : ''
                          }`}>
                          {selectedCenter === 'colombes' && (
                            <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75"></div>
                          )}
                        </div>
                      </div>
                      <div className={`absolute -bottom-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-purple-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-xl font-bold border-2 border-white transition-all duration-300 ${selectedCenter === 'colombes' ? 'opacity-100 scale-100' : 'opacity-80 scale-90'
                        }`}>
                        Colombes
                      </div>
                    </div>
                  </button>
                </div>
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
