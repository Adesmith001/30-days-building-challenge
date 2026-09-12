import { useState } from "react";
import type { FormEvent } from "react";
import { Plus } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { AppHeader, Footer } from "../components/Chrome";
import { DecisionOptionList } from "../components/DecisionOptionList";
import { createSortState, estimateComparisons } from "../lib/sorter";
import { clearNewDecisionDraft, getNewDecisionDraft, saveDecision, saveSession } from "../lib/storage";
import { createId, inferCategory, shuffle } from "../lib/utils";
import type { Decision, DecisionOption, DecisionSession } from "../types";
const MIN_OPTIONS = 3; const MAX_OPTIONS = 16;
export default function OptionsPage() {
  const navigate = useNavigate(); const [draft] = useState(getNewDecisionDraft); const [options, setOptions] = useState<DecisionOption[]>([]); const [input, setInput] = useState(""); const [error, setError] = useState("");
  if (!draft?.title) return <Navigate replace to="/new" />;
  const title = draft.title;
  function addOption(event?: FormEvent) { event?.preventDefault(); const clean = input.trim(); if (!clean) return; if (options.some((option) => option.label.toLowerCase() === clean.toLowerCase())) return setError("You've already added that."); if (options.length >= MAX_OPTIONS) return setError(`You can add up to ${MAX_OPTIONS} options.`); setOptions((current) => [...current, { id: createId(), label: clean }]); setInput(""); setError(""); }
  function startChoosing() { if (options.length < MIN_OPTIONS) return setError(`Add at least ${MIN_OPTIONS} options.`); const id = createId(); const decision: Decision = { id, title, category: inferCategory(title, options), options, comparisons: [], createdAt: Date.now() }; saveDecision(decision); const session: DecisionSession = { decisionId: id, sorter: createSortState(shuffle(options.map((option) => option.id))), comparisons: [], undoStack: [] }; saveSession(session); clearNewDecisionDraft(); navigate(`/decision/${id}`); }
  return <div className="flex min-h-screen flex-col bg-[#fafafa] dark:bg-[#0b0b0b]"><AppHeader mode="back" backTo="/new" /><main className="mx-auto flex w-full max-w-[1080px] flex-1 justify-center px-4 py-14 md:px-8 md:py-20"><div className="w-full max-w-[620px]"><h1 className="mb-1 text-[30px] font-semibold tracking-[-0.04em] text-[#111] dark:text-white">What are the options?</h1><p className="mb-7 text-[13px] text-[#717171]">Add at least 3. We'll handle the ranking.</p><form onSubmit={addOption} className="relative mb-4"><input autoFocus value={input} maxLength={80} onChange={(event) => { setInput(event.target.value); setError(""); }} placeholder="Add an option..." className="h-12 w-full rounded-xl border border-[#e1e1e1] bg-white px-4 pr-12 text-[13px] outline-none dark:border-[#292929] dark:bg-[#121212] dark:text-white" /><button type="submit" aria-label="Add option" className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#f3f3f3] text-[#717171]"><Plus size={15} /></button></form>{error && <p className="mb-3 text-[11px] text-[#ba1a1a]">{error}</p>}<DecisionOptionList options={options} onRemove={(id) => { setOptions((current) => current.filter((option) => option.id !== id)); setError(""); }} /><button type="button" disabled={options.length < MIN_OPTIONS} onClick={startChoosing} className="mt-6 h-11 w-full rounded-xl bg-[#111] text-[13px] font-medium text-white disabled:opacity-30 dark:bg-white dark:text-[#111]">Start choosing <span className="ml-2">→</span></button><p className="mt-3 text-center text-[10px] text-[#8a8a8a]">{options.length >= MIN_OPTIONS ? `About ${estimateComparisons(options.length)} quick picks` : "Add a few options to begin"}</p></div></main><Footer /></div>;
}
