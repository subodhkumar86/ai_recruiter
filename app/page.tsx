import Link from "next/link";
import Brand from "../components/Brand";

const benefits = [
  ["Natural conversations", "Adaptive follow-up questions based on every candidate answer."],
  ["Structured evaluation", "Consistent scores for communication, confidence and technical depth."],
  ["Recruiter-ready insights", "Instant transcripts, strengths, risks and clear recommendations."]
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell"><Brand /><div className="homeNavLinks"><Link href="/how-it-works">How it works</Link><Link href="/privacy">Privacy</Link><Link href="/recruiter" className="navLink">Recruiter dashboard</Link></div></nav>
      <section className="hero shell">
        <div className="heroCopy">
          <span className="eyebrow"><i /> AI-powered candidate screening</span>
          <h1>Great hiring starts with a <em>better conversation.</em></h1>
          <p>Meet Nova, your intelligent recruitment assistant. She conducts thoughtful voice interviews, asks relevant follow-ups and turns conversations into clear hiring signals.</p>
          <div className="heroActions">
            <Link href="/interview" className="button primary">Start your interview <span>→</span></Link>
            <span className="duration">◷ Takes 5–10 minutes</span>
          </div>
          <div className="trust"><span>✓ No account needed</span><span>✓ Private & secure</span><span>✓ Voice enabled</span></div>
        </div>
        <div className="heroVisual">
          <div className="glow" />
          <div className="agentCard">
            <div className="live"><i /> LIVE INTERVIEW</div>
            <div className="avatar">N<span className="online" /></div>
            <h3>Nova</h3><p>AI Recruitment Specialist</p>
            <div className="wave">{Array.from({length: 24}).map((_,i)=><i key={i} style={{height:`${12 + ((i*13)%34)}px`}} />)}</div>
            <span className="speaking">Speaking...</span>
            <blockquote>“Tell me about a project where you solved a difficult technical problem.”</blockquote>
          </div>
          <div className="floatCard score"><b>8.4</b><span>Candidate score</span></div>
          <div className="floatCard insight"><span>✦</span><div><b>Insight ready</b><small>Strong technical depth</small></div></div>
        </div>
      </section>
      <section className="benefits shell">
        {benefits.map(([title,text],i)=><article key={title}><span className="featureIcon">{["◌","⌁","✦"][i]}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
      </section>
      <footer className="homeFooter shell"><span>© 2026 ItsEasyNow Technologies</span><span>Designed for fair, human-centered hiring</span></footer>
    </main>
  );
}
