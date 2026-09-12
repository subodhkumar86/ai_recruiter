CREATE TYPE "InterviewStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');
CREATE TYPE "RecruiterStatus" AS ENUM ('NEW', 'SHORTLISTED', 'HOLD', 'REJECTED');

CREATE TABLE "Candidate" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "mobile" TEXT NOT NULL UNIQUE,
  "targetRole" TEXT,
  "location" TEXT,
  "qualification" TEXT,
  "college" TEXT,
  "branch" TEXT,
  "graduationYear" INTEGER,
  "cgpa" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Interview" (
  "id" TEXT PRIMARY KEY,
  "candidateId" TEXT NOT NULL REFERENCES "Candidate"("id") ON DELETE CASCADE,
  "status" "InterviewStatus" NOT NULL DEFAULT 'IN_PROGRESS',
  "stage" TEXT NOT NULL,
  "consentedAt" TIMESTAMP(3),
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "durationSeconds" INTEGER,
  "aiMode" TEXT,
  "recruiterStatus" "RecruiterStatus" NOT NULL DEFAULT 'NEW',
  "recruiterNotes" TEXT
);

CREATE TABLE "Message" (
  "id" TEXT PRIMARY KEY,
  "interviewId" TEXT NOT NULL REFERENCES "Interview"("id") ON DELETE CASCADE,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Evaluation" (
  "id" TEXT PRIMARY KEY,
  "interviewId" TEXT NOT NULL UNIQUE REFERENCES "Interview"("id") ON DELETE CASCADE,
  "communication" INTEGER NOT NULL,
  "confidence" INTEGER NOT NULL,
  "technical" INTEGER NOT NULL,
  "problemSolving" INTEGER NOT NULL,
  "project" INTEGER NOT NULL,
  "overall" DOUBLE PRECISION NOT NULL,
  "summary" TEXT NOT NULL,
  "strengths" JSONB NOT NULL,
  "concerns" JSONB NOT NULL,
  "recommendation" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Interview_candidateId_idx" ON "Interview"("candidateId");
CREATE INDEX "Message_interviewId_createdAt_idx" ON "Message"("interviewId", "createdAt");
