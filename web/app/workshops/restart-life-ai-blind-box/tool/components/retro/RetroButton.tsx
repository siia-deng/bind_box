type RetroButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "primary" | "accent" | "alert";
  className?: string;
  title?: string;
  type?: "button" | "submit";
};

export function RetroButton({
  children,
  onClick,
  disabled,
  variant = "default",
  className = "",
  title,
  type = "button"
}: RetroButtonProps) {
  const variantClass =
    variant === "primary"
      ? "retro-btn-primary"
      : variant === "accent"
        ? "retro-btn-accent"
        : variant === "alert"
          ? "retro-btn-alert"
          : "";

  return (
    <button type={type} title={title} onClick={onClick} disabled={disabled} className={`retro-btn retro-font-mono ${variantClass} ${className}`}>
      {children}
    </button>
  );
}
