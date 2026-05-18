import { Suspense, lazy, useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { AppRouter } from "./AppRouter";

const NotFound = lazy(() => import("@/pages/not-found"));
const ElementDefault = lazy(() => import("@/pages/ElementDefault").then((module) => ({ default: module.ElementDefault })));
const ProjectsAdmin = lazy(() => import("@/pages/ProjectsAdmin"));
const AtlaAbout = lazy(() => import("@/pages/AtlaAbout"));
const AtlaContact = lazy(() => import("@/pages/AtlaContact"));
const AtlaServices = lazy(() => import("@/pages/AtlaServices"));
const AtlaWork = lazy(() => import("@/pages/AtlaWork"));
const AtlaProject = lazy(() => import("@/pages/AtlaProject"));
const AtlaJournal = lazy(() => import("@/pages/AtlaJournal"));
const AtlaArticle = lazy(() => import("@/pages/AtlaArticle"));
const AtlaPrivacy = lazy(() => import("@/pages/AtlaPrivacy"));
const AtlaTerms = lazy(() => import("@/pages/AtlaTerms"));
const Analytics = lazy(() => import("@vercel/analytics/react").then((module) => ({ default: module.Analytics })));
const SpeedInsights = lazy(() => import("@vercel/speed-insights/react").then((module) => ({ default: module.SpeedInsights })));

function Router() {
  usePageAnalytics();

  return (
    <Suspense fallback={null}>
      <AppRouter
        NotFound={NotFound}
        ElementDefault={ElementDefault}
        ProjectsAdmin={ProjectsAdmin}
        AtlaAbout={AtlaAbout}
        AtlaContact={AtlaContact}
        AtlaServices={AtlaServices}
        AtlaWork={AtlaWork}
        AtlaProject={AtlaProject}
        AtlaJournal={AtlaJournal}
        AtlaArticle={AtlaArticle}
        AtlaPrivacy={AtlaPrivacy}
        AtlaTerms={AtlaTerms}
      />
    </Suspense>
  );
}

function DeferredEnhancements() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!import.meta.env.PROD) return;

    const enable = () => {
      window.setTimeout(() => setEnabled(true), 1200);
    };

    if (document.readyState === "complete") {
      enable();
      return;
    }

    window.addEventListener("load", enable, { once: true });
    return () => window.removeEventListener("load", enable);
  }, []);

  useEffect(() => {
    if (!enabled || !import.meta.env.PROD) return;
    if (document.getElementById("atla-gtm-script")) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    const script = document.createElement("script");
    script.id = "atla-gtm-script";
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-NFDF5TFQ";
    document.head.appendChild(script);
  }, [enabled]);

  if (!enabled || !import.meta.env.PROD) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Analytics />
      <SpeedInsights />
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router />
        <DeferredEnhancements />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
