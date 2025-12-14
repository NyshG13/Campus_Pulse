// this is how/what each post would look/contain 
// Displays one post’s:
// text
// sentiment
// timestamp
// upvotes/downvotes
// vote buttons
// score

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/types";
import { upvotePost, downvotePost, VoteResult } from "@/lib/api";


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

interface Props {
  post: Post;
}

//this displays - created_at, content, upvote, downvote, sentiment, score of votes + css
export default function PostCard({ post }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [clientFormattedDate, setClientFormattedDate] = useState<string | null>(null);

  const [upvotes, setUpvotes] = useState<number>(post.upvotes ?? 0);
  const [downvotes, setDownvotes] = useState<number>(post.downvotes ?? 0);

  const router = useRouter();

  useEffect(() => {
    try {
      const dt = new Date(post.created_at);
      setClientFormattedDate(dt.toLocaleString());
    } catch {
      setClientFormattedDate(post.created_at);
    }
  }, [post.created_at]);

  useEffect(() => {
    setUpvotes(post.upvotes ?? 0);
    setDownvotes(post.downvotes ?? 0);
  }, [post.upvotes, post.downvotes]);

  const handleVote = async (e: React.MouseEvent, type: "up" | "down") => {
    e.stopPropagation();
    setErrMsg(null);

    if (isPending) {
      console.warn("Vote already pending");
      return;
    }
    setIsPending(true);

    const deviceHash = getDeviceHash();

    // optimistic update
    if (type === "up") setUpvotes((v) => v + 1);
    else setDownvotes((v) => v + 1);

    try {
      let result: VoteResult | null = null;
      if (type === "up") {
        result = await upvotePost(post.id, deviceHash);
      } else {
        result = await downvotePost(post.id, deviceHash);
      }

      console.log("vote result:", result);

      // reconcile with server authoritative counts if present
      if (result) {
        if (typeof result.upvotes === "number") setUpvotes(result.upvotes);
        if (typeof result.downvotes === "number") setDownvotes(result.downvotes);
      } else {
        console.warn("Vote endpoint returned no body");
      }
    } catch (err: any) {
      console.error("vote error details:", err);
      // show the actual message we got from apiFetch (which includes status + body)
      setErrMsg(`Vote failed: ${err?.message ?? "unknown error"}`);
      // fallback: refresh to get authoritative state
      try {
        router.refresh();
      } catch (refreshErr) {
        console.warn("router.refresh failed", refreshErr);
      }
    } finally {
      setIsPending(false);
    }
  };

  const sentimentColor =
    post.sentiment_label === "positive"
      ? "text-emerald-400"
      : post.sentiment_label === "negative"
      ? "text-rose-400"
      : "text-slate-400";

  const score = (upvotes || 0) - (downvotes || 0);

  return (
    <article className="rounded-2xl p-4 space-y-2 
    bg-white/10 backdrop-blur-lg border border-white/20 
    shadow-[0_0_20px_rgba(255,255,255,0.1)] transition hover:shadow-[0_0_35px_rgba(255,255,255,0.2)]">

      <p className="text-sm whitespace-pre-wrap">{post.content}</p>

      <div className="flex justify-between items-center text-xs text-slate-400">
        <span className={sentimentColor}>Sentiment: {post.sentiment_label}</span>

        <span>
          Score: {score} · Posted {clientFormattedDate ?? "—"}
        </span>
      </div>

      {errMsg && <p className="text-xs text-rose-400">{errMsg}</p>}

      <div className="flex gap-2 text-xs">
        <button
          onClick={(e) => handleVote(e, "up")}
          disabled={isPending}
          className="px-2 py-1 rounded-md border border-green-400 text-green-300 
            hover:bg-green-500/20 hover:scale-110 transition-transform duration-200"

        >
          ⬆ {upvotes}
        </button>
        <button
          onClick={(e) => handleVote(e, "down")}
          disabled={isPending}
          className="px-2 py-1 rounded-md border border-red-400 text-red-300 
            hover:bg-red-500/20 hover:scale-110 transition-transform duration-200"

        >
          ⬇ {downvotes}
        </button>
      </div>
    </article>
  );
}
