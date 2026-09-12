import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const interviews = await prisma.interview.findMany({
      orderBy: { completedAt: "desc" },
      include: { candidate: true, messages: { orderBy: { createdAt: "asc" } }, evaluation: true },
    });
    return NextResponse.json(interviews.map((item) => ({
      id: item.id, stage: item.stage, status: item.status === "COMPLETED" ? "completed" : "in-progress",
      startedAt: item.startedAt.toISOString(), completedAt: item.completedAt?.toISOString(), durationSeconds: item.durationSeconds,
      aiMode: item.aiMode, recruiterStatus: item.recruiterStatus.toLowerCase(), recruiterNotes: item.recruiterNotes,
      candidate: { name: item.candidate.name, email: item.candidate.email, mobile: item.candidate.mobile, role: item.candidate.targetRole, location: item.candidate.location },
      messages: item.messages.map((message) => ({ role: message.role as "assistant" | "user", content: message.content, at: message.createdAt.toISOString() })),
      scores: item.evaluation ? { communication: item.evaluation.communication, confidence: item.evaluation.confidence, technical: item.evaluation.technical, problemSolving: item.evaluation.problemSolving, project: item.evaluation.project } : undefined,
      overall: item.evaluation?.overall, summary: item.evaluation?.summary, strengths: item.evaluation?.strengths, concerns: item.evaluation?.concerns, recommendation: item.evaluation?.recommendation,
    })));
  } catch (error) {
    console.error("Unable to load interviews", error);
    return NextResponse.json({ error: "Unable to load interviews." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const item = await request.json();
    if (!item?.id || !item?.candidate?.email || !item?.candidate?.mobile) {
      return NextResponse.json({ error: "Interview id and candidate contact details are required." }, { status: 400 });
    }

    const candidate = await prisma.candidate.upsert({
      where: { email: item.candidate.email },
      update: { name: item.candidate.name, mobile: item.candidate.mobile, targetRole: item.candidate.role || null, location: item.candidate.location || null },
      create: { name: item.candidate.name, email: item.candidate.email, mobile: item.candidate.mobile, targetRole: item.candidate.role || null, location: item.candidate.location || null },
    });

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.interview.upsert({
        where: { id: item.id },
        update: {
          candidateId: candidate.id, status: item.status === "completed" ? "COMPLETED" : "IN_PROGRESS", stage: item.stage,
          startedAt: new Date(item.startedAt), completedAt: item.completedAt ? new Date(item.completedAt) : null,
          durationSeconds: item.durationSeconds || null, aiMode: item.aiMode || null,
          recruiterStatus: (item.recruiterStatus || "new").toUpperCase(), recruiterNotes: item.recruiterNotes || null,
        },
        create: {
          id: item.id, candidateId: candidate.id, status: item.status === "completed" ? "COMPLETED" : "IN_PROGRESS", stage: item.stage,
          startedAt: new Date(item.startedAt), completedAt: item.completedAt ? new Date(item.completedAt) : null,
          durationSeconds: item.durationSeconds || null, aiMode: item.aiMode || null,
          recruiterStatus: (item.recruiterStatus || "new").toUpperCase(), recruiterNotes: item.recruiterNotes || null,
        },
      });
      await tx.message.deleteMany({ where: { interviewId: item.id } });
      if (item.messages?.length) await tx.message.createMany({ data: item.messages.map((message: { role: string; content: string; at: string }) => ({ interviewId: item.id, role: message.role, content: message.content, createdAt: new Date(message.at) })) });
      if (item.scores) await tx.evaluation.upsert({
        where: { interviewId: item.id },
        update: { ...item.scores, overall: item.overall || 0, summary: item.summary || "", strengths: item.strengths || [], concerns: item.concerns || [], recommendation: item.recommendation || "" },
        create: { interviewId: item.id, ...item.scores, overall: item.overall || 0, summary: item.summary || "", strengths: item.strengths || [], concerns: item.concerns || [], recommendation: item.recommendation || "" },
      });
    });
    return NextResponse.json({ saved: true, id: item.id });
  } catch (error) {
    console.error("Unable to save interview", error);
    return NextResponse.json({ error: "Unable to save the interview." }, { status: 500 });
  }
}
