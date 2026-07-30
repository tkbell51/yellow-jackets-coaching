import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    VitePWA({
      registerType: "prompt",
      outDir: "build/client",
      includeAssets: ["favicon.ico", "pwa-192x192.svg", "pwa-512x512.svg"],
      manifest: {
        name: "Yellow Jackets Coaching",
        short_name: "Jackets",
        description: "Mobile-first practice, roster, competition, and game-day tools for Yellow Jackets coaches.",
        start_url: "/app",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#000000",
        theme_color: "#D0B988",
        icons: [
          { src: "/pwa-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
          { src: "/pwa-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
          { src: "/pwa-512x512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
        ],
      },
      workbox: {
        navigateFallback: "/app",
        globPatterns: ["**/*.{js,css,html,ico,svg,png,woff2}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "images" },
          },
        ],
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
