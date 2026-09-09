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
      | Promise<unknown>;

  disabled?: boolean;

  placeholder?: string;

  buttonLabel?: string;

  suggestions?: string[];

  draftKey?: string;
}

export function ResponseComposer({
  onSubmit,
  disabled,

  placeholder =
    "Type your reflection…",

  buttonLabel =
    "ANSWER →",
  suggestions = [
    "I’m not sure yet",
    "The main issue is…",
    "What I’ve tried is…",
  ],
  draftKey,
}: Props) {
  const [
    value,
    setValue,
  ] = useState(() =>
    draftKey
      ? localStorage.getItem(draftKey) ?? ""
      : "",
  );

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

  useEffect(() => {
    if (!draftKey) {
      return;
    }

    if (value) {
      localStorage.setItem(draftKey, value);
    } else {
      localStorage.removeItem(draftKey);
    }
  }, [draftKey, value]);

  const submit = async () => {
    const trimmed =
      value.trim();

    if (
      !trimmed ||
      disabled
    ) {
      return;
    }

    const result = await onSubmit(
      trimmed,
    );

    if (
      result !== null &&
      result !== false
    ) {
      setValue("");
    }
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
        onInput={(event) => {
          event.currentTarget.style.height = "auto";
          event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
        }}
        onKeyDown={(
          event,
        ) => {
          if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.metaKey &&
            !event.ctrlKey
          ) {
            event.preventDefault();
            submit();
            return;
          }

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
        maxLength={12000}
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

      {!value && !disabled && suggestions.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setValue(suggestion)}
              className="border border-rule px-3 py-2 font-mono text-[9px] tracking-[0.1em] text-graphite hover:border-ink"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

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
