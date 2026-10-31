import posthog from 'posthog-js';

// Events this site sends. Keeping the list here makes the tracking plan readable in one place.
export type AnalyticsEvent =
  | { name: 'theme_changed'; props: { theme: 'system' | 'light' | 'dark' } }
  | { name: 'token_pair_checked'; props: { fg: string; bg: string } }
  | { name: 'outbound_clicked'; props: { destination: string } };

let enabled = false;

/**
 * Starts PostHog only when a project key is configured and this is a production build,
 * so local development and forks never send data.
 */
export function initAnalytics(key: string | undefined, host: string | undefined, isProd: boolean): boolean {
  if (enabled || !key || !isProd || typeof window === 'undefined') return enabled;
  posthog.init(key, {
    api_host: host || 'https://us.i.posthog.com',
    defaults: '2026-08-30',
    // No cookies or browser storage; PostHog identifies visitors with a server-side hash instead.
    // Requires cookieless mode to be turned on in the PostHog project settings.
    cookieless_mode: 'always',
    person_profiles: 'identified_only',
    respect_dnt: true,
    session_recording: { maskAllInputs: true },
  });
  enabled = true;
  return enabled;
}

/** Safe to call anywhere: does nothing when analytics is off. */
export function track<E extends AnalyticsEvent>(name: E['name'], props: E['props']): void {
  if (!enabled) return;
  posthog.capture(name, props);
}

/** Sends an outbound_clicked event for any link marked with data-track-outbound. */
export function trackOutboundLinks(root: Document = document): void {
  root.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest?.('a[data-track-outbound]');
    if (link instanceof HTMLAnchorElement) {
      track('outbound_clicked', { destination: link.dataset.trackOutbound || link.hostname });
    }
  });
}
