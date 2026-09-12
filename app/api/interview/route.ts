import { NextRequest, NextResponse } from "next/server";

const fallbackQuestions: Record<string, string[]> = {
  verification: ["Thank you. What is the best email address and mobile number to reach you on?"],
  education: ["Could you share your highest qualification, college, branch, graduation year and CGPA?"],
  technical: ["Which programming languages, frameworks and databases are you most comfortable with?", "Choose your strongest technical skill and explain how you used it in practice."],
  project: ["Tell me about one project you are proud of—what problem did it solve and what was your role?", "What was the hardest technical challenge in that project, and how did you solve it?"],
  career: ["Why does this internship interest you, and what are your preferred location, expected stipend and earliest joining date?"],
  complete: ["Thank you. I have everything I need to complete your interview."],
};

type TranscriptMessage = { role: "assistant" | "user"; content: string };
const stages = new Set(Object.keys(fallbackQuestions));

function fallback(stage: string, turn: number, mode: "demo" | "fallback") {
  const list = fallbackQuestions[stage] || fallbackQuestions.complete;
  return NextResponse.json({ question: list[Math.min(Math.max(turn, 0), list.length - 1)], mode });
}

function cleanTranscript(value: unknown): TranscriptMessage[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-10).flatMap((item): TranscriptMessage[] => {
    if (!item || typeof item !== "object") return [];
    const message = item as { role?: unknown; content?: unknown };
    if ((message.role !== "assistant" && message.role !== "user") || typeof message.content !== "string") return [];
    const content = message.content.trim().slice(0, 2500);
    return content ? [{ role: message.role, content }] : [];
  });
}

export async function POST(request: NextRequest) {
  let body: { nextStage?: unknown; stageTurn?: unknown; messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please send a valid interview request." }, { status: 400 });
  }

  const stage = typeof body.nextStage === "string" && stages.has(body.nextStage) ? body.nextStage : "complete";
  const turn = typeof body.stageTurn === "number" && Number.isFinite(body.stageTurn) ? Math.floor(body.stageTurn) : 0;
  const messages = cleanTranscript(body.messages);
  const key = process.env.OPENAI_API_KEY;
  if (!key) return fallback(stage, turn, "demo");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.65,
        max_tokens: 120,
        messages: [
          { role: "system", content: `You are Nova, a warm, concise technical recruiter. Current stage: ${stage}. Ask exactly one natural question. Use prior answers, avoid repetition, and probe specific claims. Never score or judge aloud.` },
          ...messages,
        ],
      }),
    });
    if (!response.ok) throw new Error("AI request failed");
    const data = await response.json() as { choices?: Array<{ message?: { content?: unknown } }> };
    const question = data.choices?.[0]?.message?.content;
    if (typeof question !== "string" || !question.trim()) throw new Error("AI returned no question");
    return NextResponse.json({ question: question.trim().slice(0, 1000), mode: "ai" });
  } catch {
    return fallback(stage, turn, "fallback");
  }
}
