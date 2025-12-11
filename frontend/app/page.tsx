import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mt-8 space-y-4">
      <h1 className="text-3xl font-bold">Welcome to Campus Pulse</h1>
      <p className="text-slate-300">
        Share your thoughts anonymously, see what your campus feels, and track
        trending topics over time.
      </p>
      <div className="flex gap-3">
        <Link
          href="/new"
          className="rounded-xl px-4 py-2 text-sm font-medium border border-slate-700"
        >
          Post anonymously
        </Link>
        <Link
          href="/feed"
          className="rounded-xl px-4 py-2 text-sm font-medium border border-slate-700"
        >
          View feed
        </Link>
      </div>
    </section>
  );
}
