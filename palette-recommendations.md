# Recommandations Palette & Typographie - Permis Expert

## 🎨 Palettes de Couleurs Proposées

### Option 1: Palette "Confiance & Sérénité" (Recommandée)
```css
/* Couleurs Principales */
--primary-navy: #1e3a8a;        /* Bleu marine - confiance, sérieux */
--primary-navy-light: #3b82f6;  /* Bleu clair - accessibilité */
--primary-navy-dark: #1e40af;   /* Bleu foncé - contraste */

/* Couleurs Secondaires */
--secondary-teal: #0d9488;       /* Vert-bleu - réussite, calme */
--secondary-orange: #ea580c;     /* Orange - attention, énergie */
--secondary-gray: #475569;       /* Gris ardoise - texte principal */

/* Couleurs d'Accent */
--accent-green: #059669;         /* Vert - validation, succès */
--accent-amber: #d97706;         /* Ambre - avertissement */
--accent-red: #dc2626;           /* Rouge - erreur, urgence */

/* Neutres */
--neutral-50: #f8fafc;
--neutral-100: #f1f5f9;
--neutral-200: #e2e8f0;
--neutral-300: #cbd5e1;
--neutral-400: #94a3b8;
--neutral-500: #64748b;
--neutral-600: #475569;
--neutral-700: #334155;
--neutral-800: #1e293b;
--neutral-900: #0f172a;
```

### Option 2: Palette "Moderne & Dynamique"
```css
/* Couleurs Principales */
--primary-blue: #2563eb;         /* Bleu moderne */
--primary-indigo: #4f46e5;       /* Indigo - innovation */
--primary-cyan: #06b6d4;         /* Cyan - fraîcheur */

/* Couleurs Secondaires */
--secondary-emerald: #10b981;    /* Émeraude - croissance */
--secondary-violet: #8b5cf6;     /* Violet - créativité */
--secondary-slate: #64748b;      /* Ardoise - stabilité */
```

### Option 3: Palette "Institutionnelle & Rassurante"
```css
/* Couleurs Principales */
--primary-blue: #1d4ed8;         /* Bleu institutionnel */
--primary-steel: #475569;        /* Gris acier */
--primary-forest: #065f46;       /* Vert forêt */

/* Couleurs Secondaires */
--secondary-gold: #d97706;       /* Or - excellence */
--secondary-burgundy: #991b1b;   /* Bordeaux - sérieux */
--secondary-sage: #6b7280;       /* Sauge - apaisement */
```

## 🔤 Combinaisons Typographiques

### Option 1: "Professionnelle & Lisible" (Recommandée)
```css
/* Titres & Headers */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
/* Poids: 600-700 pour les titres */

/* Corps de texte */
font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif;
/* Poids: 400-500 pour le texte courant */

/* Accents & CTA */
font-family: 'Inter', sans-serif;
/* Poids: 500-600 pour les boutons */
```

### Option 2: "Moderne & Tech"
```css
/* Titres */
font-family: 'Poppins', sans-serif;
/* Géométrique, moderne, impact visuel */

/* Corps de texte */
font-family: 'Open Sans', sans-serif;
/* Très lisible, neutre, web-friendly */

/* Accents */
font-family: 'Roboto', sans-serif;
/* Clean, Google Material Design */
```

### Option 3: "Élégante & Accessible"
```css
/* Titres */
font-family: 'Nunito Sans', sans-serif;
/* Arrondie, amicale, professionnelle */

/* Corps de texte */
font-family: 'Lato', sans-serif;
/* Humaniste, très lisible */

/* Accents */
font-family: 'Montserrat', sans-serif;
/* Géométrique, impact, CTA */
```

### Option 4: "System Fonts" (Performance optimale)
```css
/* Universelle - Utilise les polices système */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Helvetica Neue', Arial, sans-serif;
/* Avantages: Chargement instantané, familier pour l'utilisateur */
```

## 🎯 Recommandations Spécifiques

### Pour un site de tests psychotechniques:

#### Palette Recommandée: **Option 1 "Confiance & Sérénité"**
**Pourquoi:**
- **Bleu marine**: Évoque la confiance, le sérieux institutionnel
- **Vert-bleu**: Apaise l'anxiété des candidats
- **Orange contrôlé**: Attire l'attention sans agresser
- **Contrastes élevés**: Accessibilité pour tous les âges

#### Typographie Recommandée: **Option 1 "Professionnelle & Lisible"**
**Pourquoi:**
- **Inter**: Excellente lisibilité sur écran, moderne
- **Source Sans Pro**: Conçue pour la lecture prolongée
- **Accessibilité**: Dyslexie-friendly, contrastes optimaux

## 🚀 Implémentation Suggérée

### CSS Variables
```css
:root {
  /* Palette Principale */
  --color-primary: var(--primary-navy);
  --color-primary-light: var(--primary-navy-light);
  --color-primary-dark: var(--primary-navy-dark);
  
  /* États */
  --color-success: var(--accent-green);
  --color-warning: var(--accent-amber);
  --color-error: var(--accent-red);
  --color-info: var(--secondary-teal);
  
  /* Typographie */
  --font-heading: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-ui: 'Inter', sans-serif;
}
```

### Échelle Typographique
```css
/* Titres */
.text-h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
.text-h2 { font-size: 2rem; font-weight: 600; line-height: 1.3; }
.text-h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }

/* Corps */
.text-body-lg { font-size: 1.125rem; font-weight: 400; line-height: 1.6; }
.text-body { font-size: 1rem; font-weight: 400; line-height: 1.6; }
.text-body-sm { font-size: 0.875rem; font-weight: 400; line-height: 1.5; }

/* UI */
.text-button { font-size: 1rem; font-weight: 500; line-height: 1.2; }
.text-caption { font-size: 0.75rem; font-weight: 400; line-height: 1.4; }
```

## 🎨 Exemples d'Application

### Header avec InfoBar
```css
.info-bar {
  background: var(--primary-navy);
  color: white;
}

.navigation {
  background: white;
  border-bottom: 1px solid var(--neutral-200);
}

.nav-link-active {
  color: var(--primary-navy);
  background: var(--primary-navy-light);
}
```

### Boutons
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-navy), var(--primary-navy-light));
  color: white;
}

.btn-secondary {
  background: white;
  color: var(--primary-navy);
  border: 2px solid var(--primary-navy);
}

.btn-success {
  background: var(--accent-green);
  color: white;
}
```

### Cards & Sections
```css
.card {
  background: white;
  border: 1px solid var(--neutral-200);
  box-shadow: 0 4px 6px rgba(30, 58, 138, 0.1);
}

.section-highlight {
  background: linear-gradient(135deg, var(--neutral-50), var(--primary-navy-light));
}
```

---

**Recommandation finale**: La palette "Confiance & Sérénité" avec la typographie "Professionnelle & Lisible" offre le meilleur équilibre entre sérieux professionnel et accessibilité pour votre public cible.
