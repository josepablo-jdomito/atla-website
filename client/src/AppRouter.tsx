import React from "react";
import type { ComponentType } from "react";
import { Route, Switch } from "wouter";

type RouteComponent = ComponentType<any>;

type AppRouterProps = {
  NotFound: RouteComponent;
  ProjectsAdmin: RouteComponent;
  About: RouteComponent;
  Contact: RouteComponent;
  Services: RouteComponent;
  Home: RouteComponent;
  Project: RouteComponent;
  AtlaJournal: RouteComponent;
  AtlaArticle: RouteComponent;
  AtlaPrivacy: RouteComponent;
  AtlaTerms: RouteComponent;
  AtlaHospitality: RouteComponent;
  AtlaHospitalityBranding: RouteComponent;
  AtlaCpgBranding: RouteComponent;
  AtlaWellnessBranding: RouteComponent;
  AtlaSaasBranding: RouteComponent;
  AtlaBrandStrategy: RouteComponent;
  AtlaHowWeWork: RouteComponent;
  AtlaPrograms: RouteComponent;
  Brief: RouteComponent;
};

export function AppRouter({
  NotFound,
  ProjectsAdmin,
  About,
  Contact,
  Services,
  Home,
  Project,
  AtlaJournal,
  AtlaArticle,
  AtlaPrivacy,
  AtlaTerms,
  AtlaHospitality,
  AtlaHospitalityBranding,
  AtlaCpgBranding,
  AtlaWellnessBranding,
  AtlaSaasBranding,
  AtlaBrandStrategy,
  AtlaHowWeWork,
  AtlaPrograms,
  Brief,
}: AppRouterProps) {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/work" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/services" component={Services} />
      <Route path="/hospitality" component={AtlaHospitality} />
      <Route path="/hospitality-branding" component={AtlaHospitalityBranding} />
      <Route path="/cpg-branding" component={AtlaCpgBranding} />
      <Route path="/wellness-branding" component={AtlaWellnessBranding} />
      <Route path="/saas-branding" component={AtlaSaasBranding} />
      <Route path="/brand-strategy" component={AtlaBrandStrategy} />
      <Route path="/how-we-work" component={AtlaHowWeWork} />
      <Route path="/programs" component={AtlaPrograms} />
      <Route path="/brief" component={Brief} />
      <Route path="/projects/:slug" component={Project} />
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
