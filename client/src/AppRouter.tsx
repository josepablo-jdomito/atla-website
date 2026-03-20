import React from "react";
import type { ComponentType } from "react";
import { Route, Switch } from "wouter";

type RouteComponent = ComponentType<any>;

type AppRouterProps = {
  NotFound: RouteComponent;
  ElementDefault: RouteComponent;
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
};

export function AppRouter({
  NotFound,
  ElementDefault,
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
}: AppRouterProps) {
  return (
    <Switch>
      <Route path="/" component={ElementDefault} />
      <Route path="/work" component={AtlaWork} />
      <Route path="/about" component={AtlaAbout} />
      <Route path="/contact" component={AtlaContact} />
      <Route path="/services" component={AtlaServices} />
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
