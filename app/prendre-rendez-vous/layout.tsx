import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Prendre Rendez-vous Test Psychotechnique Permis | Réservation Clichy & Colombes",
  description: "Réservation en ligne Clichy & Colombes 92. Disponibilités immédiates. Psychologue ADELI. 2e chance gratuite. Invalidation/suspension/annulation permis.",
  keywords: "prendre rendez-vous test psychotechnique, réservation test psychotechnique permis, rendez-vous permis Clichy, réserver test psychotechnique en ligne, centre agréé Clichy, psychologue permis conduire, rdv test psychotechnique",
  openGraph: {
    title: "Prendre Rendez-vous Test Psychotechnique Permis - Centre Agréé tout départements",
    description: "Réservez votre test psychotechnique en ligne. Disponibilités immédiates. Centre agréé préfecture à Clichy. Psychologue certifiée.",
    url: "https://test-psychotechnique-permis.com/prendre-rendez-vous",
    type: "website",
    locale: "fr_FR",
    siteName: "Test Psychotechnique Permis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prendre Rendez-vous Test Psychotechnique Permis - Clichy",
    description: "Réservation en ligne de votre test psychotechnique. Centre agréé préfecture. Disponibilités immédiates.",
  },
  alternates: {
    canonical: "https://test-psychotechnique-permis.com/prendre-rendez-vous",
  },
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
}

export default function PrendreRendezVousLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* JSON-LD Structured Data for Booking */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Test Psychotechnique pour Permis de Conduire",
            "provider": {
              "@type": "MedicalBusiness",
              "name": "Test Psychotechnique Permis - Centre Agréé tout départements",
              "image": "https://test-psychotechnique-permis.com/logo.png",
              "telephone": "+33765565379",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "85 Boulevard Jean Jaurès",
                "addressLocality": "Clichy",
                "postalCode": "92110",
                "addressCountry": "FR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 48.9021,
                "longitude": 2.3068
              },
              "url": "https://test-psychotechnique-permis.com",
              "priceRange": "€€"
            },
            "areaServed": {
              "@type": "City",
              "name": "Clichy"
            },
            "availableChannel": {
              "@type": "ServiceChannel",
              "serviceUrl": "https://test-psychotechnique-permis.com/prendre-rendez-vous",
              "serviceType": "Réservation en ligne"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "availabilityStarts": new Date().toISOString().split('T')[0],
              "description": "Test psychotechnique pour récupération du permis de conduire suite à invalidation, suspension ou annulation"
            }
          }),
        }}
      />
      
      {/* JSON-LD for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Comment prendre rendez-vous pour un test psychotechnique ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Vous pouvez réserver directement en ligne sur notre site. Sélectionnez votre créneau disponible, remplissez vos informations et confirmez. Vous recevrez une confirmation immédiate par email."
                }
              },
              {
                "@type": "Question",
                "name": "Quels documents dois-je apporter pour mon test psychotechnique ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Vous devez apporter une pièce d'identité en cours de validité (carte d'identité ou passeport). Arrivez 10 minutes avant l'heure de votre rendez-vous."
                }
              },
              {
                "@type": "Question",
                "name": "Combien de temps dure le test psychotechnique du permis ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Le test psychotechnique dure environ 2 heures, incluant les tests et l'entretien avec la psychologue certifiée."
                }
              },
              {
                "@type": "Question",
                "name": "Le centre est-il agréé préfecture ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Oui, notre centre est agréé par la préfecture et notre psychologue est certifiée ADELI. Les résultats sont officiellement reconnus pour la récupération du permis."
                }
              }
            ]
          }),
        }}
      />
      
      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": "https://test-psychotechnique-permis.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Prendre Rendez-vous",
                "item": "https://test-psychotechnique-permis.com/prendre-rendez-vous"
              }
            ]
          }),
        }}
      />
      
      {children}
    </>
  )
}
