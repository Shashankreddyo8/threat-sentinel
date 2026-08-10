import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Cpu } from "lucide-react";
import {
  MODELS,
  fetchModelMetrics,
  getModel,
  hasRealMetrics,
  pct,
  type ModelId,
  type ModelMetrics,
} from "@/lib/models";

const tooltipStyle = {
  backgroundColor: "oklch(0.18 0.02 250)",
  border: "1px solid oklch(0.3 0.03 250)",
  borderRadius: 8,
  fontSize: 12,
};

interface Props {
  selectedModel: ModelId;
  onSelectModel: (id: ModelId) => void;
}

export function ModelComparison({ selectedModel, onSelectModel }: Props) {
  const [metrics, setMetrics] = useState<ModelMetrics[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchModelMetrics().then((m) => {
      if (!cancelled) setMetrics(m);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const isReal = hasRealMetrics(metrics);
  const byId = new Map(metrics.map((m) => [m.model_id, m]));
  const active = getModel(selectedModel);
  const activeMetrics = byId.get(selectedModel);

  const chartData = MODELS.map((m) => {
    const x = byId.get(m.id);
    return {
      name: m.name,
      accuracy: (x?.accuracy ?? 0) * 100,
      f1: (x?.f1_score ?? 0) * 100,
      detection: (x?.detection_rate ?? 0) * 100,
      fpr: (x?.false_positive_rate ?? 0) * 100,
    };
  });

  const radarData = activeMetrics
    ? [
        { metric: "Accuracy", value: activeMetrics.accuracy * 100 },
        { metric: "Precision", value: activeMetrics.precision * 100 },
        { metric: "Recall", value: activeMetrics.recall * 100 },
        { metric: "F1", value: activeMetrics.f1_score * 100 },
        { metric: "Detection", value: activeMetrics.detection_rate * 100 },
      ]
    : [];

  return (
    <section className="space-y-4">
      <Card className="border-border/60 gradient-cyber p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              ML Model Comparison
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <Cpu className="h-8 w-8 text-cyber-cyan text-glow-cyber" strokeWidth={1.5} />
              <div>
                <p className="text-2xl font-bold text-cyber-cyan text-glow-cyber">
                  {active.name}
                </p>
                <p className="text-xs text-muted-foreground">{active.description}</p>
              </div>
              {active.isProposed && (
                <Badge className="bg-safe/20 text-safe border border-safe/40">
                  Proposed Hybrid
                </Badge>
              )}
            </div>
          </div>

          <div className="w-full lg:w-72">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Active detection model
            </label>
            <Select
              value={selectedModel}
              onValueChange={(v) => onSelectModel(v as ModelId)}
            >
              <SelectTrigger className="mt-2 font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                    {m.isProposed ? " · Proposed" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!isReal && (
          <div className="mt-4 flex items-start gap-2 rounded-md border border-warning/50 bg-warning/10 px-3 py-2 text-xs text-warning">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Placeholder metrics — no evaluation API connected yet. These values are
              structural mocks, not real model results. Live CNN-LSTM predictions from
              Xano are unaffected.
            </span>
          </div>
        )}
      </Card>

      <Card className="border-border/60 gradient-cyber overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Performance Metrics — 7 Models
          </h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-widest">Model</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest">Family</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest">Accuracy</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest">Precision</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest">Recall</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest">F1 Score</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest">Detection Rate</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest">FPR</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MODELS.map((m) => {
                const x = byId.get(m.id);
                const selected = m.id === selectedModel;
                return (
                  <TableRow
                    key={m.id}
                    className={`border-border/40 cursor-pointer ${
                      selected ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-muted/30"
                    }`}
                    onClick={() => onSelectModel(m.id)}
                  >
                    <TableCell className="text-xs font-semibold">
                      <span className="flex items-center gap-2">
                        {m.name}
                        {m.isProposed && (
                          <Badge className="bg-safe/20 text-safe border border-safe/40 text-[10px]">
                            Primary
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.family}</TableCell>
                    <TableCell className="font-mono text-xs">{x ? pct(x.accuracy) : "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{x ? pct(x.precision) : "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{x ? pct(x.recall) : "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{x ? pct(x.f1_score) : "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{x ? pct(x.detection_rate) : "—"}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {x ? pct(x.false_positive_rate) : "—"}
                    </TableCell>
                    <TableCell className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {x?.source ?? "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 border-border/60 gradient-cyber lg:col-span-2">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
            Accuracy / F1 / Detection Rate by Model
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="accuracy" fill="var(--cyber-cyan)" name="Accuracy" radius={[4, 4, 0, 0]} />
              <Bar dataKey="f1" fill="var(--accent)" name="F1 Score" radius={[4, 4, 0, 0]} />
              <Bar dataKey="detection" fill="var(--safe)" name="Detection Rate" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fpr" fill="var(--danger)" name="False Positive Rate" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 border-border/60 gradient-cyber">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
            {active.name} — Metric Profile
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" stroke="var(--muted-foreground)" fontSize={11} />
              <PolarRadiusAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={10} />
              <Radar
                dataKey="value"
                stroke="var(--cyber-cyan)"
                fill="var(--cyber-cyan)"
                fillOpacity={0.25}
                name={active.name}
              />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </section>
  );
}
