"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Brand from "../../../components/Brand";

type Job = { id: string; title: string; department: string; location: string; openings: number; createdAt: string };
const key = "itseasynow-jobs-v1";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("Remote / India");
  const [openings, setOpenings] = useState(1);
  const [copied, setCopied] = useState("");
  useEffect(() => { try { setJobs(JSON.parse(localStorage.getItem(key) || "[]")); } catch { setJobs([]); } }, []);
  const persist = (next: Job[]) => { setJobs(next); localStorage.setItem(key, JSON.stringify(next)); };
  const submit = (event: FormEvent) => { event.preventDefault(); if (!title.trim()) return; persist([{ id: crypto.randomUUID(), title: title.trim(), department, location, openings, createdAt: new Date().toISOString() }, ...jobs]); setTitle(""); };
  const copy = async (job: Job) => { try { await navigator.clipboard.writeText(`${window.location.origin}/interview?job=${encodeURIComponent(job.id)}`); setCopied(job.id); setTimeout(() => setCopied(""), 1800); } catch { setCopied("Clipboard unavailable"); setTimeout(() => setCopied(""), 1800); } };
  return <main className="dashboard"><aside className="dashNav"><Brand /><nav><Link href="/recruiter">▦ <span>Overview</span></Link><Link href="/recruiter/analytics">⌁ <span>Analytics</span></Link><Link className="selected" href="/recruiter/jobs">＋ <span>Job requisitions</span></Link></nav><div className="dashBottom"><Link href="/interview">＋ <span>New interview</span></Link><Link href="/">← <span>Candidate site</span></Link></div></aside><section className="dashMain jobsPage"><header><div><span className="eyebrow">Recruiter workspace</span><h1>Job requisitions</h1><p>Create a role, then share a dedicated interview link with candidates.</p></div><Link href="/recruiter" className="button secondary">View pipeline</Link></header><div className="jobsGrid"><form className="jobForm" onSubmit={submit}><h2>Create a new role</h2><p>Each role gets an interview link you can send to candidates.</p><label><span>Job title</span><input value={title} onChange={event => setTitle(event.target.value)} placeholder="Frontend Developer Intern" required /></label><div className="jobFormRow"><label><span>Department</span><input value={department} onChange={event => setDepartment(event.target.value)} /></label><label><span>Openings</span><input min={1} max={99} type="number" value={openings} onChange={event => setOpenings(Number(event.target.value))} /></label></div><label><span>Location</span><input value={location} onChange={event => setLocation(event.target.value)} /></label><button className="button primary" type="submit">Create requisition →</button></form><section className="jobList"><div className="jobListHead"><div><h2>Active roles</h2><p>{jobs.length} requisition{jobs.length === 1 ? "" : "s"} created</p></div><Link href="/interview" className="textCta">Open generic interview →</Link></div>{jobs.length ? jobs.map(job => <article className="jobCard" key={job.id}><div className="jobIcon">{job.title.slice(0, 1).toUpperCase()}</div><div className="jobInfo"><b>{job.title}</b><span>{job.department} · {job.location} · {job.openings} opening{job.openings === 1 ? "" : "s"}</span></div><button onClick={() => copy(job)}>{copied === job.id ? "Copied" : "Copy invite link"}</button></article>) : <div className="jobsEmpty"><span>＋</span><b>No roles yet</b><p>Create your first requisition to generate a candidate interview link.</p></div>}</section></div></section></main>;
}
