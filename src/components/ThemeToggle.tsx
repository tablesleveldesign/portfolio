import { useSyncExternalStore } from 'react';
import { track } from '../lib/analytics';

type Choice = 'system' | 'light' | 'dark';
const ORDER: Choice[] = ['system', 'light', 'dark'];
const LABEL: Record<Choice, string> = { system: 'System', light: 'Light', dark: 'Dark' };

// The theme lives on <html data-theme>, set before paint by the inline script in Base.astro.
// Treat that attribute as the source of truth and subscribe to it, instead of copying it into state.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function getSnapshot(): Choice {
  const theme = document.documentElement.dataset.theme;
  return theme === 'light' || theme === 'dark' ? theme : 'system';
}

// Static HTML has no saved preference, so it renders "System" and hydration corrects it.
const getServerSnapshot = (): Choice => 'system';

/** Cycles System -> Light -> Dark. "System" removes the override and follows the OS. */
export default function ThemeToggle() {
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function cycle() {
    const next = ORDER[(ORDER.indexOf(choice) + 1) % ORDER.length];
    const root = document.documentElement;
    if (next === 'system') delete root.dataset.theme;
    else root.dataset.theme = next;
    try {
      if (next === 'system') localStorage.removeItem('theme');
      else localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable: the choice lasts for this page view */
    }
    track('theme_changed', { theme: next });
  }

  return (
    <button type="button" className="theme-toggle" onClick={cycle} aria-label={`Theme: ${LABEL[choice]}. Change theme`}>
      Theme: {LABEL[choice]}
    </button>
  );
}
