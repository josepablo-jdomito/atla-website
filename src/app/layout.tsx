import './globals.css'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { TopBar } from '@/components/layout/TopBar'
import { Footer } from '@/components/layout/Footer'
import { GoogleAnalytics } from '@/components/layout/GoogleAnalytics'
import { organizationJsonLd, webSiteJsonLd, jsonLdScript } from '@/lib/utils/jsonld'
import { SITE_URL } from '@/lib/config/site'
import { SessionProviderWrapper } from '@/components/layout/SessionProviderWrapper'

const NewsletterPopup = dynamic(
  () => import('@/components/layout/NewsletterPopup').then((module) => module.NewsletterPopup),
  { ssr: false }
)
const ThemeToggle = dynamic(
  () => import('@/components/layout/ThemeToggle').then((module) => module.ThemeToggle),
  { ssr: false }
)

export const metadata: Metadata = {
  title: 'WeLoveDaily',
  description:
    'The global platform for consumer brand design. Curated identities, packaging, rebrands, and brand strategy - for founders, CMOs, and creative directors.',
  metadataBase: SITE_URL,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Sanity CDN for faster image loads */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        {/* Preload only the fonts used above the fold */}
        <link
          rel="preload"
          href="/fonts/parabolica-text-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-wld-paper">
        {/*
          Theme init: runs before React hydration to avoid flash of wrong theme.
          Uses next/script beforeInteractive to bypass React's hydration reconciliation.
        */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('wld-theme');var t=(s==='light'||s==='dark')?s:'light';document.documentElement.dataset.theme=t;}catch(e){}})();`,
          }}
        />

        {/* Structured data — placed in body, which is valid per spec */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(webSiteJsonLd()) }}
        />

        <GoogleAnalytics />

        <SessionProviderWrapper>
          <NewsletterPopup />
          <ThemeToggle className="fixed right-4 bottom-20 lg:bottom-6 z-50" />

          <div className="flex max-w-full overflow-x-hidden lg:pl-[220px]">
            {/* Desktop: fixed sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 min-w-0 flex flex-col min-h-screen">
              <TopBar />
              <main className="flex-1 min-w-0 pb-[132px] lg:pb-0">{children}</main>
              <Footer />
            </div>
          </div>

          {/* Mobile: bottom tab bar */}
          <BottomTabBar />
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
