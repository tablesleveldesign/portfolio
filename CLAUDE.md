# portfolio

Todd Ables' portfolio: Astro + React islands on a design foundation built from one token file. Public repo, read by hiring reviewers.

## Commands

- `npm run dev`: build tokens, start the dev server
- `npm run build`: build tokens (fails on contrast errors), then the static site
- `npm test`, `npm run lint`, `npm run check`, `npm run format:check`

## Rules

- Commits and PRs follow `docs/COMMITS.md`. Read it before the first commit in a session.
- Components use semantic tokens only (`var(--accent-default)`), never raw values. New colors go in `tokens/tokens.json`, with a contrast pair if they're used for text.
- React only for interactive pieces (islands). Everything else is Astro.
- Write from scratch. No code, text, or designs from any employer.
- README and copy: plain and specific, no em dashes, no marketing words. Explain decisions.
- Analytics events are listed in `src/lib/analytics.ts`; add new ones there, and keep cookieless mode and input masking on.
- Check for visual changes in both themes and at phone width before committing.

## Layout

- `tokens/`: `tokens.json` (source of values) and `lib.mjs` (resolve, generate CSS, contrast)
- `scripts/build-tokens.mjs`: writes `src/styles/tokens.css` (generated, not committed)
- `src/components/`: Astro components and React islands (`*.tsx`)
- `src/lib/analytics.ts`: PostHog setup and event list
- `src/lib/build-log.ts`: build log entries, newest first
- `src/site.ts`: profile links
- `tests/`: vitest
