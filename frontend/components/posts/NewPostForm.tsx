// src/components/NewPostForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { createPost } from "@/lib/api";
import { useRouter } from "next/navigation";

/**
 * Returns a stable device hash stored in localStorage.
 * Safely handles environments without localStorage or crypto.randomUUID.
 */
function getDeviceHash(): string {
  try {
    const key = "device_hash";
    // ensure h is a string (never null)
    let h = localStorage.getItem(key) ?? "";

    if (!h) {
      if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        h = (crypto as any).randomUUID();
      } else {
        h = Math.random().toString(36).slice(2) + Date.now().toString(36);
      }
      localStorage.setItem(key, h);
    }

    return h;
  } catch (e) {
    // localStorage may be unavailable (e.g., private mode). produce a transient id.
    return (typeof crypto !== "undefined" && "randomUUID" in crypto)
      ? (crypto as any).randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

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

    const deviceHash = getDeviceHash();

    try {
      await createPost(content.trim(), deviceHash);
      setContent("");
      // navigate to feed or refresh — using push to go to feed route
      router.push("/feed");
    } catch (err: any) {
      console.error(err);
      setError(
        typeof err?.message === "string" && err.message.includes("422")
          ? "Failed: required fields missing on server."
          : "Failed to submit post. Try again."
      );
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
