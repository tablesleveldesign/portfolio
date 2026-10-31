# portfolio

My portfolio site, built in public. I'm a designer who builds: I've spent 12+ years taking web products from the first conversation with users through launch, and this repo is where I show the process instead of only the result.

**Status:** in progress. The design foundation comes first, and its teal palette is a placeholder until the Figma variables are done. Case studies come next.

## What's here so far

- **A design foundation built from one token file.** [`tokens/tokens.json`](tokens/tokens.json) holds every color, size, and spacing value. A build step turns it into CSS custom properties, so components never contain a raw value.
- **Light and dark themes** that follow the OS setting, with a toggle that overrides it and remembers the choice.
- **A token explorer** on [`/system`](src/pages/system.astro): every semantic color in both themes side by side, plus a pair checker that shows the contrast ratio of any text and background combination.
- **Analytics with PostHog**, off by default: web analytics, masked session replay, and three custom events (theme changed, token pair checked, outbound link clicked). See [`src/lib/analytics.ts`](src/lib/analytics.ts).
- **Contrast checks that fail the build.** Text and background pairs are declared in the token file with a WCAG minimum. If a color change drops one below it, `npm run build` stops and names the pair.

## Decisions so far

**Astro, with React only where something is interactive.** Most of a portfolio is reading. Astro ships it as static HTML, and React loads only for the pieces that need it (the theme toggle and the token explorer). Everything else costs the visitor no JavaScript.

**Two layers of tokens: primitives and semantic.** Primitives are raw values (`teal.700`). Semantic tokens say what a value is for (`accent-default`) and point to a different primitive in each theme. Components only use semantic tokens, which makes dark mode a data change in one file instead of a code change across every component.

**Contrast is a test, not a review step.** I've watched design systems drift because accessibility was checked once, at the start. Here the required pairs live next to the colors they constrain, and CI enforces them on every pull request.

**Analytics without cookies.** The site runs PostHog in cookieless mode, so it sets no cookies and uses no browser storage, and visitors are counted with a hash on PostHog's side. That means no consent banner, at the cost of less precise returning-visitor counts. Session recordings mask every input, Do Not Track is respected, and nothing loads in development or when no project key is set. The footer says the site uses PostHog whenever it does.

**System fonts, for now.** Text renders immediately with nothing to download. I'll revisit this when the visual identity settles.

## Run it

Requires Node 22.23 or newer (developed on 26).

```sh
npm install
npm run dev        # builds tokens, then starts the dev server
npm test           # token and contrast tests
npm run build      # static site in dist/
```

Analytics is optional. To turn it on, copy `.env.example` to `.env` (or set the variables in your host), add a PostHog project key, and enable cookieless mode in the PostHog project settings. Without that setting, PostHog ignores cookieless events.

## Layout

```
tokens/
  tokens.json      the design foundation's single source of values
  lib.mjs          resolve references, generate CSS, check contrast
scripts/
  build-tokens.mjs writes src/styles/tokens.css, fails on contrast errors
src/
  components/      Astro components, plus React islands (*.tsx)
  lib/analytics.ts PostHog setup and the list of tracked events
  site.ts          profile links
  layouts/         page shell, theme script
  pages/           index and /system
tests/             vitest
docs/COMMITS.md    commit and PR conventions
CLAUDE.md          instructions for coding agents working in this repo
```

## Next

- [ ] Case study page template: result first, then role, team, timeline, and the decisions behind it
- [ ] First case study: replacing a quarter-long data review with a 30-minute task
- [ ] Interactive component examples on `/system`
- [ ] Deploy previews on every pull request
