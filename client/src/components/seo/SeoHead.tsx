import { useEffect } from "react";
import { DEFAULT_OG_IMAGE_URL } from "@shared/siteSeo";

type SeoHeadProps = {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  preloadImages?: string[];
  type?: "website" | "article";
  robots?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const SITE_NAME = "Atla";
const FALLBACK_ORIGIN = "https://www.atla.design";

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

function syncImagePreloads(urls: string[]) {
  const selector = "link[data-atla-preload='image']";
  document.head.querySelectorAll(selector).forEach((node) => node.remove());
  urls.forEach((href) => {
    const link = document.createElement("link");
    link.setAttribute("rel", "preload");
    link.setAttribute("as", "image");
    link.setAttribute("href", href);
    link.setAttribute("data-atla-preload", "image");
    document.head.appendChild(link);
  });
}

export function SeoHead({
  title,
  description,
  pathname,
  image,
  preloadImages = [],
  type = "website",
  robots = "index,follow",
  structuredData,
}: SeoHeadProps) {
  useEffect(() => {
    const origin = getOrigin();
    const canonicalUrl = new URL(pathname, origin).toString();
    const imageUrl = new URL(image || DEFAULT_OG_IMAGE_URL, origin).toString();
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', { name: "description" }, description);
    upsertMeta('meta[name="robots"]', { name: "robots" }, robots);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, fullTitle);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, type);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, SITE_NAME);
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, fullTitle);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);

    upsertMeta('meta[property="og:image"]', { property: "og:image" }, imageUrl);
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, imageUrl);

    upsertLink("canonical", canonicalUrl);
    const preloadSet = new Set<string>([
      new URL("/figmaAssets/logo.svg", origin).toString(),
      imageUrl,
      ...preloadImages.filter(Boolean),
    ]);
    syncImagePreloads(Array.from(preloadSet));

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
      document.head.querySelectorAll("link[data-atla-preload='image']").forEach((node) => node.remove());
    };
  }, [description, image, pathname, preloadImages, robots, structuredData, title, type]);

  return null;
}
