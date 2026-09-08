import {
  useEffect,
  useRef,
  useState,
} from "react";

interface Props {
  onSubmit:
    (
      value: string,
    ) =>
      | void
      | Promise<void>;

  disabled?: boolean;

  placeholder?: string;

  buttonLabel?: string;
}

export function ResponseComposer({
  onSubmit,
  disabled,

  placeholder =
    "Type your reflection…",

  buttonLabel =
    "ANSWER →",
}: Props) {
  const [
    value,
    setValue,
  ] = useState("");

  const ref =
    useRef<
      HTMLTextAreaElement
    >(null);

  useEffect(
    () => {
      ref.current
        ?.focus();
    },

    [placeholder],
  );

  const submit = () => {
    const trimmed =
      value.trim();

    if (
      !trimmed ||
      disabled
    ) {
      return;
    }

    void onSubmit(
      trimmed,
    );

    setValue("");
  };

  return (
    <div
      className="
        border-l
        border-ink
        pl-5
        md:pl-7
      "
    >
      <textarea
        ref={ref}
        value={value}
        onChange={(
          event,
        ) =>
          setValue(
            event.target.value,
          )
        }
        onKeyDown={(
          event,
        ) => {
          if (
            (
              event.metaKey ||
              event.ctrlKey
            ) &&
            event.key ===
              "Enter"
          ) {
            submit();
          }
        }}
        placeholder={
          placeholder
        }
        rows={5}
        disabled={
          disabled
        }
        className="
          w-full
          resize-none
          bg-transparent
          font-serif
          text-xl
          leading-8
          outline-none
          placeholder:italic
          placeholder:text-muted
          disabled:opacity-50
        "
      />

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          gap-4
          border-t
          border-rule
          pt-5
        "
      >
        <span
          className="
            hidden
            font-mono
            text-[9px]
            tracking-[0.14em]
            text-muted
            sm:block
          "
        >
          ⌘ + ENTER TO CONTINUE
        </span>

        <button
          onClick={
            submit
          }
          disabled={
            disabled ||
            !value.trim()
          }
          className="
            ml-auto
            border
            border-ink
            bg-ink
            px-6
            py-3
            font-mono
            text-[10px]
            tracking-[0.16em]
            text-white
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}