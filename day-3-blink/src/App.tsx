import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toPng } from "html-to-image";
import { AnimatePresence, motion } from "motion/react";
import type {
  AnswerOption,
  GamePhase,
  RoundResult,
  Stimulus,
} from "./types/game";
import {
  calculateRoundScore,
  generateStimulus,
  getNextExposure,
} from "./lib/game";
import {
  loadStats,
  saveStats,
} from "./lib/storage";
import { IntroScreen } from "./components/IntroScreen";
import { GameHeader } from "./components/GameHeader";
import { GameSidebar } from "./components/GameSidebar";
import { Countdown } from "./components/Countdown";
import { StimulusRenderer } from "./components/StimulusRenderer";
import { QuestionScreen } from "./components/QuestionScreen";
import { FeedbackScreen } from "./components/FeedbackScreen";
import { ResultsScreen } from "./components/ResultScreen";
import { SettingsModal } from "./components/SettingsModal";

const TOTAL_ROUNDS = 10;

export default function App() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [stimulus, setStimulus] = useState<Stimulus | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [exposure, setExposure] = useState(500);
  const [selected, setSelected] = useState<string | null>(null);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const [countdown, setCountdown] = useState("3");
  const [results, setResults] = useState<RoundResult[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const [challenge, setChallenge] = useState(false);

  const [storedStats, setStoredStats] = useState(loadStats);
  const resultsRef = useRef<HTMLDivElement>(null);

  const startGame = (faster = false) => {
    setRound(1);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setResults([]);
    setSelected(null);
    setExposure(faster ? 300 : 500);
    setChallenge(faster);
    setCountdown("3");
    setStimulus(generateStimulus());
    setPhase("countdown");
  };

  useEffect(() => {
    if (phase !== "countdown") {
      return;
    }

    const values = ["3", "2", "1", "LOOK"];
    let index = 0;

    const timer = window.setInterval(() => {
      index += 1;

      if (index >= values.length) {
        window.clearInterval(timer);
        setPhase("stimulus");
        return;
      }

      setCountdown(values[index]);
    }, 500);

    return () => window.clearInterval(timer);
  }, [phase, round]);

  useEffect(() => {
    if (phase !== "stimulus") {
      return;
    }

    const timer = window.setTimeout(
      () => setPhase("blank"),
      exposure,
    );

    return () => window.clearTimeout(timer);
  }, [phase, exposure]);

  useEffect(() => {
    if (phase !== "blank") {
      return;
    }

    const timer = window.setTimeout(
      () => setPhase("question"),
      320,
    );

    return () => window.clearTimeout(timer);
  }, [phase]);

  const finishGame = useCallback(() => {
    const shortest = results
      .filter((result) => result.correct)
      .reduce(
        (minimum, result) => Math.min(minimum, result.exposure),
        500,
      );

    const updated = {
      personalBest: Math.max(storedStats.personalBest, score),
      highestStreak: Math.max(
        storedStats.highestStreak,
        bestStreak,
      ),
      shortestThreshold: Math.min(
        storedStats.shortestThreshold,
        shortest,
      ),
      sessionsPlayed: storedStats.sessionsPlayed + 1,
    };

    saveStats(updated);
    setStoredStats(updated);
    setPhase("results");
  }, [bestStreak, results, score, storedStats]);

  useEffect(() => {
    if (phase !== "reveal") {
      return;
    }

    const timer = window.setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        window.setTimeout(finishGame,0);
        return;
      }

      setRound((value) => value + 1);
      setStimulus(generateStimulus());
      setSelected(null);
      setCountdown("3");
      setPhase("countdown");
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [finishGame, phase, round]);

  const handleAnswer = (option: AnswerOption) => {
    if (!stimulus || selected !== null) {
      return;
    }

    setSelected(option.label);

    const correct =
      option.label === stimulus.question.correctAnswer;

    const nextStreak = correct ? streak + 1 : 0;

    const points = correct
      ? calculateRoundScore(exposure, nextStreak)
      : 0;

    if (correct) {
      setScore((value) => value + points);
      setCorrectCount((value) => value + 1);
      setBestStreak((value) =>
        Math.max(value, nextStreak),
      );
    }

    setStreak(nextStreak);
    setLastCorrect(correct);
    setLastPoints(points);

    setResults((previous) => [
      ...previous,
      {
        round,
        category: stimulus.question.category,
        correct,
        exposure,
        points,
      },
    ]);

    const nextExposure = getNextExposure(
      exposure,
      correct,
    );

    setExposure(
      challenge
        ? Math.max(150, nextExposure - 50)
        : nextExposure,
    );

    setPhase("feedback");
  };

  const handleShare = async () => {
    if (!resultsRef.current) {
      return;
    }

    const dataUrl = await toPng(resultsRef.current, {
      pixelRatio: 2,
      backgroundColor: "#000000",
    });

    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const file = new File(
      [blob],
      "blink-result.png",
      {
        type: "image/png",
      },
    );

    if (
      navigator.share &&
      navigator.canShare?.({ files: [file] })
    ) {
      await navigator.share({
        title: "My Blink Result",
        text: `I scored ${score.toLocaleString()} on Blink.`,
        files: [file],
      });

      return;
    }

    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = "blink-result.png";
    anchor.click();
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-[#f8f7f5] text-neutral-900">
        <GameHeader />

        <IntroScreen
          onStart={() => startGame(false)}
        />
      </div>
    );
  }

  if (phase === "results") {
    return (
      <ResultsScreen
        ref={resultsRef}
        score={score}
        correct={correctCount}
        bestStreak={bestStreak}
        threshold={storedStats.shortestThreshold}
        personalBest={storedStats.personalBest}
        isPersonalBest={
          score >= storedStats.personalBest &&
          score > 0
        }
        results={results}
        onReplay={() => startGame(false)}
        onFaster={() => startGame(true)}
        onShare={handleShare}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5] text-neutral-900">
      <GameHeader
        gameplay
        round={round}
        score={score}
        streak={streak}
        onSettings={() => setSettingsOpen(true)}
      />

      <div className="flex min-h-[calc(100vh-5rem)]">
        <GameSidebar active="stimulus" />

        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${phase}-${round}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {phase === "countdown" && (
                <Countdown value={countdown} />
              )}

              {phase === "stimulus" && stimulus && (
                <div className="grid min-h-[650px] place-items-center p-5 md:p-10">
                  <StimulusRenderer
                    stimulus={stimulus}
                  />
                </div>
              )}

              {phase === "blank" && (
                <div className="min-h-[650px]" />
              )}

              {phase === "question" && stimulus && (
                <QuestionScreen
                  stimulus={stimulus}
                  round={round}
                  exposure={exposure}
                  score={score}
                  streak={streak}
                  selected={selected}
                  locked={selected !== null}
                  onAnswer={handleAnswer}
                />
              )}

              {phase === "feedback" && stimulus && (
                <FeedbackScreen
                  correct={lastCorrect}
                  points={lastPoints}
                  streak={streak}
                  exposure={exposure}
                  stimulus={stimulus}
                  onContinue={() => setPhase("reveal")}
                />
              )}

              {phase === "reveal" && stimulus && (
                <div className="grid min-h-[650px] place-items-center p-5 md:p-10">
                  <StimulusRenderer
                    stimulus={stimulus}
                    reveal
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <SettingsModal
        open={settingsOpen}
        sound={sound}
        onSoundChange={setSound}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}