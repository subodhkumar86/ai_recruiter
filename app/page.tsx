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
      <section className="productProof shell" aria-label="Product highlights">
        <article><span>01</span><div><b>5 focused stages</b><small>From background to availability</small></div></article>
        <article><span>↗</span><div><b>Adaptive questions</b><small>Follow-ups respond to evidence</small></div></article>
        <article><span>✓</span><div><b>Human-led decision</b><small>AI supports, recruiters decide</small></div></article>
      </section>
      <section className="journey shell">
        <div className="journeyIntro"><span className="eyebrow"><i /> A better first round</span><h2>Everything a recruiter needs, without making candidates feel screened by a form.</h2><p>Nova keeps the conversation structured in the background, then turns the response into clear, reviewable hiring evidence.</p><Link href="/how-it-works" className="journeyLink">Explore the interview flow →</Link></div>
        <div className="journeySteps"><article><span>1</span><div><b>Candidate-ready</b><p>Consent, microphone checks and a typed-response fallback set clear expectations.</p></div></article><article><span>2</span><div><b>Conversational depth</b><p>Technical and project questions include contextual follow-ups when details matter.</p></div></article><article><span>3</span><div><b>Recruiter clarity</b><p>Transcript, evidence, scores and next-step recommendation arrive in one report.</p></div></article></div>
      </section>
      <section className="benefits shell">
        {benefits.map(([title,text],i)=><article key={title}><span className="featureIcon">{["◌","⌁","✦"][i]}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
      </section>
      <footer className="homeFooter shell"><span>© 2026 ItsEasyNow Technologies</span><span>Designed for fair, human-centered hiring</span></footer>
    </main>
  );
}
