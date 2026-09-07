import { prices } from "../data/prices";

export function SpecimenCard() {
  const item = prices[1];

  return (
    <div className="relative mx-auto mt-12 max-w-[500px]">
      <div
        className="
          absolute inset-x-3 bottom-[-16px] top-4
          rotate-2 rounded-2xl border
          border-[#c9d0c9] bg-[#efeeeb]
        "
      />

      <article
        className="
          relative rounded-2xl border
          border-[#c1c9c1] bg-white p-5
          shadow-[0_22px_45px_rgba(20,30,22,0.1)]
        "
      >
        <div
          className="
            flex justify-between border-b
            border-[#dedfdc] pb-3 font-mono
            text-[10px] font-bold tracking-[0.13em]
          "
        >
          <span>CARD SAMPLE</span>
          <span className="text-[#8e5300]">
            MILE 12 / KETU
          </span>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-xl">
          <img
            src={item.image}
            alt={item.name}
            className="aspect-[4/3] w-full object-cover"
          />

          <div
            className="
              absolute bottom-3 left-3 rounded
              bg-white/95 px-3 py-2 font-mono
              text-[9px] font-black tracking-[0.12em]
            "
          >
            PRICE CHECKED
          </div>
        </div>

        <h3 className="mt-4 text-xl font-black">
          Paint Bucket Tomatoes
        </h3>

        <p className="mt-1 text-sm text-[#626862]">
          One paint rubber. Fresh Lagos market pricing,
          rounded for gameplay.
        </p>

        <div
          className="
            mt-12 flex items-end justify-between
            border-t border-[#e0e2df] pt-4
          "
        >
          <div>
            <div
              className="
                font-mono text-[9px] font-bold
                tracking-[0.13em] text-[#717971]
              "
            >
              YOUR GUESS
            </div>

            <div className="font-mono text-xl font-black">
              NGN ?,???
            </div>
          </div>

          <div
            className="
              rounded border border-dashed
              border-[#c2c8c1] px-3 py-2
              font-mono text-[9px] font-bold
              tracking-[0.12em]
            "
          >
            * OYA GUESS
          </div>
        </div>
      </article>
    </div>
  );
}
