"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="auth-shell"><section className="auth-card"><h1>Something went wrong</h1><p>The request could not be completed. Your saved data was not changed.</p><button className="primary-button" onClick={reset}>Try again</button></section></main>;
}
