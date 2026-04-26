import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import type { Prediction } from "@/lib/predictions";
import { isAttack } from "@/lib/predictions";

const tooltipStyle = {
  backgroundColor: "oklch(0.18 0.02 250)",
  border: "1px solid oklch(0.3 0.03 250)",
  borderRadius: 8,
  fontSize: 12,
};

export function Charts({ predictions }: { predictions: Prediction[] }) {
  // Trend: by hour of day
  const trend = Array.from({ length: 24 }, (_, h) => ({
    hour: `${h.toString().padStart(2, "0")}:00`,
    attacks: 0,
    safe: 0,
  }));
  predictions.forEach((p) => {
    const d = new Date(p.timestamp || p.created_at);
    const h = d.getHours();
    if (Number.isNaN(h)) return;
    if (isAttack(p)) trend[h].attacks++;
    else trend[h].safe++;
  });

  // Pie: attack types by status (or protocol if no varied status)
  const typeMap = new Map<string, number>();
  predictions.filter(isAttack).forEach((p) => {
    const key = p.status || p.protocol || "Unknown";
    typeMap.set(key, (typeMap.get(key) ?? 0) + 1);
  });
  const pieData = Array.from(typeMap, ([name, value]) => ({ name, value }));
  const PIE_COLORS = [
    "var(--danger)",
    "var(--warning)",
    "var(--chart-5)",
    "var(--cyber-cyan)",
    "var(--accent)",
  ];

  // Bar: per day
  const dayMap = new Map<string, { day: string; attacks: number; safe: number }>();
  predictions.forEach((p) => {
    const d = new Date(p.timestamp || p.created_at);
    const day = d.toISOString().slice(0, 10);
    const cur = dayMap.get(day) ?? { day, attacks: 0, safe: 0 };
    if (isAttack(p)) cur.attacks++;
    else cur.safe++;
    dayMap.set(day, cur);
  });
  const barData = Array.from(dayMap.values()).sort((a, b) =>
    a.day.localeCompare(b.day),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ChartCard title="Attack Trend (24h)" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="attacks"
              stroke="var(--danger)"
              strokeWidth={2}
              dot={false}
              name="Attacks"
            />
            <Line
              type="monotone"
              dataKey="safe"
              stroke="var(--safe)"
              strokeWidth={2}
              dot={false}
              name="Safe"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Attack Type Distribution">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData.length ? pieData : [{ name: "No attacks", value: 1 }]}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              stroke="var(--background)"
            >
              {(pieData.length ? pieData : [{ name: "No attacks", value: 1 }]).map(
                (_, i) => (
                  <Cell
                    key={i}
                    fill={pieData.length ? PIE_COLORS[i % PIE_COLORS.length] : "var(--muted)"}
                  />
                ),
              )}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Daily Threat Detection" className="lg:col-span-3">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="safe" stackId="a" fill="var(--safe)" name="Safe" radius={[0, 0, 0, 0]} />
            <Bar dataKey="attacks" stackId="a" fill="var(--danger)" name="Attacks" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`p-4 border-border/60 gradient-cyber ${className ?? ""}`}>
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
        {title}
      </h3>
      {children}
    </Card>
  );
}
