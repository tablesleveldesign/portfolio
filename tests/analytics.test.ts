import { describe, expect, it } from 'vitest';
import { initAnalytics, track } from '../src/lib/analytics';

describe('analytics', () => {
  it('stays off without a key', () => {
    expect(initAnalytics(undefined, undefined, true)).toBe(false);
  });

  it('stays off in development builds', () => {
    expect(initAnalytics('phc_test', undefined, false)).toBe(false);
  });

  it('makes track() a safe no-op when off', () => {
    expect(() => track('theme_changed', { theme: 'dark' })).not.toThrow();
  });
});
