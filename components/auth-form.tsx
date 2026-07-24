"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { forgotPassword, login, register, type AuthState } from "@/app/auth/actions";

export function AuthForm({ mode, nextPath = "/" }: { mode: "login" | "register" | "forgot"; nextPath?: string }) {
  const [visible, setVisible] = useState(false);
  const action = mode === "login" ? login : mode === "register" ? register : forgotPassword;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, null);
  const titles = {
    login: ["Welcome back", "Continue your preparation where you left off."],
    register: ["Build your interview plan", "Start with a focused roadmap shaped around your goal."],
    forgot: ["Reset your password", "We’ll send a secure reset link to your email."]
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link href="/" className="logo"><span className="logo-mark"><Sparkles size={18}/></span><span>Diptish<span>AI</span></span></Link>
        <div className="auth-copy"><h1>{titles[mode][0]}</h1><p>{titles[mode][1]}</p></div>
        <form action={formAction}>
          {mode === "login" && <input type="hidden" name="next" value={nextPath}/>}
          {mode === "register" && <label>Full name<input name="fullName" type="text" autoComplete="name" placeholder="Your name" required/></label>}
          <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required/></label>
          {mode !== "forgot" && (
            <label>Password
              <div className="password-field">
                <input name="password" type={visible ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="••••••••" minLength={8} required/>
                <button type="button" aria-label="Toggle password visibility" onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17}/> : <Eye size={17}/>}</button>
              </div>
            </label>
          )}
          {mode === "register" && <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required/></label>}
          {state?.error && <p role="alert">{state.error}</p>}
          {state?.message && <p role="status">{state.message}</p>}
          <button className="primary-button" type="submit" disabled={pending}>
            {pending ? "Please wait…" : mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}
            <ArrowRight size={15}/>
          </button>
        </form>
        <p className="auth-switch">{mode === "login" ? <>New to DiptishAI? <Link href="/register">Create an account</Link></> : <>Already have an account? <Link href="/login">Sign in</Link></>}</p>
        <small className="auth-note">Authentication is secured by Supabase.</small>
      </section>
    </main>
  );
}
