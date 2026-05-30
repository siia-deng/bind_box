import { getCardRarity } from "../../data/cards";
import { cardKindLabels } from "../../data/copy";
import type { Card } from "../../types";
import { CardIllustration } from "./CardIllustration";

type CardBackProps = {
  compact?: boolean;
  slot?: boolean;
};

export function CardBack({ compact, slot }: CardBackProps) {
  return (
    <div
      className="retro-cartridge relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[var(--retro-surface-alt)]"
      style={{
        backgroundImage: "url(/workshops/blind-vibe/card-back.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {!slot ? (
        <span className={`font-black text-[var(--retro-ink)] ${compact ? "text-[10px]" : "text-2xl"}`}>BV</span>
      ) : null}
      {!compact && !slot ? <span className="retro-font-mono mt-1 text-[9px] font-bold tracking-widest opacity-60">BLIND VIBE</span> : null}
    </div>
  );
}

type CardVerticalProps = {
  card?: Card;
  showBack?: boolean;
  compact?: boolean;
  slot?: boolean;
  showcase?: boolean;
  fill?: boolean;
  className?: string;
};

export function CardVertical({
  card,
  showBack = false,
  compact = false,
  slot = false,
  showcase = false,
  fill = false,
  className = ""
}: CardVerticalProps) {
  const rarity = card ? getCardRarity(card) : "N";
  const smallCard = compact || showcase || slot;
  const sizeClass = fill
    ? "h-full w-full"
    : slot
      ? "h-[44px] w-[36px]"
      : compact
        ? "h-[84px] w-[68px]"
        : showcase
          ? "h-[140px] w-[96px]"
          : "h-[420px] w-[280px]";

  if (showBack || !card) {
    return (
      <div className={`${sizeClass} ${className}`}>
        <CardBack compact={compact || slot} slot={slot} />
      </div>
    );
  }

  const rarityBadgeClass =
    rarity === "SSR" ? "retro-rarity-ssr" : rarity === "SR" ? "retro-rarity-sr" : rarity === "R" ? "border-black bg-[var(--retro-surface-alt)]" : "";

  return (
    <div className={`retro-cartridge relative overflow-hidden bg-[var(--retro-surface)] text-[var(--retro-ink)] ${card.kind === "constraint" ? "retro-cartridge-constraint" : ""} ${sizeClass} ${className}`}>
      <div className={`retro-cartridge-accent ${card.accent}`} />
      {rarity !== "N" && !slot ? <span className={`retro-rarity-badge retro-font-mono ${rarityBadgeClass}`}>{rarity}</span> : null}
      <div className={`flex h-full flex-col ${slot ? "p-0" : smallCard ? "p-0.5 pt-1.5" : fill ? "p-3 pt-4" : "p-4 pt-5"}`}>
        {slot ? (
          <p className="flex flex-1 items-center justify-center px-0.5 text-center text-[6px] font-black leading-tight line-clamp-4">{card.title}</p>
        ) : (
          <>
            <CardIllustration kind={card.kind} visualKey={card.visualKey} title={card.title} compact={smallCard} fill={fill && !smallCard} />
            {!smallCard ? (
              <>
                <p className="retro-font-mono mt-2 text-[10px] font-black uppercase tracking-wide opacity-60">{cardKindLabels[card.kind]}</p>
                <h3 className={`mt-1 font-black leading-tight ${fill ? "text-base sm:text-lg" : "text-xl"}`}>{card.title}</h3>
                <p className={`mt-1 font-bold leading-snug opacity-70 ${fill ? "line-clamp-2 text-xs" : "line-clamp-3 text-sm"}`}>{card.detail}</p>
              </>
            ) : showcase ? (
              <p className="mt-0.5 line-clamp-2 text-[9px] font-black leading-tight">{card.title}</p>
            ) : (
              <p className="mt-0.5 line-clamp-2 text-[8px] font-black leading-tight">{card.title}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
