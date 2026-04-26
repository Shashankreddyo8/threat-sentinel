import { AlertTriangle } from "lucide-react";
import type { Prediction } from "@/lib/predictions";
import { isAttack } from "@/lib/predictions";

export function AlertBanner({ latest }: { latest: Prediction | null }) {
  if (!latest || !isAttack(latest)) return null;
  return (
    <div className="relative overflow-hidden rounded-lg border border-danger/70 gradient-danger px-5 py-4 shadow-glow-danger animate-pulse-danger">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-danger text-glow-danger animate-blink" />
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-danger font-semibold">
            Real-Time Security Alert
          </p>
          <p className="text-lg font-bold text-foreground text-glow-danger">
            ⚠ High Risk Malware Detected — {latest.source_ip} → {latest.destination_ip}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            Protocol {latest.protocol} • Confidence{" "}
            {(latest.confidence_score * 100).toFixed(2)}% • {latest.status}
          </p>
        </div>
      </div>
    </div>
  );
}
