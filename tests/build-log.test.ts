import { describe, expect, it } from 'vitest';
import { BUILD_LOG, formatDate } from '../src/lib/build-log';

describe('build log', () => {
  it('lists entries newest first, because the banner reads its date from the top one', () => {
    const dates = BUILD_LOG.map((entry) => entry.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('says somewhere that the design and colors are placeholders', () => {
    const titles = BUILD_LOG.map((entry) => entry.title);
    expect(titles.some((title) => /placeholder design and color theme/i.test(title))).toBe(true);
  });

  it('formats dates without shifting the day', () => {
    expect(formatDate('2026-11-01')).toBe('Nov 1, 2026');
  });
});
