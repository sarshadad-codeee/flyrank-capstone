import { defineConfig, type Plugin } from "vitest/config";
import react from "@vitejs/plugin-react";
// Local Node handler; loaded only in the Vite dev server, not the browser bundle.
// @ts-expect-error JS module without a TS declaration
import { handleFeedbackRequest } from "./server/feedbackHandler.mjs";

function feedbackApiPlugin(): Plugin {
  return {
    name: "feedback-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split("?")[0] === "/api/feedback" && req.method === "POST") {
          void handleFeedbackRequest(req, res);
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), feedbackApiPlugin()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
