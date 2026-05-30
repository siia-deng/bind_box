import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring inline-flex items-center gap-3 rounded-[6px] bg-ink px-5 py-4 text-base font-bold text-paper"
    >
      {children}
      <ArrowRight className="h-5 w-5" aria-hidden="true" />
    </Link>
  );
}
