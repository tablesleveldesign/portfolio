import { useSyncExternalStore } from 'react';
import { setConsent, shouldAskForConsent, subscribeConsent } from '../lib/analytics';

// Static HTML can't know the visitor's choice, so it renders nothing and the banner appears after hydration.
const getServerSnapshot = () => false;

/** Asks before PostHog sets a cookie and records the session. Rejecting or ignoring it stays cookieless. */
export default function ConsentBanner() {
  const asking = useSyncExternalStore(subscribeConsent, shouldAskForConsent, getServerSnapshot);
  if (!asking) return null;

  return (
    <div className="consent-banner" role="region" aria-label="Analytics choice">
      <p>
        I use PostHog to see how people move through this site, including session recordings with everything you type
        hidden. Recording needs a small amount of browser storage. If you say no, I still count the visit without
        cookies.
      </p>
      <div className="consent-actions">
        <button type="button" onClick={() => setConsent(true)}>
          Allow recording
        </button>
        <button type="button" onClick={() => setConsent(false)}>
          No thanks
        </button>
      </div>
    </div>
  );
}
