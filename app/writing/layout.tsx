import { TriangleBackground } from "@/components/triangle-background";

export default function WritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TriangleBackground />
      {children}
    </>
  );
}
