import Link from "next/link";

export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="ItsEasyNow home">
      <span className="brandMark">IE</span>
      <span><b>ItsEasyNow</b><small>AI Recruiter</small></span>
    </Link>
  );
}
