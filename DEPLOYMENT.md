# Deployment

## Environment

Copy `.env.example` to `.env` and configure PostgreSQL/Supabase. Keep service role and OpenAI keys server-only. See `DATABASE.md` for the connection and migration workflow.

## Build

```bash
npm ci
npm run typecheck
npm run test
npm run build
```

Run `npm run db:deploy` as a separate release step, then deploy the immutable application build. Verify `/api/health`, authentication, RLS isolation and one demo roadmap request after deployment.

## Vercel

Use the **Next.js** framework preset, keep the build command as `npm run build`, and leave the output directory blank so Vercel uses Next.js's `.next` directory. Add all values from `.env.example` in Project Settings → Environment Variables; never upload the local `.env` file.
