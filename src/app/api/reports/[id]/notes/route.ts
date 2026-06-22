import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reportNoteSchema } from "@/lib/validations";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = reportNoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const note = await prisma.reportNote.create({
    data: {
      reportId: id,
      author: session.user?.name ?? session.user?.email ?? "Admin",
      message: parsed.data.message,
    },
  });

  return NextResponse.json({
    id: note.id,
    author: note.author,
    message: note.message,
    createdAt: note.createdAt.toISOString(),
  });
}
