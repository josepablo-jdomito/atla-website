import './globals.css'
import type { Metadata } from 'next'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { Footer } from '@/components/layout/Footer'
import { GoogleAnalytics } from '@/components/layout/GoogleAnalytics'
import { NewsletterPopup } from '@/components/layout/NewsletterPopup'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { organizationJsonLd, webSiteJsonLd, jsonLdScript } from '@/lib/utils/jsonld'

export const metadata: Metadata = {
  title: 'WeLoveDaily',
  description:
    'The global platform for consumer brand design. Curated identities, packaging, rebrands, and brand strategy - for founders, CMOs, and creative directors.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://welovedaily.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var saved=localStorage.getItem('wld-theme');var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var theme=(saved==='light'||saved==='dark')?saved:(prefersDark?'dark':'light');document.documentElement.dataset.theme=theme;}catch(e){}})();`,
          }}
        />
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
        <link
          rel="preload"
          href="/fonts/jha-times-semibold.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/jha-times-bold.otf"
          as="font"
          type="font/otf"
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
        <NewsletterPopup />
        <ThemeToggle className="fixed right-4 bottom-20 lg:bottom-6 z-50" />

        <div className="flex max-w-full overflow-x-hidden lg:pl-[220px]">
          {/* Desktop: fixed sidebar */}
          <Sidebar />

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col min-h-screen">
            <main className="flex-1 min-w-0 pb-[132px] lg:pb-0">{children}</main>
            <Footer />
          </div>
        </div>

        {/* Mobile: bottom tab bar */}
        <BottomTabBar />
      </body>
    </html>
  )
}
