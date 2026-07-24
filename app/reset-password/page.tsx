"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updatePassword, type AuthState } from "@/app/auth/actions";

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(updatePassword, null);
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy"><h1>Choose a new password</h1><p>Use at least eight characters.</p></div>
        <form action={action}>
          <label>New password<input name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required/></label>
          <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required/></label>
          {state?.error && <p role="alert">{state.error}</p>}
          {state?.message && <p role="status">{state.message} <Link href="/">Continue</Link></p>}
          <button className="primary-button" disabled={pending}>{pending ? "Updating…" : "Update password"}</button>
        </form>
      </section>
    </main>
  );
}
