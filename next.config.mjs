/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // In dev, allow Replit's preview iframe; in production lock it down
  isDev ? "frame-ancestors *" : "frame-ancestors 'none'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://challenges.cloudflare.com https://embed.typeform.com"
    : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com https://embed.typeform.com",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://challenges.cloudflare.com https://cdn.sanity.io https://*.sanity.io https://api.typeform.com https://form.typeform.com",
  "frame-src 'self' https://challenges.cloudflare.com https://embed.typeform.com https://form.typeform.com",
  "form-action 'self' https://form.typeform.com",
  // Only upgrade insecure requests in production (dev server is HTTP)
  ...(!isDev ? ["upgrade-insecure-requests"] : []),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspDirectives },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), browsing-topics=()',
  },
  // Only set X-Frame-Options in production; in dev it blocks Replit's preview iframe
  ...(!isDev ? [{ key: 'X-Frame-Options', value: 'DENY' }] : []),
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
]

const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/brand/:slug',
        destination: '/studio/:slug',
        permanent: true,
      },
      {
        source: '/article/:slug',
        destination: '/projects/:slug',
        permanent: true,
      },
      {
        source: '/project/:slug',
        destination: '/projects/:slug',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/category/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/categories',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/projects/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/studio/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
