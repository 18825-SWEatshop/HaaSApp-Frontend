import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),

    // TanStack Start/Router FIRST
    tanstackStart({
      srcDirectory: "src",
      start: { entry: "./start.tsx" },
      // tsr: { verboseFileRoutes: false }, // optional
    }),
    nitroV2Plugin(),

    // React AFTER
    viteReact(),
  ],
});
