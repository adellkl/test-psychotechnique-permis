'use client'

export default function FAQSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Combien coûte un test psychotechnique du permis de conduire ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le prix d'un test psychotechnique varie généralement entre 80€ et 150€. Dans nos centres agréés à Clichy et Colombes, le tarif est fixe et affiché clairement lors de la réservation. Aucun frais supplémentaire n'est ajouté."
        }
      },
      {
        "@type": "Question",
        "name": "Combien de temps dure un test psychotechnique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le test psychotechnique dure environ 40 minutes. Il comprend plusieurs exercices évaluant vos réflexes, votre attention, votre coordination et votre perception. Prévoyez 1 heure au total incluant l'accueil et la remise de l'attestation."
        }
      },
      {
        "@type": "Question",
        "name": "Quand dois-je passer un test psychotechnique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le test psychotechnique est obligatoire après une suspension de permis de 6 mois ou plus, une annulation judiciaire du permis, ou une invalidation pour perte totale de points. Il est nécessaire pour récupérer votre permis de conduire."
        }
      },
      {
        "@type": "Question",
        "name": "Où passer un test psychotechnique agréé près de Paris ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nos centres agréés préfecture sont situés à Clichy (92110) au 82 Rue Henri Barbusse et à Colombes (92700). Accessibles en métro ligne 13 pour Clichy et en Transilien pour Colombes. Réservation en ligne disponible."
        }
      },
      {
        "@type": "Question",
        "name": "Quand vais-je recevoir mon attestation de test psychotechnique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "L'attestation vous est remise immédiatement en main propre à la fin du test. Vous repartez avec le document officiel nécessaire pour votre dossier de récupération de permis auprès de la préfecture. Aucune attente par courrier."
        }
      },
      {
        "@type": "Question",
        "name": "Peut-on échouer au test psychotechnique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le test psychotechnique n'est pas un examen que l'on réussit ou que l'on rate. C'est une évaluation de vos capacités actuelles. Le psychologue agréé évalue objectivement vos aptitudes à la conduite. Dans de très rares cas, si des difficultés sont détectées, le psychologue peut recommander un nouvel examen ou un suivi."
        }
      },
      {
        "@type": "Question",
        "name": "Le test psychotechnique est-il obligatoire après une suspension de permis ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, le test psychotechnique est obligatoire après une suspension de permis de 6 mois ou plus, ou si la suspension est liée à un délit lié à l'alcool ou aux stupéfiants. Il doit être réalisé dans un centre agréé par la préfecture."
        }
      },
      {
        "@type": "Question",
        "name": "Comment prendre rendez-vous pour un test psychotechnique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La réservation se fait facilement en ligne sur notre site. Sélectionnez votre centre (Clichy ou Colombes), choisissez une date et un créneau horaire disponible, confirmez votre réservation et recevez une confirmation par email. Vous pouvez aussi nous appeler au 07 65 56 53 79."
        }
      },
      {
        "@type": "Question",
        "name": "Quels documents apporter pour le test psychotechnique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vous devez obligatoirement apporter une pièce d'identité valide (carte d'identité ou passeport). Si vous portez des lunettes ou des lentilles de contact pour la conduite, pensez à les apporter. L'invitation de la commission médicale de la préfecture est également utile mais pas obligatoire."
        }
      },
      {
        "@type": "Question",
        "name": "Le test psychotechnique est-il le même partout en France ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, tous les centres agréés en France utilisent des tests standardisés et homologués. Les exercices évaluent les mêmes capacités (réflexes, attention, coordination) selon un protocole national uniforme. Seul le centre et le psychologue changent, pas le contenu du test."
        }
      },
      {
        "@type": "Question",
        "name": "Combien de temps est valable l'attestation de test psychotechnique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "L'attestation de test psychotechnique est généralement valable 2 ans. Cependant, elle doit être utilisée dans le cadre du dossier de récupération de permis en cours. Il est recommandé de la présenter à la commission médicale dans les 6 mois suivant sa délivrance."
        }
      },
      {
        "@type": "Question",
        "name": "Test psychotechnique et visite médicale : quelle différence ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le test psychotechnique évalue vos capacités cognitives (réflexes, attention, coordination) chez un psychologue agréé. La visite médicale évalue votre santé physique (vue, audition, état général) chez un médecin agréé. Les deux sont souvent nécessaires pour récupérer son permis, mais ce sont deux examens distincts réalisés par des professionnels différents."
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  )
}
