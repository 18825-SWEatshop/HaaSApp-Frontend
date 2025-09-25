import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    tsConfigPaths({ projects: ['./tsconfig.json'] }),

    // TanStack Start/Router FIRST
    tanstackStart({
      customViteReactPlugin: true,   // ← add this
      srcDirectory: 'src',
      start: { entry: './start.tsx' },
      server: { entry: './server.ts' },
      // tsr: { verboseFileRoutes: false }, // optional
    }),

    // React AFTER
    viteReact(),
  ],
})
