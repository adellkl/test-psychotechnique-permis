import Link from 'next/link'
import HeroBanner from './components/HeroBanner'
import FAQ from './components/FAQ'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      
      {/* À propos du centre */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              À propos du centre
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenu principal */}
            <div className="space-y-8 animate-slide-in-left">
              {/* Localisation */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Localisation idéale</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Notre centre de test psychotechnique est situé à <span className="font-semibold text-blue-600">3 min du métro Mairie de Clichy</span>, sur la ligne 13 et à <span className="font-semibold text-blue-600">10 min à pied de la gare de Clichy-Levallois</span>, vous pouvez donc vous y rendre depuis Paris ainsi que de toute l'Île de France.
                    </p>
                  </div>
                </div>
              </div>

              {/* Paiement */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Paiement simplifié</h3>
                    <p className="text-gray-600 leading-relaxed">
                      <span className="font-semibold text-emerald-600">Paiement sur place</span>, aucun acompte ne vous sera demandé en ligne.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deuxième chance gratuite */}
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-8 rounded-2xl border border-blue-100">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Une deuxième chance gratuite</h3>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    En cas d'échec
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6 text-center">
                  Le test psychotechnique peut être un moment stressant pour certains et il peut arriver que votre test soit un échec à cause de cela. Notre psychologue vous proposera de passer le test une <span className="font-bold text-blue-600">deuxième fois gratuitement</span>, pour vous donner toutes les chances de récupérer votre permis de conduire.
                </p>
                
                <div className="text-center">
                  <Link 
                    href="/a-propos" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    En savoir plus
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Nos Services
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 leading-relaxed mb-6 animate-slide-in-left">
                Le centre de Clichy est un <span className="font-semibold text-blue-600">centre agréé préfecture</span> pour les tests psychotechniques d'aptitude à la conduite, lorsque l'on perd son permis de conduire suite à :
              </p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Invalidation */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animation-delay-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">L'invalidation du permis</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 text-center">
                Après une invalidation du permis de conduire pour solde nul de <span className="font-semibold text-red-600">6 mois ou plus</span>, un test psychotechnique est nécessaire pour récupérer le permis.
              </p>
              <div className="text-center">
                <Link 
                  href="/invalidation-permis" 
                  className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                >
                  En savoir plus
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Suspension */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animation-delay-400">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM9 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM11 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">La suspension du permis</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 text-center">
                Dans le cas d'une suspension de permis de conduire de <span className="font-semibold text-orange-600">6 mois ou plus</span>, il est nécessaire d'effectuer un test psychotechnique.
              </p>
              <div className="text-center">
                <Link 
                  href="/suspension-permis" 
                  className="inline-flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
                >
                  En savoir plus
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Annulation */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animation-delay-600">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">L'annulation du permis</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 text-center">
                Dans le cas d'une annulation de votre permis de conduire, la première étape est également de <span className="font-semibold text-purple-600">passer un test psychotechnique</span>.
              </p>
              <div className="text-center">
                <Link 
                  href="/annulation-permis" 
                  className="inline-flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                >
                  En savoir plus
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Principal */}
          <div className="text-center animate-smooth-bounce animation-delay-800">
            <Link 
              href="/rendez-vous" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi choisir notre centre */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Pourquoi choisir notre centre ?
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed animate-slide-in-left">
              Notre centre propose des rendez-vous de tests psychotechniques en ligne ou par téléphone en fonction de vos disponibilités.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tarifs et Paiement */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fade-in-up animation-delay-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tarifs transparents</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Prix du test</span>
                  <span className="text-2xl font-bold text-emerald-600">90€</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">Aucun acompte</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">Paiement sur place</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">Deuxième chance gratuite</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Psychologue Agréée */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fade-in-up animation-delay-400">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Psychologue certifiée</h3>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Notre psychologue est <span className="font-semibold text-blue-600">agréée par la préfecture</span> et dispose d'un numéro ADELI délivré par l'ARS.
                </p>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Numéro ADELI</p>
                  <p className="text-xl font-bold text-blue-600 font-mono">929334555</p>
                </div>
                
                <Link 
                  href="/agrement-prefectoral" 
                  className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Voir l'agrément
                </Link>
              </div>
            </div>

            {/* Localisation */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fade-in-up animation-delay-600">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Localisation idéale</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed text-center">
                  Proche de Paris, situé à <span className="font-semibold text-purple-600">3min du métro Mairie de Clichy</span>, sur la ligne 13 et à <span className="font-semibold text-purple-600">10min à pied de la gare de Clichy-Levallois</span>.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Métro Ligne 13</p>
                      <p className="text-sm text-gray-600">3 min à pied</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Gare Clichy-Levallois</p>
                      <p className="text-sm text-gray-600">10 min à pied</p>
                    </div>
                  </div>
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
