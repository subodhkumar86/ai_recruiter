# Product & Engineering Documentation

## Problem and product response

Manual first-round screening consumes recruiter time and varies between interviewers. This MVP standardizes the interview stages while keeping questions conversational. It converts the interview into a transcript, a transparent multi-factor assessment and a recruiter-controlled decision workflow.

The AI never makes the final hiring decision. The recruiter can review evidence, add private notes, change the pipeline status, download records and remove data.

## End-to-end flow

1. Candidate reads the interview purpose and grants or declines microphone access.
2. Candidate explicitly consents to AI-assisted screening.
3. Name, email, mobile, role and location are validated.
4. Nova introduces herself using TTS.
5. The state machine collects profile, education, technical, project and career information.
6. Technical and project stages include an extra follow-up turn.
7. Recent conversation context is sent to the secure question endpoint.
8. A separate evaluation endpoint returns structured scores and recruiter insights.
9. The candidate sees a neutral completion screen, not confidential scores.
10. The recruiter reviews, filters, exports, annotates and updates candidate status.

## State machine

```text
permission → consent → verified profile
                         ↓
profile → education → technical → project → career → evaluation → completed
                         ↳ follow-up  ↳ follow-up
```

Stage control is deterministic so the interview cannot become endless. Question wording inside a stage can be dynamic.

## API contracts

### `POST /api/interview`

Request:

```json
{
  "nextStage": "technical",
  "stageTurn": 1,
  "candidate": { "name": "Subodh Kumar", "role": "Frontend Intern" },
  "messages": [{ "role": "user", "content": "I use React and Node.js." }]
}
```

Response:

```json
{
  "question": "How did you manage shared state in your most recent React project?",
  "mode": "ai"
}
```

`mode` can be `ai`, `demo`, or `fallback`.

### `POST /api/evaluate`

Returns `scores`, `overall`, `summary`, `strengths`, `concerns`, `recommendation`, and `aiMode`. OpenAI mode requests JSON-only output; a deterministic evidence-based evaluator handles missing keys or service failure.

## Data model

- Candidate: identity and target role
- Interview: stage, status and timestamps
- Message: role, content and timestamp
- Evaluation: five scores, overall score, summary and recommendation
- Recruiter workflow: status and private notes

The normalized PostgreSQL blueprint is in `prisma/schema.prisma`. The challenge demo uses a storage adapter backed by browser storage so it runs without accounts or infrastructure.

## AI choices

- Low-temperature evaluation improves consistency.
- Only recent messages are included in follow-up generation to control token usage.
- Prompts explicitly require one question, prohibit repetition and prevent scoring aloud.
- Evaluation is separated from questioning to keep responsibilities clear.
- Fallback paths ensure the interview can finish during API downtime.

## Error handling

- Denied microphone: retry plus typed fallback
- Unsupported speech recognition: typed fallback
- Unclear speech: actionable retry message
- Question API failure: retain the answer and allow retry
- Evaluation API failure: conservative fallback result and manual review flag
- Empty/invalid profile fields: inline validation
- Empty search result: dedicated dashboard state

## Manual QA checklist

- [ ] Landing page links open correctly
- [ ] Microphone allow and denial states work
- [ ] Consent is required
- [ ] Invalid email and mobile are rejected
- [ ] All five interview stages advance correctly
- [ ] Technical and project follow-ups appear
- [ ] Typed and voice responses work
- [ ] Mute and repeat-question controls work
- [ ] Completion creates a dashboard row
- [ ] Scores and transcript appear in the report
- [ ] Search and every status filter work
- [ ] Recruiter status and notes persist after refresh
- [ ] CSV and transcript downloads work
- [ ] Interview delete requires confirmation
- [ ] Mobile layouts do not overflow horizontally
- [ ] `npm run build` succeeds

## Production roadmap

1. Add recruiter authentication and role-based authorization.
2. Replace the browser adapter with the included Prisma/PostgreSQL repository.
3. Add resumable server-side interview sessions.
4. Replace browser STT/TTS with streaming providers where browser coverage matters.
5. Add signed consent records, retention settings and candidate deletion requests.
6. Add calibrated rubrics, prompt/version audit trails and bias monitoring.
7. Add rate limiting, structured logs, observability and background retries.
8. Add tests using Vitest, Playwright and mocked AI responses.

## Known MVP boundaries

Demo data is device/browser-specific. Speech Recognition support is strongest in Chromium browsers. Scores are decision support and must be reviewed by a human. Production use requires the security, privacy and persistence work listed above.
