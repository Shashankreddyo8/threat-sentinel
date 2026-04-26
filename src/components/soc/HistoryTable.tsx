import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Prediction } from "@/lib/predictions";
import { isAttack, formatTime } from "@/lib/predictions";

export function HistoryTable({ predictions }: { predictions: Prediction[] }) {
  return (
    <Card className="border-border/60 gradient-cyber overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Prediction History
        </h3>
        <span className="text-xs text-muted-foreground font-mono">
          {predictions.length} records
        </span>
      </div>
      <div className="overflow-x-auto max-h-[480px]">
        <Table>
          <TableHeader className="sticky top-0 bg-card/95 backdrop-blur z-10">
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-widest">Time</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest">Source IP</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest">Destination IP</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest">Protocol</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest">Prediction</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest">Confidence</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.map((p) => {
              const attack = isAttack(p);
              return (
                <TableRow
                  key={p.id}
                  className={`border-border/40 ${
                    attack
                      ? "bg-danger/10 hover:bg-danger/20"
                      : "bg-safe/5 hover:bg-safe/10"
                  }`}
                >
                  <TableCell className="font-mono text-xs">{formatTime(p)}</TableCell>
                  <TableCell className="font-mono text-xs">{p.source_ip}</TableCell>
                  <TableCell className="font-mono text-xs">{p.destination_ip}</TableCell>
                  <TableCell className="font-mono text-xs">{p.protocol}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-bold ${
                        attack
                          ? "bg-danger/20 text-danger text-glow-danger border border-danger/40"
                          : "bg-safe/20 text-safe text-glow-safe border border-safe/40"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          attack ? "bg-danger animate-blink" : "bg-safe"
                        }`}
                      />
                      {p.prediction}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {(p.confidence_score * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-xs">{p.status}</TableCell>
                </TableRow>
              );
            })}
            {predictions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No predictions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
