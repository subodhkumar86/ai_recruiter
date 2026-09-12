import Link from "next/link";
import Brand from "../components/Brand";

export default function NotFound() {
  return <main className="systemPage"><Brand /><div className="systemCard"><span className="systemCode">404</span><h1>That page isn’t here.</h1><p>The link may be outdated, or the page may have moved. Return to the interview home and continue from there.</p><Link href="/" className="button primary">Go to home →</Link></div></main>;
}
