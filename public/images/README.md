# Images du site Test Psychotechnique Permis

Ce dossier contient toutes les images utilisées sur le site web.

## Structure recommandée :

### Images principales
- `hero-bg.jpg` - Image de fond pour la page d'accueil
- `logo.png` - Logo du centre
- `favicon.ico` - Icône du site

### Images de contenu
- `centre-exterieur.jpg` - Photo extérieure du centre
- `salle-test.jpg` - Salle de test psychotechnique
- `equipe.jpg` - Photo de l'équipe
- `materiel-test.jpg` - Matériel de test

### Images d'illustration
- `test-attention.jpg` - Illustration des tests d'attention
- `test-coordination.jpg` - Tests de coordination
- `entretien.jpg` - Entretien psychologique

## Optimisation
- Format recommandé : WebP ou JPEG
- Taille max : 1920px de largeur
- Compression : 80-85% pour un bon équilibre qualité/poids
- Alt text : Toujours inclure pour l'accessibilité

## Utilisation dans le code
```jsx
import Image from 'next/image'

<Image
  src="/images/nom-image.jpg"
  alt="Description de l'image"
  width={800}
  height={600}
  priority={true} // Pour les images above-the-fold
/>
```
