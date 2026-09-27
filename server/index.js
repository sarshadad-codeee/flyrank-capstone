import "dotenv/config";
import cors from "cors";
import express from "express";
import { notifyIncharge } from "./mailer.js";
import { normalizeFeedback, validateFeedbackPayload } from "./validate.js";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors({ origin: true }));
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/feedback", async (req, res) => {
  const error = validateFeedbackPayload(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const feedback = normalizeFeedback(req.body);

  try {
    const result = await notifyIncharge(feedback);
    res.status(201).json({
      ok: true,
      delivered: result.delivered,
    });
  } catch (err) {
    console.error("[feedback] failed to notify incharge", err);
    res.status(502).json({
      error: "Your feedback could not be delivered right now. Please try again in a moment.",
    });
  }
});

app.listen(port, () => {
  console.info(`Feedback API listening on http://127.0.0.1:${port}`);
});
