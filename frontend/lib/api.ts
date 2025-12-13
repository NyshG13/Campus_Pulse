// src/lib/api.ts
import { API_BASE_URL } from "./config";
import type { Post } from "./types";

/**
 * Generic fetch wrapper for your API.
 * - Reads raw response body, attempts to parse JSON.
 * - On non-OK, throws an Error that contains status + body (helps debugging).
 */
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    // not JSON, keep raw text
  }

  if (!res.ok) {
    const body = json ?? text ?? "";
    // include the body stringified so caller sees server message
    throw new Error(`API error: ${res.status} ${JSON.stringify(body)}`);
  }

  // Successful response: return parsed JSON when possible, else raw text
  return (json ?? text) as T;
}

/** Feed retrieval */
export async function getFeed(): Promise<Post[]> {
  return apiFetch<Post[]>("/api/v1/posts/");
}

/** Create a post (used by NewPostForm) */
export async function createPost(content: string, deviceHash: string): Promise<Post> {
  return apiFetch<Post>("/api/v1/posts/", {
    method: "POST",
    body: JSON.stringify({ content, device_hash: deviceHash }),
  });
}

/** Vote result shape returned by backend */
export interface VoteResult {
  post_id: string;
  votes?: number; // total score (sum of +1/-1)
  upvotes?: number;
  downvotes?: number;
}

/** Upvote */
export async function upvotePost(postId: string, deviceHash: string): Promise<VoteResult> {
  return apiFetch<VoteResult>("/api/v1/votes/", {
    method: "POST",
    body: JSON.stringify({ post_id: postId, device_hash: deviceHash, value: 1 }),
  });
}

/** Downvote */
export async function downvotePost(postId: string, deviceHash: string): Promise<VoteResult> {
  return apiFetch<VoteResult>("/api/v1/votes/", {
    method: "POST",
    body: JSON.stringify({ post_id: postId, device_hash: deviceHash, value: -1 }),
  });
}
