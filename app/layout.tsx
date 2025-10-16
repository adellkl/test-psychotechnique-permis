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
    default: "Test Psychotechnique Permis - Centre Agréé tout départements | Récupération Permis",
    template: "%s | Test Psychotechnique Permis Clichy"
  },
  description: "👨‍⚕️ Centre agréé préfecture pour test psychotechnique permis à Clichy (92). Psychologue certifiée ADELI. Invalidation, suspension, annulation permis. ⭐ 2ème chance gratuite. 📞 07 65 56 53 79. RDV immédiat en ligne.",
  keywords: [
    "test psychotechnique permis",
    "test psychotechnique Clichy",
    "centre agréé préfecture",
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
    "visite médicale permis"
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
    siteName: "Test Psychotechnique Permis - Centre Agréé tout départements",
    title: "👨‍⚕️ Test Psychotechnique Permis | Centre Agréé Préfecture Clichy (92)",
    description: "Centre agréé pour test psychotechnique du permis de conduire à Clichy. Psychologue certifiée ADELI. Invalidation, suspension, annulation. 2ème chance GRATUITE. 📍 82 Rue Henri Barbusse. 📞 07 65 56 53 79",
    images: [
      {
        url: "/images/logo site .png",
        width: 1200,
        height: 630,
        alt: "Test Psychotechnique Permis - Centre Agréé Préfecture Clichy",
        type: "image/png",
      },
    ],
    phoneNumbers: ["+33765565379"],
    emails: ["contact@test-psychotechnique-permis.com"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TestPsychoPermis",
    title: "👨‍⚕️ Test Psychotechnique Permis | Centre Agréé tout départements",
    description: "Centre agréé préfecture. Psychologue ADELI. Invalidation/Suspension/Annulation permis. 2ème chance GRATUITE. RDV en ligne. 📍 Clichy (92)",
    images: {
      url: "/images/logo site .png",
      alt: "Test Psychotechnique Permis Clichy",
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
    "geo.placename": "Clichy",
    "geo.position": "48.9021;2.3068",
    "ICBM": "48.9021, 2.3068",
    "contact": "07 65 56 53 79",
    "address": "82 Rue Henri Barbusse, 92110 Clichy",
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
        <link rel="author" href="/humans.txt" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Test Psychotechnique" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": "Test Psychotechnique Permis",
              "description": "Centre agréé préfecture pour tests psychotechniques du permis de conduire",
              "url": "https://test-psychotechnique-permis.com",
              "telephone": "+33765565379",
              "email": "contact@test-psychotechnique-permis.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "82 Rue Henri Barbusse",
                "addressLocality": "Clichy",
                "postalCode": "92110",
                "addressCountry": "FR",
                "addressRegion": "Île-de-France"
              },
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
              "areaServed": {
                "@type": "State",
                "name": "Île-de-France"
              },
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WTB97WH8"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
