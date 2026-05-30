type LogLine = {
  prefix: string;
  text: string;
  done: boolean;
};

type RetroStatusLogProps = {
  lines: LogLine[];
  mission?: string | null;
  footer?: string;
};

export function RetroStatusLog({ lines, mission, footer }: RetroStatusLogProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="space-y-2">
        {lines.map((line) => (
          <p key={line.prefix} className={`retro-log-line retro-font-mono ${line.done ? "retro-log-line-done" : "retro-log-line-pending"}`}>
            {">"} {line.prefix}：{line.text}
          </p>
        ))}
      </div>
      {mission ? (
        <div className="mt-auto border-2 border-black bg-[var(--retro-surface-alt)] p-3 retro-dither-panel">
          <p className="text-[10px] font-black uppercase tracking-widest">Mission</p>
          <p className="retro-font-mono mt-2 text-sm font-bold leading-relaxed">{mission}</p>
        </div>
      ) : null}
      {footer ? <p className="text-[10px] font-bold opacity-50">{footer}</p> : null}
    </div>
  );
}
