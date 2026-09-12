# ItsEasyNow AI Recruitment Calling Agent

A polished, voice-first MVP that conducts structured candidate screening, asks adaptive follow-up questions, evaluates interview responses, and presents recruiter-ready insights.

## Features

- 5–10 minute guided interview across profile, education, skills, project and career stages
- Microphone permission flow with denial recovery and typed-answer fallback
- Explicit candidate consent plus validated name, email, mobile, role and location
- Browser Speech Recognition (STT) and Speech Synthesis (TTS)
- Dynamic OpenAI follow-ups when an API key is configured
- Deterministic built-in recruiter engine when no key is available
- Conversation memory, stage state machine and live transcript
- Server-side AI/fallback evaluation across five hiring dimensions
- Interview timer, voice mute, repeat-question control and answer length guidance
- Responsive recruiter dashboard with search, filters and score-ranked candidates
- Recruiter decisions (new, shortlisted, hold, rejected) and private notes
- CSV candidate export and plain-text transcript downloads
- Interview deletion and human-in-the-loop messaging
- Local persistence for a zero-setup demo
- Production-ready PostgreSQL/Prisma schema blueprint
- Robust voice, browser and network error states

## Quick start

Requirements: Node.js 18.17 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Chrome or Edge is recommended for live speech recognition. Typed answers work in every modern browser.

## AI mode

The application works immediately in Demo Mode. For real LLM-generated follow-up questions, add this to `.env.local`:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

Never commit `.env.local` or expose the key through a `NEXT_PUBLIC_` variable. AI requests are proxied through the server-side route.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Product landing page |
| `/interview` | Permissions, voice interview and completion flow |
| `/recruiter` | Candidate list, metrics, reports and transcripts |
| `/api/interview` | Secure adaptive-question endpoint |
| `/api/evaluate` | Structured evidence-based evaluation endpoint |

## Architecture

The interview uses a controlled state machine for reliability and an LLM within each stage for natural adaptation:

```text
Profile → Education → Skills (2 turns) → Project (2 turns) → Career → Evaluation
```

The browser handles microphone capture and voice playback. Answers plus recent history are sent to the server route. With an OpenAI key, the route produces a context-aware question; otherwise it uses the bundled recruiter engine. At completion, a separate server endpoint generates the structured evaluation and the browser persists the report.

```text
app/                 Next.js pages and API route
components/          Shared product branding
lib/types.ts         Domain types
lib/storage.ts       Demo persistence adapter
prisma/schema.prisma Production PostgreSQL data model
```

See `PROJECT_DOCUMENTATION.md` for detailed product decisions, data flow, API contracts, testing checklist and production roadmap.

This adapter boundary makes it straightforward to replace local persistence with Prisma without changing the interview interface.

## Production database

The included Prisma schema models `Candidate`, `Interview`, `Message`, and `Evaluation`. To enable it in a production extension:

1. Install `prisma` and `@prisma/client`.
2. Set `DATABASE_URL` to a PostgreSQL connection string.
3. Run `npx prisma migrate dev --name init`.
4. Implement a repository adapter using Prisma and authenticated recruiter API routes.

Local storage is intentionally used for this challenge build so reviewers can run the complete flow without creating infrastructure accounts.

## Evaluation strategy

The MVP records communication, confidence, technical depth, problem solving and project clarity on a 10-point scale. It generates an overall score, strengths, review points, summary, and next-round recommendation. In production, evaluation should be performed server-side using a strict JSON schema, rubric calibration, audit logs, human review and bias monitoring.

## External technology acknowledgements

- Next.js and React: application framework and UI
- Web Speech API: browser STT and TTS
- OpenAI Chat Completions API: optional dynamic follow-ups
- Prisma schema syntax: production data-model blueprint
- Google Fonts: DM Sans and Manrope, with system fallback

## Deployment

### Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add `OPENAI_API_KEY` and optionally `OPENAI_MODEL` under Environment Variables.
4. Deploy.

The local demo persistence is browser-specific. Connect the included Prisma schema for shared, multi-recruiter production data.

## Security and responsible AI

- API keys remain server-side.
- The UI clearly identifies Nova as an AI recruiter.
- Candidate-facing screens do not expose confidential recommendations.
- The recommendation supports—not replaces—human hiring decisions.
- Production deployments should add recruiter authentication, consent records, encryption, retention rules, rate limiting and deletion workflows.

## Demo walkthrough (3–5 minutes)

1. Show the landing page and explain the value proposition.
2. Start an interview and grant microphone access.
3. Answer the five stages; demonstrate one dynamic technical follow-up.
4. Complete the interview and open the recruiter dashboard.
5. Open the candidate report and show scores, recommendation and transcript.

## Sample transcript

See `SAMPLE_TRANSCRIPT.md` for a ready-to-use submission example.
