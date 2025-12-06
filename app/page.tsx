import { Nav } from "@/components/nav";
import { TriangleBackground } from "@/components/triangle-background";
import { HomeClient } from "@/components/home-client";

export default function Home() {
  return (
    <div className="h-screen max-w-2xl mx-auto px-6 font-sans flex flex-col">
      <TriangleBackground />
      <Nav />
      <HomeClient />
    </div>
  );
}
