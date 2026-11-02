import posthog from 'posthog-js';

// Events this site sends. Keeping the list here makes the tracking plan readable in one place.
export type AnalyticsEvent =
  | { name: 'theme_changed'; props: { theme: 'system' | 'light' | 'dark' } }
  | { name: 'token_pair_checked'; props: { fg: string; bg: string } }
  | { name: 'outbound_clicked'; props: { destination: string } };

let enabled = false;
let consentReopened = false;
const consentListeners = new Set<() => void>();
const notifyConsentListeners = () => consentListeners.forEach((listener) => listener());

/**
 * Starts PostHog only when a project key is configured and this is a production build,
 * so local development and forks never send data.
 */
export function initAnalytics(key: string | undefined, isProd: boolean): boolean {
  if (enabled || !key || !isProd || typeof window === 'undefined') return enabled;
  posthog.init(key, {
    // Served from this site's domain by the rewrites in vercel.json.
    api_host: '/legs',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-08-30',
    // Until a visitor accepts, there are no cookies or replay; PostHog counts them with a server-side hash instead.
    // on_reject alone captures nothing before a choice, so opting out by default also counts visitors who ignore the banner.
    // Requires cookieless mode to be turned on in the PostHog project settings.
    cookieless_mode: 'on_reject',
    opt_out_capturing_by_default: true,
    person_profiles: 'identified_only',
    respect_dnt: true,
    session_recording: { maskAllInputs: true },
  });
  enabled = true;
  notifyConsentListeners();
  return enabled;
}

/** Safe to call anywhere: does nothing when analytics is off. */
export function track<E extends AnalyticsEvent>(name: E['name'], props: E['props']): void {
  if (!enabled) return;
  posthog.capture(name, props);
}

export function subscribeConsent(listener: () => void): () => void {
  consentListeners.add(listener);
  return () => {
    consentListeners.delete(listener);
  };
}

/** True when the visitor hasn't chosen yet, or asked to change their choice. Do Not Track counts as a rejection. */
export function shouldAskForConsent(): boolean {
  return enabled && (consentReopened || posthog.get_explicit_consent_status() === 'pending');
}

/** Accepting allows cookies and session replay. Rejecting stops them and keeps counting without cookies. */
export function setConsent(accepted: boolean): void {
  if (!enabled) return;
  if (accepted) posthog.opt_in_capturing();
  else posthog.opt_out_capturing();
  consentReopened = false;
  notifyConsentListeners();
}

/** Shows the banner again. The current choice stands until the visitor picks one. */
export function reopenConsent(): void {
  if (!enabled) return;
  consentReopened = true;
  notifyConsentListeners();
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
