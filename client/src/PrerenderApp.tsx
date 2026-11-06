import React from "react";
import { dehydrate, QueryClient, type DehydratedState } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import type { JournalArticle, JournalCategory } from "@shared/journal";
import type { Project } from "@shared/schema";
import type { ProjectListItem } from "@shared/projectList";
import { AppShell } from "./App";
import ProjectsAdmin from "./pages/ProjectsAdmin";
import About from "./pages/About";
import Ventures from "./pages/Ventures";
import Services from "./pages/Services";
import Home from "./pages/Home";
import ProjectPage from "./pages/Project";
import AtlaJournal from "./pages/AtlaJournal";
import AtlaArticle from "./pages/AtlaArticle";
import AtlaPrivacy from "./pages/AtlaPrivacy";
import AtlaTerms from "./pages/AtlaTerms";
import AtlaHospitality from "./pages/AtlaHospitality";
import AtlaHospitalityBranding from "./pages/AtlaHospitalityBranding";
import AtlaCpgBranding from "./pages/AtlaCpgBranding";
import AtlaWellnessBranding from "./pages/AtlaWellnessBranding";
import AtlaSaasBranding from "./pages/AtlaSaasBranding";
import AtlaBrandStrategy from "./pages/AtlaBrandStrategy";
import AtlaHowWeWork from "./pages/AtlaHowWeWork";
import AtlaPrograms from "./pages/AtlaPrograms";
import Brief from "./pages/Brief";
import BrandCheck from "./pages/BrandCheck";
import NotFound from "./pages/not-found";

export type PrerenderRouteData = {
  /** The lite list (shared/projectList.ts), the same shape GET /api/projects answers. */
  projects?: ProjectListItem[];
  project?: Project | null;
  articles?: JournalArticle[];
  article?: JournalArticle | null;
  categories?: JournalCategory[];
};

export type PrerenderResult = {
  appHtml: string;
  dehydratedState: DehydratedState;
};

function createPrerenderQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function seedRouteData(queryClient: QueryClient, pathname: string, data: PrerenderRouteData) {
  if (data.projects) {
    queryClient.setQueryData(["/api/projects"], data.projects);
  }

  if (data.articles) {
    queryClient.setQueryData(["/api/journal"], data.articles);
  }

  if (data.categories) {
    queryClient.setQueryData(["/api/journal/categories"], data.categories);
  }

  if (pathname.startsWith("/projects/")) {
    const slug = pathname.slice("/projects/".length);
    queryClient.setQueryData(["project", slug], data.project ?? null);
  }

  if (pathname.startsWith("/journal/category/")) {
    return;
  }

  if (pathname.startsWith("/journal/")) {
    const slug = pathname.slice("/journal/".length);
    queryClient.setQueryData(["/api/journal", slug], data.article ?? null);
  }
}

export function renderPrerenderedRoute(
  pathname: string,
  data: PrerenderRouteData = {},
): PrerenderResult {
  const queryClient = createPrerenderQueryClient();
  seedRouteData(queryClient, pathname, data);

  // The same tree the browser hydrates (App.tsx AppShell), with eager pages.
  const appHtml = renderToString(
    <AppShell
      client={queryClient}
      ssrPath={pathname}
      pages={{
        NotFound,
        ProjectsAdmin,
        About,
        Ventures,
        Services,
        Home,
        Project: ProjectPage,
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
        BrandCheck,
      }}
    />,
  );

  return {
    appHtml,
    dehydratedState: dehydrate(queryClient),
  };
}
