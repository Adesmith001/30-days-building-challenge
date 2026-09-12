import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ComparePage from "./pages/ComparePage";
import HistoryPage from "./pages/HistoryPage";
import LandingPage from "./pages/LandingPage";
import NewDecisionPage from "./pages/NewDecisionPage";
import OptionsPage from "./pages/OptionsPages";
import ResultsPage from "./pages/ResultsPage";
import RevealPage from "./pages/RevealPage";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/new"
        element={<NewDecisionPage />}
      />

      <Route
        path="/new/options"
        element={<OptionsPage />}
      />

      <Route
        path="/decision/:id"
        element={<ComparePage />}
      />

      <Route
        path="/decision/:id/reveal"
        element={<RevealPage />}
      />

      <Route
        path="/decision/:id/results"
        element={<ResultsPage />}
      />

      <Route
        path="/history"
        element={<HistoryPage />}
      />

      <Route
        path="*"
        element={
          <Navigate
            replace
            to="/"
          />
        }
      />
    </Routes>
  );
}