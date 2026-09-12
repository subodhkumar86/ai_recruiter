"use client";

import Link from "next/link";
import { useState } from "react";
import Brand from "../../../components/Brand";

const templates = [
  { stage: "Technical depth", question: "Which language or framework do you use most confidently, and where have you used it in a real project?", tip: "Listen for concrete choices, trade-offs, and the candidate’s personal contribution." },
  { stage: "Project ownership", question: "Tell me about a project you are proud of. What problem did it solve, what was your role, and what result did you achieve?", tip: "Ask a follow-up when ownership, scale, or outcomes are vague." },
  { stage: "Problem solving", question: "Describe a technical challenge you faced recently. How did you investigate it and what did you change?", tip: "Look for a structured diagnostic process instead of only the final answer." },
  { stage: "Motivation & availability", question: "Why does this opportunity interest you, and when would you be available to join?", tip: "Keep this practical and role-specific; avoid personal or protected-trait questions." },
];

export default function PlaybookPage() {
  const [open, setOpen] = useState(0);
  const [copied, setCopied] = useState("");
  const copy = async (text: string) => { try { await navigator.clipboard.writeText(text); setCopied(text); setTimeout(() => setCopied(""), 1500); } catch { setCopied("Clipboard unavailable"); setTimeout(() => setCopied(""), 1500); } };
  return <main className="dashboard"><aside className="dashNav"><Brand /><nav><Link href="/recruiter">▦ <span>Overview</span></Link><Link href="/recruiter/analytics">⌁ <span>Analytics</span></Link><Link href="/recruiter/jobs">＋ <span>Job requisitions</span></Link><Link className="selected" href="/recruiter/playbook">▤ <span>Interview playbook</span></Link></nav><div className="dashBottom"><Link href="/interview">＋ <span>New interview</span></Link><Link href="/">← <span>Candidate site</span></Link></div></aside><section className="dashMain playbookPage"><header><div><span className="eyebrow">Consistent screening</span><h1>Interview playbook</h1><p>Use a shared rubric so every candidate gets a fair, focused first conversation.</p></div><Link href="/recruiter/jobs" className="button secondary">Manage roles</Link></header><section className="rubricCards"><article><span>1</span><div><b>Use evidence</b><p>Score only what the candidate explains in their interview and transcript.</p></div></article><article><span>2</span><div><b>Probe thoughtfully</b><p>Ask one specific follow-up when an important claim needs context.</p></div></article><article><span>3</span><div><b>Keep decisions human</b><p>Use Nova’s report as a guide, then record your own hiring decision.</p></div></article></section><section className="templatePanel"><div className="templateHead"><div><h2>Question templates</h2><p>These question patterns are also reflected in Nova’s interview stages.</p></div><span>{templates.length} templates</span></div><div className="templateList">{templates.map((template, index) => <article key={template.stage} className={open === index ? "open" : ""}><button className="templateToggle" onClick={() => setOpen(open === index ? -1 : index)}><span>{String(index + 1).padStart(2, "0")}</span><b>{template.stage}</b><i>{open === index ? "−" : "+"}</i></button>{open === index && <div className="templateContent"><p>“{template.question}”</p><small><b>Recruiter cue:</b> {template.tip}</small><button onClick={() => copy(template.question)}>{copied === template.question ? "Copied" : "Copy question"}</button></div>}</article>)}</div></section></section></main>;
}
