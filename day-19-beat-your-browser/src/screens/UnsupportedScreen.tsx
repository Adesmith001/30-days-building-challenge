export function UnsupportedScreen() {
  return (
    <main
      className="
        grid
        min-h-screen
        place-items-center
        bg-canvas
        px-4
      "
    >
      <section
        className="
          max-w-xl
          border
          border-line
          bg-panel
          p-8
        "
      >
        <div
          className="
            font-mono
            text-[10px]
            text-danger
          "
        >
          WEB WORKER REQUIRED
        </div>

        <h1
          className="
            mt-4
            text-4xl
            font-semibold
            tracking-tight
          "
        >
          THIS BROWSER CAN'T RUN THE RACE.
        </h1>

        <p
          className="
            mt-4
            text-sm
            leading-6
            text-muted
          "
        >
          Web Worker support is required for the comparison. Worker mode is not simulated.
        </p>
      </section>
    </main>
  );
}