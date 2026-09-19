import type {
  ReactNode,
} from "react";

export function ModeCard({
  eyebrow,
  title,
  children,
  onClick,
  image,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  onClick: () => void;
  image?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="
        group
        relative
        min-h-36
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-night-2
        p-4
        text-left
        transition
        hover:-translate-y-0.5
        hover:border-white/20
      "
    >
      {image && (
        <>
          <img
            src={image}
            alt=""
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              opacity-35
              transition
              group-hover:scale-105
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-night-2
              via-night-2/85
              to-night-2/20
            "
          />
        </>
      )}

      <div
        className="
          relative
          max-w-[75%]
        "
      >
        <span
          className="
            font-display
            text-[10px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-gold
          "
        >
          {eyebrow}
        </span>

        <h3
          className="
            mt-1
            font-display
            text-xl
            font-bold
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-2
            text-sm
            leading-5
            text-slate-300
          "
        >
          {children}
        </p>
      </div>
    </button>
  );
}