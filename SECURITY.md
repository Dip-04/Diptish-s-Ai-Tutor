# Security

## Implemented

- OpenAI credentials are read only by server code.
- API input and model output are validated with strict Zod schemas.
- Security headers include CSP, frame denial, MIME sniffing prevention, referrer policy and restrictive browser permissions.
- AI failures do not overwrite an existing roadmap.
- The model is instructed never to invent resume facts.
- No user-submitted code executes on the application server.
- The demo stores only preparation progress in local storage.

## Production controls

Before accepting real users, enable Supabase Auth middleware, the included RLS policies, per-user rate limiting, CSRF/origin checks on cookie-authenticated mutations, audit logs, private storage buckets and malware scanning. Resume uploads must be limited to PDF, DOCX and TXT, checked by signature and capped at 5 MB. Extracted text is untrusted data and must not be interpolated into system instructions.

Secrets belong in the deployment secret store. Never commit `.env.local`. Log structured error codes—not tokens, resume content or raw voice.

Report security issues privately to the project owner; do not open public issues containing exploit details or personal data.
