interface Props {
  children:
    React.ReactNode;

  tone?:
    | "lime"
    | "cyan"
    | "amber"
    | "muted";
}

export function SectionLabel({
  children,
  tone = "muted",
}: Props) {
  const color = {
    lime: "text-lime",
    cyan: "text-cyan",
    amber: "text-amber",
    muted: "text-muted",
  }[tone];

  return (
    <div
      className={`
        font-mono
        text-[10px]
        tracking-[.12em]
        ${color}
      `}
    >
      {children}
    </div>
  );
}