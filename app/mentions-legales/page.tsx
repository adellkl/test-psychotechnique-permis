import FAQ from '../components/FAQ'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Mentions Légales & Protection des Données - Test Psychotechnique Permis Clichy",
  description: "Mentions légales et politique de confidentialité du centre Test Psychotechnique Permis. SEBTI Fatiha, centre agréé préfecture Clichy. RGPD, protection données personnelles.",
  keywords: "mentions légales, protection données, RGPD, test psychotechnique permis, SEBTI Fatiha, centre agréé, Clichy, ADELI 929334555, confidentialité",
  openGraph: {
    title: "Mentions Légales & Protection des Données - Test Psychotechnique Permis",
    description: "Mentions légales et politique de confidentialité du centre Test Psychotechnique Permis. SEBTI Fatiha, centre agréé préfecture Clichy.",
    url: "https://test-psychotechnique-permis.com/mentions-legales",
    type: "website",
    locale: "fr_FR",
    siteName: "Test Psychotechnique Permis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentions Légales & Protection des Données - Test Psychotechnique Permis",
    description: "Mentions légales et politique de confidentialité du centre Test Psychotechnique Permis.",
  },
  alternates: {
    canonical: "https://test-psychotechnique-permis.com/mentions-legales",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function MentionsLegalesPage() {
  return (
    <>
      <section className="py-20 pt-40 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Mentions Légales & Protection des Données
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Informations légales, conditions d'utilisation et politique de confidentialité conforme au RGPD
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <p className="text-lg leading-relaxed">
                Bienvenue sur le Site web «test-psychotechnique-permis.com» (ci-après «le Site»).
                Ce Site est mis gratuitement à votre disposition (hors frais de connexion au Site) pour votre usage personnel, 
                sous réserve du respect des conditions définies ci-après.
              </p>
              <p className="mt-4">
                En accédant à ce Site, en le visitant et/ou en l'utilisant, vous reconnaissez que vous avez lu, 
                que vous avez compris et que vous acceptez d'être lié par ces conditions, de même que vous vous engagez 
                à vous conformer à l'ensemble des lois et règlements applicables. Vous ne pouvez utiliser le site que 
                dans un but légitime; aucune utilisation ou détournement n'est autorisé, notamment pour des finalités 
                contraires à l'ordre public et aux bonnes mœurs.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-blue-200 pb-2">Mentions légales</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Propriétaire du site</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="mb-2"><strong>Propriétaire :</strong> SEBTI Fatiha</p>
                  <p className="mb-2"><strong>Adresse :</strong> 82 rue Henri Barbusse, Clichy 92110</p>
                  <p className="mb-2"><strong>Forme juridique :</strong> Auto entrepreneur</p>
                  <p className="mb-2"><strong>SIRET :</strong> 884 314 097 00012</p>
                </div>
                <div>
                  <p className="mb-2"><strong>Code APE :</strong> 8690F Activité de santé humaine</p>
                  <p className="mb-2"><strong>Numéro ADELI :</strong> 929334555</p>
                  <p className="mb-2"><strong>Téléphone :</strong> 07 65 56 53 79</p>
                  <p className="mb-2"><strong>Email :</strong> sebtifatiha@live.fr</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-100 rounded">
                <p className="text-sm">
                  <strong>Voir l'agrément préfectoral :</strong><br/>
                  <a href="https://test-psychotechnique-permis.com/wp-content/uploads/2023/06/Recepisse-SEBTI-2023.pdf" 
                     className="text-blue-600 hover:text-blue-800 underline break-all" target="_blank" rel="noopener noreferrer">
                    Récépissé SEBTI 2023 - Agrément préfectoral
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hébergement du site</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="mb-2"><strong>Hébergeur :</strong> OVH</p>
                  <p className="mb-2"><strong>Siège social :</strong> 2 rue Kellerman, 59100 Roubaix</p>
                  <p className="mb-2"><strong>Site web :</strong> <a href="https://www.ovhcloud.com/fr/" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">ovhcloud.com</a></p>
                </div>
                <div>
                  <p className="mb-2"><strong>Création et gestion :</strong></p>
                  <p className="mb-2">Agence web « AvanceWeb »</p>
                  <p className="mb-2"><strong>Site web :</strong> <a href="https://avanceweb.fr" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">avanceweb.fr</a></p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Propriété intellectuelle</h3>
            <p className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              La structure générale – textes, images, savoir-faire – et plus généralement, toutes les informations 
              et contenus figurant sur le site test-psychotechnique-permis.com, sont la propriété de SEBTI Fatiha 
              ou font l'objet d'un droit d'utilisation ou d'exploitation. Ces éléments sont soumis à la législation 
              protégeant le droit d'auteur.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-green-200 pb-2 mt-12">
              Politique de confidentialité / Protection des données
            </h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Collecte et utilisation des données personnelles</h3>
              <p className="mb-4">
                Le site test-psychotechnique-permis.com s'engage à ce que la collecte et le traitement de vos données, 
                soient conformes au <strong>Règlement Général sur la Protection des Données (RGPD)</strong> et à la 
                <strong> Loi Informatique et Libertés (CNIL)</strong>.
              </p>
              <p className="mb-4">
                test-psychotechnique-permis.com ne sollicite des utilisateurs la communication de données personnelles 
                qu'à titre strictement confidentiel et dans l'intérêt du service, afin de permettre la communication 
                de toutes les informations utiles à la réponse aux demandes transmises dans les formulaires de contact 
                ou pour organiser un rendez-vous.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Utilisation et conservation des données</h3>
            <p className="mb-4">
              test-psychotechnique-permis.com vous informe que les données personnelles que vous pourriez lui communiquer 
              en ligne sont destinées au seul usage de test-psychotechnique-permis.com qui est responsable de leur traitement 
              et de leur conservation. Ces données ne seront pas communiquées à des tiers à l'exclusion des tiers hébergeant 
              le site ou intervenant dans son contenu ou sa gestion.
            </p>
            <p className="mb-6">
              test-psychotechnique-permis.com s'engage à prendre toutes les mesures raisonnables à sa disposition pour 
              préserver la confidentialité de ces données personnelles.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Gestion des cookies</h3>
              <p className="mb-4">
                Les cookies sont gérés grâce à l'extension Wordpress « CookieYes | GDPR Cookie Consent ». 
                En cliquant sur l'icône de gestion des cookies en bas à gauche de l'écran, l'utilisateur peut 
                à tout moment choisir :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>« Tout rejeter »</strong></li>
                <li><strong>« Tout accepter »</strong></li>
                <li><strong>« Enregistrer mes préférences »</strong></li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Vos droits</h3>
            <p className="mb-4">
              Conformément à la loi Informatique et Libertés, vous disposez d'un droit d'opposition, d'accès et de 
              rectification de ces données à caractère personnel. Vous pouvez exercer ce droit à tout moment en nous 
              contactant par mail à : <strong>contact@test-psychotechnique-permis.com</strong>
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-8 mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
              <p className="mb-4 text-lg">
                Pour toute question concernant ces mentions légales ou la protection de vos données :
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Informations légales</h4>
                  <p><strong>SEBTI Fatiha</strong></p>
                  <p>82 rue Henri Barbusse</p>
                  <p>92110 Clichy</p>
                  <p>SIRET : 884 314 097 00012</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                  <p><strong>Téléphone :</strong> 07 65 56 53 79</p>
                  <p><strong>Email :</strong> sebtifatiha@live.fr</p>
                  <p><strong>Contact web :</strong> contact@test-psychotechnique-permis.com</p>
                  <p><strong>ADELI :</strong> 929334555</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FAQ />
    </>
  )
}
