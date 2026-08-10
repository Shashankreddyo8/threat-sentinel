import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchPredictions, type Prediction } from "@/lib/predictions";
import { SOCHeader } from "@/components/soc/Header";
import { SummaryCards } from "@/components/soc/SummaryCards";
import { AlertBanner } from "@/components/soc/AlertBanner";
import { LivePrediction } from "@/components/soc/LivePrediction";
import { Charts } from "@/components/soc/Charts";
import { HistoryTable } from "@/components/soc/HistoryTable";
import { ModelComparison } from "@/components/soc/ModelComparison";
import { PRIMARY_MODEL_ID, getModel, type ModelId } from "@/lib/models";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IoT Malware Detection SOC · CNN+LSTM Hybrid Engine" },
      {
        name: "description",
        content:
          "Real-time Security Operations Center dashboard for IoT malware detection powered by a Hybrid CNN + LSTM deep learning model.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchPredictions();
        if (cancelled) return;
        setPredictions(data);
        setIsLive(true);
        setLastUpdate(new Date());
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setIsLive(false);
        setError((e as Error).message);
      }
    }
    load();
    const id = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const latest = predictions[0] ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <main className="relative max-w-[1600px] mx-auto px-4 md:px-6 py-6 space-y-6">
        <SOCHeader isLive={isLive} lastUpdate={lastUpdate} />
        {error && (
          <div className="rounded-md border border-danger/50 bg-danger/10 px-4 py-2 text-sm text-danger">
            Connection issue: {error}. Retrying…
          </div>
        )}
        <AlertBanner latest={latest} />
        <SummaryCards predictions={predictions} />
        <LivePrediction latest={latest} />
        <Charts predictions={predictions} />
        <HistoryTable predictions={predictions} />
        <footer className="text-center text-xs text-muted-foreground pt-4 pb-2 font-mono">
          Final Year Project · Hybrid CNN + LSTM IoT Malware Detection System
        </footer>
      </main>
    </div>
  );
}
