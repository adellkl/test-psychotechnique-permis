import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://test-psychotechnique-permis.com'
  const currentDate = new Date().toISOString()

  return [
    // Page d'accueil - Priorité maximale
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Pages de réservation - Très important
    {
      url: `${baseUrl}/prendre-rendez-vous`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/rendez-vous`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    // Pages principales - Invalidation/Suspension/Annulation
    {
      url: `${baseUrl}/invalidation-permis`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/suspension-permis`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/annulation-permis`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Pages informatives
    {
      url: `${baseUrl}/a-propos`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/agrement-prefectoral`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    // Pages légales
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
