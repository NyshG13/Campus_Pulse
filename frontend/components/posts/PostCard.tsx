"use client";

import type { Post } from "@/lib/types";
import { upvotePost, downvotePost } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  post: Post;
}

function getDeviceHash(): string {
  try {
    const key = "device_hash";
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
    return (typeof crypto !== "undefined" && "randomUUID" in crypto)
      ? (crypto as any).randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

export default function PostCard({ post }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [clientFormattedDate, setClientFormattedDate] = useState<string | null>(null);
  const router = useRouter();

  // Format date only on client after mount to avoid SSR/CSR mismatch
  useEffect(() => {
    try {
      const dt = new Date(post.created_at);
      // Use user's locale formatting on client
      setClientFormattedDate(dt.toLocaleString());
    } catch (e) {
      // fallback
      setClientFormattedDate(post.created_at);
    }
  }, [post.created_at]);

  const handleVote = async (type: "up" | "down") => {
    setErrMsg(null);
    setIsPending(true);
    const deviceHash = getDeviceHash();

    try {
      if (type === "up") {
        await upvotePost(post.id, deviceHash);
      } else {
        await downvotePost(post.id, deviceHash);
      }
      // re-fetch server data
      router.refresh();
    } catch (e: any) {
      console.error("vote error", e);
      setErrMsg("Vote failed. Try again.");
    } finally {
      setIsPending(false);
    }
  };

  const sentimentColor =
    post.sentiment === "positive"
      ? "text-emerald-400"
      : post.sentiment === "negative"
      ? "text-rose-400"
      : "text-slate-400";

  return (
    <article className="border border-slate-800 rounded-2xl p-4 space-y-2">
      <p className="text-sm whitespace-pre-wrap">{post.content}</p>

      <div className="flex justify-between items-center text-xs text-slate-400">
        <span className={sentimentColor}>Sentiment: {post.sentiment}</span>

        <span>
          Score: {post.upvotes ?? 0} · Posted{" "}
          {/* Render clientFormattedDate only after mount to avoid hydration mismatch.
              Show a short placeholder like '—' until client formats it. */}
          {clientFormattedDate ?? "—"}
        </span>
      </div>

      {errMsg && <p className="text-xs text-rose-400">{errMsg}</p>}

      <div className="flex gap-2 text-xs">
        <button
          onClick={() => handleVote("up")}
          disabled={isPending}
          className="px-2 py-1 rounded-md border border-slate-700"
        >
          ⬆ {post.upvotes ?? 0}
        </button>
        <button
          onClick={() => handleVote("down")}
          disabled={isPending}
          className="px-2 py-1 rounded-md border border-slate-700"
        >
          ⬇ {post.downvotes ?? 0}
        </button>
      </div>
    </article>
  );
}
