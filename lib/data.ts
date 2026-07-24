import { BookOpen, BrainCircuit, ChartNoAxesColumnIncreasing, FileText, LayoutDashboard, Map, MessageSquareText, Settings, Target } from "lucide-react";

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
