export default function LocalBusinessSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "name": "Centre 2e Chance - Test Psychotechnique Colombes",
        "image": "https://test-psychotechnique-permis.com/og-image.jpg",
        "description": "Centre agréé de tests psychotechniques pour la récupération du permis de conduire à Colombes. Psychologue ADELI diplômée. 2ème chance gratuite en cas d'échec.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "14 Rue de Mantes",
            "addressLocality": "Colombes",
            "postalCode": "92700",
            "addressRegion": "Île-de-France",
            "addressCountry": "FR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "48.9228",
            "longitude": "2.2531"
        },
        "telephone": "+33765565379",
        "email": "contact@test-psychotechnique-permis.com",
        "url": "https://test-psychotechnique-permis.com",
        "priceRange": "90€",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:00",
                "closes": "19:00"
            }
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Tests Psychotechniques",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Test Psychotechnique Invalidation Permis",
                        "description": "Test psychotechnique obligatoire après invalidation du permis de conduire"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Test Psychotechnique Suspension Permis",
                        "description": "Test psychotechnique obligatoire après suspension du permis de conduire"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Test Psychotechnique Annulation Permis",
                        "description": "Test psychotechnique obligatoire après annulation du permis de conduire"
                    }
                }
            ]
        },
        "areaServed": [
            {
                "@type": "City",
                "name": "Colombes"
            },
            {
                "@type": "City",
                "name": "Bois-Colombes"
            },
            {
                "@type": "City",
                "name": "La Garenne-Colombes"
            },
            {
                "@type": "City",
                "name": "Asnières-sur-Seine"
            },
            {
                "@type": "City",
                "name": "Gennevilliers"
            },
            {
                "@type": "City",
                "name": "Nanterre"
            },
            {
                "@type": "City",
                "name": "Courbevoie"
            },
            {
                "@type": "City",
                "name": "La Défense"
            },
            {
                "@type": "City",
                "name": "Clichy"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127"
        },
        "additionalProperty": [
            {
                "@type": "PropertyValue",
                "name": "Parking",
                "value": "Gratuit"
            },
            {
                "@type": "PropertyValue",
                "name": "Accès Handicapés",
                "value": "Oui"
            },
            {
                "@type": "PropertyValue",
                "name": "Psychologue ADELI",
                "value": "929334555"
            },
            {
                "@type": "PropertyValue",
                "name": "2ème Chance Gratuite",
                "value": "Oui"
            }
        ]
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}
