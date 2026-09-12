import { NextRequest, NextResponse } from "next/server";

type Message = { role: "assistant" | "user"; content: string };
type Scores = { communication: number; confidence: number; technical: number; problemSolving: number; project: number };

function cleanMessages(value: unknown): Message[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-20).flatMap((item): Message[] => {
    if (!item || typeof item !== "object") return [];
    const message = item as { role?: unknown; content?: unknown };
    if ((message.role !== "assistant" && message.role !== "user") || typeof message.content !== "string") return [];
    const content = message.content.trim().slice(0, 2500);
    return content ? [{ role: message.role, content }] : [];
  });
}

function fallback(messages: Message[]) {
  const answers = messages.filter((message) => message.role === "user").map((message) => message.content);
  const joined = answers.join(" ");
  const words = joined.trim().split(/\s+/).filter(Boolean).length;
  const averageWords = words / Math.max(answers.length, 1);
  const relevant = /react|angular|node|python|java|php|laravel|api|database|sql|typescript|framework|cloud|git/i.test(joined);
  const evidence = /built|created|implemented|solved|improved|designed|developed|optimized/i.test(joined);
  const scores: Scores = {
    communication: Math.min(10, 5 + Math.round(averageWords / 14)),
    confidence: Math.min(10, 6 + (answers.filter((answer) => answer.length > 90).length > 2 ? 2 : 1)),
    technical: Math.min(10, 5 + (relevant ? 2 : 0) + (averageWords > 25 ? 1 : 0)),
    problemSolving: Math.min(10, 5 + (evidence ? 2 : 0) + (averageWords > 30 ? 1 : 0)),
    project: Math.min(10, 5 + (evidence ? 2 : 0) + (joined.length > 600 ? 1 : 0)),
  };
  const overall = Number((Object.values(scores).reduce((total, score) => total + score, 0) / 5).toFixed(1));
  return {
    scores, overall,
    summary: `The candidate completed every screening stage and achieved ${overall}/10. The responses indicate ${scores.technical >= 8 ? "strong" : "developing"} technical depth, ${scores.communication >= 8 ? "clear and structured" : "generally clear"} communication, and ${evidence ? "evidence of practical project ownership" : "a need for deeper practical validation"}.`,
    strengths: [relevant ? "Relevant technical foundation" : "Positive learning attitude", evidence ? "Practical project exposure" : "Completed the full screening", "Clear career intent"],
    concerns: [averageWords < 20 ? "Several responses need more detail" : "Validate claims in a live technical round", !evidence ? "Limited measurable project outcomes" : "Explore system design depth"],
    recommendation: overall >= 8 ? "Strongly recommend next round" : overall >= 6.5 ? "Proceed to technical round" : "Hold for recruiter review",
    aiMode: "demo",
  };
}

function validEvaluation(value: unknown): value is { scores: Scores; overall: number; summary: string; strengths: string[]; concerns: string[]; recommendation: string } {
  if (!value || typeof value !== "object") return false;
  const result = value as { scores?: Record<string, unknown>; overall?: unknown; summary?: unknown; strengths?: unknown; concerns?: unknown; recommendation?: unknown };
  const scoreKeys = ["communication", "confidence", "technical", "problemSolving", "project"];
  return typeof result.overall === "number" && typeof result.summary === "string" && typeof result.recommendation === "string" && Array.isArray(result.strengths) && Array.isArray(result.concerns) && scoreKeys.every((key) => typeof result.scores?.[key] === "number");
}

export async function POST(request: NextRequest) {
  let body: { messages?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Please send a valid evaluation request." }, { status: 400 }); }
  const messages = cleanMessages(body.messages);
  if (!messages.some((message) => message.role === "user")) return NextResponse.json({ error: "At least one candidate response is required." }, { status: 400 });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json(fallback(messages));

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: 0.2, response_format: { type: "json_object" }, messages: [
        { role: "system", content: "You are a fair technical recruiter. Evaluate the transcript. Return JSON only with scores (communication, confidence, technical, problemSolving, project: integers 1-10), overall number, summary string, strengths string array, concerns string array, recommendation string. Use evidence only; never infer protected traits." },
        { role: "user", content: JSON.stringify(messages) },
      ] }),
    });
    if (!response.ok) throw new Error("AI evaluation failed");
    const data = await response.json() as { choices?: Array<{ message?: { content?: unknown } }> };
    const content = data.choices?.[0]?.message?.content;
    const evaluation: unknown = typeof content === "string" ? JSON.parse(content) : null;
    if (!validEvaluation(evaluation)) throw new Error("Invalid AI evaluation");
    return NextResponse.json({ ...evaluation, aiMode: "ai" });
  } catch {
    return NextResponse.json({ ...fallback(messages), aiMode: "fallback" });
  }
}
