# Journal cleanup: digits and dashes out of the articles (2026-11-07)

Worktree: /Users/josepablo/Projects/atla-website/.claude/worktrees/figma-shell-home. No subagents. Do not write to Sanity. Do not run git. Write only inside this folder.

Site rules (JP, binding): no numbers on the site, digits or spelled-out counts (years are allowed; prices never); no em or en dashes (replace with a period, a comma or a colon); no banned words (elevate, authentic, game-changer, next level, synergy, leverage, robust, seamless, journey, vibrant, delve, landscape, tapestry, testament, unlock); the studio is Atla, never MK+2; WeLoveDaily is not mentioned. Voice: premium, direct, founder to founder, short sentences.

Data: Sanity project dvufm78f, dataset production, public read:
  https://dvufm78f.apicdn.sanity.io/v2023-10-01/data/query/production?query=<url-encoded GROQ>
Query every published `journalArticle` (`!(_id in path("drafts.**"))`) with _id, title, slug.current, seoTitle, seoDescription, excerpt, body (portable text), introParagraphs, and any other text field the document has (fetch one document whole first to see its fields). Save the raw export to `articles.json`.

Task:
1. Scan every text field of every article for: digits that are not a four-digit year (1900 to 2026), spelled-out counts used as numbers ("three steps", "five"), em/en dashes, banned words, "MK+2", "WeLoveDaily". List each hit with slug, field, block index and the exact phrase.
2. For the article `how-much-does-branding-cost`: it is about prices, which the site never states. Recommend one of: unpublish; rewrite as a no-prices piece (give the outline and the first paragraph); keep. Say which and why in one line.
3. Write `patches.json`: one entry per article that needs changes, `{ "_id", "slug", "set": { "<field>": <full new value> } }` with the complete new value of each changed field (for `body`, the full portable text array with only the affected spans edited; keep every `_key`, mark and `_type`). Rewrite sentences, do not just delete: "in 3 steps" becomes "in a few steps" or the sentence is restructured. Numbers that are part of a proper name or a fact that cannot be said without them (a founding year, a law number) stay.
4. Write `card.md`: a table (article, hits, what changed, one before/after example) and the recommendation for the pricing article. Nothing is applied without JP's «mándalo».

Return only: the number of articles with changes, the total hits by type, and your recommendation for the pricing article in one line.
