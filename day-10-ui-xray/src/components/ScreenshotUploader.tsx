import {
  ImagePlus,
} from "lucide-react";

import {
  useRef,
  useState,
} from "react";

interface Props {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function ScreenshotUploader({
  onFile,
  disabled,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [dragging, setDragging] =
    useState(false);

  function accept(files: FileList | null) {
    const file = files?.[0];

    if (file) {
      onFile(file);
    }
  }

  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDragLeave={() => {
        setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        accept(event.dataTransfer.files);
      }}
      className={[
        "w-full max-w-xl border bg-panel p-8 text-center transition-colors sm:p-12",
        dragging
          ? "border-accent"
          : "border-line",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={disabled}
        onChange={(event) =>
          accept(event.target.files)
        }
        className="hidden"
      />

      <div className="mx-auto flex size-10 items-center justify-center border border-line bg-subtle">
        <ImagePlus
          size={17}
          strokeWidth={1.5}
        />
      </div>

      <h2 className="mt-6 font-sans text-xl font-semibold tracking-[-0.03em]">
        DROP A UI SCREENSHOT
      </h2>

      <p className="mt-2 font-mono text-[10px] tracking-[0.08em] text-muted">
        PNG · JPG · WEBP
      </p>

      <button
        disabled={disabled}
        onClick={() =>
          inputRef.current?.click()
        }
        className="mt-7 bg-ink px-5 py-2.5 font-mono text-[11px] font-semibold text-white hover:bg-accent disabled:opacity-50"
      >
        CHOOSE IMAGE
      </button>
    </div>
  );
}