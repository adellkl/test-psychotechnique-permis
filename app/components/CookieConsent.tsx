'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    
    // Ne pas afficher sur les pages admin
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/test-email')) {
      return
    }
    
    // Vérifier si l'utilisateur a déjà accepté les cookies
    const consent = localStorage.getItem('cookieConsent')
    
    if (!consent) {
      // Afficher immédiatement
      setShowBanner(true)
    }
  }, [pathname])

  // Éviter les problèmes d'hydration SSR
  if (!mounted) return null

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-2 sm:p-4 pointer-events-none">
      {/* Overlay subtil */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" />
      
      {/* Banner */}
      <div className="relative w-full max-w-4xl mb-2 sm:mb-4 pointer-events-auto animate-in slide-in-from-bottom-5 duration-500">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Contenu */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
              {/* Icône - Masquée sur mobile */}
              <div className="hidden sm:flex flex-shrink-0">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
              </div>

              {/* Texte */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">
                  🍪 Cookies et confidentialité
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site, analyser le trafic et personnaliser le contenu. 
                  En cliquant sur <strong>"Accepter"</strong>, vous consentez à l'utilisation de tous les cookies. 
                  Consultez notre{' '}
                  <a href="/mentions-legales" className="text-blue-600 hover:text-blue-700 font-medium underline">
                    politique de confidentialité
                  </a>
                  {' '}pour plus d'informations.
                </p>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleAccept}
                    className="w-full sm:w-auto sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105"
                  >
                    Accepter tous les cookies
                  </button>
                  <button
                    onClick={handleDecline}
                    className="w-full sm:w-auto sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-gray-200 transition-all duration-300 active:scale-95"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Barre décorative */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
        </div>
      </div>
    </div>
  )
}
