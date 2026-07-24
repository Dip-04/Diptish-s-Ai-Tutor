# Application audit and repair report

## Problems discovered

- The original frontend rendered hardcoded profile, roadmap, task, readiness, and analytics data.
- Login and registration forms did not submit; password reset had no completion page.
- Sessions were not refreshed centrally and several private routes were not protected.
- Onboarding displayed resume, skills, and preference steps that were never persisted.
- Onboarding created a career goal but no roadmap.
- Task completion and focus time were stored only in browser state.
- Mock-interview feedback was a hardcoded heuristic.
- The roadmap API lacked authentication, user-based abuse limits, and a consistent response envelope.
- The OpenAI integration used an incomplete JSON schema and attempted to read a non-existent REST `output_text` convenience property.
- Missing OpenAI configuration silently returned demo AI output.
- Navigation exposed placeholder pages, fake counts, dead buttons, and a missing help route.
- RLS allowed users to update their own `User` row, including the authorization role.
- Vercel ran Vinext and produced `dist` while expecting `.next`.
- The seed script referenced by `package.json` did not exist.
- Generated build output was included in linting.

## Repairs

- Added Supabase SSR authentication, middleware session refresh, safe redirects, confirmation callback, reset-password completion, and server-side validation.
- Scoped every personalized Prisma query/action to the verified Supabase Auth UUID.
- Added real onboarding persistence and roadmap creation, plus recovery for existing goals.
- Added persistent task completion and focus-time actions with ownership checks.
- Replaced fake interview feedback with validated OpenAI structured output.
- Added authenticated/rate-limited roadmap API behavior and normalized responses.
- Removed unsupported placeholder routes and dead navigation controls.
- Added error, loading, not-found, and empty states.
- Removed the RLS account-update policy that enabled role escalation and reapplied policies to Supabase.
- Restored the standard Next.js/Vercel build and removed the unused Vinext beta toolchain.
- Added an idempotent role seed and complete environment documentation.

## Database changes

- Initial Prisma migration creates the relational domain and foreign keys.
- RLS is enabled on all application tables.
- User roles are server-managed; authenticated clients only read their own account row.
- The production database was verified to contain all expected tables with RLS enabled.

## Verification

Automated:

- Prisma schema validation and client generation
- ESLint
- TypeScript
- Vitest
- Next.js production build
- Live HTTP checks for public and protected routes
- Supabase table, migration, and RLS checks

Manual browser checklist:

1. Register and confirm a new email.
2. Verify return-path login and logout.
3. Complete the five-step onboarding and confirm the roadmap appears after refresh.
4. Complete/undo a task and confirm persistence after refresh.
5. Save focus time and confirm `TaskProgress.actualMinutes`.
6. Test forgot/reset password from the production callback URL.
7. Test AI success, invalid key, unavailable model, and missing configuration.
8. Verify layout at 320, 375, 768, 1024, and 1440 pixels.

## Remaining limitations

- Voice recording, resume uploads, notifications, admin tools, search, pagination, email delivery customization, and realtime sessions are not implemented and are intentionally not exposed in navigation.
- The in-app browser was unavailable during this audit, so visual breakpoint checks require the manual checklist above.
- `npm audit` reports three high-severity transitive advisories in Next.js dependencies. npm currently proposes an unsafe downgrade through `--force`; that command was not used. Track the upstream Next.js patched release and upgrade after compatibility verification.
- In-memory API rate limiting is best-effort per server instance. Production-scale abuse protection should use a shared store or platform firewall.
- The configured OpenAI credential was exercised against the live Responses API and returned a quota/billing error. The application now surfaces this error for AI evaluation and uses an explicitly labelled `starter` roadmap during onboarding; enable API billing/quota for AI-generated plans and feedback.
