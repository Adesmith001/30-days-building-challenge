import {
  assets,
} from "../data/assets";

import {
  loadRecords,
} from "../lib/storage";

import {
  AppShell,
} from "../components/AppShell";

import {
  ModeCard,
} from "../components/ModeCard";

import {
  PrimaryButton,
} from "../components/PrimaryButton";

interface Props {
  onStart: () => void;
  onDaily: () => void;
  onTutorial: () => void;
  onCategories: () => void;
  onBlind: () => void;
  onGap: () => void;
  onHistory: () => void;
  onNavigate: (
    target:
      | "home"
      | "daily"
      | "history",
  ) => void;
}

    export function HomeScreen(
  props: Props,
) {
  const records =
    loadRecords();

  return (
    <AppShell
      active="play"
      onNavigate={
        props.onNavigate
      }
    >
      <section
        className="
          flex
          flex-1
          flex-col
          justify-center
          py-5
        "
      >
        <div
          className="
            text-center
          "
        >
          <span
            className="
              font-display
              text-xs
              font-bold
              tracking-[0.2em]
              text-emerald-300
            "
          >
            VISUAL ORDERING GAME
          </span>

          <h1
            className="
              mt-3
              font-display
              text-4xl
              font-bold
              leading-none
              tracking-tight
              sm:text-5xl
            "
          >
            THINK YOU KNOW
            <br />

            <span
              className="
                text-gold
              "
            >
              WHAT COMES FIRST?
            </span>
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-sm
              text-sm
              leading-6
              text-slate-300
            "
          >
            Four things.
            One correct order.
            Tap them into place,
            lock it, then watch
            the truth snap
            together.
          </p>
        </div>

        <div
          className="
            recessed
            mt-6
            rounded-3xl
            border
            border-white/10
            bg-well
            p-3
          "
        >
          <div
            className="
              mb-3
              flex
              items-center
              justify-between
              px-1
              font-display
              text-[10px]
              font-bold
            "
          >
            <span
              className="
                text-slate-500
              "
            >
              QUICK PREVIEW
            </span>

            <span
              className="
                text-emerald-300
              "
            >
              OLDEST → NEWEST
            </span>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-3
            "
          >
            {[
              [
                assets.music,
                "VINYL",
              ],
              [
                assets.social,
                "SOCIAL",
              ],
              [
                assets.gaming,
                "GAMES",
              ],
              [
                assets.lagos,
                "NIGERIA",
              ],
            ].map(
              ([
                image,
                label,
              ]) => (
                <div
                  key={label}
                  className="
                    tactile-tile
                    relative
                    aspect-[1.2]
                    overflow-hidden
                    rounded-2xl
                    bg-white
                  "
                >
                  <img
                    src={image}
                    alt=""
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/80
                      to-transparent
                    "
                  />

                  <span
                    className="
                      absolute
                      bottom-2
                      left-3
                      font-display
                      text-sm
                      font-bold
                    "
                  >
                    {label}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div
          className="
            mt-5
            space-y-3
          "
        >
          <PrimaryButton
            onClick={
              props.onStart
            }
          >
            START SORTING →
          </PrimaryButton>

          <button
            onClick={
              props.onTutorial
            }
            className="
              w-full
              py-1
              text-center
              text-xs
              font-semibold
              text-slate-400
              hover:text-white
            "
          >
            HOW TO PLAY ·
            20 SECOND TUTORIAL
          </button>

          <p
            className="
              text-center
              font-display
              text-[10px]
              font-bold
              tracking-widest
              text-slate-500
            "
          >
            10 ROUNDS ·
            TAP TO ORDER ·
            NO MULTIPLE CHOICE
          </p>
        </div>

        <div
          className="
            mt-7
            grid
            gap-3
            sm:grid-cols-2
          "
        >
          <ModeCard
            eyebrow="EVERYONE GETS THE SAME 5"
            title="Daily Sort"
            onClick={
              props.onDaily
            }
            image={
              assets.earth
            }
          >
            A deterministic
            five-round challenge
            that changes with
            the date.
          </ModeCard>

          <ModeCard
            eyebrow="STRETCH MODE"
            title="Blind Sort"
            onClick={
              props.onBlind
            }
            image={
              assets.space
            }
          >
            Items arrive one
            at a time.
            Once placed,
            they stay placed.
          </ModeCard>

          <ModeCard
            eyebrow="STRETCH MODE"
            title="Where Does It Go?"
            onClick={
              props.onGap
            }
            image={
              assets.city
            }
          >
            Read an ordered line,
            then drop the new item
            into the correct gap.
          </ModeCard>

          <ModeCard
            eyebrow="PICK YOUR LANE"
            title="Category Mode"
            onClick={
              props.onCategories
            }
            image={
              assets.cinema
            }
          >
            Run a deck focused on
            science, Nigeria,
            tech, world,
            entertainment
            and more.
          </ModeCard>
        </div>

        <button
          onClick={
            props.onHistory
          }
          className="
            mt-5
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-4
            text-left
          "
        >
          <span
            className="
              font-display
              text-xs
              font-bold
              text-gold
            "
          >
            YOUR RECORDS
          </span>

          <div
            className="
              mt-2
              grid
              grid-cols-3
              gap-2
              text-sm
              text-slate-300
            "
          >
            <span>
              <strong
                className="
                  block
                  font-display
                  text-lg
                  text-white
                "
              >
                {
                  records
                    .personalBest
                    .toLocaleString()
                }
              </strong>
              BEST
            </span>

            <span>
              <strong
                className="
                  block
                  font-display
                  text-lg
                  text-white
                "
              >
                {
                  records
                    .runsPlayed
                }
              </strong>
              RUNS
            </span>

            <span>
              <strong
                className="
                  block
                  font-display
                  text-lg
                  text-white
                "
              >
                {
                  records
                    .mostPerfectRounds
                }
              </strong>
              PERFECT
            </span>
          </div>
        </button>
      </section>
    </AppShell>
  );
}