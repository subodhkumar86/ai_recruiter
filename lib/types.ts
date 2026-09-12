export type Stage = "verification" | "education" | "technical" | "project" | "career" | "complete";
export type Message = { role: "assistant" | "user"; content: string; at: string };
export type Scores = { communication: number; confidence: number; technical: number; problemSolving: number; project: number };
export type Interview = {
  id: string; candidate: { name: string; email: string; mobile: string; role?: string; location?: string };
  stage: Stage; status: "in-progress" | "completed"; startedAt: string; completedAt?: string;
  messages: Message[]; scores?: Scores; overall?: number; summary?: string;
  strengths?: string[]; concerns?: string[]; recommendation?: string;
  recruiterStatus?: "new" | "shortlisted" | "hold" | "rejected"; recruiterNotes?: string;
  durationSeconds?: number; aiMode?: "ai" | "demo" | "fallback";
};
