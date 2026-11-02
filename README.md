# portfolio

My portfolio site, built in public. I'm a designer who builds: I've spent 12+ years taking web products from the first conversation with users through launch, and this repo is where I show the process instead of only the result.

**Status:** in progress. The site is a live build with a banner saying so. The layout and orange palette are placeholders, and the fonts are only set for launch, until the Figma variables are done. Case studies come next.

## What's here so far

- **A design foundation built from one token file.** [`tokens/tokens.json`](tokens/tokens.json) holds every color, size, and spacing value. A build step turns it into CSS custom properties, so components never contain a raw value.
- **Light and dark themes** that follow the OS setting, with a toggle that overrides it and remembers the choice.
- **A placeholder site:** a [home page](src/pages/index.astro) built around a large T, an [About page](src/pages/about.astro), a [build log](src/pages/build-log.astro), and [one written piece](src/pages/writing/hand-written-css.astro).
- **A token explorer** on [`/system`](src/pages/system.astro): every semantic color in both themes side by side, plus a pair checker that shows the contrast ratio of any text and background combination. The page is hidden for now: nothing links to it and it asks search engines not to index it, but the URL still works.
- **Analytics with PostHog**, off by default: web analytics, masked session replay, and three custom events (theme changed, token pair checked, outbound link clicked), served from the site's own domain. See [`src/lib/analytics.ts`](src/lib/analytics.ts) and [`vercel.json`](vercel.json).
- **Contrast checks that fail the build.** Text and background pairs are declared in the token file with a WCAG minimum. If a color change drops one below it, `npm run build` stops and names the pair.

## Decisions so far

**Astro, with React only where something is interactive.** Most of a portfolio is reading. Astro ships it as static HTML, and React loads only for the pieces that need it (the theme toggle and the token explorer). Everything else costs the visitor no JavaScript.

**Two layers of tokens: primitives and semantic.** Primitives are raw values (`orange.700`). Semantic tokens say what a value is for (`accent-default`) and point to a different primitive in each theme. Components only use semantic tokens, which makes dark mode a data change in one file instead of a code change across every component.

**Contrast is a test, not a review step.** I've watched design systems drift because accessibility was checked once, at the start. Here the required pairs live next to the colors they constrain, and CI enforces them on every pull request.

**Analytics without cookies.** The site runs PostHog in cookieless mode, so it sets no cookies and uses no browser storage, and visitors are counted with a hash on PostHog's side. That means no consent banner, at the cost of less precise returning-visitor counts. Session recordings mask every input, Do Not Track is respected, and nothing loads in development or when no project key is set. The footer says the site uses PostHog whenever it does.

**PostHog through a reverse proxy.** A test visit in Firefox sent pageviews but no session replay or autocapture, most likely because the browser blocked PostHog's asset domain while the event endpoint got through. Rewrites in `vercel.json` now serve all PostHog traffic from this site's domain, under `/legs`. PostHog warns that blockers match obvious paths like `/analytics` or `/posthog`, and tables have legs. This also means a blocker no longer stops analytics for a visitor who has one, though Do Not Track is still respected. PostHog's managed proxy was the alternative, but it needs a DNS subdomain and keeps the config out of this repo. Proxied traffic counts toward Vercel's data transfer, which a portfolio's traffic won't come close to using up on the Hobby plan.

**Self-hosted fonts.** Bricolage Grotesque and JetBrains Mono come from npm packages and ship with the site instead of loading from Google Fonts, so a visitor's browser doesn't contact a third party just to show text. The cost is a few font files to download. The fonts themselves are set for launch, not final, and I'll revisit them when the Figma variables are done.

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
public/            favicon files, served as they are
src/
  components/      Astro components, plus React islands (*.tsx)
  lib/analytics.ts PostHog setup and the list of tracked events
  lib/build-log.ts build log entries, newest first
  site.ts          profile links
  layouts/         page shell, theme script
  pages/           home, about, build log, writing, and the hidden /system
tests/             vitest
docs/COMMITS.md    commit and PR conventions
CLAUDE.md          instructions for coding agents working in this repo
vercel.json        rewrites that serve PostHog from this site's domain
```

## Next

- [ ] Case study page template: result first, then role, team, timeline, and the decisions behind it
- [ ] First case study: replacing a quarter-long data review with a 30-minute task
- [ ] Replace the placeholder palette and launch fonts with the Figma variables
- [ ] Interactive component examples on `/system`
- [ ] Deploy previews on every pull request
