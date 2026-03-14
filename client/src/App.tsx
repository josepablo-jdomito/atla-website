import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { HomePage } from "@/pages/HomePage";
import { ProjectPage } from "@/pages/ProjectPage";
import { WorkPage } from "@/pages/WorkPage";
import ProjectsAdmin from "@/pages/ProjectsAdmin";
import { SanityPortfolioDebug } from "@/pages/SanityPortfolioDebug";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/work" component={WorkPage} />
      <Route path="/work/:slug">
        {(params) => <ProjectPage slug={params.slug} />}
      </Route>
      <Route path="/admin/projects" component={ProjectsAdmin} />
      <Route path="/admin/sanity-debug" component={SanityPortfolioDebug} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
