import { defineConfig } from 'vite';

// Vercel serves the site from the domain root; GitHub Pages serves it from
// https://boxxelf.github.io/alvinwong/, so `npm run deploy` sets GH_PAGES=1.
export default defineConfig({
  base: process.env.GH_PAGES ? '/alvinwong/' : '/',
});
