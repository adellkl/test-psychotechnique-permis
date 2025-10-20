'use client'

import { useState } from 'react'
import Image from 'next/image'

// Composant SEO-optimisé pour la page À Propos avec sélection de centres
// Présente Test Psychotechnique Permis Clichy et Pro Drive Academy Colombes
const centers = [
  {
    id: 'clichy',
    name: 'Test Psychotechnique Permis - Clichy',
    code: '92110',
    title: 'À Propos de Notre Centre - Test psychotechnique à Clichy (92110)',
    address: '82 Rue Henri Barbusse, 92110 Clichy',
    phone: '07 65 56 53 79',
    color: 'blue',
    description: `Situé au 82 Rue Henri Barbusse à Clichy (92110), Test Psychotechnique Permis est un centre agréé préfecture spécialisé dans les tests psychotechniques pour le permis de conduire. Nous accompagnons les conducteurs souhaitant récupérer leur permis suspendu, annulé ou invalidé, ainsi que ceux devant renouveler leur aptitude à la conduite.`,
    description2: `Nos tests sont réalisés dans un environnement professionnel, calme et bienveillant, par une psychologue certifiée ADELI, afin de garantir une évaluation fiable et rapide de vos capacités.`,
    features: [
      'Une prise de rendez-vous simple et rapide',
      'Des résultats transmis rapidement',
      'Un accueil personnalisé pour chaque candidat',
      'Une équipe à l\'écoute, disponible pour répondre à vos questions',
      'Une deuxième chance gratuite en cas d\'échec'
    ],
    contact: {
      address: '82 Rue Henri Barbusse, 92110 Clichy',
      phone: '07 65 56 53 79',
      website: 'https://test-psychotechnique-permis.com'
    }
  },
  {
    id: 'colombes',
    name: 'Pro Drive Academy - Colombes',
    code: '92700',
    title: 'À propos de Pro Drive Academy - Test psychotechnique à Colombes (92700)',
    address: '14 Rue de Mantes, 92700 Colombes',
    phone: '07 65 56 53 79',
    email: 'contact@test-psychotechnique-permis.com',
    color: 'purple',
    description: `Situé au 14 Rue de Mantes à Colombes (92700), Pro Drive Academy est un centre agréé spécialisé dans les tests psychotechniques pour le permis de conduire. Nous accompagnons les conducteurs souhaitant récupérer leur permis suspendu, annulé ou invalidé, ainsi que ceux devant renouveler leur aptitude à la conduite.`,
    description2: `Nos tests sont réalisés dans un environnement professionnel, calme et bienveillant, par des experts agréés, afin de garantir une évaluation fiable et rapide de vos capacités.`,
    features: [
      'Une prise de rendez-vous simple et rapide',
      'Des résultats transmis rapidement',
      'Un accueil personnalisé pour chaque candidat',
      'Une équipe à l\'écoute, disponible pour répondre à vos questions'
    ],
    contact: {
      address: '14 Rue de Mantes, 92700 Colombes',
      phone: '07 65 56 53 79',
      email: 'contact@test-psychotechnique-permis.com'
    }
  }
]

export default function AboutCenterSelector() {
  const [selectedCenter, setSelectedCenter] = useState(0)

  const currentCenter = centers[selectedCenter]
  const colorClasses = {
    blue: {
      button: 'bg-blue-600 hover:bg-blue-700',
      buttonInactive: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
      badge: 'bg-blue-600',
      checkmark: 'bg-blue-100 text-blue-600'
    },
    purple: {
      button: 'bg-purple-600 hover:bg-purple-700',
      buttonInactive: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
      badge: 'bg-purple-600',
      checkmark: 'bg-purple-100 text-purple-600'
    }
  }

  const colors = colorClasses[currentCenter.color as keyof typeof colorClasses]

  return (
    <section className="relative py-12 sm:py-16 md:py-20 pt-24 sm:pt-32 md:pt-40 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Sélecteur de centre - Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-12 justify-center mt-12 sm:mt-0">
          {centers.map((center, index) => (
            <button
              key={center.id}
              onClick={() => setSelectedCenter(index)}
              className={`w-full sm:w-auto py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 transform text-sm sm:text-base ${selectedCenter === index
                  ? `${colorClasses[center.color as keyof typeof colorClasses].button} text-white shadow-lg scale-105`
                  : `${colorClasses[center.color as keyof typeof colorClasses].buttonInactive}`
                }`}
            >
              <span className="hidden sm:inline">{center.name}</span>
              <span className="sm:hidden">{center.name.split(' - ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Titre principal - Prend toute la largeur */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-12 leading-tight text-center lg:text-left">
          {currentCenter.title}
        </h1>

        {/* Contenu du centre sélectionné - Responsive */}
        <div
          key={currentCenter.id}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-center transition-all duration-500 animate-fade-in"
        >
          {/* Colonne texte */}
          <div className="order-2 lg:order-1">

            <div className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {currentCenter.description}
              </p>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {currentCenter.description2}
              </p>

              <div className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Chez {currentCenter.name.split(' - ')[0]}, nous mettons tout en œuvre pour vous offrir :
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {currentCenter.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.checkmark} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 rounded-xl border border-blue-200">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  Pour toute information ou réservation, contactez-nous :
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">Adresse :</span>
                    </div>
                    <span className="text-sm sm:text-base text-gray-700 ml-6 sm:ml-0">{currentCenter.contact.address}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">Téléphone :</span>
                    </div>
                    <a href={`tel:${currentCenter.contact.phone.replace(/\s/g, '')}`} className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium ml-6 sm:ml-0">
                      {currentCenter.contact.phone}
                    </a>
                  </div>
                  {currentCenter.contact.email && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">Email :</span>
                      </div>
                      <a href={`mailto:${currentCenter.contact.email}`} className="text-sm sm:text-base text-blue-600 hover:text-blue-700 break-all ml-6 sm:ml-0">
                        {currentCenter.contact.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt={`${currentCenter.name} - Accueil professionnel`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white p-3 sm:p-4 rounded-xl shadow-lg z-10">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">90€</div>
                <div className="text-xs sm:text-sm text-gray-600">Test complet</div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicateurs de pagination - Visible sur tous les formats */}
        <div className="flex justify-center gap-2 mt-8 sm:mt-12">
          {centers.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedCenter(index)}
              className={`h-2 rounded-full transition-all duration-300 hover:scale-110 ${
                selectedCenter === index 
                  ? 'w-8 bg-blue-600 shadow-md' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Sélectionner le centre ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
