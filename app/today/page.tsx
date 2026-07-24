import { Shell } from "@/components/shell";
import { FocusTimer } from "@/components/focus-timer";
import { PageHeader } from "@/components/page-header";

export default function TodayPage() {
  return <Shell><PageHeader eyebrow="Daily preparation" title="Focus session" description="One task at a time. Your progress is saved on this device."/><FocusTimer /></Shell>;
}
