import http from "node:http";
import { handleFeedbackRequest } from "./feedbackHandler.mjs";

const port = Number(process.env.PORT) || 3001;

const server = http.createServer((req, res) => {
  const path = req.url?.split("?")[0];
  if (path === "/api/feedback" && req.method === "POST") {
    void handleFeedbackRequest(req, res);
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ ok: false, error: "Not found." }));
});

server.listen(port, () => {
  process.stdout.write(`Feedback API listening on http://localhost:${port}\n`);
});
