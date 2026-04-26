import { Shield, ShieldAlert, Activity, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Prediction } from "@/lib/predictions";
import { isAttack } from "@/lib/predictions";

interface Props {
  predictions: Prediction[];
}

export function SummaryCards({ predictions }: Props) {
  const total = predictions.length;
  const attacks = predictions.filter(isAttack).length;
  const safe = total - attacks;
  const ratio = total > 0 ? attacks / total : 0;
  const threatLevel =
    ratio >= 0.5 ? "CRITICAL" : ratio >= 0.25 ? "HIGH" : ratio > 0 ? "MODERATE" : "LOW";
  const threatColor =
    threatLevel === "CRITICAL" || threatLevel === "HIGH"
      ? "text-danger text-glow-danger"
      : threatLevel === "MODERATE"
        ? "text-warning"
        : "text-safe text-glow-safe";

  const cards = [
    {
      label: "Total Network Traffic",
      value: total.toLocaleString(),
      icon: Activity,
      accent: "text-cyber-cyan text-glow-cyber",
      bg: "gradient-primary-soft",
    },
    {
      label: "Safe Traffic",
      value: safe.toLocaleString(),
      icon: Shield,
      accent: "text-safe text-glow-safe",
      bg: "gradient-safe",
    },
    {
      label: "Malware Detected",
      value: attacks.toLocaleString(),
      icon: ShieldAlert,
      accent: "text-danger text-glow-danger",
      bg: "gradient-danger",
    },
    {
      label: "Threat Level",
      value: threatLevel,
      icon: AlertTriangle,
      accent: threatColor,
      bg: ratio >= 0.25 ? "gradient-danger" : "gradient-cyber",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card
          key={c.label}
          className={`relative overflow-hidden border-border/60 ${c.bg} p-5 backdrop-blur-sm`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {c.label}
              </p>
              <p className={`mt-3 text-3xl font-bold tabular-nums ${c.accent}`}>
                {c.value}
              </p>
            </div>
            <c.icon className={`h-8 w-8 ${c.accent}`} strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </Card>
      ))}
    </div>
  );
}
