import Link from "next/link";
import { HurdleMark } from "./HurdleMark";

const navItems = [
  { href: "/brand/about", label: "About" },
  { href: "/events/june-2026", label: "June" },
  { href: "/workshops/restart-life-ai-blind-box", label: "Event" },
  { href: "/experience/rebuild", label: "Rebuild" },
  { href: "/experience/create", label: "Create" },
  { href: "/showcase/demos", label: "Demos" }
];

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col lg:grid lg:grid-cols-[190px_1fr]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-ink bg-paper/90 px-5 py-4 backdrop-blur lg:hidden">
        <Link href="/" className="focus-ring">
          <HurdleMark compact />
        </Link>
        <Link
          href="/events/june-2026"
          className="focus-ring rounded-[6px] bg-ink px-4 py-3 text-sm font-bold text-paper"
        >
          6月活动
        </Link>
      </header>
      <aside className="hidden px-8 py-8 lg:block">
        <div className="sticky top-8 flex h-[calc(100vh-4rem)] flex-col justify-between">
          <Link href="/" className="focus-ring text-xl font-bold">
            Shanghai
          </Link>
          <div className="text-xl">2026</div>
          <nav className="flex flex-col text-xl leading-none">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="focus-ring w-fit underline-offset-4 hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">{children}</main>
      <nav className="grid grid-cols-3 gap-px border-t-2 border-ink bg-ink text-center text-sm font-bold lg:hidden">
        {navItems.slice(0, 6).map((item) => (
          <Link key={item.href} href={item.href} className="bg-paper px-2 py-4">
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
