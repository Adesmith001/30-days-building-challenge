import {
  ArrowLeft,
  Moon,
  Sun,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

type HeaderMode =
  | "default"
  | "back"
  | "compare"
  | "cancel";

type AppHeaderProps = {
  mode?: HeaderMode;
  title?: string;
  backTo?: string;
  closeTo?: string;
  historyActive?: boolean;
};

function getInitialTheme() {
  const saved =
    localStorage.getItem("either:theme");

  if (saved === "dark") {
    return "dark";
  }

  if (saved === "light") {
    return "light";
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(
    getInitialTheme,
  );

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark",
    );

    localStorage.setItem(
      "either:theme",
      theme,
    );
  }, [theme]);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() =>
        setTheme((current) =>
          current === "dark"
            ? "light"
            : "dark",
        )
      }
      className="
        flex size-8 items-center
        justify-center rounded-lg
        text-[#717171] transition
        hover:bg-[#f3f3f3]
        hover:text-[#111111]
        dark:hover:bg-[#181818]
        dark:hover:text-white
      "
    >
      {theme === "dark" ? (
        <Sun size={17} />
      ) : (
        <Moon size={17} />
      )}
    </button>
  );
}

export function AppHeader({
  mode = "default",
  title,
  backTo = "/",
  closeTo = "/",
  historyActive = false,
}: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className="
        sticky top-0 z-40 w-full
        border-b border-[#e7e7e7]
        bg-[#fafafa]/95
        backdrop-blur-md
        dark:border-[#242424]
        dark:bg-[#0b0b0b]/95
      "
    >
      <div
        className="
          relative mx-auto flex h-16
          w-full max-w-[1080px]
          items-center justify-between
          px-4 md:px-8
        "
      >
        <div className="flex items-center gap-3">
          {mode === "back" && (
            <button
              type="button"
              onClick={() => {
                if (backTo) {
                  navigate(backTo);
                } else {
                  navigate(-1);
                }
              }}
              className="
                flex size-8 items-center
                justify-center rounded-lg
                text-[#717171]
                transition
                hover:bg-[#f3f3f3]
                hover:text-[#111111]
                dark:hover:bg-[#181818]
                dark:hover:text-white
              "
            >
              <ArrowLeft size={17} />
            </button>
          )}

          <Link
            to="/"
            className="
              text-[18px] font-bold
              tracking-[-0.04em]
              text-[#111111]
              dark:text-[#f5f5f5]
            "
          >
            either.
          </Link>
        </div>

        {mode === "compare" && title && (
          <p
            className="
              absolute left-1/2
              max-w-[48%]
              -translate-x-1/2
              truncate text-[13px]
              font-medium
              text-[#717171]
              dark:text-[#a3a3a3]
            "
          >
            {title}
          </p>
        )}

        {mode === "default" && (
          <div className="flex items-center gap-5">
            <Link
              to="/history"
              className={`
                text-[13px] font-medium
                transition
                ${
                  historyActive
                    ? "text-[#111111] underline underline-offset-4 dark:text-white"
                    : "text-[#717171] hover:text-[#111111] dark:text-[#a3a3a3] dark:hover:text-white"
                }
              `}
            >
              History
            </Link>

            <ThemeToggle />
          </div>
        )}

        {mode === "back" && (
          <ThemeToggle />
        )}

        {mode === "compare" && (
          <Link
            to={closeTo}
            className="
              flex size-8 items-center
              justify-center rounded-lg
              text-[#717171]
              transition
              hover:bg-[#f3f3f3]
              hover:text-[#111111]
              dark:hover:bg-[#181818]
              dark:hover:text-white
            "
          >
            <X size={17} />
          </Link>
        )}

        {mode === "cancel" && (
          <Link
            to={closeTo}
            className="
              flex items-center gap-1.5
              rounded-lg px-2 py-1.5
              text-[12px] font-medium
              text-[#717171]
              transition
              hover:text-[#111111]
              dark:text-[#a3a3a3]
              dark:hover:text-white
            "
          >
            <X size={14} />
            Cancel
          </Link>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer
      className="
        w-full border-t
        border-[#e7e7e7]
        dark:border-[#242424]
      "
    >
      <div
        className="
          mx-auto flex w-full
          max-w-[1080px]
          flex-col items-center
          justify-between gap-4
          px-4 py-6
          text-[11px]
          text-[#717171]
          md:flex-row md:px-8
          dark:text-[#8a8a8a]
        "
      >
        <span>
          © either. Minimalist binary
          choice & ranking.
        </span>

        <div className="flex items-center gap-5">
          <button type="button">
            Terms
          </button>

          <button type="button">
            Privacy
          </button>

          <span className="text-[#b0b0b0]">
            Shortcuts
          </span>
        </div>
      </div>
    </footer>
  );
}