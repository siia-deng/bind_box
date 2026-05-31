type HurdleMarkProps = {
  color?: boolean;
  compact?: boolean;
};

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function HurdleMark({ color = false, compact = false }: HurdleMarkProps) {
  void color;

  return (
    <img
      src={`${publicBasePath}/hurdle-club-logo.svg`}
      alt="Hurdle Club"
      className={compact ? "block h-10 w-auto mix-blend-multiply" : "block h-16 w-auto mix-blend-multiply sm:h-20"}
    />
  );
}
