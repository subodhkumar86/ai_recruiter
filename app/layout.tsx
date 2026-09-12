import type { Metadata } from "next";
import "./globals.css";
import RecruiterNavigationEnhancer from "../components/RecruiterNavigationEnhancer";
import ServerInterviewSync from "../components/ServerInterviewSync";

export const metadata: Metadata = {
  title: "ItsEasyNow AI Recruiter",
  description: "Voice-first intelligent candidate screening"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<RecruiterNavigationEnhancer /><ServerInterviewSync /></body></html>;
}
