import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { RevealView } from "../components/RevealView";
import { getDecision } from "../lib/storage";
import { getOptionLabel } from "../lib/utils";
export default function RevealPage() { const { id = "" } = useParams(); const navigate = useNavigate(); const [decision] = useState(() => getDecision(id)); useEffect(() => { if (!decision?.ranking) return; const timeout = window.setTimeout(() => navigate(`/decision/${id}/results`, { replace: true }), 1250); return () => window.clearTimeout(timeout); }, [decision, id, navigate]); if (!decision) return <Navigate replace to="/" />; if (!decision.ranking) return <Navigate replace to={`/decision/${id}`} />; return <RevealView first={getOptionLabel(decision, decision.ranking[0])} second={decision.ranking[1] ? getOptionLabel(decision, decision.ranking[1]) : ""} />; }
