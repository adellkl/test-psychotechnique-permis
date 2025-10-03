import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Deuxième Chance - Test Psychotechnique */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4" style={{color: 'var(--secondary-teal)'}}>Deuxième Chance - Test Psychotechnique</h3>
            <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
              <p>
                Notre centre de test psychotechnique est situé à <strong>3 min du métro Mairie de Clichy</strong>, 
                sur la ligne 13 et à <strong>10 min à pied de la gare de Clichy-Levallois</strong>, vous pouvez 
                donc vous y rendre depuis Paris ainsi que de toute l'Île de France.
              </p>
              <p className="font-medium" style={{color: 'var(--success-green)'}}>
                💳 Paiement sur place, aucun acompte ne vous sera demandé en ligne.
              </p>
              <p className="font-medium" style={{color: 'var(--warning-amber)'}}>
                🎯 En cas d'échec, une deuxième chance vous sera accordée gratuitement !
              </p>
            </div>
          </div>

          {/* Plan du site */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--secondary-teal)'}}>Plan du site</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/a-propos" className="text-gray-300 hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/invalidation-permis" className="text-gray-300 hover:text-white transition-colors">Invalidation du permis</Link></li>
              <li><Link href="/suspension-permis" className="text-gray-300 hover:text-white transition-colors">Suspension du permis</Link></li>
              <li><Link href="/annulation-permis" className="text-gray-300 hover:text-white transition-colors">Annulation du permis</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/rendez-vous" className="font-medium transition-colors hover:opacity-80" style={{color: 'var(--secondary-teal)'}}>Prendre rendez-vous</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--secondary-teal)'}}>Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span style={{color: 'var(--success-green)'}}>📞</span>
                <a href="tel:0765565379" className="text-gray-300 hover:text-white transition-colors">
                  07 65 56 53 79
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span style={{color: 'var(--secondary-teal)'}}>✉️</span>
                <a href="mailto:contact@test-psychotechnique-permis.com" className="text-gray-300 hover:text-white transition-colors break-all">
                  contact@test-psychotechnique-permis.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5" style={{color: 'var(--secondary-orange)'}}>📍</span>
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
            <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>

        {/* Avis et Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <div className="mb-4">
            <p className="text-sm text-gray-300 mb-2">
              Après votre rendez-vous, merci de donner votre avis sur notre centre
            </p>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-opacity text-sm font-medium hover:opacity-90"
              style={{backgroundColor: 'var(--warning-amber)'}}
            >
              ⭐ Donner mon avis
            </a>
          </div>
          <p className="text-gray-500 text-sm">
            Copyright © 2025 Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  )
}
