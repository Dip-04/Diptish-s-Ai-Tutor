# Architecture

## Product boundaries

The browser renders the preparation workspace and keeps demo progress locally. Production mutations flow through authenticated Next.js route handlers. Route handlers validate input, enforce authorization/rate limits, invoke domain services, and write through Prisma. Files use private Supabase Storage buckets. AI requests run only on the server.

## Folder map

```text
app/                 App Router pages and server route handlers
components/          Accessible product components
lib/ai/              Provider interface and server implementation
lib/schemas.ts       Shared Zod boundary schemas
lib/store.ts         Persisted demo interaction state
prisma/schema.prisma Relational production domain
supabase/             RLS policies
```

## Route map

- `/`, `/today`, `/roadmaps`: daily preparation workflow
- `/topics`, `/questions`, `/flashcards`, `/revision`: study tools
- `/mock-interview`: text mock interview
- `/resume`, `/analytics`, `/calendar`, `/settings`: supporting workflows
- `/onboarding`, `/login`, `/register`, `/forgot-password`: account setup
- `POST /api/roadmaps/generate`: validated server-side roadmap generation
- `GET /api/health`: deployment health

## Roadmap adaptation

Completed days are frozen. Regeneration receives the remaining availability, incomplete tasks, weak-topic signals and new deadline. A new roadmap version is created; historical task progress is never mutated.

## Implementation phases

1. Foundation and demonstrable preparation loop (this MVP)
2. Supabase authentication, RLS-backed persistence and uploads
3. Full adaptive roadmap engine and resource verification
4. Quizzes, flashcards, revision and question bank persistence
5. Resume confirmation, voice mock interviews and reports
6. Analytics, admin workflows, queues and production hardening
