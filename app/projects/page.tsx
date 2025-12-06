import { Nav } from "@/components/nav";
import { ParticleBackground } from "@/components/particle-background";

const projects = [
  {
    title: "LiveMock.ai",
    description: "Real-time AI interview simulator for consulting case interviews with 100+ cases and detailed feedback.",
    year: "2025",
    link: "https://livemock.ai/",
    tags: ["Python", "TypeScript", "Supabase", "Stripe"]
  },
  {
    title: "ReGain",
    description: "Voice-interactive stroke rehabilitation platform that adapts exercises in real-time.",
    year: "2025",
    link: "https://github.com/AlpUnsal/ReGain",
    tags: ["Python", "Node.js", "Express", "OpenAI API"]
  },
  {
    title: "SallyAI",
    description: "AI medical assistant that autonomously calls patients for check-ins and generates clinical summaries.",
    year: "2025",
    link: "https://github.com/AlpUnsal/SallyAI",
    tags: ["Python", "FastAPI", "Twilio", "OpenAI API"]
  }
];

export default function Projects() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 font-sans">
      <ParticleBackground />
      <Nav />
      
      <main className="pb-20">
        <header className="mb-16">
          <h1 className="text-xl font-medium tracking-tight text-black mb-4">Selected Work</h1>
          <p className="text-sm text-neutral-500">A collection of digital products and experiments.</p>
        </header>

        <div className="flex flex-col gap-10">
          {projects.map((project, index) => (
            <a key={index} href={project.link} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                <h2 className="font-medium text-black group-hover:underline decoration-neutral-300 underline-offset-4 transition-all">
                  {project.title}
                </h2>
                <span className="text-xs text-neutral-400 font-mono mt-1 sm:mt-0">{project.year}</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">{project.description}</p>
              <div className="flex gap-2 text-xs text-neutral-500 font-medium">
                {project.tags.map(tag => (
                   <span key={tag} className="bg-neutral-100 px-2 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
