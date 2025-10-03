import "./globals.css"
import type { Metadata } from "next"
import InfoBar from "./components/InfoBar"
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
import ClientLayout from "./components/ClientLayout"

export const metadata: Metadata = {
  metadataBase: new URL('https://test-psychotechnique-permis.com'),
  title: "Test Psychotechnique Permis - Centre Agréé Clichy | Récupération Permis de Conduire",
  description: "Centre agréé préfecture pour tests psychotechniques du permis de conduire à Clichy. Invalidation, suspension, annulation. Psychologue certifiée ADELI. Deuxième chance gratuite. Prise de RDV immédiate.",
  keywords: "test psychotechnique permis, centre agréé préfecture, invalidation permis, suspension permis, annulation permis, psychologue ADELI, Clichy, récupération permis conduire, test psychotechnique Clichy, permis invalidé",
  authors: [{ name: "Test Psychotechnique Permis" }],
  creator: "Test Psychotechnique Permis",
  publisher: "Test Psychotechnique Permis",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://test-psychotechnique-permis.com",
    siteName: "Test Psychotechnique Permis",
    title: "Test Psychotechnique Permis - Centre Agréé Clichy",
    description: "Centre agréé préfecture pour tests psychotechniques du permis de conduire à Clichy. Psychologue certifiée, deuxième chance gratuite.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Test Psychotechnique Permis - Centre Agréé Clichy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Psychotechnique Permis - Centre Agréé Clichy",
    description: "Centre agréé préfecture pour tests psychotechniques du permis de conduire à Clichy. Psychologue certifiée, deuxième chance gratuite.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://test-psychotechnique-permis.com",
  },
  other: {
    "geo.region": "FR-92",
    "geo.placename": "Clichy",
    "geo.position": "48.9021;2.3068",
    "ICBM": "48.9021, 2.3068",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://test-psychotechnique-permis.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
      <body>
        <ClientLayout>
          <InfoBar />
          <Navigation />
          <Footer />
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
