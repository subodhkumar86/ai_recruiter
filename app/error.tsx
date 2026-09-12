"use client";
import { useEffect } from "react";
import Link from "next/link";
import Brand from "../components/Brand";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="systemPage"><Brand /><div className="systemCard"><span className="systemCode">!</span><h1>We couldn’t load this screen.</h1><p>Your interview data has not been deleted. Try again, or return home and restart the page.</p><div className="systemActions"><button className="button primary" onClick={reset}>Try again</button><Link href="/" className="button secondary">Go to home</Link></div></div></main>;
}
