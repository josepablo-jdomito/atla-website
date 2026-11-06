import { Suspense, lazy, useEffect, useLayoutEffect, useState, type ComponentProps } from "react";
import { queryClient as browserQueryClient } from "./lib/queryClient";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { Router as LocationRouter } from "wouter";
import { useFunnelClickTracking, usePageAnalytics } from "@/hooks/use-analytics";
import { stripQuery } from "@/lib/stripQuery";
import { endHydration } from "@/lib/hydration";
import { AnalyticsConsent } from "@/components/atla/AnalyticsConsent";
import { AppRouter } from "./AppRouter";

export type AppPages = ComponentProps<typeof AppRouter>;

const pages: AppPages = {
  NotFound: lazy(() => import("@/pages/not-found")),
  ProjectsAdmin: lazy(() => import("@/pages/ProjectsAdmin")),
  About: lazy(() => import("@/pages/About")),
  Ventures: lazy(() => import("@/pages/Ventures")),
  Contact: lazy(() => import("@/pages/Contact")),
  Services: lazy(() => import("@/pages/Services")),
  Home: lazy(() => import("@/pages/Home")),
  Project: lazy(() => import("@/pages/Project")),
  AtlaJournal: lazy(() => import("@/pages/AtlaJournal")),
  AtlaArticle: lazy(() => import("@/pages/AtlaArticle")),
  AtlaPrivacy: lazy(() => import("@/pages/AtlaPrivacy")),
  AtlaTerms: lazy(() => import("@/pages/AtlaTerms")),
  AtlaHospitality: lazy(() => import("@/pages/AtlaHospitality")),
  AtlaHospitalityBranding: lazy(() => import("@/pages/AtlaHospitalityBranding")),
  AtlaCpgBranding: lazy(() => import("@/pages/AtlaCpgBranding")),
  AtlaWellnessBranding: lazy(() => import("@/pages/AtlaWellnessBranding")),
  AtlaSaasBranding: lazy(() => import("@/pages/AtlaSaasBranding")),
  AtlaBrandStrategy: lazy(() => import("@/pages/AtlaBrandStrategy")),
  AtlaHowWeWork: lazy(() => import("@/pages/AtlaHowWeWork")),
  AtlaPrograms: lazy(() => import("@/pages/AtlaPrograms")),
  Brief: lazy(() => import("@/pages/Brief")),
  BrandCheck: lazy(() => import("@/pages/BrandCheck")),
};
const Analytics = lazy(() => import("@vercel/analytics/react").then((module) => ({ default: module.Analytics })));
const SpeedInsights = lazy(() => import("@vercel/speed-insights/react").then((module) => ({ default: module.SpeedInsights })));

// useLayoutEffect warns under renderToString; the prerender never runs effects anyway.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Runs once the route's Suspense boundary has committed, i.e. once the page itself has hydrated (its lazy
 * chunk can arrive after the root commits). It ends the hydration phase (lib/hydration.ts) and lifts the
 * desktop gate: on the routes whose prerender is the phone layout (the wall), index.html keeps
 * #root[data-prerender-gate] unpainted on wide screens until the real layout is in. Two frames, so the
 * effects that set that layout (columns, the shuffle) have committed before the reveal.
 */
function HydrationDone() {
  useIsomorphicLayoutEffect(() => {
    endHydration();
    const root = document.getElementById("root");
    if (!root?.hasAttribute("data-prerender-gate")) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => root.removeAttribute("data-prerender-gate"));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  return null;
}

function Routes({ pages }: { pages: AppPages }) {
  usePageAnalytics();
  useFunnelClickTracking();

  return (
    <Suspense fallback={null}>
      <HydrationDone />
      <AppRouter {...pages} />
    </Suspense>
  );
}

function DeferredEnhancements() {
  if (!import.meta.env.PROD) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Analytics beforeSend={stripQuery} />
      <SpeedInsights beforeSend={stripQuery} />
    </Suspense>
  );
}

/**
 * The whole tree, shared by the browser (App below) and the prerender (PrerenderApp.tsx passes eager
 * pages, its own query client and the path), so the prerendered HTML and the client's first render are
 * the same tree and hydrateRoot can adopt the markup instead of rebuilding it.
 * The consent notice and Vercel's scripts are client-only: they mount after hydration.
 */
export function AppShell({
  client,
  pages: routePages,
  ssrPath,
}: {
  client: QueryClient;
  pages: AppPages;
  ssrPath?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <QueryClientProvider client={client}>
      <LocationRouter {...(ssrPath ? { ssrPath } : null)}>
        <Routes pages={routePages} />
      </LocationRouter>
      {mounted ? (
        <>
          <AnalyticsConsent />
          <DeferredEnhancements />
        </>
      ) : null}
    </QueryClientProvider>
  );
}

function App() {
  return <AppShell client={browserQueryClient} pages={pages} />;
}

export default App;
