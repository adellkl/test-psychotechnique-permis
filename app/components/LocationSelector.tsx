'use client'

import { useState } from 'react'

// Composant SEO-optimisé pour la sélection de centres de test psychotechnique
// Affiche les informations de localisation pour Clichy (92110) et Colombes (92700)
const centers = [
  {
    id: 'clichy',
    name: 'Centre de Clichy',
    code: '92110',
    address: '82 Rue Henri Barbusse, 92110 Clichy',
    color: 'purple',
    transport: [
      {
        icon: 'metro',
        title: 'Métro Ligne 13',
        detail: '3 min à pied - Mairie de Clichy'
      },
      {
        icon: 'train',
        title: 'Gare Clichy-Levallois',
        detail: '10 min à pied'
      },
      {
        icon: 'phone',
        title: 'Téléphone',
        detail: '07 65 56 53 79'
      }
    ]
  },
  {
    id: 'colombes',
    name: 'Centre de Colombes',
    code: '92700',
    address: '14 Rue de Mantes - Pro Drive Academy, 92700 Colombes',
    color: 'blue',
    transport: [
      {
        icon: 'phone',
        title: 'Téléphone',
        detail: '07 65 56 53 79'
      },
      {
        icon: 'email',
        title: 'Email',
        detail: 'contact@test-psychotechnique-permis.com'
      }
    ]
  }
]

export default function LocationSelector() {
  const [selectedCenter, setSelectedCenter] = useState(0)

  const currentCenter = centers[selectedCenter]
  const colorClasses = {
    purple: {
      bg: 'from-purple-50 to-white',
      border: 'border-purple-200',
      text: 'text-purple-900',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      buttonInactive: 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    },
    blue: {
      bg: 'from-blue-50 to-white',
      border: 'border-blue-200',
      text: 'text-blue-900',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      buttonInactive: 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    }
  }

  const colors = colorClasses[currentCenter.color as keyof typeof colorClasses]

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'metro':
        return (
          <svg className={`w-4 h-4 ${colors.iconText}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        )
      case 'train':
        return (
          <svg className={`w-4 h-4 ${colors.iconText}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
            <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'phone':
        return (
          <svg className={`w-4 h-4 ${colors.iconText}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        )
      case 'email':
        return (
          <svg className={`w-4 h-4 ${colors.iconText}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fade-in-up animation-delay-600">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Localisation idéale</h3>
        <p className="text-gray-600 leading-relaxed">
          Deux centres agréés proches de Paris pour vous accueillir
        </p>
      </div>

      {/* Sélecteur de centre */}
      <div className="flex flex-row gap-2 sm:gap-3 mb-6">
        {centers.map((center, index) => (
          <button
            key={center.id}
            onClick={() => setSelectedCenter(index)}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-semibold text-xs sm:text-base transition-all duration-300 transform ${
              selectedCenter === index
                ? `${colorClasses[center.color as keyof typeof colorClasses].button} text-white shadow-lg scale-105`
                : `${colorClasses[center.color as keyof typeof colorClasses].buttonInactive}`
            }`}
          >
            <span className="hidden sm:inline">{center.name}</span>
            <span className="sm:hidden">{center.name.replace('Centre de ', '')}</span>
          </button>
        ))}
      </div>

      {/* Carte du centre sélectionné avec animation */}
      <div
        key={currentCenter.id}
        className={`border-2 ${colors.border} rounded-xl p-4 bg-gradient-to-br ${colors.bg} transition-all duration-500 animate-fade-in`}
      >
        <h4 className={`font-bold ${colors.text} mb-3 text-lg`}>
          📍 {currentCenter.name} ({currentCenter.code})
        </h4>
        <p className="text-gray-700 font-semibold mb-4">{currentCenter.address}</p>

        <div className="space-y-2">
          {currentCenter.transport.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 bg-white rounded-lg transition-all duration-300 hover:shadow-md"
            >
              <div className={`w-8 h-8 ${colors.iconBg} rounded-full flex items-center justify-center`}>
                {getIcon(item.icon)}
              </div>
              <div>
                <p className="font-semibold text-gray-700">{item.title}</p>
                <p className="text-sm text-gray-600">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateurs */}
      <div className="flex justify-center gap-2 mt-4">
        {centers.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedCenter(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              selectedCenter === index ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300'
            }`}
            aria-label={`Sélectionner le centre ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
