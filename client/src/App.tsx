import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const NotFound = lazy(() => import("@/pages/not-found"));
const ElementDefault = lazy(() => import("@/pages/ElementDefault").then((module) => ({ default: module.ElementDefault })));
const ProjectsAdmin = lazy(() => import("@/pages/ProjectsAdmin"));
const AtlaAbout = lazy(() => import("@/pages/AtlaAbout"));
const AtlaWork = lazy(() => import("@/pages/AtlaWork"));
const AtlaProject = lazy(() => import("@/pages/AtlaProject"));
const AtlaJournal = lazy(() => import("@/pages/AtlaJournal"));
const AtlaArticle = lazy(() => import("@/pages/AtlaArticle"));
const AtlaPrivacy = lazy(() => import("@/pages/AtlaPrivacy"));
const AtlaTerms = lazy(() => import("@/pages/AtlaTerms"));

function Router() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={ElementDefault} />
        <Route path="/work" component={AtlaWork} />
        <Route path="/about" component={AtlaAbout} />
        <Route path="/projects/:slug" component={AtlaProject} />
        <Route path="/journal" component={AtlaJournal} />
        <Route path="/journal/:slug" component={AtlaArticle} />
        <Route path="/privacy" component={AtlaPrivacy} />
        <Route path="/terms" component={AtlaTerms} />
        <Route path="/admin/projects" component={ProjectsAdmin} />
        <Route component={NotFound} />
      </Switch>
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
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
