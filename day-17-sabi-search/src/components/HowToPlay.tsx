import {
  ModalShell,
} from "./ModalShell";

const example = [
  {
    letter: "S",
    style:
      "bg-[#174c3b] text-white border-[#174c3b]",
  },
  {
    letter: "A",
    style:
      "bg-[#b56820] text-white border-[#b56820]",
  },
  {
    letter: "P",
    style:
      "bg-[#d8d3cc] text-[#5c5751] border-[#d8d3cc]",
  },
  {
    letter: "A",
    style:
      "border-[#cfc8be]",
  },
];

export function HowToPlay({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <ModalShell
      eyebrow="FIELD GUIDE · 01"
      title="How to play"
      onClose={onClose}
    >
      <div
        className="
          space-y-6
          py-6
          text-sm
          leading-6
          text-[#514d48]
        "
      >
        <p>
          We give you a
          Nigerian word's
          meaning or context.
          You get{" "}
          <b>five tries</b>{" "}
          to find the hidden
          word. Every guess
          must have the same
          number of letters
          as the answer.
        </p>

        <div
          className="
            grid
            max-w-xs
            grid-cols-4
            gap-2
          "
        >
          {example.map(
            (
              cell,
              index,
            ) => (
              <div
                key={index}
                className={`
                  grid
                  aspect-square
                  place-items-center
                  border
                  font-semibold
                  ${cell.style}
                `}
              >
                {cell.letter}
              </div>
            ),
          )}
        </div>

        <div
          className="
            space-y-3
            border-y
            border-[#d9d2c8]
            py-5
          "
        >
          <p>
            <b
              className="
                text-[#174c3b]
              "
            >
              GREEN
            </b>
            {" — "}
            correct letter,
            correct position.
          </p>

          <p>
            <b
              className="
                text-[#a65c18]
              "
            >
              AMBER
            </b>
            {" — "}
            correct letter,
            wrong position.
          </p>

          <p>
            <b
              className="
                text-[#77716a]
              "
            >
              GREY
            </b>
            {" — "}
            that letter isn't
            in the answer.
          </p>
        </div>

        <p>
          You may use one
          context hint per
          puzzle. It costs
          100 Sabi Points.
          Daily Sabi is the
          same puzzle for
          everyone and can
          only count once
          per day on this
          device.
        </p>
      </div>
    </ModalShell>
  );
}