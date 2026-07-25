import { BookOpen, BrainCircuit, LayoutDashboard, Map, Target } from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Today", href: "/today", icon: Target },
  { label: "Roadmap", href: "/roadmaps", icon: Map },
  { label: "Resources", href: "/resources", icon: BookOpen },
  { label: "Mock interview", href: "/mock-interview", icon: BrainCircuit }
];
