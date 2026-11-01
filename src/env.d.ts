interface ImportMetaEnv {
  /** PostHog project API key. Analytics stays off when this is unset. */
  readonly PUBLIC_POSTHOG_KEY?: string;
  /** PostHog ingestion host, e.g. https://us.i.posthog.com or https://eu.i.posthog.com */
  readonly PUBLIC_POSTHOG_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
