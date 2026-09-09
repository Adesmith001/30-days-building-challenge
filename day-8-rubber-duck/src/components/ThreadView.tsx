import type {
  DuckSession,
} from "../schemas/session";

export function ThreadView({
  session,
}: {
  session: DuckSession;
}) {
  return (
    <div>
      <p
        className="
          mb-2
          font-mono
          text-[10px]
          tracking-[0.17em]
          text-muted
        "
      >
        REASONING MAP
      </p>

      <h2
        className="
          font-serif
          text-4xl
          md:text-5xl
        "
      >
        HOW YOU GOT THERE
      </h2>

      <p
        className="
          mt-4
          max-w-xl
          font-serif
          text-lg
          leading-8
          text-graphite
        "
      >
        The important turns,
        assumptions, and insights
        behind your conclusion.
      </p>

      <div
        className="
          mt-10
          space-y-7
        "
      >
        <ThreadNode
          index="00"
          label="PROBLEM"
          text={
            session.problem
          }
        />

        {session.turns.map(
          (
            turn,
            index,
          ) => (
            <ThreadNode
              key={
                turn.id
              }
              index={String(
                index + 1,
              ).padStart(
                2,
                "0",
              )}
              label={
                turn.type
                  .toUpperCase()
              }
              text={
                turn.answer
              }
              question={
                turn.question
              }
            />
          ),
        )}
      </div>
    </div>
  );
}

function ThreadNode({
  index,
  label,
  text,
  question,
}: {
  index: string;
  label: string;
  text: string;
  question?: string;
}) {
  return (
    <div
      className="
        border-l
        border-rule
        pl-5
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
          font-mono
          text-[9px]
          tracking-[0.14em]
          text-muted
        "
      >
        <span>
          STEP {index}
        </span>

        <span
          className="
            border
            border-rule
            px-2
            py-1
            text-graphite
          "
        >
          {label}
        </span>
      </div>

      {question ? (
        <p
          className="
            mt-3
            font-serif
            text-sm
            italic
            text-muted
          "
        >
          {question}
        </p>
      ) : null}

      <p
        className="
          mt-2
          font-serif
          text-xl
          leading-8
        "
      >
        “{text}”
      </p>
    </div>
  );
}
