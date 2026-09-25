interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: Props) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="mb-2 font-mono text-[10px] tracking-[0.2em] text-zinc-500">
          {eyebrow}
        </p>
      )}

      <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          {description}
        </p>
      )}
    </div>
  );
}
