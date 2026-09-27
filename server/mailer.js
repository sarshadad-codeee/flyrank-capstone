import nodemailer from "nodemailer";

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function formatEmail(feedback) {
  const submittedAt = new Date().toISOString();
  const lines = [
    "New customer feedback from the Facilitation Center",
    "",
    `Submitted: ${submittedAt}`,
    `Counter: ${feedback.counterId || "Not specified"}`,
    `Service: ${feedback.serviceType}`,
    `Rating: ${feedback.rating} / 5`,
    "",
    `Name: ${feedback.customerName}`,
    `Phone: ${feedback.phone}`,
    `Consumer number: ${feedback.consumerNumber || "Not provided"}`,
    "",
    "Comments:",
    feedback.comments,
  ];

  return {
    subject: `Feedback (${feedback.rating}/5) — ${feedback.serviceType}${feedback.counterId ? ` · Counter ${feedback.counterId}` : ""}`,
    text: lines.join("\n"),
  };
}

export async function notifyIncharge(feedback) {
  const to = process.env.INCHARGE_EMAIL || "incharge@example.com";

  const { subject, text } = formatEmail(feedback);

  if (!smtpConfigured()) {
    console.info("[feedback] SMTP not configured. Email that would be sent:\n", { to, subject, text });
    return { delivered: false };
  }

  const transporter = createTransport();
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  });

  return { delivered: true };
}
