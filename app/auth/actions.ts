"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export type AuthState = { error?: string; message?: string } | null;

function credentials(formData: FormData) {
  return z.object({
    email: z.string().trim().email().max(254),
    password: z.string().min(8).max(128)
  }).safeParse({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? "")
  });
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const parsed = credentials(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid credentials" };
  const values = parsed.data;
  const { data, error } = await supabase.auth.signInWithPassword(values);
  if (error) return { error: error.message };
  if (data.user) {
    const fullName = String(data.user.user_metadata.full_name ?? values.email.split("@")[0]);
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: { email: values.email },
      create: {
        id: data.user.id,
        email: values.email,
        profile: { create: { fullName } }
      }
    });
  }
  const next = String(formData.get("next") ?? "/");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
}

export async function register(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const parsed = credentials(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid registration" };
  const values = parsed.data;
  if (values.password !== String(formData.get("confirmPassword") ?? "")) return { error: "Passwords do not match." };
  const { data, error } = await supabase.auth.signUp({
    ...values,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`
    }
  });
  if (error) return { error: error.message };

  if (data.user) {
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: { email: values.email },
      create: {
        id: data.user.id,
        email: values.email,
        profile: { create: { fullName: fullName || values.email.split("@")[0] } }
      }
    });
  }

  if (data.session) redirect("/onboarding");
  return { message: "Check your email to confirm your account, then sign in." };
}

export async function forgotPassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = z.string().trim().email().max(254).safeParse(formData.get("email"));
  if (!parsed.success) return { error: "Enter a valid email address." };
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/reset-password`
  });
  return error ? { error: error.message } : { message: "Password reset email sent." };
}

export async function updatePassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8 || password.length > 128) return { error: "Password must be between 8 and 128 characters." };
  if (password !== String(formData.get("confirmPassword") ?? "")) return { error: "Passwords do not match." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { message: "Password updated. You can now continue to your dashboard." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
