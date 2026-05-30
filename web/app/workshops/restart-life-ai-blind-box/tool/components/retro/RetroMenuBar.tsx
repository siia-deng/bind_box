type RetroMenuBarProps = {
  brand: string;
  subtitle?: string;
  items: Array<{ label: string; onClick?: () => void; href?: string; active?: boolean }>;
};

export function RetroMenuBar({ brand, subtitle, items }: RetroMenuBarProps) {
  return (
    <header className="retro-menubar relative z-20 shrink-0">
      <div>
        <p className="retro-menubar-brand">{brand}</p>
        {subtitle ? <p className="text-[10px] font-bold opacity-60">{subtitle}</p> : null}
      </div>
      <nav className="retro-menubar-items">
        {items.map((item) =>
          item.href ? (
            <a key={item.label} href={item.href} className="retro-menubar-link">
              {item.label}
            </a>
          ) : (
            <button key={item.label} type="button" onClick={item.onClick} className={`retro-menubar-link ${item.active ? "border-black" : ""}`}>
              {item.label}
            </button>
          )
        )}
      </nav>
    </header>
  );
}
