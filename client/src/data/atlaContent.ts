export type PortfolioProjectSeed = {
  slug: string;
  title: string;
  client: string;
  year: number;
  category: string;
  region: string;
  industry: string;
  service: string;
  description: string;
  coverImage: string;
};

export type ProjectShowcase = {
  slug: string;
  title: string;
  client: string;
  services: string[];
  location: string;
  dateLabel: string;
  intro: string;
  brandTitle: string;
  brandBody: string[];
  heroImage: string;
  storyImage?: string;
  gallery: string[];
  credits: Array<{ role: string; names: string[] }>;
  related: Array<{ title: string; date: string }>;
};

import type { JournalArticle } from "@shared/journal";

export const portfolioFallbackProjects: PortfolioProjectSeed[] = [
  {
    slug: "reggie",
    title: "Reggie",
    client: "Meridian Architecture",
    year: 2025,
    category: "Brand Identity",
    region: "America",
    industry: "Consumer Goods",
    service: "Branding",
    description: "A reimagined identity for a boutique creative agency specializing in photography and editorial campaigns.",
    coverImage: "https://www.figma.com/api/mcp/asset/8ab2b981-c253-48a1-a51d-a42dfdcc0043",
  },
  {
    slug: "digital-poetics",
    title: "Digital Poetics",
    client: "Sonori",
    year: 2025,
    category: "Digital Experience",
    region: "America",
    industry: "Digital",
    service: "Website",
    description: "A cinematic digital system where editorial motion and tactile interactions become the brand language.",
    coverImage: "https://www.figma.com/api/mcp/asset/c4064624-f944-4dc7-ba93-2fdcc3f82393",
  },
  {
    slug: "aureon",
    title: "Aureon",
    client: "Aureon",
    year: 2025,
    category: "Brand Identity",
    region: "Europe",
    industry: "Hospitality",
    service: "Branding",
    description: "A hospitality identity system built around material contrast, light, and sculptural typography.",
    coverImage: "https://www.figma.com/api/mcp/asset/132e5a3c-6b20-436e-aa56-ef5dd07a3602",
  },
  {
    slug: "lume-agency",
    title: "Lume Agency",
    client: "Lume Agency",
    year: 2025,
    category: "Art Direction",
    region: "America",
    industry: "Digital",
    service: "Art Direction",
    description: "Editorial systems and campaign imagery shaped into a flexible identity for a creative agency.",
    coverImage: "https://www.figma.com/api/mcp/asset/9650bd78-2dde-4c08-aba1-336936e6e92d",
  },
  {
    slug: "avenir-motors",
    title: "Avenir Motors",
    client: "Avenir Motors",
    year: 2025,
    category: "Visual Identity",
    region: "Middle East",
    industry: "Consumer Goods",
    service: "Art Direction",
    description: "A performance-first visual language for a future-facing automotive concept.",
    coverImage: "https://www.figma.com/api/mcp/asset/e51e05f9-d12b-482e-96a9-7174b81ebaf2",
  },
  {
    slug: "nova-frame",
    title: "Nova Frame",
    client: "Nova Frame",
    year: 2025,
    category: "Product Identity",
    region: "Asia",
    industry: "SAAS",
    service: "Website",
    description: "A crisp launch identity and digital system for a product company working at the edge of industrial design.",
    coverImage: "https://www.figma.com/api/mcp/asset/ace928fa-6dbd-47f4-a560-3cec8d865d4d",
  },
  {
    slug: "obsidian",
    title: "Obsidian",
    client: "Obsidian",
    year: 2025,
    category: "Brand Identity",
    region: "America",
    industry: "Digital",
    service: "Packaging",
    description: "Brand architecture and tactile product storytelling for a high-contrast consumer launch.",
    coverImage: "https://www.figma.com/api/mcp/asset/506e7181-6c3b-46a8-ada5-dcf44d838cba",
  },
  {
    slug: "terran-collective",
    title: "Terran Collective",
    client: "Terran Collective",
    year: 2024,
    category: "Visual Identity",
    region: "Europe",
    industry: "Hospitality",
    service: "Branding",
    description: "An earthy, atmospheric identity built for a collective working between architecture and landscape.",
    coverImage: "https://www.figma.com/api/mcp/asset/b92fbbed-b2aa-4187-bc3c-acbc7651407d",
  },
  {
    slug: "halo-visual",
    title: "Halo Visual",
    client: "Halo Visual",
    year: 2024,
    category: "Motion Design",
    region: "America",
    industry: "Digital",
    service: "Art Direction",
    description: "A motion-led visual system with a cinematic rhythm and image-first storytelling.",
    coverImage: "https://www.figma.com/api/mcp/asset/edd44ca3-20b3-4dbf-8e6f-4fd1e2b0eb44",
  },
  {
    slug: "flux-division",
    title: "Flux Division",
    client: "Flux Division",
    year: 2024,
    category: "Digital Experience",
    region: "America",
    industry: "Digital",
    service: "Website",
    description: "A digital identity built from motion, depth, and precise image sequencing.",
    coverImage: "https://www.figma.com/api/mcp/asset/9dd4e558-aaba-42cc-afd6-e49140a81477",
  },
  {
    slug: "neutra-lab",
    title: "Neutra Lab",
    client: "Neutra Lab",
    year: 2024,
    category: "Visual Identity",
    region: "Asia",
    industry: "SAAS",
    service: "Website",
    description: "A product and motion system shaped around hardware tactility and minimal interfaces.",
    coverImage: "https://www.figma.com/api/mcp/asset/438948ec-f3a3-489f-b438-4d602d883e94",
  },
  {
    slug: "solari-house",
    title: "Solari House",
    client: "Solari House",
    year: 2024,
    category: "Brand Identity",
    region: "Europe",
    industry: "Hospitality",
    service: "Branding",
    description: "A warm, elevated identity for an interiors brand rooted in material depth and restraint.",
    coverImage: "https://www.figma.com/api/mcp/asset/794a2004-a5b7-4bb5-8b88-c7c2d95003b1",
  },
];

export const projectShowcases: Record<string, ProjectShowcase> = {
  reggie: {
    slug: "reggie",
    title: "Reggie",
    client: "Meridian Architecture",
    services: ["UX/UI Design", "3D Experience"],
    location: "USA",
    dateLabel: "Oct 2025",
    intro: "A reimagined identity for a boutique creative agency specializing in photography and editorial campaigns.",
    brandTitle: "The brand",
    brandBody: [
      "Reggie is a brand of science-backed treats and wellness products for dogs, created with a clear focus on health, care, and trust. Its products are designed to support dogs’ wellbeing through natural ingredients and research-led formulations.",
      "The identity needed to feel contemporary but warm, balancing clarity with emotional connection. Across packaging, language, and digital touchpoints, the system emphasizes confidence, friendliness, and everyday ritual.",
    ],
    heroImage: "https://www.figma.com/api/mcp/asset/8ab2b981-c253-48a1-a51d-a42dfdcc0043",
    storyImage: "https://www.figma.com/api/mcp/asset/1314effc-ccda-4b5f-821b-7e735d520b0b",
    gallery: [
      "https://www.figma.com/api/mcp/asset/bb93b353-41a0-4557-bc12-8e61a3bb916f",
      "https://www.figma.com/api/mcp/asset/49a43170-4ba3-414d-a1c5-37162e343eaf",
      "https://www.figma.com/api/mcp/asset/7c3e1a84-6cd6-4609-bdf6-607ddf53acf0",
      "https://www.figma.com/api/mcp/asset/1878f4ca-d77f-4352-abb6-67487782eab7",
      "https://www.figma.com/api/mcp/asset/ea8f2ac7-75ad-4057-9d7e-759430e1a4db",
      "https://www.figma.com/api/mcp/asset/ccccd296-6fc7-442f-87bf-ac272568507e",
      "https://www.figma.com/api/mcp/asset/c9146d15-a0e9-4771-8902-e40f0c3a6607",
      "https://www.figma.com/api/mcp/asset/100833b3-161e-4f17-ae3c-f542e323e969",
      "https://www.figma.com/api/mcp/asset/2e246289-06a1-4d36-a409-7e0365d17f8b",
      "https://www.figma.com/api/mcp/asset/2b542233-eb8d-4a1b-9d75-c02e891f0f48",
      "https://www.figma.com/api/mcp/asset/23b55532-aac4-4a28-bb03-f9fcd0d1605c",
    ],
    credits: [
      { role: "Creative Direction", names: ["Daniela Barrio de Mendoza", "Jose Pablo Dominguez"] },
      { role: "Design", names: ["Jose Aceves C.", "Adriana Mendez"] },
      { role: "Strategy Director", names: ["Ricardo Camargo"] },
      { role: "Copy Editor", names: ["Levi Ramirez Rodriguez"] },
      { role: "Illustrations", names: ["Astronaut Monastery"] },
    ],
    related: [
      { title: "Aureon", date: "Jun 2025" },
      { title: "Lume Agency", date: "Apr 2025" },
      { title: "Avenir Motors", date: "Mar 2025" },
      { title: "Nova Frame", date: "Feb 2025" },
      { title: "Obsidian", date: "Jan 2025" },
      { title: "Terran Collective", date: "Dec 2024" },
      { title: "Halo Visual", date: "Nov 2024" },
    ],
  },
};

export const journalArticles: JournalArticle[] = [
  {
    slug: "digital-poetics-when-code-becomes-canvas",
    title: "Digital Poetics — When Code Becomes Canvas",
    category: "Digital Art",
    date: "Oct 2025",
    excerpt: "We’ll be in Budapest speaking alongside some of the design world’s brightest minds.",
    heroImage: "https://www.figma.com/api/mcp/asset/559d98a7-41e1-44b1-b655-59f4951ca274",
    coverImage: "https://www.figma.com/api/mcp/asset/385e138a-53d4-4819-b2fa-9b78f6302f8b",
    introParagraphs: [
      "In the new frontier of creative technology, design and code have merged into a single expressive medium. What was once purely functional is now a field for artistic emotion.",
      "Studios like Sonori are at the edge of this transformation, where the digital becomes tactile, and interaction becomes feeling.",
    ],
    bodySections: [
      {
        paragraphs: [
          "This evolution goes beyond aesthetic appeal. Digital art is no longer about visuals on a screen. It is about creating presence, rhythm, and response.",
          "Each scroll or motion element reflects the pulse of an idea, transforming websites into evolving artworks.",
        ],
        image: "https://www.figma.com/api/mcp/asset/172162c9-4a80-4719-953d-07efc7113196",
      },
      {
        paragraphs: [
          "Technology once stood behind design, invisible and mechanical. Today, it is the material itself. The new generation of designers treats algorithms like clay, sensors like brushes, and data as pigment.",
          "The result is an aesthetic born not from surfaces but from behavior.",
        ],
        wideImage: "https://www.figma.com/api/mcp/asset/96e4a370-ba69-4710-b57c-dd6b20db1851",
      },
      {
        paragraphs: [
          "Sonori explores this language through subtle interaction: animations that respond to gaze, sound that reacts to scroll, and microdelays that mirror human rhythm.",
          "Each digital space becomes a stage for perception, invisible yet emotionally charged.",
        ],
        image: "https://www.figma.com/api/mcp/asset/4e458e95-09df-4318-8dcd-2493a6c10da6",
      },
      {
        paragraphs: [],
        wideImage: "https://www.figma.com/api/mcp/asset/65e0f690-762d-4b33-ac13-d1f21eaf3fb3",
      },
      {
        paragraphs: [],
        image: "https://www.figma.com/api/mcp/asset/e5d1bf44-ab59-4f9e-8cfe-5f5a66a4d8ed",
      },
    ],
  },
  {
    slug: "the-aesthetics-of-technology-designing-the-invisible",
    title: "The Aesthetics of Technology — Designing the Invisible",
    category: "Design & Tech",
    date: "Sep 2025",
    excerpt: "We’ll be in Budapest speaking alongside some of the design world’s brightest minds.",
    heroImage: "https://www.figma.com/api/mcp/asset/559d98a7-41e1-44b1-b655-59f4951ca274",
    coverImage: "https://www.figma.com/api/mcp/asset/8cf59a32-93ed-42a7-804d-dc893b62e8a6",
    introParagraphs: [],
    bodySections: [],
  },
  {
    slug: "human-machines-art-at-the-edge-of-intelligence",
    title: "Human Machines — Art at the Edge of Intelligence",
    category: "Feature Article",
    date: "Aug 2025",
    excerpt: "We’ll be in Budapest speaking alongside some of the design world’s brightest minds.",
    heroImage: "https://www.figma.com/api/mcp/asset/559d98a7-41e1-44b1-b655-59f4951ca274",
    coverImage: "https://www.figma.com/api/mcp/asset/9fa9094c-d771-4bd7-991a-e0f9813e3084",
    introParagraphs: [],
    bodySections: [],
  },
  {
    slug: "generative-design-when-creativity-becomes-autonomous",
    title: "Generative Design — When Creativity Becomes Autonomous",
    category: "Digital Art",
    date: "Jun 2025",
    excerpt: "We’ll be in Budapest speaking alongside some of the design world’s brightest minds.",
    heroImage: "https://www.figma.com/api/mcp/asset/559d98a7-41e1-44b1-b655-59f4951ca274",
    coverImage: "https://www.figma.com/api/mcp/asset/421cc9d1-9f0d-416b-92f5-293a2bb92001",
    introParagraphs: [],
    bodySections: [],
  },
  {
    slug: "beyond-the-screen-the-future-of-digital-presence",
    title: "Beyond the Screen — The Future of Digital Presence",
    category: "Digital Art",
    date: "May 2025",
    excerpt: "We’ll be in Budapest speaking alongside some of the design world’s brightest minds.",
    heroImage: "https://www.figma.com/api/mcp/asset/559d98a7-41e1-44b1-b655-59f4951ca274",
    coverImage: "https://www.figma.com/api/mcp/asset/57e0204e-540c-4a93-b728-b32dc2b2272f",
    introParagraphs: [],
    bodySections: [],
  },
  {
    slug: "architecture-in-motion-the-new-language-of-digital-space",
    title: "Architecture in Motion — The New Language of Digital Space",
    category: "Digital Art",
    date: "May 2025",
    excerpt: "We’ll be in Budapest speaking alongside some of the design world’s brightest minds.",
    heroImage: "https://www.figma.com/api/mcp/asset/559d98a7-41e1-44b1-b655-59f4951ca274",
    coverImage: "https://www.figma.com/api/mcp/asset/1a009823-fc03-4df4-a9ff-58473607b240",
    introParagraphs: [],
    bodySections: [],
  },
];
