import Script from 'next/script'

export default function ReviewsSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Test Psychotechnique Permis - Centre Agréé tout départements",
    "image": "https://test-psychotechnique-permis.com/images/logo.png",
    "description": "Centre agréé pour test psychotechnique du permis de conduire à Clichy. Résultats immédiats, deuxième chance gratuite en cas d'échec.",
    "@id": "https://test-psychotechnique-permis.com",
    "url": "https://test-psychotechnique-permis.com",
    "telephone": "+33765565379",
    "priceRange": "90€",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "82 Rue Henri Barbusse",
      "addressLocality": "Clichy",
      "postalCode": "92110",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.9041,
      "longitude": 2.3067
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "100"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Client satisfait"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Accueil professionnel, test rapide et résultats immédiats. Je recommande vivement ce centre pour passer son test psychotechnique."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Client vérifié"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Très bien situé, proche du métro ligne 13. Personnel accueillant et professionnel. Test bien organisé."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Client recommandé"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Deuxième chance gratuite en cas d'échec, très appréciable. Centre sérieux et fiable pour le test psychotechnique du permis."
      }
    ],
    "sameAs": [
      "https://www.google.com/maps/search/?api=1&query=Test+Psychotechnique+Permis+82+Rue+Henri+Barbusse+92110+Clichy"
    ]
  }

  return (
    <Script
      id="reviews-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      strategy="afterInteractive"
    />
  )
}
