import { Suspense, lazy, useLayoutEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFunnelClickTracking, usePageAnalytics } from "@/hooks/use-analytics";
import { stripQuery } from "@/lib/stripQuery";
import { AnalyticsConsent } from "@/components/atla/AnalyticsConsent";
import { AppRouter } from "./AppRouter";

const NotFound = lazy(() => import("@/pages/not-found"));
const ProjectsAdmin = lazy(() => import("@/pages/ProjectsAdmin"));
const About = lazy(() => import("@/pages/About"));
const Ventures = lazy(() => import("@/pages/Ventures"));
const Contact = lazy(() => import("@/pages/Contact"));
const Services = lazy(() => import("@/pages/Services"));
const Home = lazy(() => import("@/pages/Home"));
const Project = lazy(() => import("@/pages/Project"));
const AtlaJournal = lazy(() => import("@/pages/AtlaJournal"));
const AtlaArticle = lazy(() => import("@/pages/AtlaArticle"));
const AtlaPrivacy = lazy(() => import("@/pages/AtlaPrivacy"));
const AtlaTerms = lazy(() => import("@/pages/AtlaTerms"));
const AtlaHospitality = lazy(() => import("@/pages/AtlaHospitality"));
const AtlaHospitalityBranding = lazy(() => import("@/pages/AtlaHospitalityBranding"));
const AtlaCpgBranding = lazy(() => import("@/pages/AtlaCpgBranding"));
const AtlaWellnessBranding = lazy(() => import("@/pages/AtlaWellnessBranding"));
const AtlaSaasBranding = lazy(() => import("@/pages/AtlaSaasBranding"));
const AtlaBrandStrategy = lazy(() => import("@/pages/AtlaBrandStrategy"));
const AtlaHowWeWork = lazy(() => import("@/pages/AtlaHowWeWork"));
const AtlaPrograms = lazy(() => import("@/pages/AtlaPrograms"));
const Brief = lazy(() => import("@/pages/Brief"));
const BrandCheck = lazy(() => import("@/pages/BrandCheck"));
const Analytics = lazy(() => import("@vercel/analytics/react").then((module) => ({ default: module.Analytics })));
const SpeedInsights = lazy(() => import("@vercel/speed-insights/react").then((module) => ({ default: module.SpeedInsights })));

// The prerendered markup is the mobile layout. On desktop, index.html hides
// #root[data-prerender-gate] so that markup never paints; this lifts the gate
// in the same frame the real page commits. It sits inside the route's Suspense
// boundary, so it does not fire while the lazy page chunk is still loading.
function PrerenderReveal() {
  useLayoutEffect(() => {
    document.getElementById("root")?.removeAttribute("data-prerender-gate");
  }, []);

  return null;
}

function Router() {
  usePageAnalytics();
  useFunnelClickTracking();

  return (
    <Suspense fallback={null}>
      <PrerenderReveal />
      <AppRouter
        NotFound={NotFound}
        ProjectsAdmin={ProjectsAdmin}
        About={About}
        Ventures={Ventures}
        Contact={Contact}
        Services={Services}
        Home={Home}
        Project={Project}
        AtlaJournal={AtlaJournal}
        AtlaArticle={AtlaArticle}
        AtlaPrivacy={AtlaPrivacy}
        AtlaTerms={AtlaTerms}
        AtlaHospitality={AtlaHospitality}
        AtlaHospitalityBranding={AtlaHospitalityBranding}
        AtlaCpgBranding={AtlaCpgBranding}
        AtlaWellnessBranding={AtlaWellnessBranding}
        AtlaSaasBranding={AtlaSaasBranding}
        AtlaBrandStrategy={AtlaBrandStrategy}
        AtlaHowWeWork={AtlaHowWeWork}
        AtlaPrograms={AtlaPrograms}
        Brief={Brief}
        BrandCheck={BrandCheck}
      />
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <AnalyticsConsent />
      <DeferredEnhancements />
    </QueryClientProvider>
  );
}

export default App;
