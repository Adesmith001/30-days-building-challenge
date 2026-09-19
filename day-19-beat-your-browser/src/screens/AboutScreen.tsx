import {
  SectionLabel,
} from "../components/SectionLabel";

export function AboutScreen() {
  return (
    <main
      className="
        mx-auto
        max-w-5xl
        px-4
        py-10
        md:px-6
      "
    >
      <SectionLabel tone="lime">
        ABOUT THE EXPERIMENT
      </SectionLabel>

      <h1
        className="
          mt-3
          text-4xl
          font-semibold
          tracking-[-.045em]
          sm:text-5xl
        "
      >
        THE MAIN THREAD VS WEB WORKERS.
      </h1>

      <div
        className="
          mt-8
          grid
          gap-4
          md:grid-cols-2
        "
      >
        <Info
          title="THE MAIN THREAD"
          tone="amber"
        >
          Most page JavaScript, user input handling, and DOM work share the main thread. Long synchronous CPU work can stop the page from responding promptly.
        </Info>

        <Info
          title="WEB WORKERS"
          tone="cyan"
        >
          Workers run JavaScript separately from the page's main execution context. They communicate with messages and cannot directly manipulate the DOM.
        </Info>
      </div>

      <div
        className="
          mt-4
          grid
          gap-4
          md:grid-cols-2
        "
      >
        <Info
          title="GOOD CANDIDATES"
          tone="lime"
        >
          Data processing, parsing, simulations, image calculations, procedural generation, indexing, and other expensive work that does not need direct DOM access.
        </Info>

        <Info
          title="NOT AUTOMATICALLY BETTER"
          tone="muted"
        >
          Tiny computations, DOM work, network-bound operations, or tasks where worker startup and message overhead cost more than the computation itself.
        </Info>
      </div>

      <section
        className="
          mt-4
          border
          border-line
          bg-canvas
          p-5
          text-sm
          leading-6
          text-muted
        "
      >
        <strong
          className="
            text-ink
          "
        >
          Benchmark disclaimer.
        </strong>{" "}

        Beat Your Browser is an interactive demonstration, not a standardized hardware benchmark. Results vary with browser, device, refresh rate, thermal state, background activity, and workload. Compare modes within the same run rather than treating these numbers as universal scores.
      </section>
    </main>
  );
}

function Info({
  title,
  tone,
  children,
}: {
  title: string;

  tone:
    | "amber"
    | "cyan"
    | "lime"
    | "muted";

  children:
    React.ReactNode;
}) {
  const color = {
    amber:
      "text-amber",

    cyan:
      "text-cyan",

    lime:
      "text-lime",

    muted:
      "text-muted",
  }[tone];

  return (
    <section
      className="
        border
        border-line
        bg-panel
        p-5
      "
    >
      <div
        className={`
          font-mono
          text-[10px]
          ${color}
        `}
      >
        {title}
      </div>

      <p
        className="
          mt-4
          text-sm
          leading-6
          text-muted
        "
      >
        {children}
      </p>
    </section>
  );
}