import { API_BASE_URL } from "./config";
import type { Post } from "./types";

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

// Now requires deviceHash to be passed in
export async function createPost(content: string, deviceHash: string): Promise<Post> {
  return apiFetch<Post>("/api/v1/posts/", {
    method: "POST",
    body: JSON.stringify({ content, device_hash: deviceHash }),
  });
}

// Voting endpoints: leave as stubs or implement later to match backend schema
export async function upvotePost(postId: string, deviceHash: string): Promise<any> {
  return apiFetch<any>("/api/v1/votes/", {
    method: "POST",
    body: JSON.stringify({ post_id: postId, device_hash: deviceHash, value: 1 }),
  });
}

export async function downvotePost(postId: string, deviceHash: string): Promise<any> {
  return apiFetch<any>("/api/v1/votes/", {
    method: "POST",
    body: JSON.stringify({ post_id: postId, device_hash: deviceHash, value: -1 }),
  });
}