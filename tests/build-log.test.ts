import { describe, expect, it } from 'vitest';
import { BUILD_LOG, formatDate } from '../src/lib/build-log';

describe('build log', () => {
  it('lists entries newest first, because the banner reads its date from the top one', () => {
    const dates = BUILD_LOG.map((entry) => entry.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('says on the newest entry that the design and colors are placeholders', () => {
    const newest = BUILD_LOG[0];
    expect(newest.title).toMatch(/placeholder design and color theme/i);
  });

  it('formats dates without shifting the day', () => {
    expect(formatDate('2026-11-01')).toBe('Nov 1, 2026');
  });
});
