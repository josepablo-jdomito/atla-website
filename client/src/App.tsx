import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ElementDefault } from "@/pages/ElementDefault";
import ProjectsAdmin from "@/pages/ProjectsAdmin";
import AtlaAbout from "@/pages/AtlaAbout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ElementDefault} />
      <Route path="/about" component={AtlaAbout} />
      <Route path="/admin/projects" component={ProjectsAdmin} />
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
