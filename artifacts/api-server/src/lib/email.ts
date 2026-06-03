import nodemailer from "nodemailer";
import { logger } from "./logger";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? "587");

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendConsultationConfirmedEmail(opts: {
  clientName: string;
  clientEmail: string;
  scheduledAt: Date | null;
  durationType: string;
  practiceAreaTitle: string | null;
  price: number;
  consultationId: number;
}): Promise<void> {
  const { clientName, clientEmail, scheduledAt, durationType, practiceAreaTitle, price, consultationId } = opts;

  const durationLabel: Record<string, string> = {
    "30min": "30-Minute Initial Assessment",
    "60min": "60-Minute Standard Consultation",
    "90min": "90-Minute Deep Dive Strategy",
  };

  const formattedDate = scheduledAt
    ? new Date(scheduledAt).toLocaleString("en-AE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Dubai",
      })
    : "To be confirmed — our team will contact you shortly";

  const subject = `Consultation Confirmed — Nexus Axis Consultants (#${consultationId})`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Consultation Confirmed</title>
<style>
  body { margin: 0; padding: 0; background: #0a0a0a; font-family: 'Georgia', serif; color: #e5d5b0; }
  .wrapper { max-width: 600px; margin: 0 auto; background: #0f0f0f; border: 1px solid #2a2a2a; }
  .header { background: #0a0a0a; padding: 40px 40px 32px; border-bottom: 1px solid #2a2a2a; }
  .logo-area { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
  .logo-name { font-size: 20px; font-weight: bold; letter-spacing: 0.15em; color: #c9a96e; text-transform: uppercase; }
  .logo-sub { font-size: 10px; letter-spacing: 0.3em; color: #888; text-transform: uppercase; margin-top: 2px; }
  .tagline { font-size: 11px; color: #666; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 8px; }
  .hero { padding: 40px 40px 32px; border-bottom: 1px solid #1e1e1e; }
  .status-badge { display: inline-block; background: #c9a96e14; border: 1px solid #c9a96e40; color: #c9a96e; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; padding: 6px 14px; margin-bottom: 20px; font-family: 'Arial', sans-serif; }
  .hero h1 { font-size: 28px; color: #f0e6d0; margin: 0 0 12px; font-weight: normal; line-height: 1.3; }
  .hero p { font-size: 15px; color: #888; line-height: 1.7; margin: 0; font-family: 'Arial', sans-serif; }
  .details { padding: 32px 40px; border-bottom: 1px solid #1e1e1e; }
  .details h2 { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #c9a96e; margin: 0 0 20px; font-family: 'Arial', sans-serif; font-weight: normal; }
  .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #1a1a1a; font-family: 'Arial', sans-serif; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { font-size: 12px; color: #666; letter-spacing: 0.05em; }
  .detail-value { font-size: 13px; color: #e0d0b0; font-weight: 500; text-align: right; max-width: 65%; }
  .date-highlight { background: #c9a96e0f; border: 1px solid #c9a96e25; padding: 20px 40px; margin: 0; border-bottom: 1px solid #1e1e1e; }
  .date-label { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #c9a96e; font-family: 'Arial', sans-serif; margin-bottom: 8px; }
  .date-value { font-size: 17px; color: #f0e6d0; line-height: 1.4; }
  .what-next { padding: 32px 40px; border-bottom: 1px solid #1e1e1e; }
  .what-next h2 { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #c9a96e; margin: 0 0 16px; font-family: 'Arial', sans-serif; font-weight: normal; }
  .step { display: flex; gap: 14px; margin-bottom: 14px; align-items: flex-start; font-family: 'Arial', sans-serif; }
  .step-num { width: 24px; height: 24px; background: #c9a96e15; border: 1px solid #c9a96e30; color: #c9a96e; font-size: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold; }
  .step-text { font-size: 13px; color: #999; line-height: 1.6; }
  .footer { padding: 28px 40px; background: #080808; }
  .footer-line { font-size: 11px; color: #555; font-family: 'Arial', sans-serif; line-height: 1.7; }
  .footer-line a { color: #c9a96e; text-decoration: none; }
  .divider { height: 1px; background: #1e1e1e; margin: 16px 0; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="logo-area">
      <div>
        <div class="logo-name">Nexus Axis</div>
        <div class="logo-sub">Consultants</div>
      </div>
    </div>
    <div class="tagline">Strategic Legal &amp; Corporate Counsel — UAE &amp; Egypt</div>
  </div>

  <div class="hero">
    <div class="status-badge">✓ Consultation Confirmed</div>
    <h1>Your consultation has been confirmed, ${clientName}.</h1>
    <p>We look forward to meeting with you. Please review the details below and prepare any relevant documents or context you would like to discuss during your session.</p>
  </div>

  <div class="date-highlight">
    <div class="date-label">Scheduled Date &amp; Time (UAE Time)</div>
    <div class="date-value">${formattedDate}</div>
  </div>

  <div class="details">
    <h2>Consultation Details</h2>
    <div class="detail-row">
      <span class="detail-label">Session Type</span>
      <span class="detail-value">${durationLabel[durationType] ?? durationType}</span>
    </div>
    ${practiceAreaTitle ? `<div class="detail-row">
      <span class="detail-label">Practice Area</span>
      <span class="detail-value">${practiceAreaTitle}</span>
    </div>` : ""}
    <div class="detail-row">
      <span class="detail-label">Fee</span>
      <span class="detail-value">AED ${price.toLocaleString()}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Reference</span>
      <span class="detail-value">#${String(consultationId).padStart(5, "0")}</span>
    </div>
  </div>

  <div class="what-next">
    <h2>Before Your Session</h2>
    <div class="step">
      <div class="step-num">1</div>
      <div class="step-text">Gather all relevant documents — contracts, correspondence, corporate records, or evidence related to your matter.</div>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <div class="step-text">Prepare a clear timeline of events and a summary of your key objectives from this consultation.</div>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <div class="step-text">If your session is virtual, ensure you have a stable connection and a private, quiet environment.</div>
    </div>
    <div class="step">
      <div class="step-num">4</div>
      <div class="step-text">Our team will reach out 24 hours prior to confirm logistics and any additional preparation instructions.</div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-line">
      If you need to reschedule or have any questions, reply to this email or contact us at
      <a href="mailto:info@nexusaxisconsultants.com">info@nexusaxisconsultants.com</a>.
    </div>
    <div class="divider"></div>
    <div class="footer-line">
      <strong style="color: #777;">Nexus Axis Consultants</strong><br />
      UAE: Ajman (Headquarters) &nbsp;|&nbsp; Egypt: Cairo Chambers<br />
      Established 2009 &nbsp;|&nbsp; DIFC &amp; ADGM Registered
    </div>
    <div class="divider"></div>
    <div class="footer-line" style="color: #444; font-size: 10px;">
      This communication is intended solely for ${clientEmail} and is confidential and privileged. 
      Reference #${String(consultationId).padStart(5, "0")}.
    </div>
  </div>
</div>
</body>
</html>`;

  const text = `
NEXUS AXIS CONSULTANTS — Consultation Confirmed

Dear ${clientName},

Your consultation has been confirmed.

SCHEDULED: ${formattedDate}
SESSION: ${durationLabel[durationType] ?? durationType}
${practiceAreaTitle ? `PRACTICE AREA: ${practiceAreaTitle}\n` : ""}FEE: AED ${price.toLocaleString()}
REFERENCE: #${String(consultationId).padStart(5, "0")}

BEFORE YOUR SESSION:
1. Gather all relevant documents.
2. Prepare a clear timeline of events and your key objectives.
3. Ensure a stable connection if your session is virtual.
4. We will reach out 24 hours prior to confirm logistics.

For questions or to reschedule, contact us at info@nexusaxisconsultants.com.

Nexus Axis Consultants | Established 2009
UAE: Ajman (HQ) | Egypt: Cairo Chambers
`;

  const transport = createTransport();
  if (!transport) {
    logger.warn(
      { to: clientEmail, consultationId, subject },
      "SMTP not configured — email not sent. Set SMTP_HOST, SMTP_USER, SMTP_PASS to enable email notifications."
    );
    return;
  }

  try {
    await transport.sendMail({
      from: `"Nexus Axis Consultants" <${process.env.SMTP_USER}>`,
      to: clientEmail,
      subject,
      html,
      text,
    });
    logger.info({ to: clientEmail, consultationId }, "Consultation confirmed email sent");
  } catch (err) {
    logger.error({ err, to: clientEmail, consultationId }, "Failed to send consultation confirmed email");
  }
}
