interface ImportMetaEnv {
  /** PostHog project API key. Analytics stays off when this is unset. */
  readonly PUBLIC_POSTHOG_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
