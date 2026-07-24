# Threat model

Primary assets are account sessions, resume documents, confirmed experience facts, progress data and provider credentials.

Key threats and controls:

- Credential theft: server-only secrets, secure `httpOnly`, `secure`, `sameSite=lax` session cookies.
- Cross-tenant access: PostgreSQL RLS plus application authorization checks.
- Prompt injection in resumes: parse as untrusted content, isolate from system instructions, validate structured output.
- Malicious uploads: type/signature/size validation, private buckets and malware scanning.
- AI cost abuse: authenticated quotas, rate limits, timeouts and usage audit.
- Stored XSS: render plain text by default and sanitize any Markdown.
- History tampering: immutable completed roadmap days and append-only audit events.
