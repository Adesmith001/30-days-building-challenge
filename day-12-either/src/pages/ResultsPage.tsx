import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ResultView } from "../components/ResultView";
import { createSortState } from "../lib/sorter";
import { getDecision, saveSession, updateDecision } from "../lib/storage";
import { getOptionLabel, shuffle } from "../lib/utils";
import type { DecisionSession } from "../types";
export default function ResultsPage() {
  const { id = "" } = useParams(); const navigate = useNavigate(); const [decision] = useState(() => getDecision(id)); const [shared, setShared] = useState(false);
  const ranked = useMemo(() => decision?.ranking?.map((optionId) => ({ id: optionId, label: getOptionLabel(decision, optionId) })) ?? [], [decision]);
  if (!decision) return <Navigate replace to="/" />; if (!ranked.length) return <Navigate replace to={`/decision/${decision.id}`} />;
  const current = decision; const winner = ranked[0]; const wins = current.comparisons.filter((comparison) => (comparison.leftId === winner.id || comparison.rightId === winner.id) && comparison.winnerId === winner.id).length;
  async function share() { const text = [`I used Either to rank: "${current.title}"`, "", ...ranked.map((option, index) => `${index + 1}. ${option.label}`)].join("\n"); try { if (navigator.share) await navigator.share({ title: "Either.", text }); else await navigator.clipboard.writeText(text); setShared(true); } catch { /* cancelled */ } }
  function runAgain() { const session: DecisionSession = { decisionId: current.id, sorter: createSortState(shuffle(current.options.map((option) => option.id))), comparisons: [], undoStack: [] }; saveSession(session); updateDecision(current.id, { ranking: undefined, completedAt: undefined, comparisons: [] }); navigate(`/decision/${current.id}`); }
  return <><ResultView decision={current} ranked={ranked} wins={wins} onAgain={runAgain} onShare={share} onNew={() => navigate("/new")} />{shared && <button type="button" onClick={() => setShared(false)} className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-[#111] px-4 py-2 text-[11px] text-white">Result copied</button>}</>;
}
