import React from "react";
import { dehydrate, QueryClient, QueryClientProvider, type DehydratedState } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import type { JournalArticle, JournalCategory } from "@shared/journal";
import type { Project } from "@shared/schema";
import { AppRouter } from "./AppRouter";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { ElementDefault } from "./pages/ElementDefault";
import ProjectsAdmin from "./pages/ProjectsAdmin";
import AtlaAbout from "./pages/AtlaAbout";
import AtlaContact from "./pages/AtlaContact";
import AtlaServices from "./pages/AtlaServices";
import AtlaWork from "./pages/AtlaWork";
import AtlaProject from "./pages/AtlaProject";
import AtlaJournal from "./pages/AtlaJournal";
import AtlaArticle from "./pages/AtlaArticle";
import AtlaPrivacy from "./pages/AtlaPrivacy";
import AtlaTerms from "./pages/AtlaTerms";
import NotFound from "./pages/not-found";

export type PrerenderRouteData = {
  projects?: Project[];
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

  const appHtml = renderToString(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router ssrPath={pathname}>
          <AppRouter
            NotFound={NotFound}
            ElementDefault={ElementDefault}
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
          />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>,
  );

  return {
    appHtml,
    dehydratedState: dehydrate(queryClient),
  };
}
