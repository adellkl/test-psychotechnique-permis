import FAQ from '../components/FAQ'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Test Psychotechnique Annulation Permis - Infractions Graves | Clichy & Colombes 92",
  description: "Test après annulation permis (infractions graves). Centres Clichy & Colombes 92. Psychologue ADELI. 2e chance gratuite. Repasser permis annulé. RDV 07 65 56 53 79.",
  keywords: "test psychotechnique annulation permis, permis annulé, annulation homicide, annulation alcool, annulation récidive, repasser permis annulé, centre agréé préfecture, Clichy 92, psychologue ADELI, test aptitude conduite, annulation 3 ans, Hauts-de-Seine, auto-école après annulation, Île-de-France, Paris 75, Seine-et-Marne 77, Yvelines 78, Essonne 91, Seine-Saint-Denis 93, Val-de-Marne 94, Val-d'Oise 95, Boulogne-Billancourt, Nanterre, Versailles, Évry, Bobigny, Créteil, Cergy, test psychotechnique annulation permis Île-de-France",
  openGraph: {
    title: "Test Psychotechnique Annulation Permis - Infractions Graves | Clichy",
    description: "Test psychotechnique obligatoire après annulation permis pour homicide, alcool, récidive. Centre agréé préfecture Clichy. Psychologue ADELI certifiée.",
    url: "https://test-psychotechnique-permis.com/annulation-permis",
    type: "website",
    locale: "fr_FR",
    siteName: "Test Psychotechnique Permis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Psychotechnique Annulation Permis - Centre Clichy",
    description: "Test psychotechnique obligatoire après annulation permis. Centre agréé préfecture Clichy. Psychologue ADELI certifiée.",
  },
  alternates: {
    canonical: "https://test-psychotechnique-permis.com/annulation-permis",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function AnnulationPermisPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Test Psychotechnique Permis - Annulation",
    "description": "Centre agréé préfecture spécialisé dans les tests psychotechniques après annulation du permis de conduire pour homicide, alcool, récidive",
    "url": "https://test-psychotechnique-permis.com/annulation-permis",
    "telephone": "07 65 56 53 79",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "82 Rue Henri Barbusse",
      "addressLocality": "Clichy",
      "postalCode": "92110",
      "addressRegion": "Hauts-de-Seine",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.9024,
      "longitude": 2.3051
    },
    "openingHours": "Mo-Fr 09:00-18:00",
    "priceRange": "90€",
    "serviceType": "Test psychotechnique annulation permis",
    "medicalSpecialty": "Psychologie",
    "availableService": {
      "@type": "MedicalProcedure",
      "name": "Test psychotechnique après annulation permis",
      "description": "Test obligatoire après annulation du permis pour homicide, alcool, récidive",
      "procedureType": "Test d'aptitude à la conduite"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 pt-40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Test Psychotechnique Annulation Permis - <span className="relative group">
              Infractions Graves
              <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-underline"></span>
            </span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Votre permis de conduire a été <strong>annulé définitivement</strong> ? 
            Découvrez la procédure pour repasser votre permis.
          </p>
          <Link 
            href="/prendre-rendez-vous" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-600 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Prendre rendez-vous
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Qu'est-ce que c'est?
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Le permis de conduire est <strong>annulé pour une durée maximum de trois ans</strong>, (dans certains cas elle peut être portée à 10 ans) À l'issue de cette période d'annulation, le permis ne peut pas être récupéré.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Le conducteur est <strong>obligé de repasser les épreuves du permis de conduire</strong> s'il souhaite conduire à nouveau.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Comment récupérer son permis de conduire?
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">
              Pour repasser son permis après annulation, vous devrez :
            </p>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-gray-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Passer un test psychotechnique</strong> qui dure environ 40 minutes. Il comprend un entretien individuel, ainsi qu'un ou plusieurs tests psychotechniques.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-gray-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Passer une visite médicale</strong> avec un médecin agréé préfecture pour le permis.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-gray-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      Une fois les précédentes démarches validées, <strong>s'inscrire dans une auto-école</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                href="/prendre-rendez-vous" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-gray-600 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Infractions routières concernées
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
              <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                  </svg>
                </div>
                Alcool ou stupéfiants
              </h3>
              <ul className="space-y-2 text-red-800">
                <li>• Conduite sous l'emprise de l'alcool</li>
                <li>• Conduite sous l'emprise de stupéfiants</li>
                <li>• Refus de se soumettre aux vérifications concernant l'état d'alcoolémie ou l'usage de stupéfiants</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                Atteintes involontaires aggravées
              </h3>
              <ul className="space-y-2 text-orange-800">
                <li>• Atteintes involontaires aggravées entraînant une incapacité totale de travail de plus de 3 mois</li>
                <li>• Accident de la route causé par une conduite en état d'ivresse manifeste</li>
                <li>• Collision provoquée par un excès de vitesse important</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                Comportement en cas de contrôle routier
              </h3>
              <ul className="space-y-2 text-purple-800">
                <li>• Refus d'obtempérer</li>
                <li>• Refus d'obtempérer aggravé</li>
                <li>• Récidive</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                Infractions graves
              </h3>
              <ul className="space-y-2 text-gray-800">
                <li>• Homicide involontaire aggravé</li>
                <li>• Récidive</li>
                <li>• Refus de restituer son permis après une suspension ou une annulation</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/prendre-rendez-vous" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gray-600 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </section>
      
      <FAQ />
    </>
  )
}
