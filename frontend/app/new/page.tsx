import NewPostForm from "@/components/posts/NewPostForm";

export default function NewPostPage() {
  return (
    <section className="mt-6 max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Post anonymously</h1>
      <p className="text-sm text-slate-400">
        Be respectful. Your post is anonymous, but still affects real people.
      </p>
      <NewPostForm />
    </section>
  );
}
