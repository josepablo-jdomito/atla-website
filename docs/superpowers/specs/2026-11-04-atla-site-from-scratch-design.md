# atla.design from scratch: design

Date: 2026-11-04 · Status: draft for JP's approval · Source: interview with JP, 2026-11-04

## Intent

Rebuild atla.design from scratch as the site of **an agency ready for the new world of AI**. Visitors should come away feeling four things: we are fast, human taste and creative direction are what we sell, the brands we make work in ChatGPT, AI search and agents, and the site itself uses AI.

Reference: **cosmos.so**. JP called its homepage "perfect". What we take from it is the clean overall look, a single central search bar, little interface, sober type and short idea blocks. We do **not** take the floating cloud of images.

**Success at 90 days is perception:** people share the site and talk about it. What earns that is **impeccable craft** (detail, type, transitions), not gimmicks.

## Goals

- Show the work at once and never bury it.
- Make the brief the main action: one question per screen, guided by AI.
- Have one bar on the home that both searches the work and starts the brief.
- Make the site AI-ready: agents and ChatGPT can read Atla and recommend it.
- Rebuild the whole site in the new style, launched **all at once** when it's polished.

## Non-goals

- Public prices. JP first chose "from" ranges, then **"no prices"**. No price appears anywhere.
- WeLoveDaily on the site. It is not mentioned.
- A floating image cloud in the hero.
- The Journal in the main nav. It stays, but lives in the footer.
- Concrete speed claims. No numbers or deadlines are promised.
- A new typeface. We keep the current Atla fonts.

## Anti-goals (a failure even if it works)

- Looking like generic SaaS or an AI startup.
- AI that reads as a gimmick: a corner chatbot, a robotic voice.
- Burying the portfolio behind text.
- Feeling slow or heavy, especially on a phone.
- Looking like a templated Webflow or Framer agency with too much scroll animation.

## Audience

All client types weighted equally: funded founders, large brands, hospitality and lifestyle. The site favors no one; the bar and the brief adapt to whatever the visitor writes.

## Visual system

- **Look:** clean like Cosmos, with a light background, little interface and lots of air.
- **Identity:** Atla's, made more neutral, with yellow (#f6c428) **only as an accent**. The big yellow footer goes away.
- **Type:** Libre Franklin + Roboto Mono, the current fonts, applied more cleanly.
- **Dark mode:** follows the system automatically, with no switch.
- **Motion:** subtle and fine. All four of these are in:
  1. Project hover: a slight zoom, or the name appears.
  2. Short video loops on cards, where they exist.
  3. A soft transition between pages, e.g. home → project.
  4. A smooth swap of the rotating phrase in the hero.
  Every animation respects `prefers-reduced-motion`.
- **Mobile:** the same experience as desktop, re-laid out.

## Site structure

### Header (every page)
Minimal, Cosmos style: **Work · Services · About** on the left, the logo in the center, the **"Start a brief"** button on the right.

### Home
1. **Hero:**
   - A rotating phrase by industry: hospitality, consumer/CPG, tech/startups, real estate/lifestyle. JP has no preference on its structure; the builder proposes copy and JP approves it.
   - Below it, **a single bar**. The bar lives only in the hero; it neither floats nor shrinks.
2. **Cosmos-style blocks:** short cards with one idea each:
   - How we use AI: speed plus human direction, no numbers.
   - Brands for agents: part of every project, not a separate service.
   - Services, by moment.
3. **Featured projects**, chosen and ordered by JP in Sanity. This needs a "featured" field and an order.
4. **Logo row** of clients.
5. **Full archive** in masonry with the **Explore** pill (region, industry, service, year), as in PR #31.
6. Footer.

*Builder's call:* the order of sections 2–5 may move, as long as the work appears in the first scroll on desktop.

### The bar (search + brief)
- The visitor types anything. The AI decides whether it is a **search** or a **project**.
- **Search:**
  - Matching projects appear **right there under the bar**, without changing page.
  - With no exact match ("a brand for a hospital"), it shows the **closest** ones and offers the brief.
- **Project:** it starts the brief and carries over what was already written.
- **Voice: almost invisible.** It doesn't chat; it answers with work and closed questions. There is no chat bubble or typing robot.

### Brief (main conversion)
- **Step by step:** one question per screen, with options to tap. The AI picks the next question based on the previous answers.
- **Required questions:**
  - What you're building: company, industry, stage.
  - What you need: the moment (launch, raise, grow, reposition) plus deliverables.
  - **No budget question.**
- **Contact data at the end:** name, email, company, website and phone/WhatsApp.
- **When it ends:**
  1. It creates the lead in **Attio** with the summary.
  2. JP gets an email with the brief summary.
  3. It **offers a Calendly booking to everyone**, with no filter.
- Every visible "Start a brief" opens this flow.

### Project page (`/projects/:slug`, URLs kept for SEO)
- **Pure gallery:** large images one after another, with text limited to client, year and services.
- At the end, in this order:
  1. The prompt "Building something like this?" leading to the brief.
  2. The next project.

### Services
- Organized **by client moment**: Launch · Raise capital · Grow/scale · Reposition.
- Each moment lists what we do. There are **no prices**, and every moment links to the brief.

### About
- **How we work:** the AI process plus human judgment.
- **JP and the team** with names, roles and cities, **no photos**. Cities: Austin, Mexico City, Barcelona, Lima, Caracas.

### Contact
A simple page with email, cities, socials and a button to the brief.

### Footer
Clean and light, Cosmos style. It holds the links to Journal, Programs, Privacy and Terms, plus email and cities.

### Pages that survive
| Route | Treatment |
|---|---|
| `/projects/:slug` | Same URLs, new pure-gallery design |
| `/programs` | Redesigned: same content, new style |
| `/hospitality` | Redesigned: same content, new style |
| `/journal`, `/journal/:slug` | Redesigned, linked only from the footer |
| `/audit/<slug>` (branding analysis) | **Stays as is**; only the header/footer is inherited if it uses them |
| `/privacy`, `/terms` | New style |

## AI-ready site (in scope)
- `llms.txt` describing Atla, its services by moment, and its projects.
- Structured data (schema.org) for Organization, Service and each project (CreativeWork).
- Text that is server-rendered and readable without JS. The current prerender is kept.

## Copy
Claude drafts in Atla's voice (premium, direct, founder-to-founder, none of the banned clichés) and **JP approves every text** before launch. Nothing is invented: projects and descriptions come from Sanity.

## How it gets built (Claude's call, not agreed by JP)
- **Repo and stack:** same repo and stack (React + Vite, Express, Sanity, Vercel, prerender).
- **AI:** **Claude** (Anthropic API, latest model) runs the bar and the brief from a server endpoint, so the key is never exposed.
- **Integrations:** Attio, email and Calendly through the integrations that already exist in `server/`.
- **Branch:** work happens on its own branch. **The current site stays live** and switches over in one go at launch.
- **PR #31** (home with Explore) is not merged. Its masonry and Explore get reused inside the new home.

## What's left to the builder
- The exact copy of the rotating phrase and the blocks, as proposals JP approves.
- Exact spacing, sizes and timings of the motion.
- How to rank "closest" projects in the search: embeddings vs. tags.
- Internal layout of each block and of the logo row.

## JP's decisions after the builder review (2026-11-04)
- **start.atla.design** (waitlist, quiz, early-stage Branding Analysis) **stays as a separate route**. The `vercel.json` rewrites (`/waitlist`, `/api/quiz`, `/api/collect`, `/images/logos`) and their CSP entries are kept. The new brief covers everything else. Marcador keeps counting.
- **The six SEO landings are redesigned**: `/hospitality-branding`, `/cpg-branding`, `/wellness-branding`, `/saas-branding`, `/brand-strategy`, `/how-we-work`. Same content and URLs, new style. They enter the prerender and the sitemap.
- **Team and logos:** Claude pulls them from Sanity, the current site and Attio, and shows JP the list to approve **before** it is published. Nothing is invented.

## Claude's calls (JP can review them)
- **Bar and brief language:** the UI is in English. Free text is answered in the language the visitor writes in. The summary in Attio and the email to JP are always in English.
- **AI cost:**
  - Simple searches resolve first by tags and keywords without calling the AI; Claude is called only when the intent is unclear, and in the brief.
  - Rate limit per IP in a shared store, not in memory per instance.
  - Monthly spend ceiling with an alert.
  - The Privacy page gets a paragraph saying that what is typed is processed with Anthropic. That text is drafted and **JP approves it**.
- **Attio:** the same as the current form. Find or create the Person and attach the brief as a note, with source "atla.design brief". No Deal is created; the pipeline belongs to the CRO.
- **Email to JP:** sent with Resend from an atla.design sender to josepablo@atla.design. Setup (domain verification, env var) is part of the build.
- **Calendly:** the link to the current discovery event type, pre-filled with name and email. It is not an embed.
- **Brief failure:** if the AI or Attio fails, the visitor sees a simple fixed form and JP still gets the email. The lead is never lost.
- **Measurement:**
  - The current GA4 and Clarity events keep their names.
  - New events: `brief_start`, `brief_complete`, `calendly_click`, `bar_search`.
  - Conversion = a completed brief.
- **Featured projects:** the `featured` field already exists in Sanity. A manual order field is added.
- **/audit:** it is generated by `script/build_audits.py`; the builder checks what it inherits and leaves it as it is.
