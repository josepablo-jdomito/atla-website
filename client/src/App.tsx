import { Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { AppRouter } from "./AppRouter";

const NotFound = lazy(() => import("@/pages/not-found"));
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
const AtlaHospitalityBranding = lazy(() => import("@/pages/AtlaHospitalityBranding"));
const AtlaCpgBranding = lazy(() => import("@/pages/AtlaCpgBranding"));
const AtlaWellnessBranding = lazy(() => import("@/pages/AtlaWellnessBranding"));
const AtlaSaasBranding = lazy(() => import("@/pages/AtlaSaasBranding"));
const AtlaBrandStrategy = lazy(() => import("@/pages/AtlaBrandStrategy"));
const AtlaHowWeWork = lazy(() => import("@/pages/AtlaHowWeWork"));
const Analytics = lazy(() => import("@vercel/analytics/react").then((module) => ({ default: module.Analytics })));
const SpeedInsights = lazy(() => import("@vercel/speed-insights/react").then((module) => ({ default: module.SpeedInsights })));

function Router() {
  usePageAnalytics();

  return (
    <Suspense fallback={null}>
      <AppRouter
        NotFound={NotFound}
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
        AtlaHospitalityBranding={AtlaHospitalityBranding}
        AtlaCpgBranding={AtlaCpgBranding}
        AtlaWellnessBranding={AtlaWellnessBranding}
        AtlaSaasBranding={AtlaSaasBranding}
        AtlaBrandStrategy={AtlaBrandStrategy}
        AtlaHowWeWork={AtlaHowWeWork}
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
