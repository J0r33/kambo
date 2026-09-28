import type { Metadata } from "next";
import "./globals.css";

// Placeholder metadata for the scaffold. Real page titles and descriptions arrive with the
// content tickets; they must not state or imply health outcomes (AGENTS.md → Product).
export const metadata: Metadata = {
  title: "Kambo",
  description: "Website in progress.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
