import Link from "next/link";
import Brand from "../../../components/Brand";

const checklist = [
  ["A quiet place", "Use headphones or sit somewhere with minimal background noise. You can always type an answer instead."],
  ["Your best project", "Choose one project where you can explain the problem, your own contribution, technical choices, and outcome."],
  ["Specific examples", "Use concrete tools, decisions, challenges, and results instead of listing skills without context."],
  ["Your availability", "Keep your preferred location, expected stipend, and likely joining date ready for the final stage."],
];

export default function PreparePage() {
  return <main className="preparePage"><nav className="nav shell"><Brand /><Link href="/" className="navLink">Back to home</Link></nav><section className="prepareHero shell"><div><span className="eyebrow"><i /> Candidate preparation</span><h1>Feel prepared before you meet <em>Nova.</em></h1><p>This is a conversational first-round screening, not a timed test. Nova will ask about your background, skills, project experience, and career goals.</p><div className="prepareStats"><span><b>5</b> guided stages</span><span><b>5–10</b> minutes</span><span><b>Voice</b> or typed answers</span></div><Link href="/interview" className="button primary">I’m ready to start →</Link></div><aside className="prepareCard"><span className="live"><i /> BEFORE YOU BEGIN</span><h2>What Nova will ask</h2><ol><li>Introduction and role interest</li><li>Education and learning background</li><li>Technical skills and tools</li><li>One project in depth</li><li>Goals and availability</li></ol><div><b>Good to know</b><p>There is no need to be perfect. Clear, honest examples help recruiters understand your experience.</p></div></aside></section><section className="prepareChecklist shell"><div><span className="eyebrow">Quick checklist</span><h2>A few minutes of preparation makes the conversation smoother.</h2></div><div className="checklistGrid">{checklist.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section><section className="prepareFooter shell"><span>Nova is an AI recruitment assistant. Final recruitment decisions are always made by people.</span><Link href="/privacy">Privacy & responsible AI →</Link></section></main>;
}
