import { defineConfig } from "astro/config";
import { envHeaders } from "./integrations/env-headers.mjs";

export default defineConfig({
  site: "https://miejsce.to",
  trailingSlash: "always",
  integrations: [envHeaders()],
  build: {
    format: "directory",
  },
});
