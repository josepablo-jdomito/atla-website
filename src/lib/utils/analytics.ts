/**
 * GA4 Analytics Event Helpers
 * All event names and parameters centralized here.
 */

type EventLocation =
  | 'header'
  | 'footer'
  | 'in_feed'
  | 'article_footer'
  | 'mid_feed'
  | 'hero'

interface EventParams {
  location?: EventLocation
  query?: string
  slug?: string
  category?: string
  [key: string]: string | undefined
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export function trackEvent(name: string, params?: EventParams) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
}

export function trackSubmitClick(location: EventLocation) {
  trackEvent('cta_submit_click', { location })
}

export function trackAdvertiseClick(location: EventLocation) {
  trackEvent('cta_advertise_click', { location })
}

export function trackNewsletterClick(location: EventLocation) {
  trackEvent('newsletter_click', { location })
}

export function trackArticleView(slug: string, category: string) {
  trackEvent('article_view', { slug, category })
}

export function trackSearchSubmit(query: string) {
  trackEvent('search_submit', { query })
}

export function trackSubmitSuccess() {
  trackEvent('submit_success_view')
}

export function trackAdvertiseSuccess() {
  trackEvent('advertise_success_view')
}

export function trackContactSuccess() {
  trackEvent('contact_success_view')
}
