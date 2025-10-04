import FAQ from '../components/FAQ'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Test Psychotechnique Invalidation Permis - Solde Nul Points | Centre Clichy 92",
  description: "Test psychotechnique obligatoire après invalidation permis pour solde nul de points. Centre agréé préfecture Clichy. Psychologue ADELI certifiée. Récupération permis invalidé. RDV 07 65 56 53 79.",
  keywords: "test psychotechnique invalidation permis, permis invalidé, solde nul points, récupération permis invalidé, centre agréé préfecture, Clichy 92, psychologue ADELI, test aptitude conduite, permis points zéro, invalidation 6 mois, Hauts-de-Seine",
  openGraph: {
    title: "Test Psychotechnique Invalidation Permis - Solde Nul Points | Centre Clichy",
    description: "Test psychotechnique obligatoire après invalidation permis pour solde nul de points. Centre agréé préfecture Clichy. Psychologue ADELI certifiée. Récupération permis invalidé.",
    url: "https://test-psychotechnique-permis.com/invalidation-permis",
    type: "website",
    locale: "fr_FR",
    siteName: "Test Psychotechnique Permis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Psychotechnique Invalidation Permis - Centre Clichy",
    description: "Test psychotechnique obligatoire après invalidation permis. Centre agréé préfecture Clichy. Psychologue ADELI certifiée.",
  },
  alternates: {
    canonical: "https://test-psychotechnique-permis.com/invalidation-permis",
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

export default function InvalidationPermisPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Test Psychotechnique Permis - Invalidation",
    "description": "Centre agréé préfecture spécialisé dans les tests psychotechniques après invalidation du permis de conduire pour solde nul de points",
    "url": "https://test-psychotechnique-permis.com/invalidation-permis",
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
    "serviceType": "Test psychotechnique invalidation permis",
    "medicalSpecialty": "Psychologie",
    "availableService": {
      "@type": "MedicalProcedure",
      "name": "Test psychotechnique après invalidation permis",
      "description": "Test obligatoire après invalidation du permis pour solde nul de points",
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
      <section className="bg-gradient-to-br from-red-50 to-red-100 py-20 pt-40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Test Psychotechnique Invalidation Permis - Solde Nul Points
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Votre permis de conduire a été <strong>invalidé pour solde nul de points</strong> ?
            Découvrez la procédure pour le récupérer.
          </p>
          <Link
            href="/prendre-rendez-vous"
            className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
              Lorsque après plusieurs infractions, le crédit des points est épuisé (solde de points à zéro) votre permis est invalidé, généralement pour une période de 6 mois.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Dans ce cas, le titulaire du permis est informé par lettre recommandée avec AR (lettre 48SI)
            </p>
          </div>
        </div>
      </section>

      {/* Comment récupérer son permis */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Comment récupérer son permis de conduire?
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">
              Vous pouvez faire vos démarche sans attendre la fin de la période d'interdiction de conduire. Pour obtenir un nouveau permis :
            </p>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Vous devez passer un test psychotechnique.</strong> Ce test dure environ 40 minutes et comporte un entretien individuel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Vous devez passer une visite médicale</strong> avec un médecin agréé permis en ville. Une liste de ces médecins est disponible sur le site de la préfecture de votre département.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      <strong>Vous devez repasser le code</strong> si vous avez le permis depuis plus de trois ans.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Ou repasser le code et la conduite</strong> lorsque vous avez le permis depuis moins de trois ans.
                    </p>
                  </div>
                </div>
              </div>
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


      <FAQ />
    </>
  )
}
