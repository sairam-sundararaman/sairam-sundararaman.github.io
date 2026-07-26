import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base: '/' because this deploys to the root of a user/org GitHub Pages
// site (sairam-sundararaman.github.io), not a project sub-path.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
