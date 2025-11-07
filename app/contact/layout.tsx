import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nous Contacter - Test Psychotechnique Permis Clichy & Colombes | 07 65 56 53 79",
  description: "Contactez nos centres Clichy & Colombes 92. Téléphone : 07 65 56 53 79. Email : contact@test-psychotechnique-permis.com. Réponse rapide. Lundi-samedi 8h-20h.",
  keywords: "contact test psychotechnique, téléphone centre Clichy, contacter psychologue permis, rendez-vous test psychotechnique, adresse centre agréé, horaires test psychotechnique",
  openGraph: {
    title: "Nous Contacter - Test Psychotechnique Permis Clichy",
    description: "Contactez-nous au 07 65 56 53 79 pour toute question. Centre agréé préfecture à Clichy.",
    url: "https://test-psychotechnique-permis.com/contact",
    type: "website",
    locale: "fr_FR",
    siteName: "Test Psychotechnique Permis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact - Test Psychotechnique Permis Clichy",
    description: "Contactez notre centre agréé au 07 65 56 53 79. ouvert du lundi au samedi de 8h - 20h.",
  },
  alternates: {
    canonical: "https://test-psychotechnique-permis.com/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* JSON-LD Structured Data for Local Business */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "name": "Test Psychotechnique Permis - Centre Agréé tout départements",
            "image": "https://test-psychotechnique-permis.com/logo.png",
            "telephone": "+33765565379",
            "email": "contact@test-psychotechnique-permis.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "82 Rue Henri Barbusse",
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
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:00",
                "closes": "19:00"
              }
            ],
            "priceRange": "€€"
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
                "name": "Contact",
                "item": "https://test-psychotechnique-permis.com/contact"
              }
            ]
          }),
        }}
      />

      {children}
    </>
  )
}
