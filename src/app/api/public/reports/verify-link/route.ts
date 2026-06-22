import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyReportLink } from "@/lib/magicLink";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const payload = verifyReportLink(token);

  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
  }

  const report = await prisma.report.findUnique({ where: { id: payload.id } });
  if (!report || report.email.toLowerCase() !== payload.email.toLowerCase()) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
  }

  return NextResponse.json({ id: report.id, email: report.email });
}
