import './globals.css'
import type { Metadata } from 'next'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { Footer } from '@/components/layout/Footer'
import { GoogleAnalytics } from '@/components/layout/GoogleAnalytics'
import { organizationJsonLd, webSiteJsonLd, jsonLdScript } from '@/lib/utils/jsonld'

export const metadata: Metadata = {
  title: 'WeLoveDaily',
  description: 'A curated space for the creative work that matters.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://welovedaily.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Sanity CDN for faster image loads */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/parabolica-text-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/parabolica-medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/parabolica-bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Organization + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(webSiteJsonLd()) }}
        />
      </head>
      <body className="min-h-screen bg-wld-paper">
        <GoogleAnalytics />

        <div className="flex">
          {/* Desktop: fixed sidebar */}
          <Sidebar />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-h-screen">
            <main className="flex-1 pb-[72px] lg:pb-0">{children}</main>
            <Footer />
          </div>
        </div>

        {/* Mobile: bottom tab bar */}
        <BottomTabBar />
      </body>
    </html>
  )
}
