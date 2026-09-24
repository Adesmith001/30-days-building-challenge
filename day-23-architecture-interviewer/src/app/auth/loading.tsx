import {
  Spinner,
} from "@/components/ui/spinner";
import Image from "next/image";

export default function AuthLoading() {
  return (
    <main
      className="
        grid min-h-dvh
        place-items-center
      "
    >
      <div
        className="
          text-center
        "
      >
        <div
          className="
            flex items-center justify-center gap-2
            text-[10px] font-medium
            tracking-[0.12em]
          "
        >
          <Image
            src="/brand/architecture-mark.svg"
            alt=""
            aria-hidden="true"
            className="size-6"
            width={24}
            height={24}
          />
          ARCHITECTURE INTERVIEWER
        </div>

        <div
          className="
            mt-6 flex
            items-center
            justify-center
            gap-3
            text-xs
            tracking-wide
            text-muted
          "
        >
          <Spinner />

          SIGNING YOU IN...
        </div>
      </div>
    </main>
  );
}
