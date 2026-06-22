const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Asian Para Games Reports <onboarding@resend.dev>";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  if (!RESEND_API_KEY) {
    console.warn(`[mailer] RESEND_API_KEY not set, skipping email to ${to}`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });

    if (!res.ok) {
      console.error("[mailer] Failed to send email:", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[mailer] Error sending email:", err);
  }
}

export function buildMagicLinkEmail(link: string, npc: string) {
  return {
    subject: "Access your Asian Para Games medical report",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p>Hello,</p>
        <p>Here is your secure link to view or edit your submitted medical report for <strong>${npc}</strong>:</p>
        <p style="margin: 20px 0;">
          <a href="${link}" style="background:#00BCD4;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">
            View / Edit My Report
          </a>
        </p>
        <p style="font-size: 13px; color: #888;">
          Or copy this link into your browser:<br />
          <a href="${link}">${link}</a>
        </p>
        <p style="font-size: 13px; color: #888;">
          This link expires in 30 days. If you didn't submit this report, you can ignore this email.
        </p>
      </div>
    `,
  };
}
