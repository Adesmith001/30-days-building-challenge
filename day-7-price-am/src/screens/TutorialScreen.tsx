import { useState } from "react";
import { Button } from "../components/Button";
import { TutorialCard } from "../components/TutorialCard";

interface Props {
  onComplete: () => void;
  onExit: () => void;
}

export function TutorialScreen({
  onComplete,
  onExit,
}: Props) {
  const [step, setStep] = useState(0);

  if (step === 1) {
    return (
      <main className="mx-auto max-w-[620px] px-5 pt-8">
        <div className="text-center">
          <div
            className="
              inline-block rounded-full border
              border-[#c7cec6] bg-[#f4f3ef]
              px-4 py-2 font-mono text-[10px]
              font-bold tracking-[0.14em]
            "
          >
            ● TUTORIAL · STEP 01
          </div>

          <h1 className="mt-4 text-3xl font-black">
            SWIPE THIS CARD AWAY.
          </h1>

          <p className="mt-2 text-[#606860]">
            Master deck navigation before facing real
            marketplace odds.
          </p>
        </div>

        <div className="mx-auto mt-7 max-w-[500px]">
          <TutorialCard
            onComplete={() => setStep(2)}
          />
        </div>
      </main>
    );
  }

  if (step === 2) {
    return (
      <main className="mx-auto max-w-[720px] px-5 pt-28">
        <div className="text-center">
          <div
            className="
              mx-auto max-w-[250px] rounded-full
              border border-[#bfcbbf] px-4 py-2
              font-mono text-[10px] font-bold
              tracking-[0.13em] text-[#075d38]
            "
          >
            ● DRILL BRIEFING COMPLETED
          </div>

          <h1
            className="
              mt-5 text-5xl font-black
              tracking-[-0.05em]
            "
          >
            THAT'S IT.
          </h1>

          <p className="mt-3 text-lg text-[#555d56]">
            Now let's see if you actually know market.
          </p>
        </div>

        <div
          className="
            mx-auto mt-12 max-w-[700px]
            rounded-2xl border border-[#b6c4b8]
            bg-white p-7 shadow-lg
          "
        >
          <div
            className="
              flex justify-between border-b
              border-[#ccd3cc] pb-4 font-mono
              text-xs font-bold tracking-[0.12em]
            "
          >
            <span>TUTORIAL PROTOCOL</span>
            <span className="text-[#075d38]">
              GUESS · LOCK · SWIPE
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Protocol
              number="01"
              title="GUESS"
              text="Adjust the price controls to match your market instinct."
            />

            <Protocol
              number="02"
              title="LOCK"
              text="Commit your Naira estimate before courage leaves you."
            />

            <Protocol
              number="03"
              title="SWIPE"
              text="Discard unfamiliar items to preserve your streak."
            />
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[520px]">
          <Button className="w-full" onClick={onComplete}>
            START PRICE RUN →
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[760px] px-5 pt-20">
      <div>
        <div
          className="
            font-mono text-xs font-bold
            tracking-[0.13em] text-[#075d38]
          "
        >
          ● ORIENTATION MANUAL
        </div>

        <h1
          className="
            mt-2 text-5xl font-black
            tracking-[-0.05em]
          "
        >
          THREE THINGS.
        </h1>

        <p className="mt-2 text-[#565f58]">
          Master the unspoken protocol of Nigerian
          commerce before the round begins.
        </p>
      </div>

      <div
        className="
          mt-10 rounded-2xl border border-[#d1cbc2]
          bg-white p-6 shadow-lg
        "
      >
        <div
          className="
            flex justify-between border-b
            border-[#ddd7ce] pb-4 font-mono
            text-xs font-bold
          "
        >
          <span className="text-[#925506]">
            ■ FIELD DIRECTIVE
          </span>

          <span>SEC. 02 / PROTOCOL</span>
        </div>

        <Directive
          number="01"
          title="GUESS THE PRICE"
          side="INPUT"
        >
          Enter your street valuation in Nigerian Naira
          based on what you think the item costs.
        </Directive>

        <Directive
          number="02"
          title="LOCK YOUR ANSWER"
          side="CONFIRM"
        >
          Commit your estimate. Points scale based on
          proximity to the verified game value.
        </Directive>

        <Directive
          number="03"
          title="DON'T KNOW? SWIPE AWAY."
          side="DISCARD"
        >
          Pass unfamiliar items to protect your current
          streak. You have three skips per run.
        </Directive>
      </div>

      <Button
        className="mt-8 w-full"
        onClick={() => setStep(1)}
      >
        TRY IT →
      </Button>

      <button
        className="
          mt-5 w-full font-mono text-[10px]
          font-bold tracking-[0.13em]
          text-[#707870]
        "
        onClick={onExit}
      >
        RETURN TO PRICE AM
      </button>
    </main>
  );
}

function Directive({
  number,
  title,
  side,
  children,
}: {
  number: string;
  title: string;
  side: string;
  children: string;
}) {
  return (
    <div
      className="
        grid grid-cols-[44px_1fr_auto] gap-4
        border-b border-dashed border-[#ded8cf]
        py-7 last:border-none
      "
    >
      <span
        className="
          flex h-10 w-10 items-center justify-center
          rounded border border-[#ddd8d0]
          bg-[#f6f4f0] font-mono text-xs
          font-bold text-[#075d38]
        "
      >
        {number}
      </span>

      <div>
        <h3 className="text-xl font-black">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#555e57]">
          {children}
        </p>
      </div>

      <span className="font-mono text-[9px] font-bold">
        {side}
      </span>
    </div>
  );
}

function Protocol({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div
      className="
        rounded-xl border border-[#c7d0c7]
        bg-[#f7f6f3] p-5
      "
    >
      <div
        className="
          font-mono text-xs font-bold
          text-[#075d38]
        "
      >
        {number}
      </div>

      <h3 className="mt-5 text-2xl font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#555d56]">
        {text}
      </p>
    </div>
  );
}