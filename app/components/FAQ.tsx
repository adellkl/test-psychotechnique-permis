'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string | JSX.Element
}

const faqData: FAQItem[] = [
  {
    question: "Le Test psychotechnique est-il obligatoire ?",
    answer: "Un Test psychotechniques est obligatoirement demandé par la Préfecture : si vous êtes sous le coup d'une annulation de votre permis de conduire, d'une suspension supérieur ou égal à six mois et dans le cas d'une invalidation pour solde nul."
  },
  {
    question: "Où passer un test psychotechnique d'aptitude à la conduite ?",
    answer: (
      <div className="space-y-4">
        <p>Vous devez passer votre test psychotechnique dans un centre agréé préfecture.</p>
        <p>Il doit être réalisé par un psychologue agréé préfecture ayant un numéro ADELI délivré par l'ARS.</p>
        <p>Sachez également, que vous pouvez passer votre test psychotechnique dans le département de votre choix, quelque soit votre lieu de résidence.</p>
        <p className="font-semibold text-blue-600">Notre centre situé à Clichy accueille des candidats de tous les départements d'Île-de-France vous pouvez venir de :</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Paris 75</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Seine-et-Marne 77</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Yvelines 78</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Essonne 91</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Hauts-de-Seine 92</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Seine-Saint-Denis 93</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Val-de-Marne 94</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Val-d'Oise 95</span>
          </div>
        </div>
      </div>
    )
  },
  {
    question: "Comment se rendre à nos centres depuis Paris et la région ?",
    answer: (
      <div className="space-y-6">
        <p className="font-semibold text-gray-900">Nos deux centres sont facilement accessibles depuis toute l'Île-de-France :</p>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🚇</span>
              Depuis La Défense
            </h4>
            <div className="space-y-2 text-sm">
              <div className="pl-6">
                <p className="font-semibold text-blue-800">→ Vers Clichy :</p>
                <p className="text-gray-700">Transilien L jusqu'à Clichy-Levallois (1 station - 3 min), puis 8 min à pied</p>
                <p className="text-gray-600 text-xs mt-1">Ou Métro 1 jusqu'à Charles de Gaulle-Étoile, puis Ligne 13 (15 min total)</p>
                <p className="text-gray-600 text-xs mt-1">📍 82 Rue Henri Barbusse</p>
              </div>
              <div className="pl-6 mt-3">
                <p className="font-semibold text-purple-800">→ Vers Colombes :</p>
                <p className="text-gray-700">Tram T2 direction Pont de Bezons - Arrêt Charlebourg (2 stations - 5 min)</p>
                <p className="text-gray-600 text-xs mt-1">📍 14 Rue de Mantes, à 3 min à pied du tram</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🚉</span>
              Depuis Gare du Nord
            </h4>
            <div className="space-y-2 text-sm">
              <div className="pl-6">
                <p className="font-semibold text-blue-800">→ Vers Clichy :</p>
                <p className="text-gray-700">Métro ligne 5 jusqu'à Place de Clichy (10 min), puis 10 min à pied</p>
                <p className="text-gray-600 text-xs mt-1">Ou Ligne 2 puis 13 via Charles de Gaulle-Étoile (20 min total)</p>
              </div>
              <div className="pl-6 mt-3">
                <p className="font-semibold text-purple-800">→ Vers Colombes :</p>
                <p className="text-gray-700">RER D direction Orry-la-Ville - Arrêt La Garenne-Colombes (12 min)</p>
                <p className="text-gray-600 text-xs mt-1">📍 Puis 5 min à pied jusqu'au 14 Rue de Mantes</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🚇</span>
              Depuis Châtelet
            </h4>
            <div className="space-y-2 text-sm">
              <div className="pl-6">
                <p className="font-semibold text-blue-800">→ Vers Clichy :</p>
                <p className="text-gray-700">Métro ligne 14 jusqu'à Saint-Lazare, puis ligne 13 direction Saint-Denis (15 min total)</p>
                <p className="text-gray-600 text-xs mt-1">Arrêt Mairie de Clichy, puis 3 min à pied</p>
              </div>
              <div className="pl-6 mt-3">
                <p className="font-semibold text-purple-800">→ Vers Colombes :</p>
                <p className="text-gray-700">RER C direction Pontoise/Montigny - Arrêt Colombes (direct en 15 min)</p>
                <p className="text-gray-600 text-xs mt-1">📍 Puis 7 min à pied jusqu'au 14 Rue de Mantes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
          <p className="text-sm text-gray-700">
            <strong>💡 Conseil :</strong> Prévoyez d'arriver 15 minutes avant votre rendez-vous. Les deux centres sont très bien desservis par les transports en commun !
          </p>
        </div>
      </div>
    )
  },
  {
    question: "Comment réussir son test psychotechnique ?",
    answer: (
      <div className="space-y-4">
        <p>Lors de la passation d'un test psychotechnique le psychologue évalue votre capacité de concentration, d'attention ainsi que votre coordination motrice. L'objectif de l'entretien et des tests psychotechniques est de déterminer si le conducteur est en capacité de repasser ou de récupérer son permis de conduire, de respecter le Code de la route et les conditions de circulation des autres usagers pour favoriser la sécurité de tous.</p>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="font-semibold text-green-700">De manière générale 97 % des candidats ont un avis favorable. Vous avez donc toutes les chances de réussir votre test psychotechnique.</p>
        </div>
        <p>Alors pas de stress ! Restez calme, concentré et venez reposé à votre rendez-vous.</p>
        <p>Aussi, La bienveillance et les conseils du psychologue, vous aideront à diminuer l'appréhension relative au passage des tests.</p>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="font-semibold text-blue-700">L'un des gros avantages de notre centre est que vous aurez de toute manière droit à un second test gratuit si vous ratez le premier !</p>
        </div>
      </div>
    )
  },
  {
    question: "Puis-je avoir une deuxième chance en cas d'échec ?",
    answer: (
      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <p className="font-semibold text-emerald-700">Oui, l'un des gros avantages de notre centre est que vous aurez de toute manière droit à un second test psychotechnique gratuit en cas d'échec !</p>
      </div>
    )
  },
  {
    question: "Comment laisser un avis Google sur notre centre ?",
    answer: (
      <div className="text-center">
        <p className="mb-4">Après votre rendez-vous, merci de donner votre avis sur notre centre en cliquant ici :</p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Test+Psychotechnique+Permis+82+Rue+Henri+Barbusse+92110+Clichy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
          </svg>
          Laisser un avis Google
        </a>
      </div>
    )
  }
]

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 animate-fade-in-up">
            Questions fréquentes
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed animate-slide-in-left">
            Bienvenue dans notre Foire aux Questions (FAQ) pour notre Centre de Test Psychotechnique à Clichy. Voici les réponses aux questions les plus fréquemment posées :
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 pr-2 sm:pr-4">
                  {item.question}
                </h3>
                <div className={`transform transition-transform duration-300 ${openItems.includes(index) ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openItems.includes(index) 
                  ? 'max-h-screen opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-sm sm:text-base text-gray-600 leading-relaxed animate-slide-down">
                  {typeof item.answer === 'string' ? (
                    <p>{item.answer}</p>
                  ) : (
                    item.answer
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
