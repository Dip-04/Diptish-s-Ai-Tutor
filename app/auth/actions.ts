"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | null;

function credentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? "")
  };
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const values = credentials(formData);
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
  redirect("/");
}

export async function register(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const values = credentials(formData);
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
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`
  });
  return error ? { error: error.message } : { message: "Password reset email sent." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
