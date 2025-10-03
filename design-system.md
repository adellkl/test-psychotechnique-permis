# Design System - Permis Expert

## 🎨 Palette de Couleurs

### Couleurs Principales
```css
--primary-blue: #2563eb;      /* Bleu principal */
--primary-blue-dark: #1d4ed8; /* Bleu foncé (hover) */
--primary-blue-light: #eff6ff; /* Bleu clair (backgrounds) */
```

### Couleurs Secondaires
```css
--secondary-gray: #374151;    /* Gris texte principal */
--secondary-gray-light: #9ca3af; /* Gris texte secondaire */
--secondary-gray-bg: #f9fafb;  /* Gris background */
```

### Couleurs d'État
```css
--success-green: #10b981;     /* Vert succès */
--warning-yellow: #f59e0b;    /* Jaune attention */
--error-red: #ef4444;         /* Rouge erreur */
--info-cyan: #06b6d4;         /* Cyan information */
```

### Couleurs Neutres
```css
--white: #ffffff;
--black: #000000;
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

## 📝 Typographie

### Police Principale
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Échelle Typographique
```css
/* Titres */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */

/* Poids de police */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## 📏 Espacement

### Système d'espacement (basé sur 0.25rem = 4px)
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

## 🔘 Composants

### Boutons

#### Bouton Principal
```css
.btn-primary {
  background: linear-gradient(to right, var(--primary-blue), var(--primary-blue-dark));
  color: var(--white);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: var(--font-medium);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
}
```

#### Bouton Secondaire
```css
.btn-secondary {
  background: var(--white);
  color: var(--primary-blue);
  border: 1px solid var(--gray-300);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: var(--font-medium);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--primary-blue-light);
  border-color: var(--primary-blue);
}
```

### Liens de Navigation

#### Lien Actif
```css
.nav-link-active {
  color: var(--primary-blue);
  background: var(--primary-blue-light);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  position: relative;
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary-blue);
  border-radius: 9999px;
}
```

#### Lien Inactif
```css
.nav-link {
  color: var(--gray-700);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: var(--primary-blue);
  background: var(--gray-50);
}
```

### Cartes

#### Carte Standard
```css
.card {
  background: var(--white);
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--gray-200);
  padding: var(--space-6);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

## 🎭 Animations

### Transitions Standard
```css
--transition-fast: 0.15s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
```

### Animations Personnalisées
```css
/* Animation de défilement */
@keyframes marquee {
  from { transform: translateX(100%); }
  to { transform: translateX(-100%); }
}

/* Animation de fade-in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Animation de scale */
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

## 📱 Breakpoints Responsive

```css
/* Mobile First Approach */
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--large: 1280px;
--xl: 1536px;

/* Usage avec Tailwind */
sm: 640px   /* @media (min-width: 640px) */
md: 768px   /* @media (min-width: 768px) */
lg: 1024px  /* @media (min-width: 1024px) */
xl: 1280px  /* @media (min-width: 1280px) */
2xl: 1536px /* @media (min-width: 1536px) */
```

## 🎯 Règles d'Usage

### Hiérarchie Visuelle
1. **Titre Principal** : `text-2xl font-bold text-gray-800`
2. **Sous-titres** : `text-lg font-semibold text-gray-700`
3. **Texte Principal** : `text-base text-gray-600`
4. **Texte Secondaire** : `text-sm text-gray-500`

### Espacement Cohérent
- **Sections** : `space-y-16` (64px)
- **Composants** : `space-y-8` (32px)
- **Éléments** : `space-y-4` (16px)
- **Texte** : `space-y-2` (8px)

### États Interactifs
- **Hover** : Légère élévation + changement de couleur
- **Focus** : Outline bleu + légère ombre
- **Active** : Couleur primaire + indicateur visuel
- **Disabled** : Opacité 50% + cursor not-allowed

## 🚀 Exemples d'Implémentation

### Header avec InfoBar
```tsx
<InfoBar /> {/* Barre bleue défilante */}
<Navigation /> {/* Menu avec liens actifs */}
```

### Bouton CTA
```tsx
<button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium">
  Prendre rendez-vous
</button>
```

### Card Interactive
```tsx
<div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
  {/* Contenu */}
</div>
```

---

*Ce design system assure une cohérence visuelle et une expérience utilisateur optimale sur toute l'application Permis Expert.*
