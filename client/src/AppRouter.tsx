import React from "react";
import type { ComponentType } from "react";
import { Route, Switch } from "wouter";
import { isLoveHost } from "@/lib/loveHost";

type RouteComponent = ComponentType<any>;

type AppRouterProps = {
  NotFound: RouteComponent;
  ProjectsAdmin: RouteComponent;
  AtlaAbout: RouteComponent;
  AtlaContact: RouteComponent;
  AtlaServices: RouteComponent;
  AtlaWork: RouteComponent;
  AtlaProject: RouteComponent;
  AtlaJournal: RouteComponent;
  AtlaArticle: RouteComponent;
  AtlaPrivacy: RouteComponent;
  AtlaTerms: RouteComponent;
  AtlaHospitalityBranding: RouteComponent;
  AtlaCpgBranding: RouteComponent;
  AtlaWellnessBranding: RouteComponent;
  AtlaSaasBranding: RouteComponent;
  AtlaBrandStrategy: RouteComponent;
  AtlaHowWeWork: RouteComponent;
  AtlaWhyWeLove: RouteComponent;
};

export function AppRouter({
  NotFound,
  ProjectsAdmin,
  AtlaAbout,
  AtlaContact,
  AtlaServices,
  AtlaWork,
  AtlaProject,
  AtlaJournal,
  AtlaArticle,
  AtlaPrivacy,
  AtlaTerms,
  AtlaHospitalityBranding,
  AtlaCpgBranding,
  AtlaWellnessBranding,
  AtlaSaasBranding,
  AtlaBrandStrategy,
  AtlaHowWeWork,
  AtlaWhyWeLove,
}: AppRouterProps) {
  // On love.atla.design the prototype is the site root; everywhere else it is a
  // route on the main site and "/" is the work index.
  const HomeRoute = isLoveHost() ? AtlaWhyWeLove : AtlaWork;

  return (
    <Switch>
      <Route path="/" component={HomeRoute} />
      <Route path="/work" component={AtlaWork} />
      <Route path="/about" component={AtlaAbout} />
      <Route path="/contact" component={AtlaContact} />
      <Route path="/services" component={AtlaServices} />
      <Route path="/hospitality-branding" component={AtlaHospitalityBranding} />
      <Route path="/cpg-branding" component={AtlaCpgBranding} />
      <Route path="/wellness-branding" component={AtlaWellnessBranding} />
      <Route path="/saas-branding" component={AtlaSaasBranding} />
      <Route path="/brand-strategy" component={AtlaBrandStrategy} />
      <Route path="/how-we-work" component={AtlaHowWeWork} />
      <Route path="/why-we-love" component={AtlaWhyWeLove} />
      <Route path="/projects/:slug" component={AtlaProject} />
      <Route path="/journal" component={AtlaJournal} />
      <Route path="/journal/category/:slug" component={AtlaJournal} />
      <Route path="/journal/:slug" component={AtlaArticle} />
      <Route path="/privacy" component={AtlaPrivacy} />
      <Route path="/terms" component={AtlaTerms} />
      <Route path="/admin/projects" component={ProjectsAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}
