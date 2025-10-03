import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Page non trouvée - Test Psychotechnique Permis Clichy",
  description: "La page que vous recherchez n'existe pas. Retournez à l'accueil du centre Test Psychotechnique Permis à Clichy pour prendre rendez-vous.",
  robots: "noindex, nofollow",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-gray-900 mb-4">404</h1>
        
        {/* Error Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Page non trouvée
        </h2>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          <br />
          Retournez à l'accueil pour prendre rendez-vous pour votre test psychotechnique.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Retour à l'accueil
          </Link>
          
          <Link 
            href="/prendre-rendez-vous"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Prendre rendez-vous
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vous cherchez peut-être :
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <Link 
              href="/invalidation-permis" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Test après invalidation
            </Link>
            <Link 
              href="/suspension-permis" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Test après suspension
            </Link>
            <Link 
              href="/annulation-permis" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Test après annulation
            </Link>
            <Link 
              href="/contact" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Nous contacter
            </Link>
            <Link 
              href="/a-propos" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              À propos
            </Link>
            <Link 
              href="/mentions-legales" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Mentions légales
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-gray-600">
          <p className="mb-2">
            <strong>Besoin d'aide ?</strong> Contactez-nous directement :
          </p>
          <p className="text-lg font-semibold text-blue-600">
            📞 07 65 56 53 79
          </p>
          <p className="text-sm">
            Centre agréé préfecture - 82 Rue Henri Barbusse, 92110 Clichy
          </p>
        </div>
      </div>
    </div>
  )
}
