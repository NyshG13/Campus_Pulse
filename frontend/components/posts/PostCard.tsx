"use client";

import type { Post } from "@/lib/types";
import { upvotePost, downvotePost } from "@/lib/api";
import { useState, useTransition } from "react";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const [localPost, setLocalPost] = useState(post);
  const [isPending, startTransition] = useTransition();

  const handleVote = (type: "up" | "down") => {
    startTransition(async () => {
      try {
        const updated =
          type === "up"
            ? await upvotePost(localPost.id)
            : await downvotePost(localPost.id);
        setLocalPost(updated);
      } catch (e) {
        console.error(e);
      }
    });
  };

  const sentimentColor =
    localPost.sentiment === "positive"
      ? "text-emerald-400"
      : localPost.sentiment === "negative"
      ? "text-rose-400"
      : "text-slate-400";

  return (
    <article className="border border-slate-800 rounded-2xl p-4 space-y-2">
      <p className="text-sm whitespace-pre-wrap">{localPost.content}</p>
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span className={sentimentColor}>Sentiment: {localPost.sentiment}</span>
        <span>
          Score: {localPost.upvotes - localPost.downvotes} · Posted{" "}
          {new Date(localPost.created_at).toLocaleString()}
        </span>
      </div>
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => handleVote("up")}
          disabled={isPending}
          className="px-2 py-1 rounded-md border border-slate-700"
        >
          ⬆ {localPost.upvotes}
        </button>
        <button
          onClick={() => handleVote("down")}
          disabled={isPending}
          className="px-2 py-1 rounded-md border border-slate-700"
        >
          ⬇ {localPost.downvotes}
        </button>
      </div>
    </article>
  );
}
