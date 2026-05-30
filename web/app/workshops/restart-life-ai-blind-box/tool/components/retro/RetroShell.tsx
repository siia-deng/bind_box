"use client";

type RetroShellProps = {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
  themeMono?: boolean;
};

export function RetroShell({ children, className = "", scrollable = false, themeMono = false }: RetroShellProps) {
  return (
    <div
      className={`retro-shell retro-desktop-bg retro-noise retro-font-ui ${scrollable ? "retro-shell-scroll" : ""} ${themeMono ? "retro-theme-mono" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
