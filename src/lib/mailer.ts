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

export function buildTeamInviteEmail(
  npc: string,
  email: string,
  tempPassword: string,
  eventName = "Aichi Nagoya 2026 Asian Para Games",
) {
  const portalUrl = `${process.env.NEXTAUTH_URL ?? ""}/portal/login`;
  return {
    subject: `Your ${eventName} medical portal account`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p>Hello,</p>
        <p>An account has been created for <strong>${npc}</strong> on the ${eventName} medical reporting portal.</p>
        <p style="margin: 20px 0; padding: 16px; background: #f4f6f8; border-radius: 8px;">
          Email: <strong>${email}</strong><br />
          Temporary password: <strong>${tempPassword}</strong>
        </p>
        <p style="margin: 20px 0;">
          <a href="${portalUrl}" style="background:#00BCD4;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">
            Log In to the Portal
          </a>
        </p>
        <p style="font-size: 13px; color: #888;">
          You'll be asked to set a new password the first time you log in.
        </p>
      </div>
    `,
  };
}
