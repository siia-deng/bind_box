import type { CardRarity } from "../../types";

type RarityFXProps = {
  rarity: CardRarity;
  active: boolean;
};

export function RarityFX({ rarity, active }: RarityFXProps) {
  if (!active || rarity === "N") {
    return null;
  }

  if (rarity === "SSR") {
    return (
      <div className="pointer-events-none absolute inset-0 z-20 border-[3px] border-[var(--retro-alert)]" aria-hidden="true" />
    );
  }

  if (rarity === "SR") {
    return (
      <div className="pointer-events-none absolute inset-0 z-20 border-[3px] border-[var(--retro-accent)]" aria-hidden="true" />
    );
  }

  return <div className="pointer-events-none absolute inset-0 z-20 border-2 border-black" aria-hidden="true" />;
}
