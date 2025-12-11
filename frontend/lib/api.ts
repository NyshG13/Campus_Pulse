import { API_BASE_URL } from "./config";
import type { FeedResponse, Post } from "./types";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} ${text}`);
  }

  return res.json() as Promise<T>;
}

export async function getFeed(): Promise<Post[]> {
  return apiFetch<Post[]>("/api/v1/posts/");
}


export async function createPost(content: string): Promise<Post> {
  return apiFetch<Post>("/api/v1/posts/", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function upvotePost(id: string): Promise<Post> {
  return apiFetch<Post>(`/posts/${id}/upvote`, { method: "POST" });
}

export async function downvotePost(id: string): Promise<Post> {
  return apiFetch<Post>(`/posts/${id}/downvote`, { method: "POST" });
}
