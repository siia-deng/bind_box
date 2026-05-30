type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  copy?: string;
};

export function SectionHeader({ eyebrow, title, copy }: SectionHeaderProps) {
  return (
    <div className="mb-10 max-w-5xl">
      <p className="mb-4 text-lg font-bold uppercase tracking-normal">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      {copy ? (
        <p className="text-anywhere mt-8 max-w-3xl text-xl font-bold leading-tight sm:text-2xl">{copy}</p>
      ) : null}
    </div>
  );
}
