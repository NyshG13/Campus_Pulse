"use client";

import { useState, FormEvent } from "react";
import { createPost } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewPostForm() {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      await createPost(content.trim());
      setContent("");
      router.push("/feed");
    } catch (e) {
      console.error(e);
      setError("Failed to submit post. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <textarea
        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm outline-none focus:ring-1 focus:ring-slate-500"
        rows={5}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="rounded-xl px-4 py-2 text-sm font-medium border border-slate-700 disabled:opacity-60"
      >
        {submitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
