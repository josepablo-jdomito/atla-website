/**
 * Analytics hook for SPA page view tracking and conversion events.
 *
 * Every event goes to two places. The dataLayer push is GTM-shaped, so a GTM
 * container can be added later and pick all of this up untouched. The ga4*
 * call talks to GA4 directly, because no GTM container is installed and
 * without it these pushes reach nothing.
 */

import { useEffect } from "react";
import { useLocation } from "wouter";

import { configureGa4, ga4Event } from "@/lib/ga";

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

    const pageLocation = new URL(location, window.location.origin).toString();

    pushToDataLayer({
      event: "page_view",
      page_path: location,
      page_title: document.title,
      page_location: pageLocation,
    });

    configureGa4();
    // GA4 derives the path from page_location; page_path is a Universal
    // Analytics field and is kept above only for GTM.
    ga4Event("page_view", {
      page_title: document.title,
      page_location: pageLocation,
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
  ga4Event(event, params);
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
