import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://miejsce.to",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
});
