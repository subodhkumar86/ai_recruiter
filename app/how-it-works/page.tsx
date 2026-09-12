import Link from "next/link";
import Brand from "../../components/Brand";

const steps = [
  ["01", "Invite a candidate", "Share a private interview link. Candidates can complete the screening with voice or typed answers—no account required."],
  ["02", "Nova leads the conversation", "The AI introduces itself, checks consent, asks structured questions, and uses follow-ups to explore relevant experience."],
  ["03", "Review evidence, not guesses", "Get a transcript, score breakdown, strengths, review points, and a recruiter-controlled next-step recommendation."],
];

export default function HowItWorksPage() {
  return <main className="marketingPage">
    <nav className="nav shell"><Brand /><div className="marketingLinks"><Link href="/">Home</Link><Link href="/recruiter">Recruiter workspace</Link><Link href="/interview" className="smallCta">Start interview</Link></div></nav>
    <section className="processHero shell"><span className="eyebrow"><i /> Designed around recruiter decisions</span><h1>A consistent first conversation for <em>every candidate.</em></h1><p>ItsEasyNow turns early-stage screening into an approachable, evidence-led workflow—without replacing recruiter judgment.</p></section>
    <section className="processSteps shell">{steps.map(([number,title,copy]) => <article key={number}><span>{number}</span><div><h2>{title}</h2><p>{copy}</p></div></article>)}</section>
    <section className="principles shell"><div><span className="eyebrow">Built responsibly</span><h2>Human decisions stay human.</h2><p>Nova is clear that it is an AI assistant. Candidates provide consent before the interview, and final hiring decisions always remain with your team.</p><Link className="textCta" href="/privacy">Read privacy & responsible AI →</Link></div><div className="principleCards"><article><b>Voice optional</b><span>Typed responses are always available.</span></article><article><b>Structured, not rigid</b><span>Stage controls keep interviews useful while prompts adapt to the candidate.</span></article><article><b>Recruiter controlled</b><span>Shortlist, hold, reject, add notes, and audit the underlying transcript.</span></article></div></section>
    <section className="marketingFooter shell"><div><h2>Ready to see a better screening flow?</h2><p>Run the complete demo in a few minutes.</p></div><Link className="button primary" href="/interview">Start the interview →</Link></section>
  </main>;
}
