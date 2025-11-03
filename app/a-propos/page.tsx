import FAQ from '../components/FAQ'
import AboutCenterSelector from '../components/AboutCenterSelector'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "À Propos - Centres Test Psychotechnique Clichy & Colombes 92 | Agréés Préfecture",
  description: "Découvrez nos 2 centres agréés préfecture : Test Psychotechnique Permis à Clichy (métro ligne 13, psychologue ADELI certifiée, 2ème chance gratuite) et Centre 2e Chance à Colombes. Invalidation, suspension, annulation permis. Hauts-de-Seine 92110 et 92700.",
  keywords: "à propos test psychotechnique, centre agréé Clichy 92110, Centre 2e Chance Colombes 92700, psychologue ADELI 929334555, métro ligne 13 Clichy, test psychotechnique Hauts-de-Seine, centre agréé préfecture 92, récupération permis Clichy, récupération permis Colombes, test psychotechnique proche Paris, deuxième chance gratuite, psychologue agréé permis conduire",
  openGraph: {
    title: "À Propos - 2 Centres Test Psychotechnique Agréés Clichy & Colombes (92)",
    description: "Centres agréés préfecture dans les Hauts-de-Seine. Clichy : psychologue ADELI, métro ligne 13, 2ème chance gratuite. Colombes : Centre 2e Chance, service rapide.",
    url: "https://test-psychotechnique-permis.com/a-propos",
    type: "website",
    locale: "fr_FR",
  },
  alternates: {
    canonical: "https://test-psychotechnique-permis.com/a-propos",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function APropos() {
  return (
    <>
      <AboutCenterSelector />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Passer son test psychotechnique proche de Paris
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Deux centres agréés préfecture dans les Hauts-de-Seine pour vous accueillir
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Centre de Clichy</h3>
                  <p className="text-sm text-gray-600 font-semibold">92110 - Hauts-de-Seine</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Situé à <strong>Clichy en Île-de-France</strong>, notre centre de test psychotechnique se situe dans une zone bien desservie par le métro, le transilien et les bus. Proche de Paris, venez passer votre test rapidement et facilement.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">📍 Informations pratiques</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-700 font-bold">•</span>
                      <span><strong>Adresse :</strong> 82 Rue Henri Barbusse, 92110 Clichy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-700 font-bold">•</span>
                      <span><strong>Téléphone :</strong> 07 65 56 53 79</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-700 font-bold">•</span>
                      <span><strong>Métro :</strong> Ligne 13 - Mairie de Clichy (3 min à pied)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-700 font-bold">•</span>
                      <span><strong>Gare :</strong> Clichy-Levallois (10 min à pied)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 border-l-4 border-slate-700 p-4 rounded-r-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    ✨ Deuxième chance gratuite
                  </p>
                  <p className="text-sm text-gray-700">
                    Notre psychologue certifiée ADELI vous propose de repasser le test gratuitement en cas d'échec.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Centre 2e Chance</h3>
                  <p className="text-sm text-gray-600 font-semibold">92700 Colombes - Hauts-de-Seine</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Implanté au sein des bureaux de <strong>Prodrive Academy</strong>, notre centre est agréé pour la réalisation des tests psychotechniques d'aptitude à la conduite.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">📍 Informations pratiques</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-700 font-bold">•</span>
                      <span><strong>Adresse :</strong> 14 Rue de Mantes, 92700 Colombes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-700 font-bold">•</span>
                      <span><strong>Téléphone :</strong> 07 65 56 53 79</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-700 font-bold">•</span>
                      <span><strong>Email :</strong> contact@test-psychotechnique-permis.com</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-700 font-bold">•</span>
                      <span><strong>Accès :</strong> Proche du T2 arrêt Jacqueline Auriol (5 min)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 border-l-4 border-slate-700 p-4 rounded-r-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    ⚡ Service rapide
                  </p>
                  <p className="text-sm text-gray-700">
                    Prise de rendez-vous simple et résultats transmis rapidement pour votre dossier préfecture.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Permis annulé, invalidé ou suspendu ?
            </h3>
            <p className="text-gray-700 leading-relaxed text-center mb-6">
              Récupérez votre permis en passant un test psychotechnique dans l'un de nos centres agréés dans le département des <strong>Hauts-de-Seine 92</strong>. Nos psychologues vous reçoivent dans un cadre apaisant et vous expliquent les démarches ultérieures à suivre pour la récupération de votre permis de conduire.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Paiement sur place</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Aucun acompte en ligne</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">RDV en quelques clics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notre Équipe Professionnelle
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une équipe de professionnels qualifiés pour vous accompagner dans votre démarche de récupération du permis de conduire.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://lh3.googleusercontent.com/p/AF1QipPl6CYxHRPJgTMrnTDkdm3Kmbtc9ueH90ZpEGI4=s1360-w1360-h1020-rw"
                  alt="SEBTI Fatiha - Psychologue certifiée ADELI pour tests psychotechniques"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 bg-slate-800 text-white p-3 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="font-bold">ADELI</div>
                  <div className="text-xs">929334555</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Psychologue Agréée Préfecture
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Certification ADELI</h4>
                    <p className="text-gray-600">Numéro d'agrément 929334555 délivré par l'ARS</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Expérience Professionnelle</h4>
                    <p className="text-gray-600">Spécialisée dans les tests psychotechniques d'aptitude à la conduite</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Approche Bienveillante</h4>
                    <p className="text-gray-600">Accompagnement personnalisé dans un cadre apaisant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
            Qu'est-ce qu'un test psychotechnique d'aptitude à la conduite ?
          </h2>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-relaxed mb-8">
              Un test psychotechnique est réalisé par un psychologue agréé préfecture, il se déroule en deux temps :
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-700 font-bold text-base sm:text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">1ère étape</h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                    L'entretien individuel doit permettre d'aborder les points suivants :
                  </p>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>La situation du conducteur (son histoire, sa situation familiale et professionnelle, sa santé, son hygiène de vie)</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Les raisons de la sanction qui l'ont mené à une invalidation, une suspension ou une annulation du permis de conduire</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Ses usages d'un véhicule motorisé (enjeux professionnels, personnels et sociaux)</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Une confrontation aux faits, ayant justifié la sanction</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Sa motivation à une réhabilitation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-700 font-bold text-base sm:text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">2ème étape</h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                    Les tests psychotechniques doivent en outre permettre l'exploration de divers champs de l'activité psychomotrice en lien avec la conduite tels que :
                  </p>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>Les capacités visuo-attentionnelles</strong> (Capacités visuelles)</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>La vitesse de traitement</strong> de l'information et la vitesse de réaction</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>La capacité de coordination</strong> des mouvements et les fonctions exécutives d'inhibition</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
    </>
  )
}
