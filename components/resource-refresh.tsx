"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function ResourceRefresh() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      className="secondary-button resource-refresh"
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      <RefreshCw size={15} className={pending ? "spin" : ""}/>
      {pending ? "Finding resources..." : "Refresh from web"}
    </button>
  );
}
