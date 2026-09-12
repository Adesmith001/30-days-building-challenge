import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LandingView, type Demo } from "../components/LandingView";
const demos: Demo[] = [{ prompt: "What should I eat?", left: "Jollof rice", right: "Fried rice" }, { prompt: "Which laptop?", left: "MacBook Pro", right: "ThinkPad X1" }, { prompt: "Where should we go?", left: "Kyoto", right: "Reykjavík" }, { prompt: "What should I build?", left: "CLI utility", right: "Web app" }];
export default function LandingPage() { const navigate = useNavigate(); const [demo, setDemo] = useState(demos[0]); const [selected, setSelected] = useState<"left" | "right" | null>(null); return <LandingView demos={demos} demo={demo} selected={selected} onSelect={(next, side) => { if (next.prompt !== demo.prompt) { setDemo(next); setSelected(null); } else setSelected(side ?? null); }} onStart={() => navigate(`/new?title=${encodeURIComponent(demo.prompt)}`)} />; }
