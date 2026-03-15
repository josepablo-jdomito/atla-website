/**
 * Atla Service Pages — Sanity Migration Script
 *
 * Creates: 13 programmatic service pages as drafts
 * Requires: SANITY_TOKEN env variable with Editor-level permissions
 * Run: SANITY_TOKEN=sk-... node script/migrateServicePages.mjs
 *
 * NOTE: The Sanity schema must include a `servicePage` document type before running.
 */

import { createClient } from "@sanity/client";
import crypto from "crypto";

const client = createClient({
  projectId: "dvufm78f",
  dataset: "production",
  apiVersion: "2026-03-12",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

function genKey() {
  return crypto.randomBytes(6).toString("hex");
}

function textBlock(text, style = "normal") {
  const { spans, markDefs } = parseInlineMarks(text);
  return {
    _type: "block",
    _key: genKey(),
    style,
    markDefs,
    children: spans,
  };
}

function parseInlineMarks(text) {
  const spans = [];
  const markDefs = [];
  let current = "";
  let index = 0;

  function pushSpan(spanText, marks = []) {
    if (spanText) {
      spans.push({ _type: "span", _key: genKey(), text: spanText, marks });
    }
  }

  while (index < text.length) {
    if (text.slice(index, index + 2) === "**") {
      pushSpan(current);
      current = "";
      const end = text.indexOf("**", index + 2);
      if (end !== -1) {
        pushSpan(text.slice(index + 2, end), ["strong"]);
        index = end + 2;
        continue;
      }
    }

    if (text[index] === "*" && text[index + 1] !== "*") {
      pushSpan(current);
      current = "";
      const end = text.indexOf("*", index + 1);
      if (end !== -1) {
        pushSpan(text.slice(index + 1, end), ["em"]);
        index = end + 1;
        continue;
      }
    }

    if (text[index] === "[") {
      const closeBracket = text.indexOf("]", index);
      if (closeBracket !== -1 && text[closeBracket + 1] === "(") {
        const closeParen = text.indexOf(")", closeBracket + 2);
        if (closeParen !== -1) {
          pushSpan(current);
          current = "";
          const linkText = text.slice(index + 1, closeBracket);
          const href = text.slice(closeBracket + 2, closeParen);
          const linkKey = genKey();
          markDefs.push({
            _type: "link",
            _key: linkKey,
            href,
            blank: href.startsWith("http"),
          });
          pushSpan(linkText, [linkKey]);
          index = closeParen + 1;
          continue;
        }
      }
    }

    current += text[index];
    index += 1;
  }

  pushSpan(current);
  return { spans, markDefs };
}

function paragraphsToBlocks(text, style = "normal") {
  return text
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => textBlock(paragraph, style));
}

const SERVICE_PAGES = [
  {
    _id: "service-boutique-hotels",
    title: "Branding Agency for Boutique Hotels",
    slug: "branding-agency-for-boutique-hotels",
    vertical: "Hospitality",
    seoTitle: "Branding Agency for Boutique Hotels — Atla",
    seoDescription: "Brand strategy, identity, and digital design for boutique hotels that compete on experience, not room count. Based in Austin, working globally.",
    primaryKeyword: "branding agency for boutique hotels",
    intro: `A boutique hotel sells a feeling before it sells a room. The brand has to land in the first three seconds of someone scrolling — on a booking platform, on Instagram, on your own site. But most boutique hotel brands are built backward: someone picks a color palette, designs a logo, and hopes it communicates something. That's decoration. Not branding.`,
    sections: [
      {
        heading: "Why boutique hotel branding is different",
        body: `Hotels are physical-first brands. The logo on a key card, the signage in a lobby, the menu typography, the scent of the hallway — these aren't afterthoughts, they're the product. A brand that works on screen but falls apart in a physical space is half-finished.

Boutique hotels also compete in a category where taste is the differentiator. You're not selling price or square footage. You're selling a point of view — about hospitality, about a neighborhood, about how a guest should feel when they check in. Strategy has to define that point of view before design touches anything.

And then there's the multi-touchpoint problem. A boutique hotel brand shows up on OTAs, Google Maps, printed collateral, staff uniforms, room amenities, social content, and your website. Every one of those surfaces needs to feel like the same place. Most don't.`,
      },
      {
        heading: "What we build",
        body: `We start with positioning: what kind of guest you're for, what experience you're promising, and how that's different from the property across the street. Then we build the identity system — logo, typography, color, photography direction, material palette — designed to work at every scale from a favicon to a building facade.

For boutique hotels, our engagements typically include brand strategy, visual identity, signage and environmental direction, website design, and a brand guidelines document detailed enough for your operations team, interior designers, and marketing agency to all stay in the same lane.`,
      },
      {
        heading: "Where most boutique hotel brands break",
        body: `The brand was designed by the interior designer. It looks beautiful inside the space and completely generic everywhere else — on a booking site, in an email confirmation, on a Google listing. The digital presence doesn't match the physical experience.

Or the brand was designed for opening night and never updated. The hotel evolves, adds a restaurant concept, expands to a second property — and the original identity can't stretch to hold it.

The worst version: a founder with strong taste skips strategy entirely and goes straight to aesthetics. The result looks expensive but communicates nothing specific. You can't tell from the brand whether it's a beach resort or a downtown loft.`,
      },
    ],
    relatedSlugs: ["how-much-does-branding-cost", "hospitality-branding-guide", "how-to-brief-a-branding-agency"],
    ctaText: "Have a hotel project in the works?",
    ctaLink: "/about#contact",
  },
  {
    _id: "service-restaurants",
    title: "Branding Agency for Restaurants",
    slug: "branding-agency-for-restaurants",
    vertical: "Hospitality",
    seoTitle: "Branding Agency for Restaurants — Atla",
    seoDescription: "Brand strategy and identity for restaurants that want to be known for more than the food. From positioning to menus to digital presence.",
    primaryKeyword: "branding agency for restaurants",
    intro: `The restaurant industry has a branding problem: everyone invests in the food and the space, and the brand gets whatever's left. A name, a logo, a menu layout, maybe some social content. But the restaurants people remember — the ones they travel for, recommend unprompted, and post about without being asked — have a brand that's as intentional as the kitchen.`,
    sections: [
      {
        heading: "Why restaurant branding is different",
        body: `A restaurant brand lives in physical space more than almost any other category. The logo on the awning, the typography on the menu, the coasters, the matchbooks, the takeout bags, the neon sign in the window. Every detail is a brand moment, and diners notice when it doesn't hold together.

Speed matters too. Restaurants operate on tighter timelines than most businesses. A rebrand for a tech company might take six months; a restaurant opening needs the full identity ready for day one, from signage specs to menu templates to social assets.

And the competition is proximity-based. You're not competing with every restaurant in the world — you're competing with what's on the same block. Positioning isn't abstract here. It's "why would someone walk past three other places to sit at yours?"`,
      },
      {
        heading: "What we build",
        body: `Brand strategy comes first: who you're for, what the dining experience promises, and how that translates into visual and verbal language. Then identity — logo, type system, color, illustration or photography direction, and a full set of applications from menus to merch to environmental graphics.

For restaurants, we also think about the digital stack: website (reservation flow, not just a brochure), social templates, delivery platform assets, and Google Business profile optimization. The brand has to look right everywhere someone encounters it — not just inside the dining room.`,
      },
      {
        heading: "Where most restaurant brands break",
        body: `The owner designs it by committee. Everyone has an opinion about the logo, nobody has a strategy, and the result is a compromise that doesn't say anything.

Or the brand was built for the soft launch and never scaled. The restaurant grows — adds catering, opens a second location, launches a product line — and the identity that worked for one cozy spot can't hold the weight.

The other common failure: the brand looks like the cuisine instead of the restaurant. Every Mexican restaurant doesn't need a Day of the Dead skull. Every Japanese restaurant doesn't need brush-stroke typography. The category shouldn't dictate the identity. The point of view should.`,
      },
    ],
    relatedSlugs: ["hospitality-branding-guide", "what-does-a-branding-agency-do", "brand-strategy-vs-brand-identity"],
    ctaText: "Opening soon, or ready to rethink the brand?",
    ctaLink: "/about#contact",
  },
  {
    _id: "service-coffee-shops",
    title: "Branding Agency for Coffee Shops",
    slug: "branding-agency-for-coffee-shops",
    vertical: "Hospitality",
    seoTitle: "Branding Agency for Coffee Shops — Atla",
    seoDescription: "Brand identity and strategy for coffee shops that want to be more than another third-wave cafe. Positioning, design, and packaging.",
    primaryKeyword: "branding agency for coffee shops",
    intro: `Coffee is one of the most crowded brand categories on earth. Every city has fifty third-wave shops with exposed brick, sans-serif logos, and kraft paper bags. Looking "nice" isn't a differentiator anymore. The coffee shops that build real loyalty — the ones with lines around the block and a retail bag people buy as a gift — have a brand that makes you feel something specific. That's what we build.`,
    sections: [
      {
        heading: "Why coffee shop branding is different",
        body: `Coffee is a daily-frequency product. People don't choose a coffee shop once — they choose it every morning. That means brand recognition and consistency at every touchpoint matter more than in almost any other retail category. The cup, the bag, the shop signage, the app icon, the Instagram grid — all of it reinforces (or erodes) the decision to come back tomorrow.

Packaging is also unusually important. If you sell retail bags — online or in the shop — the packaging IS the brand for anyone who doesn't visit in person. A bag of coffee on a shelf is competing with forty other bags. Yours needs to communicate quality, origin story, and aesthetic point of view in about two seconds.

And there's the scaling question. Most coffee shops start as one location with a strong vibe. When they add a second shop, launch wholesale, or start an e-commerce line, the brand either stretches or it snaps. The identity system needs to be built for growth from the start, even if you're opening your first location.`,
      },
      {
        heading: "What we build",
        body: `Positioning and naming (if you're pre-launch), brand strategy, visual identity, packaging system for retail, environmental design direction for the shop, and a digital presence that's more than a menu PDF. We think about the full experience arc: discover, visit, purchase, repurchase, gift.

For multi-location or wholesale-focused coffee brands, we also build tiered packaging systems (single origin, blends, seasonal), brand guidelines for wholesale partners, and templates for ongoing seasonal campaigns.`,
      },
      {
        heading: "Where most coffee shop brands break",
        body: `The aesthetic is borrowed, not owned. It looks like every other coffee shop in the neighborhood because it was built from the same Pinterest board. Clean, minimal, lowercase — but indistinguishable.

Or the brand was designed for the first shop and can't flex. The second location is in a different neighborhood with a different vibe, and now the identity feels forced. A system would have handled this. A logo treatment can't.

The packaging trap: beautiful bag, zero shelf presence. Muted colors, tiny type, and a story nobody can read at arm's length. Packaging design for coffee needs to balance taste with function — it has to sell off a shelf, not just look good in a flat lay.`,
      },
    ],
    relatedSlugs: ["how-much-does-branding-cost", "brand-audit-framework", "how-to-select-a-branding-agency"],
    ctaText: "Building a coffee brand or rethinking the one you have?",
    ctaLink: "/about#contact",
  },
  {
    _id: "service-food-beverage",
    title: "Branding Agency for Food and Beverage Brands",
    slug: "branding-agency-for-food-and-beverage-brands",
    vertical: "Consumer",
    seoTitle: "Branding Agency for Food & Beverage Brands — Atla",
    seoDescription: "Strategy, identity, and packaging design for food and beverage brands that need to win on shelf and online. From startup to retail scale.",
    primaryKeyword: "branding agency for food and beverage brands",
    intro: `A food or beverage brand has about two seconds to make its case. On a shelf, in a scroll, in a delivery app thumbnail. The product might be exceptional, but if the brand doesn't land in those two seconds, the consumer moves to the next option. This is a category where design isn't a nice-to-have — it's the sales team.`,
    sections: [
      {
        heading: "Why food & beverage branding is different",
        body: `Shelf competition is the defining constraint. Your brand sits next to ten others in the same category, at the same eye level, in the same lighting. The identity has to create instant recognition and communicate quality, positioning, and personality without anyone picking it up. Color, shape, typography hierarchy — these are conversion decisions, not aesthetic ones.

Then there's the omnichannel challenge. A food brand today lives on a retail shelf, a DTC website, Amazon, Instagram, a farmers market booth, and a wholesale line sheet. The identity system needs to feel cohesive across all of these — not just designed for one context and forced into the others.

Regulation adds a layer. Nutritional panels, ingredient lists, allergen callouts, country-specific labeling requirements. The packaging design has to accommodate all of that without looking like a compliance document. That's a structural design challenge most agencies underestimate.`,
      },
      {
        heading: "What we build",
        body: `Brand strategy (positioning within your category, audience definition, competitive mapping), naming, visual identity, and packaging design. For food and beverage brands, packaging is always the primary deliverable — we design the structural layout, label system, and a scalable framework so you can add new SKUs without starting from scratch every time.

Beyond packaging, we build the digital ecosystem: product photography direction, website design, Amazon storefront assets, and social templates. The brand should sell the same story whether someone finds you on a shelf in Whole Foods or on their phone at midnight.`,
      },
      {
        heading: "Where most food & beverage brands break",
        body: `The brand was built by the manufacturer. The co-packer offered a "design package" that produced something functional but generic. It looks like a house brand, not a brand someone would choose.

Or the founder designed it themselves (or hired a freelancer on Fiverr) and it worked well enough at the farmers market — but now that they're pitching retailers, the packaging doesn't look like it belongs next to the competition. Retailers notice. Buyers notice.

The SKU problem is also real. Many brands design one great package and then can't scale it. New flavors, new sizes, new product lines — and suddenly the family of products doesn't look like a family anymore. A system beats a single design every time.`,
      },
    ],
    relatedSlugs: ["how-much-does-branding-cost", "what-does-a-branding-agency-do", "how-to-brief-a-branding-agency"],
    ctaText: "Launching a product or scaling to retail?",
    ctaLink: "/about#contact",
  },
  {
    _id: "service-skincare",
    title: "Branding Agency for Skincare Brands",
    slug: "branding-agency-for-skincare-brands",
    vertical: "Consumer",
    seoTitle: "Branding Agency for Skincare Brands — Atla",
    seoDescription: "Brand strategy, identity, and packaging for skincare brands that want to stand out in the most aesthetically competitive category on earth.",
    primaryKeyword: "branding agency for skincare brands",
    intro: `Skincare is the most aesthetically saturated consumer category right now. Every brand has clean lines, muted earth tones, and a sans-serif logo. The visual language that felt fresh five years ago is now the default. If your brand looks like it could be any of fifty others, you're competing on price and distribution — not on identity. We build skincare brands that own a visual territory no one else occupies.`,
    sections: [
      {
        heading: "Why skincare branding is different",
        body: `Perception of quality is almost entirely brand-driven. Consumers can't evaluate a serum from a shelf. They evaluate the bottle, the box, the typography, the photography, the story. The brand IS the product for most buyers at the moment of purchase.

The category also moves in aesthetic waves. What reads as "premium" changes every two years. Minimalism, maximalism, clinical, botanical — the brands that survive multiple waves have an identity rooted in a point of view, not a trend. If your brand is just riding the current aesthetic, it expires when the trend does.

E-commerce adds complexity. Most skincare brands sell primarily online, which means the brand has to convert in a product tile: a tiny square image with no context. The packaging, the product photography, and the grid presentation all need to work at thumbnail scale.`,
      },
      {
        heading: "What we build",
        body: `Brand positioning (who you're for, what skincare philosophy you represent, where you sit in the market), visual identity, packaging system (primary + secondary packaging, box, bottle, label, insert), and digital design (site, product pages, social templates). For skincare, we also develop the photography and art direction style — because how the product is shot matters as much as how it's designed.`,
      },
      {
        heading: "Where most skincare brands break",
        body: `The brand looks like a mood board, not a system. Someone pulled references from Aesop and Glossier and landed somewhere in between — which is exactly where a thousand other brands already live.

Or the packaging was designed before the strategy. The bottles are beautiful, but the brand can't articulate why it exists beyond "clean ingredients" and "self-care." That's not positioning. That's a category description.

Scaling is the other fracture point. The first three SKUs look great together. By SKU twelve, the system has drifted — different label layouts, inconsistent color coding, no clear hierarchy between product lines. What started as curated now looks chaotic.`,
      },
    ],
    relatedSlugs: ["brand-strategy-vs-brand-identity", "brand-audit-framework", "why-most-startups-rebrand-too-late"],
    ctaText: "Building a skincare brand that lasts longer than a trend cycle?",
    ctaLink: "/about#contact",
  },
  {
    _id: "service-supplements",
    title: "Branding Agency for Supplement Brands",
    slug: "branding-agency-for-supplement-brands",
    vertical: "Consumer",
    seoTitle: "Branding Agency for Supplement Brands — Atla",
    seoDescription: "Brand strategy, identity, and packaging for supplement brands that need to build trust and stand out in a skeptical market.",
    primaryKeyword: "branding agency for supplement brands",
    intro: `Supplements have a trust problem. The category is crowded with brands that overpromise, underdeliver, and look like they were designed in a weekend. Consumers are getting smarter — they research ingredients, read reviews, and judge credibility by how a brand presents itself. A supplement brand that looks cheap or unserious gets skipped, regardless of what's in the bottle.`,
    sections: [
      {
        heading: "Why supplement branding is different",
        body: `Trust is the primary conversion driver. Unlike skincare or fashion, supplements go inside your body. People need to believe the brand is credible, transparent, and backed by real science (or at least real integrity) before they'll buy. The brand's visual language — from packaging to website to social proof — either builds or destroys that trust.

Regulatory constraints shape the design. Supplement Facts panels, disclaimer copy, FDA-compliant language — the packaging has to carry a significant amount of mandatory information while still looking intentional. Brands that treat compliance copy as an afterthought end up with beautiful front labels and backs that look like pharmaceutical inserts.

The subscription model also changes the branding equation. Most supplement brands live or die on retention, not acquisition. The unboxing experience, the refill packaging, the email touchpoints — these are brand moments that affect whether someone keeps paying every month.`,
      },
      {
        heading: "What we build",
        body: `Brand strategy (positioning against competitors, trust framework, ingredient story), naming, visual identity, packaging system (bottle/pouch, box, label, insert), and digital design. For supplements, we put extra emphasis on the website and product pages — that's where the purchase decision actually happens, and it needs to balance editorial credibility with clear product communication.`,
      },
      {
        heading: "Where most supplement brands break",
        body: `The brand tries too hard to look "clinical" and ends up feeling cold and unapproachable. Or it goes the opposite direction — too playful, too colorful — and loses the trust signals the category demands.

Ingredient storytelling is often underdeveloped. The brand lists what's in the product but doesn't explain why those ingredients matter, how they're sourced, or what makes this formula different. The packaging and the website leave the customer to do their own research — which usually means reading a competitor's better-written product page instead.

The subscription experience is usually an afterthought. The first order arrives in nice packaging. The refill arrives in a plain mailer with a shipping label. The brand equity built during acquisition evaporates the moment the customer experience becomes transactional.`,
      },
    ],
    relatedSlugs: ["how-much-does-branding-cost", "what-is-a-branding-agency", "how-to-brief-a-branding-agency"],
    ctaText: "Building a supplement brand people actually trust?",
    ctaLink: "/about#contact",
  },
  {
    _id: "service-spirits-wine",
    title: "Branding Agency for Spirits and Wine Brands",
    slug: "branding-agency-for-spirits-and-wine-brands",
    vertical: "Consumer",
    seoTitle: "Branding Agency for Spirits & Wine Brands — Atla",
    seoDescription: "Brand strategy, identity, and packaging for spirits and wine brands competing for shelf presence and cultural relevance.",
    primaryKeyword: "branding agency for spirits and wine brands",
    intro: `A bottle of spirits or wine is one of the few consumer products where the packaging IS the product experience for the buyer. It sits on a shelf, on a bar back, on a dinner table. People photograph it, display it, gift it. The label design isn't marketing collateral — it's the product's face in the world. And in a category with thousands of options, that face has to be unforgettable.`,
    sections: [
      {
        heading: "Why spirits and wine branding is different",
        body: `The bottle is a permanent object. Unlike most consumer packaging, a spirits bottle isn't thrown away immediately. It sits on a counter, on a bar, in a cabinet. The brand lives in someone's home or establishment for weeks or months. That level of visibility demands a design that rewards sustained attention — not just a strong first impression.

Distribution complexity shapes everything. A spirits brand needs to look right in a liquor store under fluorescent lights, on a cocktail menu as a name in 10pt type, behind a bar at ten feet, and on a product page at thumbnail size. The identity system has to perform across wildly different contexts.

Cultural association matters more here than in almost any other category. Spirits brands carry connotations — heritage, craft, rebellion, sophistication, regionality. The brand's visual and verbal language places it in a cultural conversation whether you intend it or not. Being deliberate about that placement is the difference between a brand that resonates and one that just exists.`,
      },
      {
        heading: "What we build",
        body: `Brand strategy (market positioning, cultural territory, pricing tier alignment), naming, visual identity, label and packaging design (including structural considerations for bottle shape, closure, and materials), and digital presence. For spirits and wine, we also develop the brand story framework — the origin narrative and language system that shows up on the back label, the website, the sell sheet, and the distributor pitch.`,
      },
      {
        heading: "Where most spirits and wine brands break",
        body: `The label was designed to win a design award, not to sell on a shelf. It's gorgeous in a portfolio and invisible in a liquor store. Shelf presence requires contrast, hierarchy, and legibility at a distance — not just beauty at arm's length.

Or the brand leans too hard on category tropes. Every mezcal brand doesn't need folk art. Every bourbon doesn't need Americana woodcut illustrations. Every natural wine doesn't need hand-drawn type. Category conventions become camouflage when everyone follows them.

The portfolio problem: the first expression looks stunning. By the third or fourth variant (aged, reserve, flavored, limited edition), the system has collapsed. Each new bottle looks like it was designed by a different person because there was no underlying system — just a one-off label that happened to work once.`,
      },
    ],
    relatedSlugs: ["brand-strategy-vs-brand-identity", "art-direction-vs-graphic-design", "how-to-select-a-branding-agency"],
    ctaText: "Launching a spirits or wine brand?",
    ctaLink: "/about#contact",
  },
  {
    _id: "service-fitness",
    title: "Branding Agency for Fitness Brands",
    slug: "branding-agency-for-fitness-brands",
    vertical: "Consumer",
    seoTitle: "Branding Agency for Fitness Brands — Atla",
    seoDescription: "Brand strategy and identity for fitness brands — gyms, studios, apps, and equipment companies — that want to own a lane, not blend in.",
    primaryKeyword: "branding agency for fitness brands",
    intro: `The fitness industry has a visual identity crisis. Bold gradients, aggressive typography, motivational slogans — the category default is loud, generic, and interchangeable. Meanwhile, the brands actually growing (the studios people travel for, the apps with real retention, the equipment people show off at home) have moved past the cliches. They've built brands with a specific point of view about fitness, not just a look.`,
    sections: [
      {
        heading: "Why fitness branding is different",
        body: `Fitness brands are identity brands. People don't just use a gym or a fitness app — they affiliate with it. They wear the merch, post the classes, talk about it at dinner. The brand becomes part of how someone presents themselves. That means the brand has to be aspirational enough to affiliate with but grounded enough to feel earned, not exclusive.

The category spans wildly different business models — brick-and-mortar studios, digital apps, equipment manufacturers, supplement lines, coaching platforms. Each model has different touchpoints, different customer journeys, and different brand requirements. A gym brand needs environmental design. An app needs interface design. An equipment brand needs packaging. The strategy has to be model-specific.

Community is the retention mechanism. Acquisition gets people in the door. Community keeps them. The brand needs to facilitate belonging — through language, visual identity, events, content, and the physical or digital space itself. Brands that feel transactional lose to brands that feel like a crew.`,
      },
      {
        heading: "What we build",
        body: `Brand strategy (positioning, audience, competitive differentiation, community framework), visual identity, environmental design direction (for studios/gyms), digital design (site, app UI direction), merch design, and content direction. For fitness brands, we also develop the brand voice in detail — because how you talk to members (on the app, in class, in emails) is as much of the brand as the logo.`,
      },
      {
        heading: "Where most fitness brands break",
        body: `The brand screams intensity and alienates everyone who isn't already a hardcore athlete. The aggressive visual language feels motivating to the founder but intimidating to the 80% of potential customers who want to get fitter, not compete.

Or the brand is purely visual — a logo, some colors, a nice Instagram grid — but has no strategic foundation. When it's time to launch a second location, add a digital product, or hire coaches who need to represent the brand, there's nothing documented to guide those decisions.

The merch test: if people wouldn't wear the merch outside the gym, the brand isn't strong enough. That's not a vanity metric — it's a signal of whether the brand has cultural value or is just a service provider.`,
      },
    ],
    relatedSlugs: ["brand-audit-framework", "why-most-startups-rebrand-too-late", "what-does-a-branding-agency-do"],
    ctaText: "Building a fitness brand people want to belong to?",
    ctaLink: "/about#contact",
  },
  {
    _id: "service-startups",
    title: "Branding Agency for Startups",
    slug: "branding-agency-for-startups",
    vertical: "Tech",
    seoTitle: "Branding Agency for Startups — Atla",
    seoDescription: "Brand strategy and identity for startups past the MVP stage — when the product works and the brand needs to catch up.",
    primaryKeyword: "branding agency for startups",
    intro: `Most startups brand too early or too late. Too early: they spend money on a brand before they know what the product actually is. Too late: the product-market fit is real, revenue is growing, and the brand is still a logo someone made in Canva during a weekend sprint. There's a window — usually Series A, sometimes late seed — where investing in brand makes a measurable difference. That's when we work best.`,
    sections: [
      {
        heading: "Why startup branding is different",
        body: `Speed is a constraint, not an excuse. Startups can't afford six-month branding engagements with eight rounds of revisions. But they also can't afford a brand that needs to be redone in a year. The engagement model has to be fast AND durable — which means the strategy work has to be tight, the design system has to be flexible, and the brand guidelines have to be usable by a team that's moving fast.

Hiring is a branding problem most startups don't recognize. Top candidates research your company before they apply. Your website, your social presence, your visual identity — these signal whether you're a company worth joining. A weak brand costs you candidates you never even know about.

And then there's the fundraising dimension. Investors pattern-match. A startup with a sharp, intentional brand signals operational maturity. It says: this team thinks about how they present themselves, which means they probably think about how they present their product, their pitch, and their company to customers. Brand quality is a trust signal in a fundraise, whether anyone says it out loud or not.`,
      },
      {
        heading: "What we build",
        body: `Brand strategy (positioning, messaging framework, competitive differentiation), visual identity, website design, pitch deck templates, and a brand system that a small team can execute without a designer in the room for every decision. For startups, we prioritize speed and usability — templates, guidelines, and assets your team can actually use, not a 200-page brand book no one opens.`,
      },
      {
        heading: "Where most startup brands break",
        body: `The "we'll fix it later" approach. The MVP brand becomes the permanent brand because nobody prioritizes the rebrand. By the time it becomes urgent (hiring is suffering, enterprise deals are stalling, the Series B deck looks amateur), the cost is higher and the window is tighter.

Or the startup hires a freelancer who delivers a logo and some colors but no system. It looks fine on the website, but the moment someone needs to make a sales deck, a conference booth, or a product screenshot, they're improvising. Every new asset is a one-off because there's no framework.

The positioning gap: the brand looks modern and polished, but it doesn't say anything specific. If you swap the logo with a competitor's and nothing feels different, the strategy is missing.`,
      },
    ],
    relatedSlugs: ["why-most-startups-rebrand-too-late", "how-much-does-branding-cost", "how-to-brief-a-branding-agency"],
    ctaText: "Past the MVP and ready for a real brand?",
    ctaLink: "/about#contact",
  },
  {
    _id: "service-saas",
    title: "Branding Agency for SaaS Companies",
    slug: "branding-agency-for-saas-companies",
    vertical: "Tech",
    seoTitle: "Branding Agency for SaaS Companies — Atla",
    seoDescription: "Brand strategy, identity, and web design for SaaS companies that need to look as good as their product works.",
    primaryKeyword: "branding agency for saas companies",
    intro: `SaaS is a category where the product is invisible until someone signs up. You can't hold it, display it, or demo it at a glance. Everything the buyer knows before purchase — trust, quality, sophistication — comes from the brand. The website, the visual identity, the way you write, the way the product is presented. For SaaS, brand IS the first product experience.`,
    sections: [
      {
        heading: "Why SaaS branding is different",
        body: `The website is the storefront, the sales floor, and the demo environment. It's not a brochure — it's the primary conversion tool. SaaS branding and web design can't be separated because the brand lives almost entirely on screen.

Competitive differentiation in SaaS is brutal. Feature sets converge. Pricing models converge. In many categories, three or four products do roughly the same thing. The brand is what makes one feel more trustworthy, more modern, more "us" than the others. That's a positioning and design problem, not a product problem.

B2B SaaS has the added challenge of multiple decision-makers. The user, the buyer, and the IT/security team each evaluate the brand through a different lens. The brand has to be credible enough for procurement, attractive enough for the end user, and clear enough for the evaluator comparing your product page against three competitors in a Google Sheet.`,
      },
      {
        heading: "What we build",
        body: `Brand strategy (positioning, messaging architecture for different personas, competitive framing), visual identity, product marketing design (feature pages, comparison pages, pricing page), and website design. For SaaS, we often also develop the UI identity layer — not the full product design, but the visual language (color, type, illustration style, iconography) that bridges the marketing site and the product interface so they feel like one brand.`,
      },
      {
        heading: "Where most SaaS brands break",
        body: `The brand was built for launch and never updated. The product matured, moved upmarket, added enterprise features — but the brand still looks like a seed-stage startup. The visual identity is a mismatch with the customer you're now trying to close.

Or the brand is a collection of one-off assets: the website was designed by one team, the product UI by another, the sales deck by a third. Nothing feels connected. The customer experiences a different brand at every stage of the funnel.

The illustration trap: SaaS brands default to generic isometric illustrations, abstract blobs, or stock-style "diverse team smiling at laptop" imagery. When every competitor uses the same visual vocabulary, the brand becomes noise. A distinct illustration or photography style is one of the highest-leverage differentiation moves in SaaS.`,
      },
    ],
    relatedSlugs: ["what-does-a-branding-agency-do", "brand-strategy-vs-brand-identity", "how-to-select-a-branding-agency"],
    ctaText: "Need a brand that matches the product?",
    ctaLink: "/about#contact",
  },
  {
    _id: "service-luxury",
    title: "Branding Agency for Luxury Brands",
    slug: "branding-agency-for-luxury-brands",
    vertical: "Premium",
    seoTitle: "Branding Agency for Luxury Brands — Atla",
    seoDescription: "Brand strategy and identity for luxury brands where restraint, craft, and specificity matter more than volume.",
    primaryKeyword: "branding agency for luxury brands",
    intro: `Luxury isn't a price point. It's a promise of exceptionalism — in craft, in taste, in the details nobody else would bother getting right. The brand has to deliver on that promise at every level of contact, from the first impression on screen to the weight of the paper in the packaging. Most agencies can make something look expensive. Very few can make it feel rare.`,
    sections: [
      {
        heading: "Why luxury branding is different",
        body: `Restraint is the skill. Luxury branding is about what you leave out as much as what you put in. Over-designing, over-explaining, over-branding — all of it undermines the perception of exclusivity. The visual language needs to be precise, not loud.

Material and production quality are brand elements. In luxury, the paper stock, the printing technique, the packaging materials, the website animations — these aren't details, they're the product. A luxury brand on cheap paper is a contradiction. The design has to be conceived alongside the production, not adapted to it afterward.

Heritage and story carry weight. Luxury buyers want to know the origin — of the founder, the craft, the ingredients, the place. But the story has to be real, specific, and understated. Fabricated heritage or overstated narratives feel worse than no story at all in this category.`,
      },
      {
        heading: "What we build",
        body: `Brand strategy (market positioning within the luxury spectrum, story architecture, audience and occasion mapping), visual identity with extreme attention to detail (custom typography considerations, precise color calibration, spatial systems), packaging and collateral (speccing materials and production techniques, not just designing for screen), digital design (website, e-commerce, campaign pages), and a brand book that covers tone, photography, styling, and spatial guidelines.`,
      },
      {
        heading: "Where most luxury brands break",
        body: `The brand uses "luxury" as a visual shorthand — black and gold, serif fonts, marble textures — without any underlying substance. That's costume, not brand. Real luxury brands don't announce themselves as luxury. The quality signals it.

Or the digital experience doesn't match the physical one. The packaging is impeccable, the retail environment is stunning, and the website looks like a Shopify template with custom fonts. The weakest touchpoint defines the brand's ceiling.

Over-accessibility kills luxury perception. Too many sales, too much social content, too much visibility. If a luxury brand shows up as often as a DTC brand, it stops feeling special. The brand system needs to include rules about restraint — not just what to design, but what not to do.`,
      },
    ],
    relatedSlugs: ["art-direction-vs-graphic-design", "brand-audit-framework", "how-much-does-branding-cost"],
    ctaText: "Building something that deserves this level of care?",
    ctaLink: "/about#contact",
  },
  {
    _id: "service-real-estate",
    title: "Branding Agency for Real Estate Developers",
    slug: "branding-agency-for-real-estate-developers",
    vertical: "Premium",
    seoTitle: "Branding Agency for Real Estate Developers — Atla",
    seoDescription: "Brand strategy and identity for real estate developments — from residential projects to mixed-use properties that need to sell a vision.",
    primaryKeyword: "branding agency for real estate developers",
    intro: `A real estate development sells a future. The building doesn't exist yet, or it's half-finished, or it's a rendering and a sales office. The buyer is making a six- or seven-figure decision based on how the brand makes them feel about a place they can't visit. That's an extraordinary amount of weight on brand strategy, identity, and presentation to carry. Most development brands aren't built to handle it.`,
    sections: [
      {
        heading: "Why real estate branding is different",
        body: `The brand exists before the product does. Unlike almost every other category, real estate development branding has to sell something that isn't built yet. The identity, the rendering style, the website, the sales materials — everything is doing the work of the unfinished building. The brand IS the product until the building is the product.

The sales cycle is long and high-consideration. Nobody impulse-buys a condo. The brand has to sustain interest and credibility over months (sometimes years) of decision-making, from first awareness through deposit. Every touchpoint during that window — the website, the sales center, the brochure, the email updates — either reinforces the decision or introduces doubt.

Naming carries unusual weight. The development name becomes a neighborhood reference, an address, a Google Maps pin. It outlasts the sales campaign. Getting it wrong means living with a name that misrepresents the project or dates itself within a few years.`,
      },
      {
        heading: "What we build",
        body: `Brand strategy (market positioning, buyer persona definition, competitive differentiation within the market), project naming, visual identity, sales center design direction, website design (pre-launch capture page through full marketing site), brochure and sales collateral, signage and environmental graphics, and ongoing campaign materials as the project progresses through construction phases.`,
      },
      {
        heading: "Where most real estate brands break",
        body: `The brand looks like every other development in the area. Same serif logotype, same earth tones, same "elevated living" tagline. When three competing projects on the same corridor have interchangeable brands, buyers default to price and location — which is exactly what branding should be preventing.

Or the brand was designed by the architect's in-house team or the marketing person at the development company. It's functional but generic. It doesn't convey the specific vision that makes this project different from the one three blocks away.

The timeline trap: real estate branding has to be ready for pre-sales, which often means the brand launches before the architecture is finalized. If the brand is too literal (tied to specific renderings or features that change), it has to be revised. If it's too abstract, it doesn't sell anything. The right approach is a brand built around the experience and positioning, not the architecture.`,
      },
    ],
    relatedSlugs: ["how-to-brief-a-branding-agency", "what-does-a-branding-agency-do", "how-much-does-branding-cost"],
    ctaText: "Have a development that needs a brand as ambitious as the project?",
    ctaLink: "/about#contact",
  },
  {
    _id: "service-nonprofits",
    title: "Branding Agency for Nonprofits",
    slug: "branding-agency-for-nonprofits",
    vertical: "Social Impact",
    seoTitle: "Branding Agency for Nonprofits — Atla",
    seoDescription: "Brand strategy and identity for nonprofits that want to be taken as seriously as the cause they serve. No templates. Real brand work.",
    primaryKeyword: "branding agency for nonprofits",
    intro: `Nonprofits do some of the hardest, most important work on the planet — and most of them have brands that look like they were made in PowerPoint. There's a perception that investing in brand is frivolous when there's a mission to fund. But the opposite is true: a strong brand raises more money, attracts better talent, earns media attention, and makes every dollar spent on outreach go further. Looking like you don't care about your brand tells donors you might not care about the details either.`,
    sections: [
      {
        heading: "Why nonprofit branding is different",
        body: `The audience is split. A nonprofit brand has to speak to donors (who fund the work), beneficiaries (who receive it), volunteers (who do it), media (who amplify it), and institutional partners (who formalize it). One brand, five audiences, each with different motivations and trust triggers. The strategy has to map all of these before design begins.

Credibility is the currency. Donors need to believe the organization is well-run, transparent, and effective. A polished, intentional brand signals competence. A sloppy, inconsistent brand — regardless of the mission — raises questions about operational rigor. Fair or not, that's how trust works.

Budget consciousness shapes perception. Nonprofits walk a tightrope: the brand needs to look professional enough to be credible but not so polished that donors question where the money is going. The right answer isn't "make it look cheap" — it's "make it look intentional and efficient." Those are different things.`,
      },
      {
        heading: "What we build",
        body: `Brand strategy (mission articulation, audience mapping, positioning against other organizations in the same space), visual identity, website design, annual report and impact report design direction, fundraising collateral, and campaign materials. For nonprofits, we also develop messaging frameworks — because how you talk about the problem, the work, and the impact is the brand, arguably more than the visual identity.`,
      },
      {
        heading: "Where most nonprofit brands break",
        body: `The brand was designed ten years ago and never updated. The mission evolved, the organization grew, the audience shifted — but the logo, the colors, and the website stayed frozen. The brand reflects who the organization was, not who it is.

Or the brand was designed by a board member's nephew, a pro-bono volunteer, or a well-intentioned intern. The gesture was kind, the result is holding the organization back. A brand that doesn't look like it belongs in the same room as the organizations you're trying to partner with makes every conversation harder.

The emotional trap: the brand relies entirely on the cause itself to generate feeling and doesn't invest in how it's communicated. Heartbreaking photography and a sad statistic can only carry so much weight. The organizations that sustain donor engagement over years do it with brand consistency, not just emotional triggers.`,
      },
    ],
    relatedSlugs: ["brand-strategy-vs-brand-identity", "brand-audit-framework", "what-is-a-branding-agency"],
    ctaText: "Doing important work that deserves a brand to match?",
    ctaLink: "/about#contact",
  },
];

const ARTICLE_TITLE_MAP = {
  "how-much-does-branding-cost": "How Much Does Branding Cost in 2026? A Real Breakdown by Service",
  "how-to-brief-a-branding-agency": "How to Brief a Branding Agency",
  "hospitality-branding-guide": "The Complete Guide to Hospitality Branding",
  "brand-audit-framework": "Brand Audit Framework",
  "brand-strategy-vs-brand-identity": "Brand Strategy vs Brand Identity",
  "why-most-startups-rebrand-too-late": "Why Most Startups Rebrand Too Late",
  "what-does-a-branding-agency-do": "What Does a Branding Agency Actually Do?",
  "how-to-select-a-branding-agency": "How to Select a Branding Agency",
  "what-is-a-branding-agency": "What Is a Branding Agency?",
  "art-direction-vs-graphic-design": "Art Direction vs Graphic Design",
  "success-addiction": "Are We Sleepwalking Into Success Addiction?",
};

async function migrate() {
  if (!process.env.SANITY_TOKEN) {
    throw new Error("Missing SANITY_TOKEN. Run: SANITY_TOKEN=sk-... node script/migrateServicePages.mjs");
  }

  console.log("Starting Atla Service Pages migration...\n");
  console.log(`Creating ${SERVICE_PAGES.length} service pages as drafts...\n`);

  for (const page of SERVICE_PAGES) {
    const body = [];

    body.push(...paragraphsToBlocks(page.intro));

    for (const section of page.sections) {
      body.push(textBlock(section.heading, "h2"));
      body.push(...paragraphsToBlocks(section.body));
    }

    body.push(textBlock("Related reading", "h3"));

    for (const slug of page.relatedSlugs) {
      const articleTitle = ARTICLE_TITLE_MAP[slug] || slug;
      body.push(textBlock(`[${articleTitle}](/journal/${slug})`));
    }

    body.push(textBlock(`${page.ctaText} [Let's talk.](${page.ctaLink})`));

    const doc = {
      _type: "servicePage",
      _id: page._id,
      title: page.title,
      slug: { _type: "slug", current: page.slug },
      vertical: page.vertical,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      primaryKeyword: page.primaryKeyword,
      body,
      ctaText: page.ctaText,
      ctaLink: page.ctaLink,
      status: "draft",
    };

    await client.createOrReplace(doc);
    console.log(`  [${page.vertical}] ${page.title}`);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("Service pages migration complete!");
  console.log("=".repeat(60));
  console.log(`  Pages created: ${SERVICE_PAGES.length} (all as drafts)`);
  console.log("\nNext steps:");
  console.log("  1. Deploy the updated Sanity schema");
  console.log("  2. Run this migration script with an Editor token");
  console.log("  3. Review each draft in Sanity Studio");
  console.log("  4. Flip status from draft to published when ready");
  console.log("\nSanity Studio: https://www.sanity.io/manage/project/dvufm78f");
}

migrate().catch((err) => {
  console.error("\nMigration failed:", err.message);
  if (err.statusCode === 403) {
    console.error("  -> Token lacks write permissions. Generate an Editor-level token.");
  }
  process.exit(1);
});
