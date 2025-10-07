import FAQ from '../components/FAQ'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Test Psychotechnique Suspension Permis - Alcool Vitesse Stupéfiants | Clichy 92",
  description: "Test psychotechnique obligatoire après suspension permis pour alcool, excès vitesse, stupéfiants. Centre agréé préfecture Clichy. Psychologue ADELI certifiée. Récupération permis suspendu. RDV 07 65 56 53 79.",
  keywords: "test psychotechnique suspension permis, permis suspendu, suspension alcool, suspension vitesse, suspension stupéfiants, récupération permis suspendu, centre agréé préfecture, Clichy 92, psychologue ADELI, test aptitude conduite, suspension 6 mois, Hauts-de-Seine, visite médicale permis",
  openGraph: {
    title: "Test Psychotechnique Suspension Permis - Alcool Vitesse Stupéfiants | Clichy",
    description: "Test psychotechnique obligatoire après suspension permis pour alcool, excès vitesse, stupéfiants. Centre agréé préfecture Clichy. Psychologue ADELI certifiée.",
    url: "https://test-psychotechnique-permis.com/suspension-permis",
    type: "website",
    locale: "fr_FR",
    siteName: "Test Psychotechnique Permis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Psychotechnique Suspension Permis - Centre Clichy",
    description: "Test psychotechnique obligatoire après suspension permis. Centre agréé préfecture Clichy. Psychologue ADELI certifiée.",
  },
  alternates: {
    canonical: "https://test-psychotechnique-permis.com/suspension-permis",
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

export default function SuspensionPermisPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Test Psychotechnique Permis - Suspension",
    "description": "Centre agréé préfecture spécialisé dans les tests psychotechniques après suspension du permis de conduire pour alcool, vitesse, stupéfiants",
    "url": "https://test-psychotechnique-permis.com/suspension-permis",
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
    "serviceType": "Test psychotechnique suspension permis",
    "medicalSpecialty": "Psychologie",
    "availableService": {
      "@type": "MedicalProcedure",
      "name": "Test psychotechnique après suspension permis",
      "description": "Test obligatoire après suspension du permis pour alcool, excès de vitesse, stupéfiants",
      "procedureType": "Test d'aptitude à la conduite"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 pt-40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Test Psychotechnique Suspension Permis - <span className="relative group">
              Alcool Vitesse Stupéfiants
              <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-underline"></span>
            </span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Votre permis de conduire a été <strong>suspendu temporairement</strong> ?
            Découvrez la procédure pour le récupérer.
          </p>
          <Link
            href="/prendre-rendez-vous"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Prendre rendez-vous
          </Link>
        </div>
      </section>

      {/* Qu'est-ce que c'est */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Qu'est-ce que c'est ?
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              La suspension de permis de conduire est une <strong>mesure temporaire de retrait du permis de conduire</strong>. Elle est prononcée pour plusieurs mois et ne remet pas, en elle-même, en cause la validité du permis de conduire.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cela signifie qu'à l'issue de la période de suspension, l'automobiliste retrouvera la possibilité de conduire sans avoir à repasser les épreuves du permis de conduire.
            </p>
          </div>
        </div>
      </section>

      {/* Comment récupérer son permis */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Comment récupérer son permis de conduire ?
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">
              La récupération du permis de conduire nécessitera l'accomplissement de quelques formalités :
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
                    <p className="text-gray-700 leading-relaxed mb-3">
                      <strong>Passer une visite médicale</strong> dans le cas d'un excès de vitesse, la visite se fait chez un médecin agréé permis en ville.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Dans le cas d'une suspension pour <strong>alcool ou stupéfiant</strong> la visite médicale se fait en commission médicale à la préfecture.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-500 p-6 rounded-r-lg mt-8">
              <p className="text-gray-700 leading-relaxed">
                <strong>Durée :</strong> La durée maximale de la suspension est de 6 mois. Elle peut, cependant, dans certains cas, être portée à 1 an.
              </p>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/prendre-rendez-vous"
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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

      {/* Infractions routières concernées */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Infractions routières concernées
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Alcool ou stupéfiants */}
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

            {/* Excès de vitesse */}
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6s.792.193 1.264.979L14 10.5l-1.264 2.979C12.264 14.265 11.776 14.458 11.472 14.458s-.792-.193-1.264-.979L7.472 10.5l1.264-2.521z" clipRule="evenodd" />
                  </svg>
                </div>
                Excès de vitesse
              </h3>
              <ul className="space-y-2 text-orange-800">
                <li>• Excès de vitesse à 30 km/h et inférieur à 50 km/h</li>
                <li>• Excès de vitesse supérieur à 50 km/h</li>
                <li>• Utilisation d'un détecteur de radar</li>
                <li>• Excès de vitesse supérieur à 50 km/h en récidive</li>
              </ul>
            </div>

            {/* Circulation et stationnement */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                Circulation et stationnement
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Circulation en sens interdit</li>
                <li>• Refus de priorité</li>
                <li>• Dépassement dangereux</li>
                <li>• Non-respect de l'arrêt au feu rouge, au stop ou au cédez le passage</li>
              </ul>
            </div>

            {/* Comportement */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                Comportement
              </h3>
              <ul className="space-y-2 text-purple-800">
                <li>• Conduite en tenant un téléphone en main</li>
                <li>• Conduite malgré une suspension administrative ou judiciaire du permis</li>
                <li>• Atteinte involontaire à la vie ou à l'intégrité d'une personne</li>
                <li>• Refus d'obtempérer</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/prendre-rendez-vous"
              className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-xl font-semibold text-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
