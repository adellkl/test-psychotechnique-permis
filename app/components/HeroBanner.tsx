import Link from "next/link"

export default function HeroBanner() {
  return (
    <section className="relative bg-white overflow-hidden h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50"></div>
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Contenu texte */}
          <div className="space-y-4 lg:space-y-8 mt-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 lg:py-2 bg-emerald-100 text-emerald-800 rounded-full text-xs sm:text-sm font-medium animate-smooth-bounce">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="whitespace-nowrap">Deuxième chance gratuite</span>
            </div>

            {/* Titre */}
            <div className="space-y-1 lg:space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
                <span className="block animate-text-reveal animation-delay-200">Centre de Test</span>
                <span className="block text-blue-600 animate-text-reveal animation-delay-500">Psychotechnique</span>
                <span className="block animate-text-reveal animation-delay-800">Permis</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed animate-slide-in-right animation-delay-1100">
                En cas d'échec, une deuxième chance vous sera accordée{" "}
                <span className="font-bold text-emerald-600 animate-highlight animation-delay-1400">gratuitement !</span>
              </p>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 animate-slide-in-left animation-delay-1600">
              <Link
                href="tel:0765565379"
                className="group flex items-center justify-center gap-2 lg:gap-3 px-6 py-3 lg:px-8 lg:py-4 bg-blue-600 text-white rounded-lg lg:rounded-xl font-semibold text-base lg:text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-button-glow w-full sm:w-auto"
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5 group-hover:animate-ring" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="whitespace-nowrap">07 65 56 53 79</span>
              </Link>

              <Link
                href="/prendre-rendez-vous"
                className="group flex items-center justify-center gap-2 lg:gap-3 px-6 py-3 lg:px-8 lg:py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg lg:rounded-xl font-semibold text-base lg:text-lg hover:bg-blue-50 transition-all duration-300 w-full sm:w-auto"
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Prendre rendez-vous
              </Link>
            </div>

            {/* Avantages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 pt-4 lg:pt-8 animate-fade-in-up animation-delay-1900">
              <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-9 h-9 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm lg:text-base font-medium text-gray-900">Clichy (92)</p>
                  <p className="text-xs lg:text-sm text-gray-500">3 min du métro</p>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-9 h-9 lg:w-10 lg:h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm lg:text-base font-medium text-gray-900">Paiement</p>
                  <p className="text-xs lg:text-sm text-gray-500">Sur place</p>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-9 h-9 lg:w-10 lg:h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm lg:text-base font-medium text-gray-900">Horaires</p>
                  <p className="text-xs lg:text-sm text-gray-500">Lun-Sam 9h-19h</p>
                </div>
              </div>
            </div>

          </div>

          {/* Mockup iPhone */}
          <div className="relative hidden lg:block lg:order-first">
            {/* Particules flottantes en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-2 h-2 bg-blue-300 rounded-full animate-float-particle-1 opacity-60"></div>
              <div className="absolute top-20 right-16 w-1 h-1 bg-emerald-300 rounded-full animate-float-particle-2 opacity-50"></div>
              <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-purple-300 rounded-full animate-float-particle-3 opacity-40"></div>
              <div className="absolute top-32 left-32 w-1 h-1 bg-pink-300 rounded-full animate-float-particle-4 opacity-50"></div>
            </div>

            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-[3rem] transform rotate-6 animate-pulse-glow"></div>

              {/* iPhone Mockup */}
              <div className="relative bg-gray-900 p-3 rounded-[3rem] shadow-2xl animate-card-appear animate-card-float-3d hover:shadow-3xl transition-shadow duration-500 max-w-[340px] mx-auto">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-7 bg-gray-900 rounded-b-3xl z-10"></div>

                {/* Screen */}
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-inner">
                  {/* Status Bar */}
                  <div className="bg-white px-8 pt-3 pb-2 flex justify-between items-center text-xs font-semibold">
                    <span className="text-gray-900">9:41</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414z" clipRule="evenodd" />
                      </svg>
                      <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                      </svg>
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="bg-white px-5 py-4 space-y-4 max-h-[520px] overflow-y-auto">
                    {/* Header */}
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Mon Rendez-vous</h1>
                      <p className="text-sm text-gray-500">Test Psychotechnique</p>
                    </div>

                    {/* Confirmation Badge */}
                    <div className="bg-emerald-500 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-white">
                        <p className="font-bold text-lg">Réservation confirmée</p>
                        <p className="text-sm text-white/90">Email de confirmation envoyé</p>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Informations Client</p>
                      <div className="flex items-center gap-2 text-gray-900">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Jean Dupont</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>j.dupont@email.fr</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>06 12 ** ** **</span>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                        <span className="text-xs font-semibold">JAN</span>
                        <span className="text-lg font-bold leading-none">17</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Date & Heure</p>
                        <p className="font-bold text-gray-900 mt-1">Lundi 15 Janvier 2025</p>
                        <p className="text-sm text-gray-600">10:00 - 12:00 (2h)</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="bg-purple-50 rounded-xl p-4 flex items-start gap-3">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Localisation</p>
                        <p className="font-bold text-gray-900 mt-1">Centre Clichy</p>
                        <p className="text-sm text-gray-600">82 Rue Henri Barbusse</p>
                        <p className="text-sm text-gray-600">92110 Clichy</p>
                        <div className="flex items-center gap-1 mt-1 text-purple-600 text-xs">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          <span>3 min Métro ligne 13</span>
                        </div>
                      </div>
                    </div>

                    {/* Guarantee */}
                    <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl p-4 flex items-start gap-3">
                      <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">⭐</span>
                      </div>
                      <div className="flex-1 text-white">
                        <p className="text-xs font-semibold uppercase tracking-wide">Garantie 2ème Chance</p>
                        <p className="font-semibold mt-1">Offerte gratuitement</p>
                        <p className="text-sm text-white/90">En cas d'échec au test</p>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="flex justify-center py-2 bg-white">
                    <div className="w-32 h-1 bg-gray-900 rounded-full opacity-40"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Éléments décoratifs flottants */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-float-enhanced opacity-80 shadow-lg"></div>
            <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full animate-float-reverse-enhanced opacity-60 shadow-md"></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full animate-pulse-enhanced opacity-70 shadow-sm"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
