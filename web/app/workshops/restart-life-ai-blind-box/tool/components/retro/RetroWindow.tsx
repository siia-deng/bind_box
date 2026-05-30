type RetroWindowProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  flash?: boolean;
};

export function RetroWindow({ title, children, className = "", bodyClassName = "", flash = false }: RetroWindowProps) {
  return (
    <section className={`retro-window ${flash ? "retro-window-flash" : ""} ${className}`}>
      <div className="retro-window-titlebar retro-titlebar-stripe">
        <span className="retro-window-close" aria-hidden="true" />
        <span className="retro-window-title retro-font-mono">{title}</span>
        <span className="retro-window-close invisible" aria-hidden="true" />
      </div>
      <div className={`retro-window-body ${bodyClassName}`}>{children}</div>
    </section>
  );
}
