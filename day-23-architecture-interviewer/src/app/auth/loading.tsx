import {
  Spinner,
} from "@/components/ui/spinner";

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
        <p
          className="
            text-[10px]
            font-medium
            tracking-[0.12em]
          "
        >
          ARCHITECTURE INTERVIEWER
        </p>

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
