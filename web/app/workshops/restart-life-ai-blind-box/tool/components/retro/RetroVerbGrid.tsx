import { RetroButton } from "./RetroButton";

type VerbItem = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "primary" | "accent" | "alert";
};

type RetroVerbGridProps = {
  items: VerbItem[];
  hint?: string | null;
};

export function RetroVerbGrid({ items, hint }: RetroVerbGridProps) {
  return (
    <div className="gacha-dock-controls shrink-0 border-t-2 border-black bg-[var(--retro-surface-alt)] p-2 retro-dither-panel">
      {hint ? <p className="mb-1.5 border-2 border-black bg-[var(--retro-surface)] px-2 py-1 text-center text-[10px] font-bold">{hint}</p> : null}
      <div className="retro-verb-grid">
        {items.map((item) => (
          <RetroButton key={item.label} onClick={item.onClick} disabled={item.disabled} variant={item.variant ?? "default"} className="w-full text-[11px]">
            {item.label}
          </RetroButton>
        ))}
      </div>
    </div>
  );
}
