import FAQ from '../components/FAQ'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "À Propos - Test Psychotechnique Permis Clichy | Centre Agréé Préfecture",
  description: "Découvrez notre centre de test psychotechnique agréé préfecture à Clichy. Psychologue certifiée ADELI, proche métro ligne 13. Deuxième chance gratuite en cas d'échec.",
  keywords: "à propos test psychotechnique, centre agréé Clichy, psychologue ADELI, métro ligne 13, Hauts-de-Seine 92",
  alternates: {
    canonical: "https://test-psychotechnique-permis.com/a-propos",
  },
}

export default function APropos() {
  return (
    <>
      {/* Hero Section avec image */}
      <section className="relative py-20 pt-40 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                À Propos de Notre Centre
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                <strong>Test Psychotechnique Permis</strong> est votre centre agréé préfecture spécialisé dans les tests psychotechniques d'aptitude à la conduite, situé au cœur de Clichy.
              </p>
              <div className="flex items-center gap-4 text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">82 Rue Henri Barbusse, 92110 Clichy</span>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Centre Test Psychotechnique Permis - Accueil professionnel"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">90€</div>
                  <div className="text-sm text-gray-600">Test complet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Passer son test psychotechnique proche de Paris */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Passer son test psychotechnique proche de Paris
              </h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Situé à <strong>Clichy en Île-de-France</strong>, notre centre de test psychotechnique se situe dans une zone bien desservie par le métro, le transilien et les bus. Proche de Paris, venez passer votre test rapidement et facilement. Prenez rendez-vous en quelques clics. Paiement sur place, aucun acompte ne vous sera demandé en ligne.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Permis annulé ? Invalidé ? Ou suspendu ? Récupérez votre permis en passant un test psychotechnique dans notre centre de Clichy dans le département des <strong>Hauts-de-Seine 92</strong>.
                </p>

                <p className="text-gray-700 leading-relaxed mb-8">
                  La psychologue chargée de la passation vous reçoit dans un cadre apaisant. Elle vous expliquera également les démarches ultérieures à suivre pour la récupération de votre permis de conduire en fonction de votre situation.
                </p>

                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Une deuxième chance gratuite en cas d'échec à votre test psychotechnique
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Le test psychotechnique peut être un moment stressant pour certains et il peut arriver que votre test soit un échec à cause de cela. Notre psychologue vous proposera de passer le test une deuxième fois gratuitement, pour vous donner toutes les chances de récupérer votre permis de conduire.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/metro-13.jpg"
                  alt="Métro Mairie de Clichy ligne 13 - Accès facile au centre"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Métro Ligne 13 - 3min
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre équipe */}
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
              <div className="absolute top-4 right-4 bg-blue-600 text-white p-3 rounded-lg">
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
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Certification ADELI</h4>
                    <p className="text-gray-600">Numéro d'agrément 929334555 délivré par l'ARS</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Expérience Professionnelle</h4>
                    <p className="text-gray-600">Spécialisée dans les tests psychotechniques d'aptitude à la conduite</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
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

      {/* Qu'est-ce qu'un test psychotechnique */}
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

          <div className="space-y-12">
            {/* 1ère étape */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-700 font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">1ère étape</h3>
                  <p className="text-gray-700 mb-4">
                    L'entretien individuel doit permettre d'aborder les points suivants :
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>La situation du conducteur (son histoire, sa situation familiale et professionnelle, sa santé, son hygiène de vie)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Les raisons de la sanction qui l'ont mené à une invalidation, une suspension ou une annulation du permis de conduire</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Ses usages d'un véhicule motorisé (enjeux professionnels, personnels et sociaux)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Une confrontation aux faits, ayant justifié la sanction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Sa motivation à une réhabilitation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2ème étape */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-700 font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2ème étape</h3>
                  <p className="text-gray-700 mb-4">
                    Les tests psychotechniques doivent en outre permettre l'exploration de divers champs de l'activité psychomotrice en lien avec la conduite tels que :
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>Les capacités visuo-attentionnelles</strong> (Capacités visuelles)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>La vitesse de traitement</strong> de l'information et la vitesse de réaction</span>
                    </li>
                    <li className="flex items-start gap-3">
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
