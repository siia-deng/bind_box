import type { CardKind } from "../../types";
import { resolveCardArt } from "../../data/card-art";

const symbolPaths: Record<string, string> = {
  understood: "M12 3c-3 0-5 2-5 5 0 4 5 9 5 9s5-5 5-9c0-3-2-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z",
  "space-resident": "M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4zm0 4v10",
  "future-luxury": "M4 8h16v2H4V8zm2 4h12v8H6v-8zm4-8h4v4h-4V4z",
  "lonely-mood": "M8 10a4 4 0 018 0v6H8v-6zm2 10h4v2h-4v-2z",
  "internet-newbie": "M4 6h16v12H4V6zm3 3h10v2H7V9zm0 4h6v2H7v-2z",
  "retro-web-90s": "M3 5h18v10H3V5zm2 2v6h14V7H5zm2 10h10v2H7v-2z",
  "life-restart": "M12 4v4l3-3 1 1-3 3h4v10H7V9h4l1-1-3-3 3 3V4z",
  "urban-stress": "M6 6h12v2H6V6zm0 4h8v2H6v-2zm0 4h10v2H6v-2z",
  "child-fantasy": "M12 4l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z",
  "calm-healing": "M12 3C9 8 5 9 5 14a7 7 0 0014 0c0-5-4-6-7-11z",
  "landing-page": "M4 6h16v12H4V6zm2 2v8h12V8H6z",
  "ai-ad-film": "M4 6h12v12H4V6zm14 3l4-2v10l-4-2V9z",
  "personality-quiz": "M8 4h8v4H8V4zm-4 6h16v2H4v-2zm2 4h12v8H6v-8z",
  mono: "M4 4h16v16H4V4zm2 2v12h12V6H6z",
  "retro-future": "M2 12h20M12 2v20M6 6l12 12M18 6L6 18",
  "mars-architect": "M12 2L2 22h20L12 2zm0 6l5 10h-10l5-10z",
  "brand-video": "M4 6h12v12H4V6zm14 3l4-2v10l-4-2V9z"
};

const defaultSymbol = "M12 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z";

type CardIllustrationProps = {
  kind: CardKind;
  visualKey?: string;
  title: string;
  compact?: boolean;
  fill?: boolean;
};

export function CardIllustration({ kind, visualKey, title, compact, fill }: CardIllustrationProps) {
  const art = resolveCardArt(kind, visualKey);
  const path = symbolPaths[art.iconKey] ?? symbolPaths[visualKey ?? ""] ?? defaultSymbol;
  const sizeClass = compact ? "h-full min-h-[48px]" : fill ? "min-h-0 flex-1" : "h-[180px]";

  return (
    <div
      className={`card-illustration relative overflow-hidden border-2 border-black retro-dither-panel ${art.moodClass} ${sizeClass}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={art.imageSrc}
        alt=""
        className="card-illustration-img absolute inset-0 z-10 h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.classList.add("card-illustration-img-missing");
        }}
      />
      <div className="card-illustration-icon absolute inset-0 z-20 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className={compact ? "h-8 w-8 drop-shadow-sm" : "h-14 w-14 drop-shadow-sm"} fill="currentColor" aria-hidden="true">
          <path d={path} />
        </svg>
      </div>
      {!compact ? (
        <div className="card-illustration-caption absolute inset-x-0 bottom-0 z-30 border-t-2 border-black bg-[var(--retro-surface)] p-2">
          <p className="truncate text-xs font-black">{title}</p>
        </div>
      ) : null}
    </div>
  );
}

export function getIllustrationPath(kind: CardKind, visualKey?: string) {
  return resolveCardArt(kind, visualKey).imageSrc;
}
