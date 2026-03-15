/**
 * Analytics hook for SPA page view tracking and GTM conversion events.
 *
 * GA4, Clarity, and future tags can all be configured in GTM without adding
 * individual scripts to the app.
 */

import { useEffect } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function pushToDataLayer(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

export function usePageAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;

    pushToDataLayer({
      event: "page_view",
      page_path: location,
      page_title: document.title,
      page_location: new URL(location, window.location.origin).toString(),
    });
  }, [location]);
}

type ConversionEvent =
  | "contact_form_submit"
  | "newsletter_signup"
  | "brief_template_download"
  | "journal_cta_click"
  | "journal_article_read"
  | "portfolio_project_view";

interface EventParams {
  page?: string;
  article_slug?: string;
  article_category?: string;
  article_lane?: string;
  cta_type?: string;
  project_name?: string;
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(event: ConversionEvent, params?: EventParams) {
  pushToDataLayer({
    event,
    ...params,
  });
}

export function useScrollDepthTracking(
  articleSlug: string,
  category?: string,
  lane?: string,
  threshold = 0.75,
) {
  useEffect(() => {
    if (typeof window === "undefined" || !articleSlug) return;

    let fired = false;

    const handleScroll = () => {
      if (fired) return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight > 0 && scrollTop / docHeight >= threshold) {
        fired = true;
        trackEvent("journal_article_read", {
          article_slug: articleSlug,
          article_category: category,
          article_lane: lane,
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [articleSlug, category, lane, threshold]);
}
