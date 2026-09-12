import { NextRequest, NextResponse } from "next/server";

const fallbackQuestions: Record<string, string[]> = {
  verification: ["Thank you. What is the best email address and mobile number to reach you on?"],
  education: ["Could you share your highest qualification, college, branch, graduation year and CGPA?"],
  technical: ["Which programming languages, frameworks and databases are you most comfortable with?", "Choose your strongest technical skill and explain how you used it in practice."],
  project: ["Tell me about one project you are proud of—what problem did it solve and what was your role?", "What was the hardest technical challenge in that project, and how did you solve it?"],
  career: ["Why does this internship interest you, and what are your preferred location, expected stipend and earliest joining date?"],
  complete: ["Thank you. I have everything I need to complete your interview."]
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    const list = fallbackQuestions[body.nextStage] || fallbackQuestions.complete;
    return NextResponse.json({ question: list[Math.min(body.stageTurn || 0, list.length - 1)], mode: "demo" });
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` }, body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: .65, max_tokens: 120,
      messages: [{ role: "system", content: `You are Nova, a warm, concise technical recruiter. Current stage: ${body.nextStage}. Ask exactly one natural question. Use prior answers, avoid repetition, and probe specific claims. Never score or judge aloud.` }, ...(body.messages || []).slice(-10).map((m: {role:string;content:string})=>({role:m.role,content:m.content}))]
    }) });
    if (!response.ok) throw new Error("AI request failed");
    const data = await response.json();
    return NextResponse.json({ question: data.choices[0].message.content, mode: "ai" });
  } catch {
    const list = fallbackQuestions[body.nextStage] || fallbackQuestions.complete;
    return NextResponse.json({ question: list[Math.min(body.stageTurn || 0, list.length - 1)], mode: "fallback" });
  }
}
