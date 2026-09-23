export default function LoadingChat() {
  return (
    <div
      className="
        flex h-dvh
        flex-col
      "
    >
      <div
        className="
          h-14 border-b
        "
      />

      <div
        className="
          mx-auto
          w-full
          max-w-[780px]
          flex-1
          space-y-7
          px-6 py-10
        "
      >
        <div
          className="
            ml-auto
            h-16 w-2/3
            animate-pulse
            rounded-lg
            bg-surface-subtle
          "
        />

        <div
          className="
            h-20 w-4/5
            animate-pulse
            rounded-md
            bg-surface-subtle
          "
        />

        <div
          className="
            ml-auto
            h-14 w-1/2
            animate-pulse
            rounded-lg
            bg-surface-subtle
          "
        />
      </div>
    </div>
  );
}
