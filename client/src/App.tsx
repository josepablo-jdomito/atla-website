import { Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { AppRouter } from "./AppRouter";

const NotFound = lazy(() => import("@/pages/not-found"));
const ElementDefault = lazy(() => import("@/pages/ElementDefault").then((module) => ({ default: module.ElementDefault })));
const ProjectsAdmin = lazy(() => import("@/pages/ProjectsAdmin"));
const AtlaAbout = lazy(() => import("@/pages/AtlaAbout"));
const AtlaServices = lazy(() => import("@/pages/AtlaServices"));
const AtlaWork = lazy(() => import("@/pages/AtlaWork"));
const AtlaProject = lazy(() => import("@/pages/AtlaProject"));
const AtlaJournal = lazy(() => import("@/pages/AtlaJournal"));
const AtlaArticle = lazy(() => import("@/pages/AtlaArticle"));
const AtlaPrivacy = lazy(() => import("@/pages/AtlaPrivacy"));
const AtlaTerms = lazy(() => import("@/pages/AtlaTerms"));

function Router() {
  usePageAnalytics();

  return (
    <Suspense fallback={null}>
      <AppRouter
        NotFound={NotFound}
        ElementDefault={ElementDefault}
        ProjectsAdmin={ProjectsAdmin}
        AtlaAbout={AtlaAbout}
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <Analytics />
          <SpeedInsights />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
