import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Campus Pulse",
  description: "Anonymous campus sentiment dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
