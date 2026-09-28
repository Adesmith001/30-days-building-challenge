import {
  Download,
  Moon,
  Palette,
  Search,
  Shuffle,
  Sparkles,
  Type,
  X,
} from "lucide-react"
import {
  useEffect,
  useState,
} from "react"
import {
  useBrandStore,
} from "../store/brand-store"

export function CommandPalette() {
  const [open, setOpen] =
    useState(false)

  const setView =
    useBrandStore((state) => state.setView)

  const remix =
    useBrandStore((state) => state.remix)

  const toggleTheme =
    useBrandStore(
      (state) => state.toggleTheme,
    )

  useEffect(() => {
    function handle(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault()

        setOpen((value) => !value)
      }

      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener(
      "keydown",
      handle,
    )

    return () =>
      window.removeEventListener(
        "keydown",
        handle,
      )
  }, [])

  if (!open) {
    return null
  }

  const commands = [
    {
      label: "Open palette",
      icon: Palette,
      action: () => setView("palette"),
    },
    {
      label: "Open typography",
      icon: Type,
      action: () => setView("type"),
    },
    {
      label: "Remix direction",
      icon: Shuffle,
      action: remix,
    },
    {
      label: "Toggle dark mode",
      icon: Moon,
      action: toggleTheme,
    },
    {
      label: "Stress test",
      icon: Sparkles,
      action: () => setView("stress"),
    },
    {
      label: "Export system",
      icon: Download,
      action: () => setView("export"),
    },
  ]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/35 px-4 pt-[14vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden border border-black/15 bg-[#f7f6f2] shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center gap-3 border-b border-black/10 px-4 py-4">
          <Search
            size={16}
            className="text-black/40"
          />

          <div className="flex-1 text-sm text-black/45">
            Command palette
          </div>

          <button
            onClick={() =>
              setOpen(false)
            }
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-2">
          {commands.map(
            ({
              label,
              icon: Icon,
              action,
            }) => (
              <button
                key={label}
                onClick={() => {
                  action()
                  setOpen(false)
                }}
                className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm hover:bg-black/5"
              >
                <Icon size={15} />
                {label}
              </button>
            ),
          )}
        </div>

        <div className="border-t border-black/10 px-4 py-3 text-[9px] font-bold tracking-[0.1em] text-black/30">
          CMD / CTRL + K
        </div>
      </div>
    </div>
  )
}