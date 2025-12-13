//define the fonts here 
//create variables here to use all throughout the frontend 

import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";

import { Pacifico, Anton, Share_Tech } from "next/font/google";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

const sharetech = Share_Tech({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sharetech",
});

export const metadata: Metadata = {
  title: "Campus Pulse",
  description: "Anonymous campus sentiment dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon_2.ico" />
      </head>
      <body className={`${pacifico.variable} ${anton.variable} ${sharetech.variable} min-h-screen bg-slate-950 text-slate-100`}>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
