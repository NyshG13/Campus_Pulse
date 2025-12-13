// the ui concerned with a list of posts 
import type { Post } from "@/lib/types";
import PostCard from "./PostCard";

interface Props {
  posts: Post[] | undefined;
}

export default function PostList({ posts }: Props) {
  const safePosts = posts ?? [];

  return (
    <div className="space-y-4">
      {safePosts.length === 0 ? (
        <p className="text-sm text-slate-400">
          No posts yet. Be the first to share something!
        </p>
      ) : (
        safePosts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
}
