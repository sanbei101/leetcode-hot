import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";
import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    vinext({
      cache: { cdn: cdnAdapter() },
      prerender: { routes: "*" },
      react: {
        compiler: true,
      },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": ".",
    },
  },
});
