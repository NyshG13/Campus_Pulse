import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
      <nav className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-lg">
          Campus Pulse
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/feed">Feed</Link>
          <Link href="/new">Post</Link>
          {/* later: <Link href="/dashboard">Dashboard</Link> */}
        </div>
      </nav>
    </header>
  );
}
