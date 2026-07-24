import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DiptishAI — Interview preparation",
  description: "Your personalised path from preparation to interview confidence."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
