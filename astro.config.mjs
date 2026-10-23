import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const site =
  process.env.SITE_URL || (deploymentHost ? `https://${deploymentHost}` : 'https://erra.example');

export default defineConfig({
  site,
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] },
});
