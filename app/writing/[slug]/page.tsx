import { Nav } from "@/components/nav";
import { getPostBySlug } from "@/content/posts";
import { notFound } from "next/navigation";
import Link from "next/link";

// Force dynamic rendering so posts.ts changes take effect immediately
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 font-sans">
      <Nav />
      
      <main className="pb-20">
        <header className="mb-12">
          <Link 
            href="/writing" 
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-6 inline-block"
          >
            ← Back to Writing
          </Link>
          <h1 className="text-2xl font-medium tracking-tight text-black mb-3">
            {post.title}
          </h1>
          <span className="text-xs text-neutral-400 font-mono">{post.date}</span>
        </header>

        <article className="prose prose-neutral prose-sm max-w-none">
          <div 
            className="text-neutral-700 leading-relaxed whitespace-pre-line [&_a]:text-black [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-neutral-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <footer className="mt-16 pt-8 border-t border-neutral-200">
          <Link 
            href="/writing" 
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ← Back to Writing
          </Link>
        </footer>
      </main>
    </div>
  );
}
