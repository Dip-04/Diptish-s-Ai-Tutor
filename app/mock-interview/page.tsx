import { Shell } from "@/components/shell";
import { PageHeader } from "@/components/page-header";
import { InterviewPractice } from "@/components/interview-practice";

export default function MockInterviewPage() {
  return <Shell><PageHeader eyebrow="AI practice" title="Mock interview" description="Practise honest, structured answers in a safe preparation environment."/><InterviewPractice/></Shell>;
}
