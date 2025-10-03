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
        <button 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed opacity-75"
          disabled
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Laisser un avis Google
        </button>
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
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            Questions fréquentes
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed animate-slide-in-left">
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
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
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
                <div className="px-6 pb-4 text-gray-600 leading-relaxed animate-slide-down">
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
