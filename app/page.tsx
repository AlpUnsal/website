import { Nav } from "@/components/nav";
import { NowIndicator } from "@/components/now-indicator";
import { TriangleBackground } from "@/components/triangle-background";

export default function Home() {
  return (
    <div className="h-screen max-w-2xl mx-auto px-6 font-sans flex flex-col">
      <TriangleBackground />
      <Nav />
      
      <main className="flex flex-col justify-between flex-1 pb-8">
        {/* Hero Section */}
        <section className="flex flex-col gap-4">
          <h1 className="text-xl font-medium tracking-tight text-black">
            Alp Unsal
          </h1>
          <p className="text-sm text-neutral-500 max-w-lg leading-relaxed">
            Machine & human learning
          </p>
        </section>

        {/* Now Indicator */}
        <NowIndicator />

        {/* Experience Section */}
        <section>
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-5">
            Experience
          </h2>
          <div className="flex flex-col gap-6">
            <div className="group">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="font-medium text-black group-hover:text-neutral-600 transition-colors">ML Research Student</h3>
                <span className="text-xs text-neutral-400">Apr 2025 — Present</span>
              </div>
              <p className="text-sm text-neutral-500">Vector Institute & The Hospital for Sick Children</p>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                Building a multi-modal pipeline for senescence classification from microscopic images to handle the heterogeneity problem.
              </p>
            </div>
            
            <div className="group">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="font-medium text-black group-hover:text-neutral-600 transition-colors">ML Research Student</h3>
                <span className="text-xs text-neutral-400">May 2024 — Aug 2024</span>
              </div>
              <p className="text-sm text-neutral-500">University Health Network</p>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                Developed a self-supervised ViT-MAE foundation model for cervical cancer tumor segmentation on 30K+ MRI scans.
              </p>
            </div>

            <div className="group">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="font-medium text-black group-hover:text-neutral-600 transition-colors">High Performance Computing Intern</h3>
                <span className="text-xs text-neutral-400">May 2023 — Dec 2023</span>
              </div>
              <p className="text-sm text-neutral-500">The Hospital for Sick Children</p>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                Managed 15 petabytes of research data infrastructure, ensuring 100% uptime for 2,000+ healthcare and ML researchers.
              </p>
            </div>
          </div>
        </section>

        {/* Contact/Connect Section */}
        <section>
           <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-5">
            Connect
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-6 text-xs font-medium">
              <a href="mailto:unsalalp10@gmail.com" className="bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors">
                Get in Touch
              </a>
              <div className="flex items-center gap-6">
                <a href="https://www.linkedin.com/in/alpunsal/" className="text-neutral-500 hover:text-black transition-colors">LinkedIn</a>
                <a href="https://github.com/AlpUnsal" className="text-neutral-500 hover:text-black transition-colors">GitHub</a>
                <a href="https://x.com/alpunssal" className="text-neutral-500 hover:text-black transition-colors">Twitter</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
