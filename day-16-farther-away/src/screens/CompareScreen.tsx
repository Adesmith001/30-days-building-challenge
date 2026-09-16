import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Download,
  Save,
  Share2,
  X,
} from "lucide-react";

import {
  toPng,
} from "html-to-image";

import CompareNav, {
  type CompareTab,
} from "../components/CompareNav";

import ShareCard from "../components/ShareCard";

import {
  calculateComparison,
} from "../lib/calculations";

import {
  formatNairaCompact,
} from "../lib/currency";

import type {
  ComparisonDraft,
  ComparisonPrefs,
} from "../types/comparison";

import BreakEvenView from "../views/BreakEvenView";
import MoneyView from "../views/MoneyView";
import OverviewView from "../views/OverviewView";
import TimeView from "../views/TimeView";
import WhatIfView from "../views/WhatIfView";

interface Props {
  baseDraft: ComparisonDraft;
  prefs: ComparisonPrefs;

  onPrefsChange:
    (prefs: ComparisonPrefs) => void;

  onEdit: () => void;

  onSave: (
    draft: ComparisonDraft,
    prefs: ComparisonPrefs,
  ) => void;

  onUnlock:
    (id: string) => void;
}

export default function CompareScreen({
  baseDraft,
  prefs,
  onPrefsChange,
  onEdit,
  onSave,
  onUnlock,
}: Props) {
  const [
    tab,
    setTab,
  ] = useState<CompareTab>(
    "overview",
  );

  const [
    draft,
    setDraft,
  ] = useState(baseDraft);

  const [
    shareOpen,
    setShareOpen,
  ] = useState(false);

  const [
    saved,
    setSaved,
  ] = useState(false);

  const cardRef =
    useRef<HTMLDivElement>(
      null,
    );

  const metrics = useMemo(
    () =>
      calculateComparison(
        draft,
      ),
    [draft],
  );

  const selectTab = (
    next: CompareTab,
  ) => {
    setTab(next);

    if (next === "money") {
      onUnlock("money");
    }

    if (next === "time") {
      onUnlock("time");
    }

    if (
      next === "break-even"
    ) {
      onUnlock(
        "breakEven",
      );
    }

    if (
      next === "what-if"
    ) {
      onUnlock("whatIf");
    }
  };

  const save = () => {
    onSave(
      draft,
      prefs,
    );

    onUnlock("save");

    setSaved(true);

    window.setTimeout(
      () =>
        setSaved(false),
      1600,
    );
  };

  const downloadCard =
    async () => {
      if (!cardRef.current) {
        return;
      }

      const dataUrl =
        await toPng(
          cardRef.current,
          {
            pixelRatio: 2,
            cacheBust: true,
          },
        );

      const link =
        document.createElement(
          "a",
        );

      link.download =
        `farther-away-${draft.homeA.name}-${draft.homeB.name}.png`
          .toLowerCase()
          .replace(
            /\s+/g,
            "-",
          );

      link.href = dataUrl;
      link.click();

      onUnlock("share");
    };

  const shareText =
    async () => {
      const text =
        `${draft.homeA.name} vs ${draft.homeB.name}: ` +
        `${formatNairaCompact(
          Math.abs(
            metrics.cashSavingsB,
          ),
        )}/yr cash difference and ` +
        `${Math.abs(
          Math.round(
            metrics.extraHoursB,
          ),
        )} commute hours/yr difference. ` +
        `Farther Away?`;

      if (navigator.share) {
        await navigator.share({
          title:
            "Farther Away?",
          text,
        });
      } else if (
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(
          text,
        );
      }

      onUnlock("share");
    };

  return (
    <>
      <div
        className="
          border-b
          border-line
          bg-paper
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-5
            py-2
            font-mono
            text-[10px]
            text-muted
            md:px-10
          "
        >
          <span>
            HOME A ·{" "}
            {draft.homeA.name.toUpperCase()}
          </span>

          <span>
            VS
          </span>

          <span>
            HOME B ·{" "}
            {draft.homeB.name.toUpperCase()}
          </span>
        </div>
      </div>

      <CompareNav
        active={tab}
        onChange={selectTab}
      />

      <main
        className="
          mx-auto
          w-full
          max-w-7xl
          px-5
          py-9
          md:px-10
          md:py-12
        "
      >
        <div
          className="
            mb-8
            flex
            flex-wrap
            justify-end
            gap-2
          "
        >
          <button
            onClick={onEdit}
            className="
              border
              border-line
              px-3
              py-2
              font-mono
              text-[10px]
              text-muted
              hover:border-ink
              hover:text-ink
            "
          >
            EDIT INPUTS
          </button>

          <button
            onClick={save}
            className="
              flex
              items-center
              gap-2
              border
              border-line
              px-3
              py-2
              font-mono
              text-[10px]
              hover:border-ink
            "
          >
            <Save size={13} />

            {saved
              ? "SAVED"
              : "SAVE"}
          </button>

          <button
            onClick={() =>
              setShareOpen(
                true,
              )
            }
            className="
              flex
              items-center
              gap-2
              border
              border-ink
              bg-ink
              px-3
              py-2
              font-mono
              text-[10px]
              text-paper
              hover:bg-cobalt
            "
          >
            <Share2
              size={13}
            />

            SHARE
          </button>
        </div>

        {tab === "overview" && (
          <OverviewView
            draft={draft}
            metrics={metrics}
          />
        )}

        {tab === "money" && (
          <MoneyView
            draft={draft}
            metrics={metrics}
          />
        )}

        {tab === "time" && (
          <TimeView
            draft={draft}
            metrics={metrics}
          />
        )}

        {tab ===
          "break-even" && (
          <BreakEvenView
            draft={draft}
            metrics={metrics}
            onRentChange={(
              annualRent,
            ) => {
              setDraft({
                ...draft,

                homeB: {
                  ...draft.homeB,
                  annualRent,
                },
              });

              onUnlock(
                "whatIf",
              );
            }}
          />
        )}

        {tab ===
          "what-if" && (
          <WhatIfView
            draft={draft}
            metrics={metrics}
            prefs={prefs}
            onPrefsChange={
              onPrefsChange
            }
            onDraftChange={
              setDraft
            }
            onExplore={(
              kind,
            ) =>
              onUnlock(kind)
            }
            onReset={() =>
              setDraft(
                baseDraft,
              )
            }
          />
        )}
      </main>

      {shareOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            overflow-y-auto
            bg-ink/50
            p-4
            md:p-8
          "
        >
          <div
            className="
              mx-auto
              max-w-2xl
              border
              border-ink
              bg-paper
              p-5
              md:p-8
            "
          >
            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >
              <div>
                <p
                  className="
                    font-mono
                    text-[10px]
                    text-muted
                  "
                >
                  SHARE RESULT
                </p>

                <h2
                  className="
                    font-serif
                    text-3xl
                  "
                >
                  THE TRADE-OFF
                  CARD.
                </h2>
              </div>

              <button
                aria-label="Close share card"
                onClick={() =>
                  setShareOpen(
                    false,
                  )
                }
              >
                <X />
              </button>
            </div>

            <ShareCard
              ref={cardRef}
              draft={draft}
              metrics={metrics}
            />

            <div
              className="
                mt-5
                flex
                flex-wrap
                gap-2
              "
            >
              <button
                onClick={
                  downloadCard
                }
                className="
                  flex
                  items-center
                  gap-2
                  border
                  border-ink
                  bg-ink
                  px-4
                  py-3
                  font-mono
                  text-[10px]
                  text-paper
                "
              >
                <Download
                  size={13}
                />

                DOWNLOAD PNG
              </button>

              <button
                onClick={
                  shareText
                }
                className="
                  flex
                  items-center
                  gap-2
                  border
                  border-ink
                  px-4
                  py-3
                  font-mono
                  text-[10px]
                "
              >
                <Share2
                  size={13}
                />

                SHARE TEXT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}