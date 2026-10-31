import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Static site. React is only shipped for components marked as islands (client:*).
export default defineConfig({
  integrations: [react()],
});
