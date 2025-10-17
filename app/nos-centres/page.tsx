import CentersShowcase from '../components/CentersShowcase'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nos Centres | Test Psychotechnique Permis',
  description: 'Découvrez nos deux centres agréés pour votre test psychotechnique du permis de conduire à Clichy et Colombes.',
}

export default function NosCentres() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Nos Centres Agréés
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Deux centres à votre disposition dans les Hauts-de-Seine pour votre test psychotechnique. 
            Choisissez celui qui vous convient le mieux !
          </p>
        </div>

        {/* Centres Showcase */}
        <CentersShowcase variant="full" showBookingButton={true} />

        {/* Informations supplémentaires */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Agréés Préfecture</h3>
            <p className="text-gray-600">Nos deux centres sont officiellement agréés par la préfecture</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Disponibilités</h3>
            <p className="text-gray-600">Créneaux disponibles dans les deux centres toute la semaine</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Équipe Qualifiée</h3>
            <p className="text-gray-600">Psychologues diplômés et expérimentés dans les deux centres</p>
          </div>
        </div>
      </div>
    </main>
  )
}
