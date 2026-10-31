import { describe, expect, it } from 'vitest';
import rawTokens from '../tokens/tokens.json';
import { THEMES, checkContrast, contrast, resolveTheme, toCss, type Tokens } from '../tokens/lib.mjs';

const tokens = rawTokens as unknown as Tokens;
const hex = /^#[0-9a-f]{6}$/i;

describe('semantic tokens', () => {
  it('define the same names in every theme', () => {
    const [light, dark] = THEMES.map((t) => Object.keys(tokens.semantic[t]).sort());
    expect(dark).toEqual(light);
  });

  it.each(THEMES)('resolve to real hex colors in %s', (theme) => {
    for (const [name, value] of Object.entries(resolveTheme(tokens, theme))) {
      expect(value, name).toMatch(hex);
    }
  });

  it('reject a reference to a primitive that does not exist', () => {
    const broken = structuredClone(tokens);
    broken.semantic.light['text-primary'] = '{color.neutral.999}';
    expect(() => resolveTheme(broken, 'light')).toThrow(/Unknown primitive/);
  });
});

describe('contrast', () => {
  it('matches known WCAG values', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrast('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
  });

  it('passes every declared pair in both themes', () => {
    const failures = checkContrast(tokens).filter((r) => !r.pass);
    expect(failures).toEqual([]);
  });

  it('only declares pairs between tokens that exist', () => {
    const names = Object.keys(tokens.semantic.light);
    for (const { fg, bg } of tokens.contrastPairs) {
      expect(names).toContain(fg);
      expect(names).toContain(bg);
    }
  });
});

describe('generated CSS', () => {
  const css = toCss(tokens);

  it('emits every semantic token as a custom property', () => {
    for (const name of Object.keys(tokens.semantic.light)) {
      expect(css).toContain(`--${name}:`);
    }
  });

  it('lets an explicit light choice override a dark OS setting', () => {
    expect(css).toContain(":root:not([data-theme='light'])");
    expect(css).toContain(":root[data-theme='dark']");
  });
});
