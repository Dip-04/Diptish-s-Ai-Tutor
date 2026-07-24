"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { navItems } from "@/lib/data";
import { logout } from "@/app/auth/actions";
import { Logo } from "./logo";

export function Shell({ children, viewer, goalName }: { children: React.ReactNode; viewer?: { name: string; email: string }; goalName?: string }) {
  const pathname = usePathname();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top"><Logo /></div>
        <nav aria-label="Main navigation">
          <p className="nav-heading">Workspace</p>
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className={`nav-link ${pathname === href ? "active" : ""}`}>
              <Icon size={18} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-foot">
          <p>INTERVIEW COUNTDOWN</p>
          <strong>Active plan</strong>
          <span>{goalName ?? "No career goal"}</span>
          <div className="countdown-track"><i /></div>
          <small>Monday, 5 August</small>
        </div>
      </aside>

      <div className="main-wrap">
        <header className="topbar">
          <div className="mobile-logo"><Logo /></div>
          <div className="top-actions">
            <form action={logout}>
              <button className="profile-button" title="Sign out">
                <span className="avatar">{(viewer?.name ?? "A").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
                <span className="profile-copy"><strong>{viewer?.name ?? "Account"}</strong><small>{viewer?.email ?? "Sign in"}</small></span>
                <ChevronDown size={16} />
              </button>
            </form>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""}><Icon size={19}/><span>{label}</span></Link>
        ))}
      </nav>
    </div>
  );
}
