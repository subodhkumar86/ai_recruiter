"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Brand from "../../../components/Brand";
import { Interview } from "../../../lib/types";
import { loadInterviews } from "../../../lib/storage";

const dimensions = ["communication", "confidence", "technical", "problemSolving", "project"] as const;
const labels: Record<typeof dimensions[number], string> = { communication: "Communication", confidence: "Confidence", technical: "Technical depth", problemSolving: "Problem solving", project: "Project clarity" };

export default function AnalyticsPage() {
  const [items, setItems] = useState<Interview[]>([]);
  useEffect(() => setItems(loadInterviews()), []);
  const completed = items.filter(x => x.status === "completed");
  const averages = useMemo(() => dimensions.map(key => ({ key, value: completed.length ? completed.reduce((sum, item) => sum + (item.scores?.[key] || 0), 0) / completed.length : 0 })), [completed]);
  const overall = completed.length ? completed.reduce((sum, x) => sum + (x.overall || 0), 0) / completed.length : 0;
  const recommended = completed.filter(x => (x.overall || 0) >= 7).length;
  return <main className="dashboard"><aside className="dashNav"><Brand /><nav><Link href="/recruiter">▦ <span>Overview</span></Link><Link href="/recruiter">♙ <span>Candidates</span></Link><Link href="/recruiter">◌ <span>Interviews</span></Link><Link className="selected" href="/recruiter/analytics">⌁ <span>Analytics</span></Link></nav><div className="dashBottom"><Link href="/interview">＋ <span>New interview</span></Link><Link href="/">← <span>Candidate site</span></Link></div></aside><section className="dashMain analytics"><header><div><span className="eyebrow">Recruiter intelligence</span><h1>Screening analytics</h1><p>Understand the quality signals across your completed interviews.</p></div><Link className="button secondary" href="/recruiter">View candidates</Link></header><div className="analyticsStats"><article><small>Completed interviews</small><b>{completed.length}</b><span>Available for review</span></article><article><small>Average overall score</small><b>{overall.toFixed(1)}<em>/10</em></b><span>Across all dimensions</span></article><article><small>Recommended</small><b>{completed.length ? Math.round(recommended / completed.length * 100) : 0}%</b><span>{recommended} candidates at 7.0+</span></article></div><section className="analyticsPanel"><div><h2>Interview quality signals</h2><p>Average score per dimension. These are recruiter-assistance signals, not automated decisions.</p></div><div className="metricList">{averages.map(({ key, value }) => <div className="analyticsMetric" key={key}><div><span>{labels[key]}</span><b>{value.toFixed(1)} <small>/10</small></b></div><i><em style={{ width: `${value * 10}%` }} /></i></div>)}</div></section><section className="insightGrid"><article><span>✦</span><div><h3>What to review next</h3><p>{completed.length ? "Open candidates with low project clarity to validate scope, ownership, and outcomes in the next conversation." : "Complete an interview to unlock team-level quality signals here."}</p></div></article><article><span>✓</span><div><h3>Data stays actionable</h3><p>Every metric links back to the underlying candidate transcript and recruiter decision.</p></div></article></section></section></main>;
}
