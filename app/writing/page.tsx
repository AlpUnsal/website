import { Nav } from "@/components/nav";
import Link from "next/link";
import { posts } from "@/content/posts";

export default function Writing() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 font-sans">
      <Nav />
      
      <main className="pb-20">
        <header className="mb-16">
          <h1 className="text-xl font-medium tracking-tight text-black mb-4">Writing</h1>
          <p className="text-sm text-neutral-500">Thoughts on AI, learning, and research.</p>
        </header>

        <section>
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">
            Thoughts
          </h2>
          <div className="flex flex-col gap-4">
          {posts.map((post) => (
             <Link key={post.slug} href={`/writing/${post.slug}`} className="group flex flex-col sm:flex-row sm:items-baseline justify-between py-3 border-b border-neutral-100 hover:border-neutral-200 transition-colors">
                <h2 className="font-medium text-black group-hover:text-neutral-600 transition-colors">
                  {post.title}
                </h2>
                <span className="text-xs text-neutral-400 font-mono flex-shrink-0 mt-1 sm:mt-0 sm:ml-4">{post.date}</span>
             </Link>
          ))}
        </div>
        </section>

        <section className="mt-16 pt-8 border-t border-neutral-100">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">
            Technical Breakdowns
          </h2>
          <a 
            href="https://aiweeklybriefing.substack.com/s/ai-technical-breakdowns" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center justify-between py-3 border-b border-neutral-100 hover:border-neutral-200 transition-colors"
          >
            <div>
              <h3 className="font-medium text-black group-hover:text-neutral-600 transition-colors">
                AI Weekly Briefing
              </h3>
              <p className="text-sm text-neutral-500 mt-1">In-depth technical analysis on Substack</p>
            </div>
            <span className="text-xs text-neutral-400 group-hover:text-neutral-600 transition-colors">→</span>
          </a>
        </section>
      </main>
    </div>
  );
}
