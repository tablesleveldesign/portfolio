import { useMemo, useState } from 'react';
import rawTokens from '../../tokens/tokens.json';
import { THEMES, checkContrast, contrast, resolveTheme, type Theme, type Tokens } from '../../tokens/lib.mjs';
import styles from './TokenExplorer.module.css';
import { track } from '../lib/analytics';

const tokens = rawTokens as unknown as Tokens;
const resolved: Record<Theme, Record<string, string>> = {
  light: resolveTheme(tokens, 'light'),
  dark: resolveTheme(tokens, 'dark'),
};
const names = Object.keys(resolved.light);

const grade = (ratio: number) => (ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : 'Fail');

/**
 * Shows every semantic color in both themes at once, so a theme decision can be
 * judged at a glance, plus a pair checker for any foreground/background combination.
 */
export default function TokenExplorer() {
  const [fg, setFg] = useState('text-primary');
  const [bg, setBg] = useState('surface-base');
  const declared = useMemo(() => checkContrast(tokens), []);

  return (
    <div className={styles.explorer}>
      <section aria-labelledby="pair-heading">
        <h3 id="pair-heading">Try a pair</h3>
        <div className={styles.controls}>
          <label>
            Text
            <select
              value={fg}
              onChange={(e) => {
                setFg(e.target.value);
                track('token_pair_checked', { fg: e.target.value, bg });
              }}
            >
              {names.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <label>
            Background
            <select
              value={bg}
              onChange={(e) => {
                setBg(e.target.value);
                track('token_pair_checked', { fg, bg: e.target.value });
              }}
            >
              {names.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.pairRow}>
          {THEMES.map((theme) => {
            const ratio = contrast(resolved[theme][fg], resolved[theme][bg]);
            return (
              <div
                key={theme}
                className={styles.pairPreview}
                style={{ color: resolved[theme][fg], background: resolved[theme][bg] }}
              >
                <span className={styles.pairTheme}>{theme}</span>
                <span className={styles.pairSample}>The quick review took five minutes.</span>
                <span>
                  {ratio.toFixed(2)}:1 · {grade(ratio)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="palette-heading">
        <h3 id="palette-heading">Semantic colors</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Light</th>
              <th scope="col">Dark</th>
            </tr>
          </thead>
          <tbody>
            {names.map((name) => (
              <tr key={name}>
                <th scope="row">
                  <code>--{name}</code>
                </th>
                {THEMES.map((theme) => (
                  <td key={theme}>
                    <span className={styles.swatch} style={{ background: resolved[theme][name] }} aria-hidden="true" />
                    <code>{resolved[theme][name]}</code>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="checks-heading">
        <h3 id="checks-heading">Required contrast</h3>
        <p className={styles.note}>
          These pairs are declared in <code>tokens.json</code>. The build fails if any of them drops below its minimum.
        </p>
        <ul className={styles.checks}>
          {declared.map((r) => (
            <li key={`${r.theme}-${r.fg}-${r.bg}`}>
              <span>
                {r.theme}: <code>{r.fg}</code> on <code>{r.bg}</code>
              </span>
              <span>
                {r.ratio.toFixed(2)}:1 (min {r.min}) {r.pass ? '✓' : '✗'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
