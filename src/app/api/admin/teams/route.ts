import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teamCreateSchema } from "@/lib/validations";
import { sendEmail, buildTeamInviteEmail } from "@/lib/mailer";
import { getEventSettings } from "@/lib/eventSettings";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "admin") return null;
  return session;
}

function generateTempPassword() {
  return crypto.randomBytes(6).toString("base64url");
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teams = await prisma.teamUser.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { athletes: true, injuries: true, illnesses: true } } },
  });

  return NextResponse.json(
    teams.map((t) => ({
      id: t.id,
      npc: t.npc,
      name: t.name,
      email: t.email,
      phone: t.phone,
      athleteCount: t._count.athletes,
      injuryCount: t._count.injuries,
      illnessCount: t._count.illnesses,
      createdAt: t.createdAt.toISOString(),
    })),
  );
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = teamCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.teamUser.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "A team with that email already exists" }, { status: 409 });
  }

  const tempPassword = generateTempPassword();
  const hashed = await bcrypt.hash(tempPassword, 10);

  const team = await prisma.teamUser.create({
    data: {
      npc: parsed.data.npc,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      password: hashed,
      mustResetPassword: true,
    },
  });

  const { eventName } = await getEventSettings();
  const { subject, html } = buildTeamInviteEmail(team.npc, team.email, tempPassword, eventName);
  void sendEmail({ to: team.email, subject, html });

  return NextResponse.json({ id: team.id, tempPassword }, { status: 201 });
}
