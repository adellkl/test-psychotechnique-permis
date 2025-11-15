'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'

export default function SoberHero() {
  const words = useMemo(() => ['invalidation', 'annulation', 'suspension'], [])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 3000) // Change tous les 3 secondes

    return () => clearInterval(interval)
  }, [words])

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  }), [])

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }), [])

  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/20 overflow-hidden min-h-[85vh] lg:min-h-screen flex items-center justify-center pt-24 sm:pt-32 md:pt-36 lg:pt-40 pb-8 sm:pb-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59, 130, 246) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Gradient orbs - subtle */}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-6 sm:space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mt-8 sm:mt-0">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Deuxième chance gratuite
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-4 px-4">
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
                2e Chance
              </span>
              <span className="block text-gray-800 text-xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug">Centre agréé de tests psychotechniques</span>
              <span className="block text-gray-600 text-base sm:text-xl md:text-2xl lg:text-3xl mt-2 font-medium">Valable partout en France</span>
            </h1>

            {/* Animated rotating text */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold px-4">
              <span className="text-gray-700">Pour votre</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWordIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"
                >
                  {words[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Avec nos <span className="font-semibold text-blue-600">deux centres agréés</span>, 2e Chance vous offre plus de <span className="font-semibold text-emerald-600">flexibilité</span> pour passer votre test psychotechnique.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 max-w-md sm:max-w-none mx-auto">
            <Link
              href="tel:0765565379"
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>07 65 56 53 79</span>
            </Link>

            <Link
              href="/prendre-rendez-vous"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-800 rounded-xl font-semibold text-base hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Prendre rendez-vous
            </Link>
          </motion.div>

          {/* Info Cards - Responsive Grid/Scroll */}
          <motion.div variants={itemVariants} className="pt-6 sm:pt-8">
            {/* Mobile: Grid 2x2 */}
            <div className="grid grid-cols-2 gap-3 px-4 sm:hidden">
              {/* Card 1 - Centres */}
              <div className="group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">2 Centres</p>
                    <p className="text-xs text-gray-600">Clichy & Colombes</p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Horaires */}
              <div className="group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Lun-Sam</p>
                    <p className="text-xs text-gray-600">9h - 19h</p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Paiement */}
              <div className="group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">90€</p>
                    <p className="text-xs text-gray-600">Paiement sur place</p>
                  </div>
                </div>
              </div>

              {/* Card 4 - Agrément */}
              <div className="group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Agréé</p>
                    <p className="text-xs text-gray-600">Tout départements</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Animated Scrolling Banner */}
            <div className="hidden sm:block overflow-hidden">
              <div className="relative">
                {/* Gradient masks for smooth edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />

                <div className="flex animate-scroll-infinite-smooth">
                  {/* Duplicate cards 4 times for ultra-smooth seamless loop */}
                  {[...Array(4)].map((_, setIndex) => (
                    <div key={setIndex} className="flex gap-6 px-3 flex-shrink-0">
                      {/* Card 1 - Centres */}
                      <div className="flex-shrink-0 group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 w-52">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">2 Centres</p>
                            <p className="text-sm text-gray-600">Clichy & Colombes</p>
                          </div>
                        </div>
                      </div>

                      {/* Card 2 - Horaires */}
                      <div className="flex-shrink-0 group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 w-52">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                            <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Lun-Sam</p>
                            <p className="text-sm text-gray-600">9h - 19h</p>
                          </div>
                        </div>
                      </div>

                      {/* Card 3 - Paiement */}
                      <div className="flex-shrink-0 group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 w-52">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">90€</p>
                            <p className="text-sm text-gray-600">Paiement sur place</p>
                          </div>
                        </div>
                      </div>

                      {/* Card 4 - Agrément */}
                      <div className="flex-shrink-0 group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 w-52">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Agréé</p>
                            <p className="text-sm text-gray-600">Tout départements</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
