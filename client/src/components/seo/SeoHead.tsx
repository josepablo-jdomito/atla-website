import { useEffect } from "react";

type SeoHeadProps = {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  type?: "website" | "article";
  robots?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const SITE_NAME = "Atla";
const FALLBACK_ORIGIN = "https://atla-website.vercel.app";

function getOrigin() {
  if (typeof window === "undefined") return FALLBACK_ORIGIN;
  return window.location.origin || FALLBACK_ORIGIN;
}

function upsertMeta(selector: string, attributes: Record<string, string>, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export function SeoHead({
  title,
  description,
  pathname,
  image,
  type = "website",
  robots = "index,follow",
  structuredData,
}: SeoHeadProps) {
  useEffect(() => {
    const origin = getOrigin();
    const canonicalUrl = new URL(pathname, origin).toString();
    const imageUrl = image ? new URL(image, origin).toString() : undefined;
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', { name: "description" }, description);
    upsertMeta('meta[name="robots"]', { name: "robots" }, robots);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, fullTitle);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, type);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, SITE_NAME);
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, imageUrl ? "summary_large_image" : "summary");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, fullTitle);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);

    if (imageUrl) {
      upsertMeta('meta[property="og:image"]', { property: "og:image" }, imageUrl);
      upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, imageUrl);
    }

    upsertLink("canonical", canonicalUrl);

    const scriptId = "atla-seo-jsonld";
    const existingScript = document.getElementById(scriptId);
    if (existingScript) existingScript.remove();

    if (structuredData) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      const currentScript = document.getElementById(scriptId);
      if (currentScript) currentScript.remove();
    };
  }, [description, image, pathname, robots, structuredData, title, type]);

  return null;
}
