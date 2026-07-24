import Link from "next/link";

export default function NotFound() {
  return <main className="auth-shell"><section className="auth-card"><h1>Page not found</h1><p>This feature is not available.</p><Link className="primary-button" href="/">Return to dashboard</Link></section></main>;
}
