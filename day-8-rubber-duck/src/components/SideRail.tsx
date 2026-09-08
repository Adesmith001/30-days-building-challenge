import type {
  DuckSession,
} from "../schemas/session";

interface Props {
  session:
    DuckSession;

  onThread:
    () => void;
}

export function SideRail({
  session,
  onThread,
}: Props) {
  return (
    <aside
      className="
        space-y-8
        border-t
        border-rule
        pt-8
        lg:border-l
        lg:border-t-0
        lg:pl-8
        lg:pt-0
      "
    >
      <RailSection
        title="KEY INSIGHTS"
        items={
          session.insights.slice(
            -3,
          )
        }
        empty="Nothing locked in yet."
      />

      <RailSection
        title="ASSUMPTIONS"
        items={
          session.assumptions.slice(
            -4,
          )
        }
        empty="No assumptions flagged yet."
      />

      <RailSection
        title="WHAT WE KNOW"
        items={
          session.evidence.slice(
            -4,
          )
        }
        empty="Evidence will collect here."
      />

      {session.tryThis ? (
        <div
          className="
            border
            border-rule
            bg-wash/45
            p-4
          "
        >
          <p
            className="
              mb-2
              font-mono
              text-[9px]
              tracking-[0.16em]
              text-muted
            "
          >
            TRY THIS
          </p>

          <p
            className="
              font-serif
              text-[15px]
              leading-6
              text-graphite
            "
          >
            {session.tryThis}
          </p>
        </div>
      ) : null}

      <button
        onClick={
          onThread
        }
        className="
          border-b
          border-ink
          pb-1
          font-mono
          text-[10px]
          tracking-[0.14em]
        "
      >
        YOUR THREAD (
        {session.turns.length}
        ) →
      </button>
    </aside>
  );
}

function RailSection({
  title,
  items,
  empty,
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <section>
      <h3
        className="
          mb-3
          font-mono
          text-[9px]
          tracking-[0.17em]
          text-muted
        "
      >
        {title}
      </h3>

      {items.length ? (
        <ul className="space-y-3">
          {items.map(
            (item) => (
              <li
                key={
                  item
                }
                className="
                  border-l
                  border-rule
                  pl-3
                  font-serif
                  text-[15px]
                  leading-6
                  text-graphite
                "
              >
                {item}
              </li>
            ),
          )}
        </ul>
      ) : (
        <p
          className="
            font-serif
            text-[14px]
            italic
            text-muted
          "
        >
          {empty}
        </p>
      )}
    </section>
  );
}