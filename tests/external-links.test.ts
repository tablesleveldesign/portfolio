import { describe, expect, it } from 'vitest';

const sources = import.meta.glob<string>('../src/**/*.astro', { query: '?raw', import: 'default', eager: true });

describe('external links', () => {
  it('open in a new tab', () => {
    const anchors = Object.values(sources).flatMap((source) => source.match(/<a\b[^>]*>/g) ?? []);
    const external = anchors.filter((anchor) => /href=(\{SITE\.|"https?:)/.test(anchor));
    expect(external.length).toBeGreaterThan(0);
    for (const anchor of external) {
      expect(anchor).toContain('target="_blank"');
      expect(anchor).toContain('rel="noopener noreferrer"');
    }
  });
});
