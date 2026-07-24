import { BookOpen, BrainCircuit, ChartNoAxesColumnIncreasing, FileText, LayoutDashboard, Map, MessageSquareText, Settings, Sparkles, Target } from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Today", href: "/today", icon: Target },
  { label: "Roadmap", href: "/roadmaps", icon: Map },
  { label: "Topics", href: "/topics", icon: BookOpen },
  { label: "Questions", href: "/questions", icon: MessageSquareText },
  { label: "Mock interview", href: "/mock-interview", icon: BrainCircuit },
  { label: "Resume", href: "/resume", icon: FileText },
  { label: "Analytics", href: "/analytics", icon: ChartNoAxesColumnIncreasing },
  { label: "Settings", href: "/settings", icon: Settings }
];

export type Task = {
  id: string;
  title: string;
  detail: string;
  minutes: number;
  type: "Learn" | "Practice" | "Interview" | "Revision";
  completed?: boolean;
};

export const initialTasks: Task[] = [
  { id: "http", title: "HTTP request lifecycle", detail: "Web fundamentals · Core", minutes: 35, type: "Learn", completed: true },
  { id: "auth", title: "Authentication vs authorisation", detail: "Identity · Critical", minutes: 25, type: "Revision" },
  { id: "api", title: "Build a secure CRUD endpoint", detail: "REST APIs · Hands-on", minutes: 55, type: "Practice" },
  { id: "questions", title: "Answer 10 security questions", detail: "Spoken practice · Timed", minutes: 30, type: "Interview" }
];

export const roadmapDays = [
  { day: 1, short: "Mon", date: "24", title: "Web foundations", minutes: 145, state: "today", topics: ["HTTP", "Networking", "Authentication"] },
  { day: 2, short: "Tue", date: "25", title: "OWASP Top 10", minutes: 180, state: "next", topics: ["Access Control", "Injection", "SSRF"] },
  { day: 3, short: "Wed", date: "26", title: "Secure coding", minutes: 165, state: "next", topics: ["Validation", "Secrets", "Logging"] },
  { day: 4, short: "Thu", date: "27", title: "API security", minutes: 150, state: "next", topics: ["BOLA", "JWT", "Rate limits"] },
  { day: 5, short: "Fri", date: "28", title: "Penetration testing", minutes: 180, state: "next", topics: ["Burp Suite", "ZAP", "Reporting"] },
  { day: 6, short: "Sat", date: "29", title: "Cloud & crypto", minutes: 240, state: "next", topics: ["IAM", "TLS", "Hashing"] },
  { day: 7, short: "Sun", date: "30", title: "Final project", minutes: 300, state: "next", topics: ["Secure API", "Mock", "Review"] }
];

export const weakTopics = [
  { name: "OAuth 2.0", confidence: 42, due: "Revise today" },
  { name: "JWT security", confidence: 51, due: "Quiz in 2 days" },
  { name: "BOLA", confidence: 58, due: "Practice tomorrow" }
];

export const quickActions = [
  { label: "Mock interview", detail: "15 min adaptive session", icon: BrainCircuit, href: "/mock-interview" },
  { label: "Practice questions", detail: "10 role-specific prompts", icon: MessageSquareText, href: "/questions" },
  { label: "Review flashcards", detail: "8 cards due today", icon: Sparkles, href: "/flashcards" }
];
