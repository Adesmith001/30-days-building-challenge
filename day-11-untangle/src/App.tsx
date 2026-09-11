import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { FocusPage } from "./pages/FocusPage";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { PlanPage } from "./pages/PlanPage";
import { SessionPage } from "./pages/SessionPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/session/:id"
        element={<SessionPage />}
      />

      <Route
        path="/focus/:sessionId/:itemId"
        element={<FocusPage />}
      />

      <Route
        path="/plan/:sessionId"
        element={<PlanPage />}
      />

      <Route
        path="/history"
        element={<HistoryPage />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}