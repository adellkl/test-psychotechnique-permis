'use client'

import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    // Masquer tout le contenu du body sauf la page 404
    document.body.style.overflow = 'hidden'
    const style = document.createElement('style')
    style.id = 'hide-layout-404'
    style.textContent = `
      body > div:not([data-404-page]) { display: none !important; }
    `
    document.head.appendChild(style)
    
    return () => {
      document.body.style.overflow = 'auto'
      const styleEl = document.getElementById('hide-layout-404')
      if (styleEl) styleEl.remove()
    }
  }, [])

  return (
    <div data-404-page className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center" style={{ zIndex: 9999 }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10 px-6">
        {/* 404 */}
        <h1 className="text-9xl font-black mb-6">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            404
          </span>
        </h1>

        {/* Titre */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Oups ! Page introuvable
        </h2>

        {/* Description */}
        <p className="text-lg text-blue-100 mb-8">
          La page que vous recherchez semble avoir disparu. Revenez à l'accueil ou prenez rendez-vous.
        </p>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://test-psychotechnique-permis.com/"
            className="inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xl transition-all duration-300 hover:scale-105"
          >
            Retour à l'accueil
          </a>

          <a
            href="https://test-psychotechnique-permis.com/prendre-rendez-vous"
            className="inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-xl transition-all duration-300 hover:scale-105"
          >
            Prendre rendez-vous
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  )
}
