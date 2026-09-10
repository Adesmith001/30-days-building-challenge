/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useState,
} from "react";

import { AppHeader } from "./components/AppHeader";

import { useAnalysisHistory } from "./hooks/useAnalysisHistory";

import { AnalyzeScreen } from "./screens/AnalyzeScreen";
import { ExportScreen } from "./screens/ExportScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { UploadScreen } from "./screens/UploadScreen";

import type {
  DesignSystem,
  HistoryRecord,
  ImageAsset,
} from "./types/ui-analysis";

type View =
  | "home"
  | "upload"
  | "analyze"
  | "export"
  | "history";

export default function App() {
  const [view, setView] =
    useState<View>("home");

  const [asset, setAsset] =
    useState<ImageAsset | null>(null);

  const [system, setSystem] =
    useState<DesignSystem | null>(null);

  const history = useAnalysisHistory();

  const saveCompleted = useCallback(
    (
      name: string,
      nextSystem: DesignSystem,
    ) => {
      history.save(name, nextSystem);
    },
    [history.save],
  );

  function startAnalysis(
    nextAsset: ImageAsset,
  ) {
    setAsset(nextAsset);
    setSystem(null);
    setView("analyze");
  }

  function openHistory(
    record: HistoryRecord,
  ) {
    setSystem(record.system);
    setAsset(null);
    setView("export");
  }

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
      <AppHeader
        canExport={Boolean(system)}
        onHome={() => setView("home")}
        onHistory={() =>
          setView("history")
        }
        onExport={() =>
          system && setView("export")
        }
      />

      {view === "home" && (
        <HomeScreen
          onStart={() =>
            setView("upload")
          }
        />
      )}

      {view === "upload" && (
        <UploadScreen
          onAnalyze={startAnalysis}
        />
      )}

      {view === "analyze" &&
        asset && (
          <AnalyzeScreen
            asset={asset}
            system={system}
            onSystemChange={setSystem}
            onComplete={saveCompleted}
          />
        )}

      {view === "export" &&
        system && (
          <ExportScreen system={system} />
        )}

      {view === "history" && (
        <HistoryScreen
          records={history.records}
          onOpen={openHistory}
          onRemove={history.remove}
          onNew={() =>
            setView("upload")
          }
        />
      )}
    </div>
  );
}