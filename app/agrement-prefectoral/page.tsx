import FAQ from '../components/FAQ'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Agrément Préfectoral - Test Psychotechnique Permis Clichy",
  description: "Consultez l'agrément préfectoral officiel de SEBTI Fatiha, centre agréé pour les tests psychotechniques. Récépissé 2023, numéro ADELI 929334555.",
  keywords: "agrément préfectoral, SEBTI Fatiha, centre agréé, test psychotechnique, ADELI 929334555, récépissé 2023, Clichy",
  openGraph: {
    title: "Agrément Préfectoral - Test Psychotechnique Permis Clichy",
    description: "Consultez l'agrément préfectoral officiel de SEBTI Fatiha, centre agréé pour les tests psychotechniques.",
    url: "https://test-psychotechnique-permis.com/agrement-prefectoral",
    type: "website",
    locale: "fr_FR",
    siteName: "Test Psychotechnique Permis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agrément Préfectoral - Test Psychotechnique Permis",
    description: "Consultez l'agrément préfectoral officiel de SEBTI Fatiha, centre agréé pour les tests psychotechniques.",
  },
  alternates: {
    canonical: "https://test-psychotechnique-permis.com/agrement-prefectoral",
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

export default function AgrementPrefectoralPage() {
  return (
    <>
      <section className="py-20 pt-40 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Agrément Préfectoral Officiel
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Centre agréé par la préfecture des Hauts-de-Seine pour les tests psychotechniques d'aptitude à la conduite
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Document officiel */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 mb-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Document Officiel d'Agrément</h2>
              <p className="text-gray-600 mb-6">
                Récépissé officiel délivré par la préfecture des Hauts-de-Seine
              </p>
              
              <a 
                href="https://test-psychotechnique-permis.com/wp-content/uploads/2023/06/Recepisse-SEBTI-2023.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Télécharger le Récépissé SEBTI 2023
              </a>
            </div>
          </div>

          {/* Informations sur l'agrément */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Détails de l'Agrément</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Titulaire :</span>
                  <span className="font-semibold">SEBTI Fatiha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro ADELI :</span>
                  <span className="font-semibold">929334555</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SIRET :</span>
                  <span className="font-semibold">884 314 097 00012</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Code APE :</span>
                  <span className="font-semibold">8690F</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Localisation du Centre</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Adresse :</span>
                  <span className="font-semibold">82 rue Henri Barbusse</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ville :</span>
                  <span className="font-semibold">Clichy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Code postal :</span>
                  <span className="font-semibold">92110</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Département :</span>
                  <span className="font-semibold">Hauts-de-Seine (92)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Validité de l'agrément */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Validité et Portée de l'Agrément</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>✓ Centre agréé</strong> par la préfecture des Hauts-de-Seine pour réaliser des tests psychotechniques d'aptitude à la conduite.
              </p>
              <p>
                <strong>✓ Psychologue certifiée</strong> inscrite au répertoire ADELI sous le numéro 929334555.
              </p>
              <p>
                <strong>✓ Habilitation officielle</strong> pour les tests après invalidation, suspension ou annulation du permis de conduire.
              </p>
              <p>
                <strong>✓ Conformité</strong> aux exigences réglementaires en vigueur pour les centres de tests psychotechniques.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions sur l'Agrément ?</h3>
            <p className="text-gray-600 mb-6">
              Pour toute question concernant notre agrément préfectoral ou nos certifications
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:0765565379"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                07 65 56 53 79
              </a>
              <a 
                href="mailto:sebtifatiha@live.fr"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <FAQ />
    </>
  )
}
