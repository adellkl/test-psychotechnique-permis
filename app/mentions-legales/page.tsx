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
                  <p className="mb-2"><strong>Email :</strong> f.sebti@outlook.com</p>
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
                  <p className="mb-2">Adel Loukal</p>
                  <p className="mb-2"><strong>Site web :</strong> <a href="https://adelloukal.fr" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">adelloukal.fr</a></p>
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


            <h3 className="text-xl font-semibold text-gray-900 mb-4">Responsable du traitement des données</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <p className="mb-2"><strong>Responsable du traitement :</strong> SEBTI Fatiha</p>
              <p className="mb-2"><strong>Adresse :</strong> 82 rue Henri Barbusse, 92110 Clichy</p>
              <p className="mb-2"><strong>Email :</strong> contact@test-psychotechnique-permis.com</p>
              <p className="mb-2"><strong>Téléphone :</strong> 07 65 56 53 79</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Finalités du traitement des données</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <p className="mb-3 font-semibold text-gray-900">Vos données personnelles sont collectées pour les finalités suivantes :</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Gestion des rendez-vous :</strong> Prise de rendez-vous pour les tests psychotechniques</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Communication :</strong> Envoi de confirmations, rappels et informations relatives à votre rendez-vous</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Gestion administrative :</strong> Tenue des registres et obligations légales</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Amélioration du service :</strong> Analyse de la satisfaction client et amélioration de nos services</span>
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Durée de conservation des données</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">📅</span>
                  <span><strong>Données de rendez-vous :</strong> Conservées pendant 3 ans à compter de la date du test pour des raisons légales et administratives</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">📧</span>
                  <span><strong>Données de contact :</strong> Conservées pendant la durée de la relation commerciale + 3 ans</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">🔐</span>
                  <span><strong>Logs de connexion :</strong> Conservés 12 mois pour des raisons de sécurité</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">🍪</span>
                  <span><strong>Cookies :</strong> Durée variable selon le type (voir section cookies ci-dessous)</span>
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Vos droits RGPD</h3>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-6 mb-6">
              <p className="mb-4 font-semibold text-gray-900">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, 
                vous disposez des droits suivants :
              </p>
              <div className="space-y-3 text-gray-700">
                <div className="bg-white rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-1">✓ Droit d'accès</p>
                  <p className="text-sm">Obtenir la confirmation que vos données sont traitées et accéder à vos données personnelles</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-1">✓ Droit de rectification</p>
                  <p className="text-sm">Corriger ou compléter vos données personnelles inexactes ou incomplètes</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-1">✓ Droit à l'effacement ("droit à l'oubli")</p>
                  <p className="text-sm">Demander la suppression de vos données personnelles dans certaines conditions</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-1">✓ Droit à la limitation du traitement</p>
                  <p className="text-sm">Demander la limitation du traitement de vos données dans certains cas</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-1">✓ Droit à la portabilité</p>
                  <p className="text-sm">Recevoir vos données dans un format structuré et les transmettre à un autre responsable</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-1">✓ Droit d'opposition</p>
                  <p className="text-sm">Vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-1">✓ Droit de retirer votre consentement</p>
                  <p className="text-sm">Retirer votre consentement à tout moment pour les traitements basés sur le consentement</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-3">📧 Comment exercer vos droits ?</h4>
              <p className="mb-3 text-gray-700">
                Pour exercer l'un de ces droits, vous pouvez nous contacter à tout moment :
              </p>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Par email :</strong> contact@test-psychotechnique-permis.com</li>
                <li><strong>Par téléphone :</strong> 07 65 56 53 79</li>
                <li><strong>Par courrier :</strong> SEBTI Fatiha, 82 rue Henri Barbusse, 92110 Clichy</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600 italic">
                Nous nous engageons à répondre à votre demande dans un délai maximum d'un mois.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-3">⚖️ Droit de réclamation auprès de la CNIL</h4>
              <p className="mb-3 text-gray-700">
                Si vous estimez que vos droits ne sont pas respectés, vous avez le droit d'introduire une réclamation 
                auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="mb-1"><strong>CNIL</strong></p>
                <p className="text-sm text-gray-700">3 Place de Fontenoy - TSA 80715</p>
                <p className="text-sm text-gray-700">75334 PARIS CEDEX 07</p>
                <p className="text-sm text-gray-700">Téléphone : 01 53 73 22 22</p>
                <p className="text-sm">
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                    www.cnil.fr
                  </a>
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sécurité des données</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="mb-4 font-semibold text-gray-900">
                Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour assurer 
                la sécurité de vos données personnelles :
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">🔒</span>
                  <span><strong>Chiffrement SSL/TLS :</strong> Toutes les communications sont sécurisées par protocole HTTPS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">🔐</span>
                  <span><strong>Accès restreint :</strong> Seules les personnes autorisées ont accès aux données personnelles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">💾</span>
                  <span><strong>Sauvegardes régulières :</strong> Vos données sont sauvegardées de manière sécurisée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">🛡️</span>
                  <span><strong>Protection contre les intrusions :</strong> Pare-feu et systèmes de détection d'intrusion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">📝</span>
                  <span><strong>Traçabilité :</strong> Journalisation des accès et des modifications</span>
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Transfert de données hors UE</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="mb-3 text-gray-700">
                Certains services que nous utilisons peuvent impliquer un transfert de données en dehors de l'Union Européenne :
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">📊</span>
                  <span><strong>Google Analytics :</strong> Outil d'analyse d'audience (données anonymisées, transfert vers les USA avec garanties appropriées)</span>
                </li>
              </ul>
              <p className="mt-3 text-sm text-gray-600 italic">
                Ces transferts sont encadrés par des garanties appropriées conformément au RGPD (clauses contractuelles types, Privacy Shield, etc.).
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-green-200 pb-2 mt-12">
              Gestion des cookies
            </h2>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Qu'est-ce qu'un cookie ?</h3>
              <p className="mb-4">
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) 
                lors de la visite d'un site internet. Il permet de collecter des informations relatives à votre 
                navigation et de vous adresser des services adaptés à votre terminal.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Types de cookies utilisés</h3>
            
            <div className="space-y-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Cookies strictement nécessaires
                </h4>
                <p className="text-gray-700 mb-2">
                  Ces cookies sont indispensables au fonctionnement du site. Ils vous permettent d'utiliser 
                  les principales fonctionnalités du site (par exemple : accès à votre espace personnel, 
                  prise de rendez-vous).
                </p>
                <p className="text-sm text-gray-600 italic">
                  Ces cookies ne nécessitent pas votre consentement.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">📊</span>
                  Cookies de mesure d'audience (Google Analytics)
                </h4>
                <p className="text-gray-700 mb-2">
                  Ces cookies nous permettent de mesurer l'audience du site, les pages visitées et 
                  d'améliorer votre expérience utilisateur. Les données collectées sont anonymisées.
                </p>
                <p className="text-sm text-gray-600 italic">
                  Vous pouvez accepter ou refuser ces cookies via notre bandeau de consentement.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-purple-600">🔧</span>
                  Cookies de préférences
                </h4>
                <p className="text-gray-700 mb-2">
                  Ces cookies permettent de mémoriser vos choix et préférences (langue, région, etc.) 
                  pour améliorer votre confort de navigation.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Gestion de vos cookies</h3>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-3">Comment gérer vos cookies ?</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">1.</span>
                  <span>Via notre bandeau de consentement qui apparaît lors de votre première visite</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">2.</span>
                  <span>Via les paramètres de votre navigateur (voir ci-dessous)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">3.</span>
                  <span>En nous contactant directement pour exercer vos droits</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h4 className="font-bold text-gray-900 mb-4">Configuration par navigateur</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">🌐 Google Chrome</p>
                  <p className="text-sm text-gray-600">Paramètres → Confidentialité et sécurité → Cookies</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">🦊 Mozilla Firefox</p>
                  <p className="text-sm text-gray-600">Options → Vie privée et sécurité → Cookies</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">🧭 Safari</p>
                  <p className="text-sm text-gray-600">Préférences → Confidentialité → Cookies</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">🌊 Microsoft Edge</p>
                  <p className="text-sm text-gray-600">Paramètres → Confidentialité → Cookies</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
              <h4 className="font-bold text-gray-900 mb-2">⚠️ Important</h4>
              <p className="text-gray-700">
                Le refus ou la suppression de certains cookies peut avoir un impact sur votre expérience 
                de navigation et limiter l'accès à certaines fonctionnalités du site. Nous ne pourrons 
                être tenus responsables de la dégradation de vos conditions de navigation.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Durée de conservation</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span><strong>Cookies de session :</strong> Supprimés à la fermeture du navigateur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span><strong>Cookies de préférences :</strong> Conservés jusqu'à 12 mois</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span><strong>Cookies analytiques :</strong> Conservés jusqu'à 13 mois (Google Analytics)</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-blue-200 pb-2 mt-12">
              Conditions d'utilisation
            </h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Limitation de responsabilité</h3>
              <p className="mb-4 text-gray-700">
                test-psychotechnique-permis.com met tout en œuvre pour offrir aux visiteurs des informations et/ou 
                des outils disponibles et vérifiés, mais ne saurait être tenu pour responsable des erreurs, d'une 
                absence de disponibilité des informations et/ou de la présence de virus sur son site.
              </p>
              <p className="mb-4 text-gray-700">
                Les informations fournies par test-psychotechnique-permis.com le sont à titre indicatif et ne 
                sauraient dispenser l'utilisateur d'une analyse complémentaire et personnalisée.
              </p>
              <p className="text-gray-700">
                test-psychotechnique-permis.com ne saurait garantir l'exactitude, la complétude, l'actualité des 
                informations diffusées sur son site. En conséquence, l'utilisateur reconnaît utiliser ces informations 
                sous sa responsabilité exclusive.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Liens hypertextes</h3>
              <p className="mb-3 text-gray-700">
                Le site test-psychotechnique-permis.com peut contenir des liens hypertextes vers d'autres sites 
                présents sur le réseau Internet. Les liens vers ces autres ressources vous font quitter le site 
                test-psychotechnique-permis.com.
              </p>
              <p className="text-gray-700">
                Il est possible de créer un lien vers la page de présentation de ce site sans autorisation expresse 
                de test-psychotechnique-permis.com. Aucune autorisation ou demande d'information préalable ne peut 
                être exigée par l'éditeur à l'égard d'un site qui souhaite établir un lien vers le site de l'éditeur. 
                Il convient toutefois d'afficher ce site dans une nouvelle fenêtre du navigateur.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Droit applicable et juridiction compétente</h3>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">⚖️</span>
                  <span>
                    <strong>Loi applicable :</strong> Les présentes mentions légales sont régies par le droit français. 
                    Tout litige relatif à l'utilisation du site test-psychotechnique-permis.com est soumis au droit français.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">🏛️</span>
                  <span>
                    <strong>Juridiction compétente :</strong> En cas de litige et à défaut d'accord amiable, le litige 
                    sera porté devant les tribunaux français conformément aux règles de compétence en vigueur. 
                    Les tribunaux de Nanterre (92) seront compétents pour connaître de tout litige relatif à l'utilisation du site.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">🤝</span>
                  <span>
                    <strong>Règlement amiable :</strong> Avant toute action en justice, nous vous encourageons à nous 
                    contacter pour tenter de résoudre tout différend à l'amiable.
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Modification des mentions légales</h3>
              <p className="text-gray-700">
                test-psychotechnique-permis.com se réserve le droit de modifier les présentes mentions légales à tout moment. 
                Il est donc conseillé de les consulter régulièrement. Les modifications entrent en vigueur dès leur publication 
                sur le site. Votre utilisation continue du site après la publication de modifications constitue votre acceptation 
                de ces modifications.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Médiation</h3>
              <p className="mb-3 text-gray-700">
                Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, 
                test-psychotechnique-permis.com adhère au Service du Médiateur du e-commerce de la FEVAD (Fédération du e-commerce 
                et de la vente à distance) dont les coordonnées sont les suivantes :
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="mb-1"><strong>Médiateur de la consommation FEVAD</strong></p>
                <p className="text-sm text-gray-700">60 Rue La Boétie – 75008 Paris</p>
                <p className="text-sm">
                  <a href="https://www.mediateurfevad.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                    www.mediateurfevad.fr
                  </a>
                </p>
              </div>
              <p className="mt-3 text-sm text-gray-600 italic">
                Après démarche préalable écrite des consommateurs vis-à-vis de test-psychotechnique-permis.com, le Service du 
                Médiateur peut être saisi pour tout litige de consommation dont le règlement n'aurait pas abouti.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-8 mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
              <p className="mb-4 text-lg">
                Pour toute question concernant ces mentions légales, la protection de vos données ou la gestion des cookies :
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
                  <p><strong>Email :</strong> f.sebti@outlook.com</p>
                  <p><strong>Contact web :</strong> contact@test-psychotechnique-permis.com</p>
                  <p><strong>ADELI :</strong> 929334555</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
