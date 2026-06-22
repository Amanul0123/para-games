import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signReportLink } from "@/lib/magicLink";
import { sendEmail, buildMagicLinkEmail } from "@/lib/mailer";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // MySQL's default collation compares strings case-insensitively, matching
  // the lookup behavior used elsewhere for report ownership checks.
  const reports = await prisma.report.findMany({
    where: { email: parsed.data.email },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  for (const report of reports) {
    const token = signReportLink(report.id, report.email);
    const link = `${process.env.NEXTAUTH_URL}/form/manage/verify?token=${token}`;
    const { subject, html } = buildMagicLinkEmail(link, report.npc);
    void sendEmail({ to: report.email, subject, html });
  }

  // Always return success, regardless of whether a match was found, to avoid
  // leaking which emails have submitted reports.
  return NextResponse.json({ success: true });
}
