import { useDeferredValue, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { FileText, Grid3X3, List, Mail, MessageCircleQuestion, Palette, RotateCcw, Search, Send, Share2 } from "lucide-react";
import { AtlaWordmark } from "@/components/atla/AtlaMarks";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { trackEvent } from "@/hooks/use-analytics";
import { useIsMobile } from "@/hooks/use-mobile";
import { CONTACT_EMAIL, SITE_ORIGIN } from "@shared/siteSeo";

const NAV_HEIGHT_DESKTOP = 76;
const NAV_HEIGHT_MOBILE = 68;
const QUICK_EMAIL = CONTACT_EMAIL;
const SLACK_DEEP_LINK = "slack://open";
const RECENT_PROJECTS_STORAGE_KEY = "atla-command-recent-projects-v1";
const RECENT_ACTIONS_STORAGE_KEY = "atla-command-recent-actions-v1";
const COMMAND_DRAFTS_STORAGE_KEY = "atla-command-drafts-v1";

const SEARCH_INPUT_STYLE: CSSProperties = {
  width: "100%",
  minHeight: 48,
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 999,
  background: "rgba(255,255,255,0.12)",
  color: "#f5f3ef",
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.2,
  lineHeight: "1.1",
  padding: "13px 16px",
  boxSizing: "border-box",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
};

export type AtlaCommandProject = {
  slug: string;
  title: string;
  client: string;
  year: number;
  category: string;
  region: string;
  country: string;
  service: string;
  coverImage: string;
  description: string;
};

type CommandEventDetail =
  | { type: "search"; value: string }
  | { type: "focus-project"; value: string }
  | { type: "set-view"; value: string }
  | { type: "set-background"; value: "White" | "Black" | "Random" | "System" }
  | { type: "set-grid-size"; value: "Extra Large" | "Large" | "Small" | "Extra Small" }
  | { type: "clear-filters" };

type CommandAction = {
  id: string;
  label: string;
  helper: string;
  command: string;
  shortcut?: string;
  icon: ReactNode;
  keywords: string[];
  keepOpen?: boolean;
  run: () => void;
};

type PaletteItem = {
  key: string;
  kind: "action" | "project";
  title: string;
  subtitle: string;
  meta?: string;
  commandLabel?: string;
  icon?: ReactNode;
  imageSrc?: string;
  keepOpen?: boolean;
  onSelect: () => void;
};

type PaletteSection = {
  id: string;
  title: string;
  items: PaletteItem[];
};

type StoredDrafts = {
  brief: string;
  ask: string;
};

function readStoredStringArray(key: string) {
  if (typeof window === "undefined") return [];

  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) return [];
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeStoredStringArray(key: string, values: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(values.slice(0, 6)));
}

function readStoredDrafts(): StoredDrafts {
  if (typeof window === "undefined") {
    return { brief: "", ask: "" };
  }

  try {
    const rawValue = window.localStorage.getItem(COMMAND_DRAFTS_STORAGE_KEY);
    if (!rawValue) return { brief: "", ask: "" };
    const parsed = JSON.parse(rawValue) as Partial<StoredDrafts>;
    return {
      brief: typeof parsed.brief === "string" ? parsed.brief : "",
      ask: typeof parsed.ask === "string" ? parsed.ask : "",
    };
  } catch {
    return { brief: "", ask: "" };
  }
}

function writeStoredDrafts(drafts: StoredDrafts) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COMMAND_DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
}

function scoreProjectMatch(project: AtlaCommandProject, normalizedQuery: string) {
  if (!normalizedQuery) return 0;

  const title = project.title.toLowerCase();
  const client = project.client.toLowerCase();
  const category = project.category.toLowerCase();
  const service = project.service.toLowerCase();
  const country = project.country.toLowerCase();
  const region = project.region.toLowerCase();
  const description = project.description.toLowerCase();

  let score = 0;

  if (title === normalizedQuery) score += 120;
  if (title.startsWith(normalizedQuery)) score += 90;
  if (title.includes(normalizedQuery)) score += 56;
  if (client.startsWith(normalizedQuery)) score += 38;
  if (client.includes(normalizedQuery)) score += 26;
  if (category.includes(normalizedQuery)) score += 18;
  if (service.includes(normalizedQuery)) score += 16;
  if (country.includes(normalizedQuery)) score += 15;
  if (region.includes(normalizedQuery)) score += 12;
  if (description.includes(normalizedQuery)) score += 8;

  return score;
}

function commandPackage(mode: "brief" | "ask", content: string) {
  const header = mode === "brief" ? "ATLA PROJECT BRIEF" : "ATLA QUESTION";
  return `${header}\nContact: ${QUICK_EMAIL}\n\n${content.trim()}`;
}

function currentShareContext() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      url: `${SITE_ORIGIN}/work`,
      title: "Atla",
    };
  }

  const cleanTitle = document.title.replace(/\s+\|\s+Atla\s*$/i, "").trim();
  return {
    url: window.location.href || `${SITE_ORIGIN}/work`,
    title: cleanTitle || "Atla",
  };
}

function shareSitePackage() {
  const { url, title } = currentShareContext();
  return {
    subject: `Atla — ${title}`,
    body: `Take a look at this page from Atla:\n${title}\n${url}\n\nIf useful, you can reach the studio here: ${QUICK_EMAIL}`,
    slack: `Take a look at this page from Atla:\n*${title}*\n${url}\n\nIf useful, the studio contact is ${QUICK_EMAIL}.`,
  };
}

function tonePalette(isMobile: boolean) {
  return {
    panel: {
      width: "100%",
      maxWidth: isMobile ? "100%" : 920,
      maxHeight: isMobile ? "calc(100vh - 90px)" : "min(82vh, 760px)",
      borderRadius: isMobile ? 16 : 20,
      border: "1px solid rgba(255,255,255,0.18)",
      background: "linear-gradient(180deg, rgba(72,72,74,0.94) 0%, rgba(62,62,64,0.92) 100%)",
      boxShadow: "0 28px 90px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.16)",
    } satisfies CSSProperties,
    row: {
      border: "1px solid rgba(255,255,255,0.10)",
      background: "rgba(255,255,255,0.04)",
      borderRadius: 12,
    } satisfies CSSProperties,
    rowActive: {
      background: "rgba(255,255,255,0.10)",
      borderColor: "rgba(255,255,255,0.16)",
    } satisfies CSSProperties,
  };
}

export function AtlaNav({
  inverted = false,
  commandProjects = [],
  currentSearch = "",
  showCommandTrigger = true,
}: {
  inverted?: boolean;
  commandProjects?: AtlaCommandProject[];
  currentSearch?: string;
  /** Hide the "start here / Cmd K" pill; the palette still opens with the keyboard shortcut. */
  showCommandTrigger?: boolean;
}) {
  const isMobile = useIsMobile();
  const palette = tonePalette(isMobile);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [composerMode, setComposerMode] = useState<"brief" | "ask" | null>(null);
  const [composerText, setComposerText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentProjectSlugs, setRecentProjectSlugs] = useState<string[]>([]);
  const [recentActionIds, setRecentActionIds] = useState<string[]>([]);
  const [storedDrafts, setStoredDrafts] = useState<StoredDrafts>({ brief: "", ask: "" });
  const [isScrolled, setIsScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navHeight = isMobile ? NAV_HEIGHT_MOBILE : NAV_HEIGHT_DESKTOP;
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncScrollState = () => {
      setIsScrolled(window.scrollY > 18);
    };

    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });
    return () => window.removeEventListener("scroll", syncScrollState);
  }, []);

  const dispatchCommand = (detail: CommandEventDetail) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("atla:command", { detail }));
  };

  const rememberProject = (slug: string) => {
    setRecentProjectSlugs((previous) => {
      const next = [slug, ...previous.filter((item) => item !== slug)].slice(0, 4);
      writeStoredStringArray(RECENT_PROJECTS_STORAGE_KEY, next);
      return next;
    });
  };

  const rememberAction = (actionId: string) => {
    setRecentActionIds((previous) => {
      const next = [actionId, ...previous.filter((item) => item !== actionId)].slice(0, 6);
      writeStoredStringArray(RECENT_ACTIONS_STORAGE_KEY, next);
      return next;
    });
  };

  const copyToClipboard = async (value: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return false;

    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  };

  const openMailDraft = (subject: string, body: string) => {
    if (typeof window === "undefined") return;
    const href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  const shareCurrentPage = async (channel: "email" | "slack") => {
    const payload = shareSitePackage();

    if (channel === "email") {
      openMailDraft(payload.subject, payload.body);
      setFeedback("Email draft opened");
      rememberAction("share-email");
      return;
    }

    const copied = await copyToClipboard(payload.slack);
    setFeedback(copied ? "Slack share copied" : payload.slack);
    rememberAction("share-slack");

    if (typeof window !== "undefined") {
      window.location.href = SLACK_DEEP_LINK;
    }
  };

  const openComposer = (mode: "brief" | "ask", seed = "") => {
    setComposerMode(mode);
    setComposerText(seed || storedDrafts[mode] || "");
    setQuery("");
    setActiveIndex(0);
  };

  const closePalette = () => {
    setIsCommandOpen(false);
    setComposerMode(null);
    setFeedback("");
  };

  const openPalette = () => {
    setQuery(currentSearch.trim());
    setComposerMode(null);
    setFeedback("");
    setIsCommandOpen(true);
  };

  const runSlashCommand = (value: string): "close" | "keep-open" | false => {
    const input = value.trim();
    if (!input) return false;

    const lower = input.toLowerCase();
    if (lower.startsWith("/brief")) {
      openComposer("brief", input.replace(/^\/brief\s*/i, "").trim());
      return "keep-open";
    }

    if (lower.startsWith("/ask")) {
      openComposer("ask", input.replace(/^\/ask\s*/i, "").trim());
      return "keep-open";
    }

    if (lower.startsWith("/search ")) {
      dispatchCommand({ type: "search", value: input.replace(/^\/search\s+/i, "").trim() });
      setFeedback("Archive search updated");
      rememberAction("search-archive");
      return "close";
    }

    if (lower.startsWith("/view ")) {
      const nextView = input.replace(/^\/view\s+/i, "").trim().toLowerCase();
      const viewMap: Record<string, string> = {
        masonry: "Masonry",
        grid: "Grid",
        list: "List",
        timeline: "Timeline",
      };
      const matched = viewMap[nextView];
      if (matched) {
        dispatchCommand({ type: "set-view", value: matched });
        setFeedback(`View set to ${matched}`);
        rememberAction(`view-${nextView}`);
        return "close";
      }
    }

    if (lower.startsWith("/background ") || lower.startsWith("/bg ")) {
      const nextBackground = input.replace(/^\/(background|bg)\s+/i, "").trim().toLowerCase();
      const backgroundMap: Record<string, "White" | "Black" | "Random" | "System"> = {
        white: "White",
        black: "Black",
        random: "Random",
        system: "System",
      };
      const matched = backgroundMap[nextBackground];
      if (matched) {
        dispatchCommand({ type: "set-background", value: matched });
        setFeedback(`Background set to ${matched}`);
        rememberAction(`background-${nextBackground}`);
        return "close";
      }
    }

    if (lower.startsWith("/grid ")) {
      const nextSize = input.replace(/^\/grid\s+/i, "").trim().toLowerCase();
      const sizeMap: Record<string, "Extra Large" | "Large" | "Small" | "Extra Small"> = {
        xl: "Extra Large",
        l: "Large",
        s: "Small",
        xs: "Extra Small",
      };
      const matched = sizeMap[nextSize];
      if (matched) {
        dispatchCommand({ type: "set-grid-size", value: matched });
        setFeedback(`Grid size set to ${nextSize.toUpperCase()}`);
        rememberAction(`grid-${nextSize}`);
        return "close";
      }
    }

    if (lower === "/clear") {
      dispatchCommand({ type: "clear-filters" });
      setFeedback("Filters cleared");
      rememberAction("clear-filters");
      return "close";
    }

    if (lower === "/email" || lower === "/contact") {
      void copyToClipboard(QUICK_EMAIL).then((copied) => {
        setFeedback(copied ? "Contact email copied" : QUICK_EMAIL);
      });
      rememberAction("copy-email");
      return "close";
    }

    if (lower === "/share email" || lower === "/share mail") {
      void shareCurrentPage("email");
      return "close";
    }

    if (lower === "/share slack" || lower === "/slack") {
      void shareCurrentPage("slack");
      return "close";
    }

    dispatchCommand({ type: "search", value: input.replace(/^\/search\s*/i, "").trim() });
    setFeedback("Archive search updated");
    rememberAction("search-archive");
    return "close";
  };

  const actionQuerySeed = deferredQuery.trim();
  const baseActions = useMemo<CommandAction[]>(
    () => [
      {
        id: "search-archive",
        label: actionQuerySeed ? `Search "${actionQuerySeed}" in archive` : "Search archive",
        helper: actionQuerySeed ? "Apply the current query to the project archive" : "Search by project, client, category, service, or region",
        command: "/search",
        shortcut: "Enter",
        icon: <Search size={18} strokeWidth={2} />,
        keywords: ["search", "archive", "project", "client", "category"],
        run: () => {
          dispatchCommand({ type: "search", value: actionQuerySeed });
          setFeedback("Archive search updated");
          rememberAction("search-archive");
        },
      },
      {
        id: "write-brief",
        label: "Write a brief",
        helper: "Open a draft composer for a project brief",
        command: "/brief",
        shortcut: "Cmd+B",
        icon: <FileText size={18} strokeWidth={2} />,
        keywords: ["brief", "project", "scope", "proposal", "draft"],
        keepOpen: true,
        run: () => {
          rememberAction("write-brief");
          openComposer("brief", actionQuerySeed);
        },
      },
      {
        id: "ask-question",
        label: "Ask a question",
        helper: "Draft a message for the studio without leaving the page",
        command: "/ask",
        shortcut: "Cmd+/",
        icon: <MessageCircleQuestion size={18} strokeWidth={2} />,
        keywords: ["ask", "question", "message", "contact"],
        keepOpen: true,
        run: () => {
          rememberAction("ask-question");
          openComposer("ask", actionQuerySeed);
        },
      },
      {
        id: "share-email",
        label: "Share site via email",
        helper: "Open a ready-to-send email draft with the current page",
        command: "/share email",
        shortcut: "Cmd+E",
        icon: <Share2 size={18} strokeWidth={2} />,
        keywords: ["share", "email", "mail", "send", "site"],
        run: () => {
          void shareCurrentPage("email");
        },
      },
      {
        id: "share-slack",
        label: "Share site via Slack",
        helper: "Copy a Slack-ready message and jump to Slack",
        command: "/share slack",
        shortcut: "Cmd+L",
        icon: <Send size={18} strokeWidth={2} />,
        keywords: ["share", "slack", "team", "message", "site"],
        run: () => {
          void shareCurrentPage("slack");
        },
      },
      {
        id: "clear-filters",
        label: "Reset archive state",
        helper: "Reset background, search, and filters while keeping the current view",
        command: "/clear",
        icon: <RotateCcw size={18} strokeWidth={2} />,
        keywords: ["clear", "reset", "filters", "background", "all"],
        run: () => {
          dispatchCommand({ type: "clear-filters" });
          setFeedback("Archive state reset");
          rememberAction("clear-filters");
        },
      },
      {
        id: "view-grid",
        label: "Switch to Grid view",
        helper: "Move the archive to Grid mode",
        command: "/view grid",
        icon: <Grid3X3 size={18} strokeWidth={2} />,
        keywords: ["grid", "view", "layout"],
        run: () => {
          dispatchCommand({ type: "set-view", value: "Grid" });
          setFeedback("View set to Grid");
          rememberAction("view-grid");
        },
      },
      {
        id: "view-list",
        label: "Switch to List view",
        helper: "Move the archive to List mode",
        command: "/view list",
        icon: <List size={18} strokeWidth={2} />,
        keywords: ["list", "view", "layout"],
        run: () => {
          dispatchCommand({ type: "set-view", value: "List" });
          setFeedback("View set to List");
          rememberAction("view-list");
        },
      },
      {
        id: "background-random",
        label: "Random background",
        helper: "Generate an accessible random surface color",
        command: "/background random",
        icon: <Palette size={18} strokeWidth={2} />,
        keywords: ["background", "surface", "color", "random"],
        run: () => {
          dispatchCommand({ type: "set-background", value: "Random" });
          setFeedback("Random background applied");
          rememberAction("background-random");
        },
      },
      {
        id: "background-system",
        label: "System background",
        helper: "Follow the current system light or dark preference",
        command: "/background system",
        icon: <Palette size={18} strokeWidth={2} />,
        keywords: ["background", "surface", "color", "system", "theme"],
        run: () => {
          dispatchCommand({ type: "set-background", value: "System" });
          setFeedback("System background applied");
          rememberAction("background-system");
        },
      },
      {
        id: "copy-email",
        label: "Copy contact email",
        helper: QUICK_EMAIL,
        command: "/email",
        icon: <Mail size={18} strokeWidth={2} />,
        keywords: ["email", "contact", "hello", "studio"],
        run: () => {
          void copyToClipboard(QUICK_EMAIL).then((copied) => {
            setFeedback(copied ? "Contact email copied" : QUICK_EMAIL);
          });
          rememberAction("copy-email");
        },
      },
    ],
    [actionQuerySeed],
  );

  const filteredActions = useMemo(() => {
    if (!normalizedQuery) return baseActions;

    const actionNeedle = normalizedQuery.startsWith("/") ? normalizedQuery.slice(1) : normalizedQuery;
    return baseActions.filter((action) => {
      const text = [action.label, action.helper, action.command, ...action.keywords].join(" ").toLowerCase();
      return text.includes(actionNeedle);
    });
  }, [baseActions, normalizedQuery]);

  const projectResults = useMemo(() => {
    if (!commandProjects.length || !normalizedQuery || normalizedQuery.startsWith("/")) return [];

    return [...commandProjects]
      .map((project) => ({ project, score: scoreProjectMatch(project, normalizedQuery) }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 6)
      .map((entry) => entry.project);
  }, [commandProjects, normalizedQuery]);

  const recentProjects = useMemo(
    () =>
      recentProjectSlugs
        .map((slug) => commandProjects.find((project) => project.slug === slug))
        .filter((project): project is AtlaCommandProject => Boolean(project)),
    [commandProjects, recentProjectSlugs],
  );

  const recentActions = useMemo(
    () =>
      recentActionIds
        .map((actionId) => baseActions.find((action) => action.id === actionId))
        .filter((action): action is CommandAction => Boolean(action)),
    [baseActions, recentActionIds],
  );

  const sections = useMemo<PaletteSection[]>(() => {
    if (composerMode) return [];

    if (normalizedQuery) {
      const resultSections: PaletteSection[] = [];

      if (projectResults.length > 0) {
        resultSections.push({
          id: "project-results",
          title: "Project results",
          items: projectResults.map((project) => ({
            key: `project-${project.slug}`,
            kind: "project",
            title: project.title,
            subtitle: `${project.client} • ${project.category} • ${project.country || project.region}`,
            meta: String(project.year),
            imageSrc: project.coverImage,
            onSelect: () => {
              rememberProject(project.slug);
              dispatchCommand({ type: "focus-project", value: project.slug });
              setFeedback(`Focused ${project.title}`);
            },
          })),
        });
      }

      if (filteredActions.length > 0) {
        resultSections.push({
          id: "matching-actions",
          title: projectResults.length > 0 ? "Matching actions" : "Actions",
          items: filteredActions.map((action) => ({
            key: `action-${action.id}`,
            kind: "action",
            title: action.label,
            subtitle: action.helper,
            meta: action.shortcut,
            commandLabel: action.command,
            icon: action.icon,
            keepOpen: action.keepOpen,
            onSelect: action.run,
          })),
        });
      }

      return resultSections;
    }

    const emptySections: PaletteSection[] = [];

    if (recentProjects.length > 0 || recentActions.length > 0) {
      emptySections.push({
        id: "recent",
        title: "Recent",
        items: [
          ...recentProjects.map((project) => ({
            key: `recent-project-${project.slug}`,
            kind: "project" as const,
            title: project.title,
            subtitle: `${project.client} • ${project.category} • ${project.country || project.region}`,
            meta: String(project.year),
            imageSrc: project.coverImage,
            onSelect: () => {
              rememberProject(project.slug);
              dispatchCommand({ type: "focus-project", value: project.slug });
              setFeedback(`Focused ${project.title}`);
            },
          })),
          ...recentActions.slice(0, 3).map((action) => ({
            key: `recent-action-${action.id}`,
            kind: "action" as const,
            title: action.label,
            subtitle: action.helper,
            meta: action.shortcut,
            commandLabel: action.command,
            icon: action.icon,
            keepOpen: action.keepOpen,
            onSelect: action.run,
          })),
        ],
      });
    }

    emptySections.push({
      id: "common-actions",
      title: "Common actions",
      items: baseActions.slice(0, 8).map((action) => ({
        key: `action-${action.id}`,
        kind: "action" as const,
        title: action.label,
        subtitle: action.helper,
        meta: action.shortcut,
        commandLabel: action.command,
        icon: action.icon,
        keepOpen: action.keepOpen,
        onSelect: action.run,
      })),
    });

    return emptySections;
  }, [baseActions, composerMode, filteredActions, normalizedQuery, projectResults, recentActions, recentProjects]);

  const flatItems = useMemo(() => sections.flatMap((section) => section.items), [sections]);

  useEffect(() => {
    setActiveIndex(0);
  }, [composerMode, normalizedQuery, sections.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setRecentProjectSlugs(readStoredStringArray(RECENT_PROJECTS_STORAGE_KEY));
    setRecentActionIds(readStoredStringArray(RECENT_ACTIONS_STORAGE_KEY));
    setStoredDrafts(readStoredDrafts());
  }, []);

  useEffect(() => {
    if (!composerMode) return;
    setStoredDrafts((previous) => {
      const nextDrafts = {
        ...previous,
        [composerMode]: composerText,
      };
      writeStoredDrafts(nextDrafts);
      return nextDrafts;
    });
  }, [composerMode, composerText]);

  useEffect(() => {
    if (!feedback) return;
    const timeoutId = window.setTimeout(() => setFeedback(""), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isCommandOpen) {
          closePalette();
        } else {
          openPalette();
        }
        return;
      }

      if (event.key === "Escape" && isCommandOpen) {
        event.preventDefault();
        closePalette();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCommandOpen, currentSearch, storedDrafts]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isCommandOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCommandOpen]);

  useEffect(() => {
    if (!isCommandOpen || !inputRef.current) return;
    const timeoutId = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(timeoutId);
  }, [isCommandOpen]);

  const runPaletteItem = (item: PaletteItem) => {
    item.onSelect();
    if (!item.keepOpen) closePalette();
  };

  const submitComposerPackage = async () => {
    if (!composerMode || !composerText.trim()) return;

    const copied = await copyToClipboard(commandPackage(composerMode, composerText));
    rememberAction(composerMode === "brief" ? "write-brief" : "ask-question");
    setFeedback(copied ? `${composerMode === "brief" ? "Brief" : "Question"} package copied` : composerText.trim());
    // Only the brief counts as taking the template away; the ask composer is a
    // question, not a brief. A failed clipboard write still delivers the brief,
    // because the feedback falls back to the raw text for manual copying, so
    // the event fires either way and carries whether the write landed.
    if (composerMode === "brief") {
      trackEvent("brief_template_download", { cta_type: "copy", page: "nav-composer", clipboard: copied });
    }
  };

  const shareComposerPackage = async (channel: "email" | "slack") => {
    if (!composerMode || !composerText.trim()) return;

    const label = composerMode === "brief" ? "Brief" : "Question";
    const packageText = commandPackage(composerMode, composerText);

    if (channel === "email") {
      openMailDraft(`Atla ${label}`, packageText);
      setFeedback(`${label} email draft opened`);
      rememberAction("share-email");
      if (composerMode === "brief") {
        trackEvent("brief_template_download", { cta_type: "email", page: "nav-composer" });
      }
      return;
    }

    const copied = await copyToClipboard(packageText);
    setFeedback(copied ? `${label} copied for Slack` : packageText);
    rememberAction("share-slack");
    if (composerMode === "brief") {
      trackEvent("brief_template_download", { cta_type: "slack", page: "nav-composer", clipboard: copied });
    }

    if (typeof window !== "undefined") {
      window.location.href = SLACK_DEEP_LINK;
    }
  };

  const headerSearchLabel = currentSearch.trim() || "";

  return (
    <>
      <div aria-hidden="true" style={{ height: navHeight }} />
      <nav
        data-testid="atla-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          pointerEvents: "none",
          padding: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            pointerEvents: "auto",
            borderRadius: 0,
            border: isScrolled
              ? "1px solid color-mix(in srgb, var(--atla-text-color, #222222) 14%, transparent)"
              : "none",
            background: isScrolled
              ? "linear-gradient(130deg, color-mix(in srgb, var(--atla-surface-color, #050505) 84%, white 16%) 0%, color-mix(in srgb, var(--atla-surface-color, #050505) 88%, white 12%) 58%, color-mix(in srgb, var(--atla-surface-color, #050505) 90%, white 10%) 100%)"
              : "var(--atla-surface-color, #050505)",
            backdropFilter: isScrolled ? "saturate(145%) blur(14px)" : "none",
            WebkitBackdropFilter: isScrolled ? "saturate(145%) blur(14px)" : "none",
            boxShadow: isScrolled
              ? "0 10px 28px rgba(0,0,0,0.18), inset 0 1px 0 color-mix(in srgb, var(--atla-text-color, #222222) 18%, transparent)"
              : "0 1px 0 color-mix(in srgb, var(--atla-text-color, #222222) 10%, transparent)",
            padding: isMobile ? "14px 10px" : "14px 12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: isMobile ? 8 : 14,
            }}
          >
            <a
              href="/"
              aria-label="Atla work"
              className="atla-logo"
              style={{
                color: "var(--atla-text-color, #f5f3ef)",
                width: isMobile ? 168 : 320,
                height: isMobile ? 28 : 52,
                display: "inline-flex",
                alignItems: "center",
                minHeight: 48,
                flexShrink: 0,
              }}
            >
              <AtlaWordmark />
            </a>

            {showCommandTrigger ? (
              <button
                type="button"
                onClick={openPalette}
                className="atla-tap-target"
                style={{
                  width: isMobile ? "min(58vw, 240px)" : "clamp(320px, 38vw, 520px)",
                  minHeight: 48,
                  marginLeft: "auto",
                  flexShrink: 0,
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    ...SEARCH_INPUT_STYLE,
                    border: "1px solid color-mix(in srgb, var(--atla-text-color, #222222) 16%, transparent)",
                    background: "color-mix(in srgb, var(--atla-text-color, #222222) 10%, transparent)",
                    color: "var(--atla-text-color, #f5f3ef)",
                    boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--atla-text-color, #222222) 14%, transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    textAlign: "left",
                  }}
                  >
                  <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <Search
                      size={14}
                      strokeWidth={2}
                      style={{ color: "var(--atla-text-color, #f5f3ef)", flexShrink: 0 }}
                      aria-hidden="true"
                    />
                    <span style={{ display: "flex", flexDirection: "column", minWidth: 0, lineHeight: 1.1, gap: 2 }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: 0.7,
                          textTransform: "uppercase",
                          color: "color-mix(in srgb, var(--atla-text-color, #222222) 76%, transparent)",
                        }}
                      >
                        start here
                      </span>
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "var(--atla-text-color, #f5f3ef)",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {headerSearchLabel || " i want to."}
                      </span>
                    </span>
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid color-mix(in srgb, var(--atla-text-color, #222222) 20%, transparent)",
                      borderRadius: 999,
                      padding: "4px 8px",
                      fontSize: 12,
                      letterSpacing: 0.2,
                      color: "var(--atla-text-color, #f5f3ef)",
                      lineHeight: 1,
                      background: "color-mix(in srgb, var(--atla-text-color, #222222) 12%, transparent)",
                    }}
                  >
                    Cmd K
                  </span>
                </div>
              </button>
            ) : null}
          </div>
        </div>
      </nav>

      {isCommandOpen ? (
        <div
          onClick={closePalette}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "center",
            padding: isMobile ? "74px 10px 18px" : "40px 24px",
            background: "rgba(16,16,18,0.34)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Command center"
            onClick={(event) => event.stopPropagation()}
            style={{
              ...palette.panel,
              overflow: "hidden",
              color: "#f2f2f2",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Search
                  size={24}
                  strokeWidth={1.8}
                  style={{
                    position: "absolute",
                    left: 4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.72)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Type a command or search"
                  aria-label="Command input"
                  onKeyDown={(event) => {
                    if (composerMode) {
                      if (event.key === "Escape") {
                        event.preventDefault();
                        setComposerMode(null);
                      }
                      return;
                    }

                    if (event.key === "ArrowDown" && flatItems.length > 0) {
                      event.preventDefault();
                      setActiveIndex((previous) => (previous + 1) % flatItems.length);
                      return;
                    }

                    if (event.key === "ArrowUp" && flatItems.length > 0) {
                      event.preventDefault();
                      setActiveIndex((previous) => (previous - 1 + flatItems.length) % flatItems.length);
                      return;
                    }

                    if (event.key === "Enter") {
                      event.preventDefault();

                      if (normalizedQuery.startsWith("/")) {
                        const handled = runSlashCommand(query);
                        if (handled === "close") closePalette();
                        return;
                      }

                      if (flatItems[activeIndex]) {
                        runPaletteItem(flatItems[activeIndex]);
                      }
                    }
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    color: "#f7f7f7",
                    fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                    fontSize: isMobile ? 20 : 34,
                    fontWeight: 400,
                    lineHeight: "1.15",
                    padding: "6px 84px 8px 40px",
                    letterSpacing: -0.3,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: 4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.22)",
                    borderRadius: 10,
                    color: "rgba(255,255,255,0.72)",
                    fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "6px 10px",
                    lineHeight: 1,
                  }}
                >
                  Cmd K
                </div>
              </div>
            </div>

            <div style={{ position: "relative", flex: 1, minHeight: 0, isolation: "isolate" }}>
              <div style={{ overflowY: "auto", height: "100%", padding: "14px", display: "flex", flexDirection: "column", gap: 14 }}>
                <ProgressiveBlur
                  className="sticky top-0 z-[70] -mt-3"
                  position="top"
                  height="110px"
                  blurLevels={[4, 8, 12, 18, 24, 32, 42, 56]}
                  anchored={false}
                />
                {composerMode ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <p style={{ margin: 0, fontFamily: "'Libre Franklin', Helvetica, sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.66)" }}>
                      {composerMode === "brief" ? "Brief composer" : "Question composer"}
                    </p>
                    <p style={{ margin: 0, fontFamily: "'Libre Franklin', Helvetica, sans-serif", fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.82)", lineHeight: "1.35" }}>
                      Draft it here. The text is autosaved locally and can be copied as a ready-to-send package.
                    </p>
                  </div>

                  <textarea
                    value={composerText}
                    onChange={(event) => setComposerText(event.target.value)}
                    placeholder={
                      composerMode === "brief"
                        ? "Describe the company, current state, scope, timeline, and what has to change."
                        : "Ask anything about process, timing, scope, deliverables, or fit."
                    }
                    rows={isMobile ? 8 : 10}
                    style={{
                      width: "100%",
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: "rgba(255,255,255,0.05)",
                      color: "#f5f5f5",
                      fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                      fontSize: 15,
                      fontWeight: 500,
                      lineHeight: "1.55",
                      padding: "14px 16px",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => void submitComposerPackage()}
                      style={{
                        border: "1px solid rgba(255,255,255,0.18)",
                        background: "rgba(255,255,255,0.12)",
                        color: "#f7f7f7",
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Copy package
                    </button>
                    <button
                      type="button"
                      onClick={() => void shareComposerPackage("email")}
                      style={{
                        border: "1px solid rgba(255,255,255,0.18)",
                        background: "rgba(255,255,255,0.09)",
                        color: "#f7f7f7",
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Share via email
                    </button>
                    <button
                      type="button"
                      onClick={() => void shareComposerPackage("slack")}
                      style={{
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "transparent",
                        color: "rgba(255,255,255,0.88)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Share to Slack
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void copyToClipboard(QUICK_EMAIL).then((copied) => {
                          setFeedback(copied ? "Contact email copied" : QUICK_EMAIL);
                        });
                        rememberAction("copy-email");
                      }}
                      style={{
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "transparent",
                        color: "rgba(255,255,255,0.88)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Copy email
                    </button>
                    <button
                      type="button"
                      onClick={() => setComposerMode(null)}
                      style={{
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "transparent",
                        color: "rgba(255,255,255,0.72)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Back to commands
                    </button>
                  </div>
                </div>
                ) : sections.length === 0 ? (
                <div style={{ ...palette.row, padding: "18px 16px" }}>
                  <p style={{ margin: 0, fontFamily: "'Libre Franklin', Helvetica, sans-serif", fontSize: 20, fontWeight: 700, color: "#f4f4f4" }}>
                    No results
                  </p>
                  <p style={{ margin: "6px 0 0", fontFamily: "'Libre Franklin', Helvetica, sans-serif", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.74)" }}>
                    Press Enter to search the archive with the current text.
                  </p>
                </div>
                ) : (
                sections.map((section) => (
                  <div key={section.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <p style={{ margin: 0, fontFamily: "'Libre Franklin', Helvetica, sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.70)" }}>
                      {section.title}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {section.items.map((item) => {
                        const itemIndex = flatItems.findIndex((candidate) => candidate.key === item.key);
                        const isActive = itemIndex === activeIndex;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onMouseEnter={() => setActiveIndex(itemIndex)}
                            onClick={() => runPaletteItem(item)}
                            style={{
                              ...palette.row,
                              ...(isActive ? palette.rowActive : null),
                              textAlign: "left",
                              padding: item.kind === "project" ? "10px 12px" : "11px 12px",
                              cursor: "pointer",
                              display: "grid",
                              gridTemplateColumns: item.kind === "project" ? "56px 1fr auto" : "40px 1fr auto",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            {item.kind === "project" ? (
                              <div
                                style={{
                                  position: "relative",
                                  width: 56,
                                  height: 56,
                                  borderRadius: 10,
                                  overflow: "hidden",
                                  backgroundColor: "rgba(255,255,255,0.08)",
                                }}
                              >
                                {item.imageSrc ? (
                                  <img
                                    src={item.imageSrc}
                                    alt={item.title}
                                    loading="lazy"
                                    decoding="async"
                                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                  />
                                ) : null}
                              </div>
                            ) : (
                              <span
                                aria-hidden="true"
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 10,
                                  border: "1px solid rgba(255,255,255,0.18)",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "rgba(255,255,255,0.88)",
                                }}
                              >
                                {item.icon}
                              </span>
                            )}

                            <span style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                              <span style={{ fontFamily: "'Libre Franklin', Helvetica, sans-serif", fontSize: item.kind === "project" ? 17 : 16, fontWeight: 600, color: "#f7f7f7", lineHeight: "1.2", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {item.title}
                              </span>
                              <span style={{ fontFamily: "'Libre Franklin', Helvetica, sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.72)", lineHeight: "1.25", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {item.subtitle}
                              </span>
                            </span>

                            <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                              {item.meta ? (
                                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.74)" }}>
                                  {item.meta}
                                </span>
                              ) : null}
                              {item.commandLabel ? (
                                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.56)" }}>
                                  {item.commandLabel}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
                )}
                <ProgressiveBlur
                  className="sticky bottom-0 z-[70] -mb-3 mt-[-110px]"
                  position="bottom"
                  height="110px"
                  blurLevels={[4, 8, 12, 18, 24, 32, 42, 56]}
                  anchored={false}
                />
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.12)",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <p style={{ margin: 0, fontFamily: "'Libre Franklin', Helvetica, sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.68)" }}>
                Esc close · Up/Down navigate · Enter run
              </p>
              {feedback ? (
                <p style={{ margin: 0, fontFamily: "'Libre Franklin', Helvetica, sans-serif", fontSize: 12, fontWeight: 600, color: "#f4f4f4" }}>
                  {feedback}
                </p>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
