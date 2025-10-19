'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FAQ from '../components/FAQ'

export default function ContactPage() {
  const [selectedCenter, setSelectedCenter] = useState<'clichy' | 'colombes'>('clichy')

  const centers = {
    clichy: {
      name: 'Centre de Clichy',
      shortName: 'Clichy',
      address: '82 Rue Henri Barbusse',
      city: '92110 Clichy',
      phone: '07 65 56 53 79',
      email: 'contact@test-psychotechnique-permis.com',
      metro: 'Métro Ligne 13 - Mairie de Clichy',
      metroTime: '3 min',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      lat: 48.9042,
      lng: 2.3068,
      features: ['Psychologue ADELI', '2ème chance gratuite', 'Parking à proximité']
    },
    colombes: {
      name: 'Pro Drive Academy',
      shortName: 'Colombes',
      address: '14 Rue de Mantes',
      city: '92700 Colombes',
      phone: '09 72 13 22 50',
      email: 'reservation@mon-permis-auto.com',
      metro: 'Transports en commun',
      metroTime: 'Accessible',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      lat: 48.9225,
      lng: 2.2531,
      features: ['Service rapide', 'Équipe expérimentée', 'Résultats rapides']
    }
  }

  const currentCenter = centers[selectedCenter]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Hero Section Ultra Moderne */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Grille animée en arrière-plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Orbes lumineux */}
        <motion.div
          className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
              style={{
                background: 'linear-gradient(to right, #fff, #93c5fd, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Contactez-nous
            </motion.h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8">
              Deux centres à votre service dans les Hauts-de-Seine
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16 relative z-10">
        
        {/* Sélecteur de centres - Design moderne avec onglets */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {Object.entries(centers).map(([key, center]) => (
              <motion.button
                key={key}
                onClick={() => setSelectedCenter(key as 'clichy' | 'colombes')}
                className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  selectedCenter === key
                    ? 'text-white shadow-2xl'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {selectedCenter === key && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${center.gradient} rounded-2xl`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{center.shortName}</span>
              </motion.button>
            ))}
          </div>

          {/* Carte du centre sélectionné - Design glassmorphism */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCenter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Carte principale avec effet glassmorphism */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
                {/* Header avec gradient */}
                <div className={`bg-gradient-to-r ${currentCenter.gradient} p-8 sm:p-12`}>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">{currentCenter.name}</h2>
                      <p className="text-white/80 text-lg">Centre Agréé Préfecture</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Contenu - Grid moderne */}
                <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-12">
                  {/* Colonne gauche - Informations */}
                  <div className="space-y-6">
                    {/* Adresse */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="group"
                    >
                      <div className="flex items-start gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/10">
                        <div className={`w-12 h-12 bg-gradient-to-br ${currentCenter.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Adresse</p>
                          <p className="text-white font-semibold">{currentCenter.address}</p>
                          <p className="text-gray-300">{currentCenter.city}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Téléphone */}
                    <motion.a
                      href={`tel:${currentCenter.phone.replace(/\s/g, '')}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="group block"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/10">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Téléphone</p>
                          <p className="text-xl sm:text-2xl font-bold text-white group-hover:text-green-400 transition-colors">{currentCenter.phone}</p>
                        </div>
                      </div>
                    </motion.a>

                    {/* Email */}
                    <motion.a
                      href={`mailto:${currentCenter.email}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="group block"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/10">
                        <div className={`w-12 h-12 bg-gradient-to-br ${currentCenter.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-400 mb-1">Email</p>
                          <p className="text-white font-semibold text-sm truncate group-hover:text-blue-400 transition-colors">{currentCenter.email}</p>
                        </div>
                      </div>
                    </motion.a>

                    {/* Métro */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">🚇</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Transport</p>
                          <p className="text-white font-semibold">{currentCenter.metro}</p>
                          <p className="text-sm text-gray-300">{currentCenter.metroTime}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Colonne droite - Carte et actions */}
                  <div className="space-y-6">
                    {/* Carte Google Maps */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative h-64 rounded-2xl overflow-hidden border border-white/20"
                    >
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(currentCenter.address + ', ' + currentCenter.city)}&zoom=15`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-3"
                    >
                      {currentCenter.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className={`w-2 h-2 bg-gradient-to-r ${currentCenter.gradient} rounded-full`}></div>
                          <span className="text-white text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </motion.div>

                    {/* Bouton itinéraire */}
                    <motion.a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(currentCenter.address + ', ' + currentCenter.city)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`block w-full bg-gradient-to-r ${currentCenter.gradient} text-white py-4 px-6 rounded-2xl font-bold text-center shadow-lg hover:shadow-2xl transition-all duration-300`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                        </svg>
                        Obtenir l'itinéraire
                      </div>
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Notice importante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Créneaux supplémentaires disponibles</h3>
                <p className="text-gray-300">
                  D'autres créneaux horaires peuvent être proposés par téléphone. N'hésitez pas à nous appeler !
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <FAQ />
    </div>
  )
}
