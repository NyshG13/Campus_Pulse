// frontend/app/feed/page.tsx
import { getFeed } from "@/lib/api";
import PostList from "@/components/posts/PostList";

export default async function FeedPage() {
  // getFeed returns Post[]
  const posts = await getFeed();

  return (
    <section className="mt-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-sharetech)" }}>
          Campus Feed
        </h1>
        <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-sharetech)"}}>
          Most recent anonymous posts with sentiment.
        </p>
      </div>

     
      <PostList posts={posts} />
    </section>
  );
}
