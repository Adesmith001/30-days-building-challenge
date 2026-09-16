import type {
  ReactNode,
} from "react";

import {
  motion,
} from "motion/react";

interface Props {
  step: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export default function SetupShell({
  step,
  eyebrow,
  title,
  description,
  children,
}: Props) {
  return (
    <motion.main
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        mx-auto
        w-full
        max-w-5xl
        px-5
        py-10
        md:px-10
        md:py-16
      "
    >
      <div
        className="
          mb-10
          grid
          gap-7
          border-b
          border-line
          pb-8
          md:grid-cols-[1fr_2fr]
        "
      >
        <div
          className="
            font-mono
            text-xs
            text-muted
          "
        >
          SETUP // {step}
        </div>

        <div>
          <p
            className="
              mb-3
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-muted
            "
          >
            {eyebrow}
          </p>

          <h1
            className="
              max-w-3xl
              font-serif
              text-4xl
              leading-[1.05]
              md:text-6xl
            "
          >
            {title}
          </h1>

          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-6
              text-muted
              md:text-base
            "
          >
            {description}
          </p>
        </div>
      </div>

      {children}
    </motion.main>
  );
}