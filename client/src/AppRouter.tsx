import React from "react";
import type { ComponentType } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";

/**
 * While the free audit ships ahead of the site (JP, 2026-11-07): audit.atla.design serves only /audit.
 * Vercel redirects every other request there (vercel.json); this covers the client-side route changes
 * the server never sees (the wordmark, "See the work", the privacy link).
 */
const AUDIT_HOST = "audit.atla.design";
function useAuditHostGuard() {
  const [location] = useLocation();
  React.useEffect(() => {
    if (window.location.hostname !== AUDIT_HOST) return;
    if (location === "/audit" || location.startsWith("/audit?")) return;
    window.location.replace(`https://www.atla.design${location}${window.location.search}`);
  }, [location]);
}

type RouteComponent = ComponentType<any>;

type AppRouterProps = {
  NotFound: RouteComponent;
  ProjectsAdmin: RouteComponent;
  About: RouteComponent;
  Ventures: RouteComponent;
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
  AtlaStartupBranding: RouteComponent;
  AtlaBrandingAgencyAustin: RouteComponent;
  AtlaBrandStrategy: RouteComponent;
  AtlaHowWeWork: RouteComponent;
  AtlaPrograms: RouteComponent;
  Brief: RouteComponent;
  BrandCheck: RouteComponent;
  Audit: RouteComponent;
};

export function AppRouter({
  NotFound,
  ProjectsAdmin,
  About,
  Ventures,
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
  AtlaStartupBranding,
  AtlaBrandingAgencyAustin,
  AtlaBrandStrategy,
  AtlaHowWeWork,
  AtlaPrograms,
  Brief,
  BrandCheck,
  Audit,
}: AppRouterProps) {
  useAuditHostGuard();
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/ventures" component={Ventures} />
      <Route path="/contact">{() => <Redirect to="/brief" replace />}</Route>
      <Route path="/services" component={Services} />
      <Route path="/hospitality" component={AtlaHospitality} />
      <Route path="/hospitality-branding" component={AtlaHospitalityBranding} />
      <Route path="/cpg-branding" component={AtlaCpgBranding} />
      <Route path="/wellness-branding" component={AtlaWellnessBranding} />
      <Route path="/saas-branding" component={AtlaSaasBranding} />
      <Route path="/startup-branding" component={AtlaStartupBranding} />
      <Route path="/branding-agency-austin" component={AtlaBrandingAgencyAustin} />
      <Route path="/brand-strategy" component={AtlaBrandStrategy} />
      <Route path="/how-we-work" component={AtlaHowWeWork} />
      <Route path="/programs" component={AtlaPrograms} />
      <Route path="/brief" component={Brief} />
      <Route path="/brand-check" component={BrandCheck} />
      <Route path="/audit" component={Audit} />
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
