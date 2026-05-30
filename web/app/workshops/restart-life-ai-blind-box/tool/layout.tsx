import type { ReactNode } from "react";

export default function BlindBoxToolLayout({ children }: { children: ReactNode }) {
  return <div className="h-full min-h-[100dvh] w-full [--font-retro-mono:'Courier_New',Courier,monospace]">{children}</div>;
}
