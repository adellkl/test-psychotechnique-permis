import "./globals.css"
import "./styles/animations.css"
import type { Metadata } from "next"
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
import ClientLayout from "./components/ClientLayout"
import CookieConsent from "./components/CookieConsent"
import InfoBar from "./components/InfoBar"
import PageTransition from "./components/PageTransition"
import ConditionalLayout from "./components/ConditionalLayout"

export const metadata: Metadata = {
  metadataBase: new URL('https://test-psychotechnique-permis.com'),
  title: {
    default: "Test Psychotechnique Permis - 2 Centres Agréés Clichy & Colombes 92 | Récupération Permis",
    template: "%s | Test Psychotechnique Permis"
  },
  description: "👨‍⚕️ 2 centres agréés préfecture : Clichy (métro ligne 13, psychologue ADELI, 2ème chance gratuite 📞 07 65 56 53 79) et Pro Drive Academy Colombes (📞 09 72 13 22 50). Invalidation, suspension, annulation permis. RDV rapide Hauts-de-Seine 92. Service Île-de-France : Paris 75, Seine-et-Marne 77, Yvelines 78, Essonne 91, Seine-Saint-Denis 93, Val-de-Marne 94, Val-d'Oise 95.",
  keywords: [
    "test psychotechnique permis",
    "test psychotechnique Clichy",
    "test psychotechnique Colombes",
    "Pro Drive Academy Colombes",
    "centre agréé préfecture",
    "centre agréé Clichy 92110",
    "centre agréé Colombes 92700",
    "psychologue ADELI",
    "invalidation permis",
    "suspension permis",
    "annulation permis",
    "récupération permis conduire",
    "permis invalidé Clichy",
    "test psychotechnique 92",
    "test psychotechnique Hauts-de-Seine",
    "psychologue agréé permis",
    "test psychotechnique Paris",
    "test psychotechnique Ile-de-France",
    "rendez-vous test psychotechnique",
    "test psychotechnique rapide",
    "test psychotechnique pas cher",
    "psychologue permis conduire",
    "examen psychotechnique permis",
    "visite médicale permis",
    // Nouveaux mots-clés Île-de-France
    "test psychotechnique Paris 75",
    "test psychotechnique Seine-et-Marne 77",
    "test psychotechnique Yvelines 78",
    "test psychotechnique Essonne 91",
    "test psychotechnique Hauts-de-Seine 92",
    "test psychotechnique Seine-Saint-Denis 93",
    "test psychotechnique Val-de-Marne 94",
    "test psychotechnique Val-d'Oise 95",
    // Villes principales Île-de-France
    "test psychotechnique Boulogne-Billancourt",
    "test psychotechnique Nanterre",
    "test psychotechnique Asnières-sur-Seine",
    "test psychotechnique Colombes",
    "test psychotechnique Courbevoie",
    "test psychotechnique Levallois-Perret",
    "test psychotechnique Neuilly-sur-Seine",
    "test psychotechnique Puteaux",
    "test psychotechnique Rueil-Malmaison",
    "test psychotechnique Suresnes",
    "test psychotechnique Versailles",
    "test psychotechnique Saint-Germain-en-Laye",
    "test psychotechnique Mantes-la-Jolie",
    "test psychotechnique Sartrouville",
    "test psychotechnique Poissy",
    "test psychotechnique Conflans-Sainte-Honorine",
    "test psychotechnique Houilles",
    "test psychotechnique Chatou",
    "test psychotechnique Le Chesnay-Rocquencourt",
    "test psychotechnique Vélizy-Villacoublay",
    "test psychotechnique Montigny-le-Bretonneux",
    "test psychotechnique Guyancourt",
    "test psychotechnique Trappes",
    "test psychotechnique Élancourt",
    "test psychotechnique Rambouillet",
    "test psychotechnique Meaux",
    "test psychotechnique Melun",
    "test psychotechnique Fontainebleau",
    "test psychotechnique Provins",
    "test psychotechnique Torcy",
    "test psychotechnique Évry",
    "test psychotechnique Corbeil-Essonnes",
    "test psychotechnique Massy",
    "test psychotechnique Savigny-sur-Orge",
    "test psychotechnique Sainte-Geneviève-des-Bois",
    "test psychotechnique Viry-Châtillon",
    "test psychotechnique Athis-Mons",
    "test psychotechnique Palaiseau",
    "test psychotechnique Orsay",
    "test psychotechnique Les Ulis",
    "test psychotechnique Bobigny",
    "test psychotechnique Saint-Denis",
    "test psychotechnique Montreuil",
    "test psychotechnique Aubervilliers",
    "test psychotechnique Pantin",
    "test psychotechnique Noisy-le-Sec",
    "test psychotechnique Rosny-sous-Bois",
    "test psychotechnique Villemomble",
    "test psychotechnique Bondy",
    "test psychotechnique Épinay-sur-Seine",
    "test psychotechnique Stains",
    "test psychotechnique Pierrefitte-sur-Seine",
    "test psychotechnique Créteil",
    "test psychotechnique Vitry-sur-Seine",
    "test psychotechnique Champigny-sur-Marne",
    "test psychotechnique Saint-Maur-des-Fossés",
    "test psychotechnique Ivry-sur-Seine",
    "test psychotechnique Villejuif",
    "test psychotechnique Maisons-Alfort",
    "test psychotechnique Alfortville",
    "test psychotechnique Cergy",
    "test psychotechnique Argenteuil",
    "test psychotechnique Sarcelles",
    "test psychotechnique Garges-lès-Gonesse",
    "test psychotechnique Franconville",
    "test psychotechnique Bezons",
    "test psychotechnique Ermont",
    "test psychotechnique Eaubonne",
    "test psychotechnique Saint-Ouen-l'Aumône",
    "test psychotechnique Pontoise"
  ],
  authors: [{ name: "Centre Psychotechnique Permis Expert", url: "https://test-psychotechnique-permis.com" }],
  creator: "Centre Psychotechnique Permis Expert",
  publisher: "Centre Psychotechnique Permis Expert",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://test-psychotechnique-permis.com",
    siteName: "Test Psychotechnique Permis - 2 Centres Agréés Hauts-de-Seine",
    title: "👨‍⚕️ Test Psychotechnique Permis | 2 Centres Agréés Clichy & Colombes (92)",
    description: "2 centres agréés préfecture dans les Hauts-de-Seine. Clichy : psychologue ADELI, métro ligne 13, 2ème chance GRATUITE 📞 07 65 56 53 79. Colombes : Pro Drive Academy 📞 09 72 13 22 50. Invalidation, suspension, annulation permis.",
    images: [
      {
        url: "/images/logo site .png",
        width: 1200,
        height: 630,
        "alt": "Test Psychotechnique Permis - 2 Centres Agréés Clichy & Colombes",
        type: "image/png",
      },
    ],
    phoneNumbers: ["+33765565379", "+33972132250"],
    emails: ["contact@test-psychotechnique-permis.com"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TestPsychoPermis",
    title: "👨‍⚕️ Test Psychotechnique Permis | 2 Centres Agréés Clichy & Colombes 92",
    description: "2 centres agréés préfecture Hauts-de-Seine. Clichy : psychologue ADELI, 2ème chance GRATUITE. Colombes : Pro Drive Academy. Invalidation/Suspension/Annulation permis. RDV rapide.",
    images: {
      url: "/images/logo site .png",
      "alt": "Test Psychotechnique Permis Clichy & Colombes",
    },
  },
  alternates: {
    canonical: "https://test-psychotechnique-permis.com",
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "Health & Medical Services",
  classification: "Test Psychotechnique, Permis de Conduire",
  other: {
    "geo.region": "FR-92",
    "geo.placename": "Clichy, Colombes",
    "geo.position": "48.9021;2.3068",
    "ICBM": "48.9021, 2.3068",
    "contact": "07 65 56 53 79",
    "address": "82 Rue Henri Barbusse, 92110 Clichy | 14 Rue de Mantes, 92700 Colombes",
    "rating": "5",
    "price": "90€",
    "availability": "Lundi-Samedi 9h-19h",
    "language": "fr",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Style pour masquer le layout sur page 404 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            [data-404-page] ~ * { display: none !important; }
            body:has([data-404-page]) > div:first-child > *:not([data-404-page]) { display: none !important; }
          `
        }} />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WTB97WH8');`,
          }}
        />
        {/* End Google Tag Manager */}
        <meta name="google-site-verification" content="4pYjLHX5ai-q0_nkEDN4bvOWOAUDoV2Nubte0kHic20" />
        <link rel="canonical" href="https://test-psychotechnique-permis.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="geo.region" content="FR-75;FR-77;FR-78;FR-91;FR-92;FR-93;FR-94;FR-95" />
        <meta name="geo.placename" content="Île-de-France;Paris;Seine-et-Marne;Yvelines;Essonne;Hauts-de-Seine;Seine-Saint-Denis;Val-de-Marne;Val-d'Oise" />
        <meta name="geo.position" content="48.9021;2.3068" />
        <meta name="ICBM" content="48.9021, 2.3068" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 days" />
        <meta name="language" content="fr-FR" />
        <meta name="author" content="Centre Psychotechnique Permis Expert" />
        <meta name="publisher" content="Centre Psychotechnique Permis Expert" />
        <meta name="copyright" content="Centre Psychotechnique Permis Expert" />
        <meta name="city" content="Clichy" />
        <meta name="country" content="France" />
        <meta name="state" content="Île-de-France" />
        <meta name="zipcode" content="92110" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Test Psychotechnique" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": "Test Psychotechnique Permis - 2 Centres Agréés",
              "description": "2 centres agréés préfecture pour tests psychotechniques du permis de conduire : Clichy (92110) et Pro Drive Academy Colombes (92700). Service complet Île-de-France : Paris (75), Seine-et-Marne (77), Yvelines (78), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94), Val-d'Oise (95). Test psychotechnique Boulogne-Billancourt, Nanterre, Asnières-sur-Seine, Colombes, Courbevoie, Levallois-Perret, Neuilly-sur-Seine, Puteaux, Rueil-Malmaison, Suresnes, Versailles, Saint-Germain-en-Laye, Mantes-la-Jolie, Sartrouville, Poissy, Conflans-Sainte-Honorine, Houilles, Chatou, Le Chesnay-Rocquencourt, Vélizy-Villacoublay, Montigny-le-Bretonneux, Guyancourt, Trappes, Élancourt, Rambouillet, Meaux, Melun, Fontainebleau, Provins, Torcy, Évry, Corbeil-Essonnes, Massy, Savigny-sur-Orge, Sainte-Geneviève-des-Bois, Viry-Châtillon, Athis-Mons, Palaiseau, Orsay, Les Ulis, Bobigny, Saint-Denis, Montreuil, Aubervilliers, Pantin, Noisy-le-Sec, Rosny-sous-Bois, Villemomble, Bondy, Épinay-sur-Seine, Stains, Pierrefitte-sur-Seine, Créteil, Vitry-sur-Seine, Champigny-sur-Marne, Saint-Maur-des-Fossés, Ivry-sur-Seine, Villejuif, Maisons-Alfort, Alfortville, Cergy, Argenteuil, Sarcelles, Garges-lès-Gonesse, Franconville, Bezons, Ermont, Eaubonne, Saint-Ouen-l'Aumône, Pontoise.",
              "url": "https://test-psychotechnique-permis.com",
              "telephone": ["+33765565379", "+33972132250"],
              "email": "contact@test-psychotechnique-permis.com",
              "address": [
                {
                  "@type": "PostalAddress",
                  "streetAddress": "82 Rue Henri Barbusse",
                  "addressLocality": "Clichy",
                  "postalCode": "92110",
                  "addressCountry": "FR",
                  "addressRegion": "Île-de-France"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "14 Rue de Mantes",
                  "addressLocality": "Colombes",
                  "postalCode": "92700",
                  "addressCountry": "FR",
                  "addressRegion": "Île-de-France"
                }
              ],
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 48.9021,
                "longitude": 2.3068
              },
              "openingHours": "Mo-Sa 09:00-19:00",
              "priceRange": "90€",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "reviewCount": "127",
                "bestRating": "5",
                "worstRating": "1"
              },
              "paymentAccepted": "Espèces",
              "currenciesAccepted": "EUR",
              "areaServed": [
                {
                  "@type": "State",
                  "name": "Île-de-France",
                  "containsPlace": [
                    {
                      "@type": "AdministrativeArea",
                      "name": "Paris (75)",
                      "addressRegion": "75"
                    },
                    {
                      "@type": "AdministrativeArea",
                      "name": "Seine-et-Marne (77)",
                      "addressRegion": "77"
                    },
                    {
                      "@type": "AdministrativeArea",
                      "name": "Yvelines (78)",
                      "addressRegion": "78"
                    },
                    {
                      "@type": "AdministrativeArea",
                      "name": "Essonne (91)",
                      "addressRegion": "91"
                    },
                    {
                      "@type": "AdministrativeArea",
                      "name": "Hauts-de-Seine (92)",
                      "addressRegion": "92"
                    },
                    {
                      "@type": "AdministrativeArea",
                      "name": "Seine-Saint-Denis (93)",
                      "addressRegion": "93"
                    },
                    {
                      "@type": "AdministrativeArea",
                      "name": "Val-de-Marne (94)",
                      "addressRegion": "94"
                    },
                    {
                      "@type": "AdministrativeArea",
                      "name": "Val-d'Oise (95)",
                      "addressRegion": "95"
                    }
                  ]
                }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Services de tests psychotechniques",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Test psychotechnique invalidation permis",
                      "description": "Test psychotechnique obligatoire après invalidation du permis de conduire"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Test psychotechnique suspension permis",
                      "description": "Test psychotechnique obligatoire après suspension du permis de conduire"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Test psychotechnique annulation permis",
                      "description": "Test psychotechnique obligatoire après annulation du permis de conduire"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <div style={{ display: 'none' }} aria-hidden="true">
          {/* SEO Content - Hidden from users but visible to search engines */}
          <div>
            <h1>Test Psychotechnique Permis Île-de-France</h1>
            <p>Centre agréé préfecture pour test psychotechnique permis dans toute l'Île-de-France. Service disponible à Paris (75), Seine-et-Marne (77), Yvelines (78), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94), Val-d'Oise (95).</p>

            <h2>Test Psychotechnique Paris 75</h2>
            <p>Test psychotechnique permis Paris, centre agréé préfecture Paris, psychologue ADELI Paris, récupération permis Paris.</p>

            <h2>Test Psychotechnique Seine-et-Marne 77</h2>
            <p>Test psychotechnique permis Seine-et-Marne, centre agréé Meaux, test psychotechnique Melun, Fontainebleau, Provins, Torcy.</p>

            <h2>Test Psychotechnique Yvelines 78</h2>
            <p>Test psychotechnique permis Yvelines, centre agréé Versailles, Saint-Germain-en-Laye, Mantes-la-Jolie, Sartrouville, Poissy, Conflans-Sainte-Honorine, Houilles, Chatou, Le Chesnay-Rocquencourt, Vélizy-Villacoublay, Montigny-le-Bretonneux, Guyancourt, Trappes, Élancourt, Rambouillet.</p>

            <h2>Test Psychotechnique Essonne 91</h2>
            <p>Test psychotechnique permis Essonne, centre agréé Évry, Corbeil-Essonnes, Massy, Savigny-sur-Orge, Sainte-Geneviève-des-Bois, Viry-Châtillon, Athis-Mons, Palaiseau, Orsay, Les Ulis.</p>

            <h2>Test Psychotechnique Hauts-de-Seine 92</h2>
            <p>Test psychotechnique permis Hauts-de-Seine, 2 centres agréés : Clichy 92110 (métro ligne 13, psychologue ADELI, 2ème chance gratuite) et Pro Drive Academy Colombes 92700. Service également pour Boulogne-Billancourt, Nanterre, Asnières-sur-Seine, Courbevoie, Levallois-Perret, Neuilly-sur-Seine, Puteaux, Rueil-Malmaison, Suresnes.</p>

            <h2>Test Psychotechnique Seine-Saint-Denis 93</h2>
            <p>Test psychotechnique permis Seine-Saint-Denis, centre agréé Bobigny, Saint-Denis, Montreuil, Aubervilliers, Pantin, Noisy-le-Sec, Rosny-sous-Bois, Villemomble, Bondy, Épinay-sur-Seine, Stains, Pierrefitte-sur-Seine.</p>

            <h2>Test Psychotechnique Val-de-Marne 94</h2>
            <p>Test psychotechnique permis Val-de-Marne, centre agréé Créteil, Vitry-sur-Seine, Champigny-sur-Marne, Saint-Maur-des-Fossés, Ivry-sur-Seine, Villejuif, Maisons-Alfort, Alfortville.</p>

            <h2>Test Psychotechnique Val-d'Oise 95</h2>
            <p>Test psychotechnique permis Val-d'Oise, centre agréé Cergy, Argenteuil, Sarcelles, Garges-lès-Gonesse, Franconville, Bezons, Ermont, Eaubonne, Saint-Ouen-l'Aumône, Pontoise.</p>

            <h2>Test Psychotechnique Invalidation Permis Île-de-France</h2>
            <p>Test psychotechnique invalidation permis Île-de-France, permis invalidé Île-de-France, solde nul points Île-de-France, récupération permis invalidé Île-de-France.</p>

            <h2>Test Psychotechnique Suspension Permis Île-de-France</h2>
            <p>Test psychotechnique suspension permis Île-de-France, permis suspendu Île-de-France, suspension alcool Île-de-France, suspension vitesse Île-de-France, suspension stupéfiants Île-de-France.</p>

            <h2>Test Psychotechnique Annulation Permis Île-de-France</h2>
            <p>Test psychotechnique annulation permis Île-de-France, permis annulé Île-de-France, annulation homicide Île-de-France, annulation alcool Île-de-France, annulation récidive Île-de-France.</p>

            <p>Mots-clés SEO : test psychotechnique permis Île-de-France, centre agréé préfecture Île-de-France, psychologue ADELI Île-de-France, invalidation permis Île-de-France, suspension permis Île-de-France, annulation permis Île-de-France, récupération permis conduire Île-de-France, permis invalidé Île-de-France, test psychotechnique Clichy Île-de-France, test psychotechnique Paris Île-de-France, test psychotechnique Boulogne-Billancourt Île-de-France, test psychotechnique Nanterre Île-de-France, test psychotechnique Versailles Île-de-France, test psychotechnique Évry Île-de-France, test psychotechnique Bobigny Île-de-France, test psychotechnique Créteil Île-de-France, test psychotechnique Cergy Île-de-France.</p>
          </div>
        </div>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
