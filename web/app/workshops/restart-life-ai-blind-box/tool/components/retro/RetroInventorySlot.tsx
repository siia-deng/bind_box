type RetroInventorySlotProps = {
  label: string;
  active?: boolean;
  filled?: boolean;
  dense?: boolean;
  children: React.ReactNode;
  slotRef?: (element: HTMLDivElement | null) => void;
};

export function RetroInventorySlot({ label, active, filled, dense, children, slotRef }: RetroInventorySlotProps) {
  return (
    <div
      ref={slotRef}
      className={`retro-inventory-slot ${dense ? "retro-inventory-slot-dense" : ""} ${active ? "retro-inventory-slot-active" : ""} ${filled ? "retro-inventory-slot-filled" : ""}`}
      title={label}
    >
      {children}
      <span className="retro-slot-label retro-font-mono">{dense ? label.replace("卡", "") : label}</span>
    </div>
  );
}
