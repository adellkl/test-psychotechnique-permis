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
      phone: '07 65 56 53 79',
      email: 'contact@test-psychotechnique-permis.com',
      metro: 'Proche des transports en commun',
      lat: 48.9225,
      lng: 2.2531
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section Moderne */}
      <section className="relative pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="h-4"></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-12">

        {/* Important Notice */}
        <div className="mb-8">
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Colonne gauche - Informations du centre sélectionné */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:h-[500px] flex flex-col order-2 lg:order-1"
          >
            {/* Boutons de sélection des centres */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setSelectedCenter('clichy')}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${selectedCenter === 'clichy'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white/70 text-gray-700 hover:bg-white'
                  }`}
              >
                📍 Clichy
              </button>
              <button
                onClick={() => setSelectedCenter('colombes')}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${selectedCenter === 'colombes'
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white/70 text-gray-700 hover:bg-white'
                  }`}
              >
                📍 Colombes
              </button>
            </div>

            {/* Informations du centre sélectionné avec animation améliorée */}
            <motion.div
              key={selectedCenter}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 flex-1 flex flex-col justify-center"
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
                        staggerChildren: 0.08,
                        delayChildren: 0.1
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

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }
                      }
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(centers[selectedCenter].address + ', ' + centers[selectedCenter].city)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-base font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl group"
                    >
                      <svg className="w-6 h-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                      </svg>
                      <span className="group-hover:tracking-wide transition-all duration-300">Obtenir l'itinéraire</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

          </motion.div>

          {/* Colonne droite - Carte Interactive */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit order-1 lg:order-2"
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

              {/* Google Maps - Carte dynamique selon le centre sélectionné */}
              <iframe
                key={selectedCenter}
                src={
                  selectedCenter === 'clichy'
                    ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2622.725844492942!2d2.30719387698572!3d48.90156177133817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66f094592d2c3%3A0x8689d8b070aafcaf!2s82%20Rue%20Henri%20Barbusse%2C%2092110%20Clichy!5e0!3m2!1sfr!2sfr!4v1760903017331!5m2!1sfr!2sfr"
                    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1311.1789205594011!2d2.231577939082856!3d48.90857419283477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66586d6fe25c7%3A0xdc6ecf96e58ac63c!2s14%20Rue%20de%20Mantes%2C%2092700%20Colombes!5e0!3m2!1sfr!2sfr!4v1760903088293!5m2!1sfr!2sfr"
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Carte Google Maps - ${centers[selectedCenter].name}`}
                className="w-full h-[500px] rounded-xl"
              ></iframe>

            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />
    </div>
  )
}
