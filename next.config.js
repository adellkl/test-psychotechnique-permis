/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'localhost',
      'maps.googleapis.com',
      'maps.gstatic.com',
    ],
  },

  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: https://maps.gstatic.com https://maps.googleapis.com;
              font-src 'self' data:;
              connect-src 'self' https://*.supabase.co https://api.elasticemail.com;
              frame-src 'self' https://www.google.com https://maps.google.com;
              base-uri 'self';
              form-action 'self';
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/rendez-vous',
        destination: '/prendre-rendez-vous',
        permanent: true,
      },
      {
        source: '/rdv',
        destination: '/prendre-rendez-vous',
        permanent: true,
      },
    ];
  },

  // Experimental features for performance
  experimental: {
    scrollRestoration: true,
  },

  // Build configuration optimized for deployment
  distDir: '.next',
  generateEtags: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // Internationalization
  i18n: {
    locales: ['fr'],
    defaultLocale: 'fr',
  },

  // Output configuration for Vercel deployment
  output: 'standalone',

  // Trailing slash configuration
  trailingSlash: false,

  // Static optimization
  staticPageGenerationTimeout: 60,

  // Webpack optimization for production
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
    }
    return config
  },
}

module.exports = nextConfig
