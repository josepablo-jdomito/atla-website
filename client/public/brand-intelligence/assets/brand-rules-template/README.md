# Brand rules template

Brand rules your team's AI can follow, so posts, emails and decks come out sounding and looking like you. Fill in the brackets, then load the files into Claude or ChatGPT (install.md).

Made by Atla, a branding studio in Austin. Same structure as the brand kits we build for clients, cut down to what you can fill in yourself. Plan on about two hours: 90 to fill in, 15 to install, a few to test.

## Short on time? Start with 20 minutes

Fill in just these three and install. The AI works with them and marks everything else MISSING, which tells you what to add next.

1. verbal/positioning.md: the one sentence at the top.
2. verbal/proof-and-claims.md: products and prices.
3. verbal/voice-and-tone.md: your three words and two lines you love.

## Who reads what

- **You** read this file and install.md. Don't upload them to your AI.
- **Your AI** reads AGENTS.md first, then the files it points to.

## Fill-in order

1. verbal/positioning.md. Everything else depends on it.
2. verbal/proof-and-claims.md. Your products, prices and the numbers you can cite. Without it, the AI either invents facts or refuses to write.
3. verbal/voice-and-tone.md
4. verbal/terminology.md
5. visual/visual-system.json and visual/logo-and-color.md. Ask your designer if you have one. Anything marked "Optional" can stay as it is.
6. Replace [Brand] in AGENTS.md and in the instructions inside install.md.
7. Install it in Claude or ChatGPT (install.md, about 15 minutes).
8. Test: ask your AI for one post, one email and one slide. Every place it gets wrong, or marks MISSING, is a rule or a fact you still need to add.

## How a rule is written

Every rule has five lines. The AI uses the last two when the rule doesn't fit the case exactly.

```
- Lead with the result, then how we get it.
  - Why: buyers scan the first line and decide there.
  - Applies to: headlines, first lines of emails, ads.
  - Example: "Invoices approved in 2 days. Here's how."
  - If it doesn't fit: open with the customer's problem instead.
```

An example teaches the AI more than any explanation. If you write only one extra line, write the example.

## Small print

- The `updated` and `approved_by` lines at the top of each file: today's date and "first version" is fine.
- Brackets like `[this]` are blanks. When you finish, search the folder for `[` to catch any you missed. Ignore `[MISSING: ...]` in AGENTS.md and install.md, and `[]` lists in the JSON: those stay.
- In visual-system.json, only change text inside the quotes. Keep the quotes and commas, or the file breaks.
