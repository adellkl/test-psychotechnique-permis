import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Deuxième Chance - Test Psychotechnique */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--secondary-teal)' }}>Deuxième Chance - Test Psychotechnique</h3>
            <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
              <p>
                Notre centre de test psychotechnique est situé à <strong>3 min du métro Mairie de Clichy</strong>,
                sur la ligne 13 et à <strong>10 min à pied de la gare de Clichy-Levallois</strong>, vous pouvez
                donc vous y rendre depuis Paris ainsi que de toute l'Île de France.
              </p>
              <p className="font-medium" style={{ color: 'var(--success-green)' }}>
                💳 Paiement sur place, aucun acompte ne vous sera demandé en ligne.
              </p>
              <p className="font-medium" style={{ color: 'var(--warning-amber)' }}>
                🎯 En cas d'échec, une deuxième chance vous sera accordée gratuitement !
              </p>
            </div>
          </div>

          {/* Plan du site */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--secondary-teal)' }}>Plan du site</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/a-propos" className="text-gray-300 hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/invalidation-permis" className="text-gray-300 hover:text-white transition-colors">Invalidation du permis</Link></li>
              <li><Link href="/suspension-permis" className="text-gray-300 hover:text-white transition-colors">Suspension du permis</Link></li>
              <li><Link href="/annulation-permis" className="text-gray-300 hover:text-white transition-colors">Annulation du permis</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/rendez-vous" className="font-medium transition-colors hover:opacity-80" style={{ color: 'var(--secondary-teal)' }}>Prendre rendez-vous</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--secondary-teal)' }}>Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--success-green)' }}>📞</span>
                <a href="tel:0765565379" className="text-gray-300 hover:text-white transition-colors">
                  07 65 56 53 79
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--secondary-teal)' }}>✉️</span>
                <a href="mailto:contact@test-psychotechnique-permis.com" className="text-gray-300 hover:text-white transition-colors break-all">
                  contact@test-psychotechnique-permis.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: 'var(--secondary-orange)' }}>📍</span>
                <address className="text-gray-300 not-italic">
                  82 Rue Henri Barbusse<br />
                  92110 Clichy
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Liens légaux */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <Link href="/mentions-legales" className="text-gray-400 hover:text-white transition-colors">
              Mentions légales / Protection des données
            </Link>
            <Link href="/agrement-prefectoral" className="text-gray-400 hover:text-white transition-colors">
              Voir l'agrément préfectoral
            </Link>
          </div>
        </div>

        {/* Avis Google */}
        <div className="border-t border-gray-700 pt-6">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--secondary-teal)' }}>Nos clients nous font confiance</h3>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-center gap-3 mb-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <div className="text-left">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white font-bold text-xl">5.0</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">Note moyenne basée sur <span className="font-semibold text-white">100+ avis Google</span></p>
              <a
                href="https://www.google.com/search?q=test+psychotechnique+permis+clichy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-gray-900 rounded-lg transition-all hover:bg-gray-100 text-sm font-semibold shadow-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Voir tous les avis Google
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            Copyright © 2025 Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  )
}
