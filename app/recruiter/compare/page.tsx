"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Brand from "../../../components/Brand";
import { Interview } from "../../../lib/types";
import { loadInterviews } from "../../../lib/storage";

const dimensions = ["communication", "confidence", "technical", "problemSolving", "project"] as const;
const names = { communication: "Communication", confidence: "Confidence", technical: "Technical", problemSolving: "Problem solving", project: "Project clarity" };

export default function ComparePage() {
  const [items, setItems] = useState<Interview[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => { const records = loadInterviews().filter(item => item.status === "completed"); setItems(records); setSelected(records.slice(0, 2).map(item => item.id)); }, []);
  const compared = useMemo(() => items.filter(item => selected.includes(item.id)).slice(0, 3), [items, selected]);
  const toggle = (id: string) => setSelected(value => value.includes(id) ? value.filter(item => item !== id) : value.length < 3 ? [...value, id] : value);
  return <main className="dashboard"><aside className="dashNav"><Brand /><nav><Link href="/recruiter">▦ <span>Overview</span></Link><Link href="/recruiter/analytics">⌁ <span>Analytics</span></Link><Link href="/recruiter/jobs">＋ <span>Job requisitions</span></Link><Link href="/recruiter/playbook">▤ <span>Interview playbook</span></Link><Link className="selected" href="/recruiter/compare">⇄ <span>Compare candidates</span></Link></nav><div className="dashBottom"><Link href="/interview">＋ <span>New interview</span></Link><Link href="/">← <span>Candidate site</span></Link></div></aside><section className="dashMain comparePage"><header><div><span className="eyebrow">Recruiter decision support</span><h1>Compare candidates</h1><p>Select up to three completed interviews and compare the evidence behind each score.</p></div><Link href="/recruiter" className="button secondary">Back to pipeline</Link></header><section className="comparePicker"><div><h2>Select candidates</h2><p>{selected.length}/3 selected</p></div><div className="candidateChips">{items.map(item => <button key={item.id} className={selected.includes(item.id) ? "active" : ""} onClick={() => toggle(item.id)}><span>{item.candidate.name.split(" ").map(part => part[0]).slice(0, 2).join("")}</span>{item.candidate.name}</button>)}</div></section>{compared.length ? <section className="comparison"><div className="compareLabels"><span>Score dimension</span>{compared.map(item => <div key={item.id}><b>{item.candidate.name}</b><small>{item.candidate.role || "Candidate"}</small><em>{item.overall?.toFixed(1) || "—"}/10</em></div>)}</div>{dimensions.map(key => <div className="compareRow" key={key}><b>{names[key]}</b>{compared.map(item => { const value = item.scores?.[key] || 0; return <div key={item.id}><i><em style={{ width: `${value * 10}%` }} /></i><span>{value}/10</span></div>; })}</div>)}<div className="compareRecommendation"><b>Recruiter review reminder</b><p>Use these scores to guide your review, then open the transcript and record a human decision in the candidate report.</p></div></section> : <section className="compareEmpty"><span>⇄</span><h2>Choose completed interviews to compare</h2><p>Candidate comparison becomes available after interviews are completed.</p><Link className="button primary" href="/interview">Start an interview →</Link></section>}</section></main>;
}
