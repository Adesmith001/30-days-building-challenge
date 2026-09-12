import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HistoryView } from "../components/HistoryView";
import { getDecisions } from "../lib/storage";
import type { Category } from "../types";
type Filter = "All" | Exclude<Category, "General">;
export default function HistoryPage() { const navigate = useNavigate(); const [filter, setFilter] = useState<Filter>("All"); const [visible, setVisible] = useState(5); const decisions = useMemo(() => getDecisions().filter((decision) => decision.ranking?.length), []); return <HistoryView decisions={decisions} filter={filter} visible={visible} onFilter={(next) => { setFilter(next); setVisible(5); }} onMore={() => setVisible((count) => count + 5)} onNew={(title) => navigate(title ? `/new?title=${encodeURIComponent(title)}` : "/new")} />; }
