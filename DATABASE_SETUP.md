# Local PostgreSQL Setup

This project includes a self-contained PostgreSQL 16 service for production-style development.

## Start the database

Install Docker Desktop, then run:

```bash
docker compose up -d
```

The database runs locally at `127.0.0.1:5433` (the host port avoids clashes with an existing PostgreSQL installation). Set a strong password in `.env` before starting Docker:

```env
POSTGRES_PASSWORD=replace_with_a_strong_local_password
DATABASE_URL=postgresql://postgres:replace_with_a_strong_local_password@127.0.0.1:5433/ai_recruiter
```

## Enable Prisma persistence

Generate Prisma Client and apply the included migration:

```bash
npx prisma generate
npx prisma migrate deploy
```

Open Prisma Studio with:

```bash
npx prisma studio
```

## Important

The challenge demo always keeps a browser copy so reviewers can run it without Docker. When `DATABASE_URL` is configured, completed interviews are also persisted through `/api/interviews` for shared, durable recruiter data.

For Vercel, use a hosted PostgreSQL provider and set its connection string as `DATABASE_URL` in Vercel. A local Docker database cannot be accessed by a Vercel deployment.
