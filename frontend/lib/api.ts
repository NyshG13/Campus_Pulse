// src/lib/api.ts
//this makes the http request, adds the base url, sends and receives json and sees the errors 
//it contains the path of 1st the whole backend url and secondly the api for the backend call for each function
//each wrapper function is a gateway that every api request has to pass through 
//Without it, every component would have fetch code like:

// fetch("http://localhost:8000/api/v1/posts", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify(...), });

//this function automatically attaches backend url everywhere,so now u just call - apiFetch("/posts")



import { API_BASE_URL } from "./config";
import type { Post } from "./types";
console.log("API_BASE_URL =", API_BASE_URL);


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
