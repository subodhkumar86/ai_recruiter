# Local PostgreSQL Setup

This project includes a self-contained PostgreSQL 16 service for production-style development.

## Start the database

Install Docker Desktop, then run:

```bash
docker compose up -d
```

The database runs locally at `localhost:5432` using the values already present in `.env`:

```env
DATABASE_URL=postgresql://postgres:subodh%40123@localhost:5432/ai_recruiter
```

## Enable Prisma persistence

Install the Prisma packages and create the database schema:

```bash
npm install prisma @prisma/client
npx prisma migrate dev --name init
```

Open Prisma Studio with:

```bash
npx prisma studio
```

## Important

The challenge demo currently keeps interview records in browser storage so reviewers can run it without Docker. The supplied Docker service and Prisma schema are the upgrade path for shared, durable recruiter data.
