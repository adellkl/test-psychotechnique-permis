'use client'

import { motion } from 'framer-motion'
import FAQ from '../components/FAQ'

export default function ContactPage() {
  const centers = [
    {
      id: 'clichy',
      name: 'Centre de Clichy',
      address: '82 Rue Henri Barbusse',
      city: '92110 Clichy',
      phone: '07 65 56 53 79',
      email: 'contact@test-psychotechnique-permis.com',
      metro: 'À 3 min du métro Mairie de Clichy (ligne 13) – 8 min de la gare Clichy-Levallois (ligne L)',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      id: 'colombes',
      name: 'Centre 2e Chance',
      address: '14 Rue de Mantes',
      city: '92700 Colombes',
      phone: '07 65 56 53 79',
      email: 'contact@test-psychotechnique-permis.com',
      metro: 'À 3 min du tram Charlebourg (T2) – 3 min de la gare La Garenne-Colombes (ligne L) – 5 min de La Défense',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-pink-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Créneaux supplémentaires disponibles</h3>
                <p className="text-base text-gray-600">
                  D'autres créneaux horaires peuvent être proposés par téléphone. N'hésitez pas à nous appeler !
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {centers.map((center, index) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="bg-slate-800 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{center.name}</h3>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{center.address}</p>
                    <p className="text-gray-600">{center.city}</p>
                  </div>
                </div>

                <a
                  href={`tel:${center.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group border border-gray-200"
                >
                  <svg className="w-5 h-5 text-slate-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-lg font-bold text-slate-800 group-hover:text-slate-900">
                    {center.phone}
                  </span>
                </a>

                <a
                  href={`mailto:${center.email}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group border border-gray-200"
                >
                  <svg className="w-5 h-5 text-slate-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 break-all font-medium">
                    {center.email}
                  </span>
                </a>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-sm text-gray-700 font-medium">{center.metro}</p>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(center.address + ', ' + center.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-800 text-white py-4 px-6 rounded-lg hover:bg-slate-900 transition-all text-base font-semibold flex items-center justify-center gap-3 shadow-sm group"
                >
                  <svg className="w-6 h-6 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                  <span>Obtenir l'itinéraire</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Prêt à réserver votre test ?
          </h2>
          <p className="text-gray-600 text-base mb-6">
            Réservez en ligne en quelques clics ou contactez-nous par téléphone
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/prendre-rendez-vous"
              className="px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Réserver en ligne
            </a>
            <a
              href="tel:0765565379"
              className="px-8 py-4 bg-gray-100 text-slate-800 rounded-lg font-semibold hover:bg-gray-200 transition-all border border-gray-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              07 65 56 53 79
            </a>
          </div>
        </motion.div>
      </div>

      <FAQ />
    </div>
  )
}
