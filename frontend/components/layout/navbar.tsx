//this just defines how the navbar should be 
//its in a separate folder because we want this style to apply to the whole page instead of one column or box or smth 

import Link from "next/link";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico"
});


export default function Navbar() {
  return (
    <header className="border-b border-purple-500/40 
        bg-purple-900/20 backdrop-blur-xl 
        sticky top-0 z-50">

      <nav className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        
        {/* Title with Pacifico font */}
        <Link
          href="/"
          className="text-xl"
          style={{ fontFamily: "var(--font-pacifico)" }}
        >
          Campus Pulse
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-3 text-med" style={{ fontFamily: "var(--font-sharetech)" }}>
          <Link href="/feed">Feed</Link>
          <Link href="/new">Post</Link>
          {/* later: <Link href="/dashboard">Dashboard</Link> */}
        </div>

      </nav>
    </header>
  );
}
