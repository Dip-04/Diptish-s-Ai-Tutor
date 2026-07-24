import { Sparkles } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="logo">
      <span className="logo-mark"><Sparkles size={18} strokeWidth={2.5} /></span>
      {!compact && <span>Diptish<span>AI</span></span>}
    </div>
  );
}
