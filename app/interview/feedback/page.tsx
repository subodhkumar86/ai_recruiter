"use client";

import Link from "next/link";
import { useState } from "react";
import Brand from "../../../components/Brand";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const submit = () => { if (!rating) return; let existing: unknown[] = []; try { existing = JSON.parse(localStorage.getItem("itseasynow-candidate-feedback") || "[]"); } catch { existing = []; } localStorage.setItem("itseasynow-candidate-feedback", JSON.stringify([{ rating, note: note.trim(), createdAt: new Date().toISOString() }, ...existing])); setSent(true); };
  return <main className="feedbackPage"><nav className="nav shell"><Brand /><Link href="/" className="navLink">Home</Link></nav><section className="feedbackCard">{sent ? <><span className="feedbackSuccess">✓</span><span className="eyebrow">Feedback received</span><h1>Thank you for helping us improve.</h1><p>Your feedback is separate from the recruiter’s interview assessment and is used only to improve the candidate experience.</p><Link href="/" className="button primary">Return home →</Link></> : <><span className="eyebrow"><i /> Candidate experience</span><h1>How was your interview with Nova?</h1><p>Your feedback helps ItsEasyNow make screening more clear, respectful, and useful for future candidates.</p><div className="ratingButtons" aria-label="Rate your interview"><span>Not helpful</span><div>{[1, 2, 3, 4, 5].map(value => <button key={value} aria-label={`${value} star${value > 1 ? "s" : ""}`} className={value <= rating ? "selected" : ""} onClick={() => setRating(value)}>★</button>)}</div><span>Excellent</span></div><label><span>Anything you’d like us to improve? <small>Optional</small></span><textarea value={note} onChange={event => setNote(event.target.value)} maxLength={500} placeholder="For example: the questions were clear, I needed more time, or voice input worked well..." /><b>{note.length}/500</b></label><button className="button primary" onClick={submit} disabled={!rating}>Send feedback →</button><small className="feedbackNote">Your response does not change your interview score or hiring outcome.</small></>}</section></main>;
}
