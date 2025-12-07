import { FollowingBackground } from "@/components/following-background";

export default function WritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FollowingBackground />
      {children}
    </>
  );
}
