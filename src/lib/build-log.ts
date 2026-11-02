// Entries on the build log page, newest first. The banner's "last updated" date reads from the top entry.
// Body strings are HTML written in this file, so they can hold links.
export interface BuildLogEntry {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  title: string;
  body: string[];
}

export const BUILD_LOG: BuildLogEntry[] = [
  {
    date: '2026-11-01',
    title: 'Put up a placeholder design and color theme',
    body: [
      'The colors and layout you’re looking at are placeholders, and the fonts are only set for this launch. They all stand in until the Figma variables are done, so expect them to change.',
      'This replaces the first home page, and the banner at the top says the site is a live build. The design foundation page still exists, but it’s hidden for now.',
    ],
  },
  {
    date: '2026-11-01',
    title: 'Launching before it’s finished',
    body: [
      'I’d rather show the work as it happens than wait for a finished site. The trade-off is that a visitor might land on a thin day, so the launch has a floor: a homepage, an About page, this log, the repo, and one real written piece.',
      'One rule to keep it from breaking: main only gets working builds. Anything unfinished lives on a preview deploy.',
    ],
  },
  {
    date: '2026-11-01',
    title: 'Type: Bricolage Grotesque and JetBrains Mono',
    body: [
      'The first fonts were placeholders I hadn’t really chosen, and one of them is a default you see on a lot of developer sites. I put four pairings on the same homepage in Figma and compared them side by side. Bricolage Grotesque had the most character while still reading like a working product font. JetBrains Mono handles the labels and dates.',
      'Comparing them on the real page caught something a font list wouldn’t: two of the monospace fonts were missing the arrow characters I use for links.',
    ],
  },
  {
    date: '2026-11-01',
    title: 'Homepage: a T as the centerpiece',
    body: [
      'I mocked up four hero layouts in Figma and first picked a wordmark, where the T in “Todd” was drawn and its leg dropped below the rest of the name. It was clever, but my name became the loudest thing on the page, and most portfolios I admire lead with what the person does instead.',
      'The second round kept the T and gave it room. The crossbar runs under the four broad skills, the leg drops from the center for design systems, and my name and headline sit beside it at a readable size. The colors are still placeholders until the real tokens land.',
    ],
  },
  {
    date: '2026-11-01',
    title: 'Foundation: hand-written, token-driven CSS',
    body: [
      'I passed on a prebuilt component kit and decided to write the CSS myself, driven by a token file. The full reasoning is in <a href="/writing/hand-written-css">the first piece</a>.',
    ],
  },
  {
    date: '2026-11-01',
    title: 'Commits stay unsquashed',
    body: [
      'My first plan was to squash the history into a few clean commits before making the repo public. I changed my mind. The history is part of the work, so commits follow Conventional Commits, one idea each, and nothing gets squashed.',
    ],
  },
  {
    date: '2026-10-31',
    title: 'Added analytics without cookies',
    body: [
      'I want to know which parts of the site people use without asking them to accept cookies. PostHog runs in cookieless mode, so there’s no consent banner, at the cost of less precise returning-visitor counts.',
      'Session recordings mask everything typed, Do Not Track is respected, and only three custom events are sent: theme changes, token pairs checked, and outbound clicks.',
    ],
  },
  {
    date: '2026-10-31',
    title: 'Built a token explorer',
    body: [
      'Contrast numbers in a token file are hard to judge, so I built a page that shows every semantic color in both themes side by side. A pair checker sets any text token on any background token and shows the contrast ratio and WCAG grade.',
    ],
  },
  {
    date: '2026-10-31',
    title: 'Added the page shell and themes',
    body: [
      'The site follows the operating system’s theme, and a toggle overrides it and remembers the choice. A small script in the head applies that choice before the first paint, so nobody who picked dark gets a flash of light.',
    ],
  },
  {
    date: '2026-10-31',
    title: 'Generated the CSS from one token file',
    body: [
      'Components should never hold a raw color or size, so every value lives in one file. Base values sit at the bottom, and semantic tokens point to a different one in each theme, which makes dark mode a data change instead of a code change.',
      'Text and background pairs are declared next to the colors, and the build stops with the failing pair and its ratio if one drops below its minimum.',
    ],
  },
  {
    date: '2026-10-30',
    title: 'Prototyped a looping life timeline',
    body: [
      'A small running character moves through scenes from my life along the bottom of the homepage, and the last scene hands off to the first so it loops. It’s a working prototype with placeholder art, and it isn’t on the site yet.',
    ],
  },
  {
    date: '2026-10-28',
    title: 'Scaffolded the repo',
    body: [
      'Astro for the pages, with React only for the few pieces that need to be interactive. Design tokens live in one JSON file that generates the CSS. Light and dark themes follow the operating system. If a text and background pair drops below the contrast I’ve set for it, the build fails.',
    ],
  },
];

/** "2026-11-01" -> "Nov 1, 2026". Fixed to UTC so the date doesn't shift with the build machine's time zone. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
