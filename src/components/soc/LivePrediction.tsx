import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";
import type { Prediction } from "@/lib/predictions";
import { isAttack, formatTime } from "@/lib/predictions";

export function LivePrediction({ latest }: { latest: Prediction | null }) {
  if (!latest) {
    return (
      <Card className="p-6 border-border/60 gradient-cyber">
        <p className="text-muted-foreground">Awaiting live prediction stream…</p>
      </Card>
    );
  }
  const attack = isAttack(latest);
  return (
    <Card
      className={`relative overflow-hidden p-6 border ${
        attack
          ? "border-danger/60 gradient-danger animate-scan"
          : "border-safe/50 gradient-safe"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio
            className={`h-4 w-4 ${attack ? "text-danger animate-blink" : "text-safe"}`}
          />
          <h3 className="text-sm uppercase tracking-widest font-semibold text-muted-foreground">
            Live Prediction
          </h3>
        </div>
        <Badge
          variant="outline"
          className={
            attack
              ? "border-danger text-danger text-glow-danger animate-pulse-danger"
              : "border-safe text-safe text-glow-safe"
          }
        >
          {attack ? "● THREAT" : "● BENIGN"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Field
          label="Prediction"
          value={latest.prediction}
          accent={attack ? "text-danger text-glow-danger" : "text-safe text-glow-safe"}
        />
        <Field
          label="Confidence"
          value={`${(latest.confidence_score * 100).toFixed(2)}%`}
          accent="text-cyber-cyan"
        />
        <Field label="Source IP" value={latest.source_ip} mono />
        <Field label="Destination IP" value={latest.destination_ip} mono />
        <Field label="Protocol" value={latest.protocol} />
        <Field
          label="Status"
          value={latest.status}
          accent={attack ? "text-danger" : "text-safe"}
        />
      </div>
      <div className="mt-4 text-xs text-muted-foreground font-mono">
        ⏱ {formatTime(latest)}
      </div>
    </Card>
  );
}

function Field({
  label,
  value,
  accent,
  mono,
}: {
  label: string;
  value: string;
  accent?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 text-base font-semibold ${mono ? "font-mono" : ""} ${
          accent ?? "text-foreground"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}
