import {
    useState,
  type FormEvent,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  AppHeader,
  Footer,
} from "../components/Chrome";

import {
  saveNewDecisionDraft,
} from "../lib/storage";

export default function NewDecisionPage() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const [title, setTitle] =
    useState(
      searchParams.get("title") ?? "",
    );

  const [error, setError] =
    useState("");

  function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError(
        "Give this decision a name first.",
      );

      return;
    }

    saveNewDecisionDraft({
      title: cleanTitle,
    });

    navigate("/new/options");
  }

  return (
    <div
      className="
        flex min-h-screen
        flex-col bg-[#fafafa]
        dark:bg-[#0b0b0b]
      "
    >
      <AppHeader
        mode="back"
        backTo="/"
      />

      <main
        className="
          mx-auto flex w-full
          max-w-[1080px]
          flex-1 items-start
          justify-center
          px-4 py-16
          md:px-8 md:py-24
        "
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[600px]"
        >
          <h1
            className="
              mb-3 text-[31px]
              font-semibold
              tracking-[-0.04em]
              text-[#111111]
              md:text-[36px]
              dark:text-[#f5f5f5]
            "
          >
            What are you trying to
            decide?
          </h1>

          <p
            className="
              mb-8 text-[14px]
              text-[#717171]
              dark:text-[#999]
            "
          >
            Name the decision. Keep it
            simple.
          </p>

          <input
            autoFocus
            value={title}
            onChange={(event) => {
              setTitle(
                event.target.value,
              );

              setError("");
            }}
            placeholder="e.g. What should we eat tonight?"
            className="
              h-14 w-full rounded-xl
              border border-[#e1e1e1]
              bg-white px-4
              text-[15px]
              text-[#111111]
              outline-none
              transition
              placeholder:text-[#9a9a9a]
              focus:border-[#111111]
              dark:border-[#292929]
              dark:bg-[#121212]
              dark:text-white
              dark:focus:border-white
            "
          />

          {error && (
            <p
              className="
                mt-2 text-[12px]
                text-[#ba1a1a]
              "
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="
              mt-5 h-11 w-full
              rounded-xl bg-[#111111]
              text-[13px] font-medium
              text-white transition
              hover:bg-[#292929]
              active:scale-[0.99]
              dark:bg-white
              dark:text-[#111111]
            "
          >
            Continue
            <span className="ml-2">
              →
            </span>
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}