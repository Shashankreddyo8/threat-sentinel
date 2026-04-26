import { Cpu, Wifi } from "lucide-react";

export function SOCHeader({
  isLive,
  lastUpdate,
}: {
  isLive: boolean;
  lastUpdate: Date | null;
}) {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border/60">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 rounded-lg gradient-primary-soft border border-primary/40 flex items-center justify-center shadow-glow-cyber">
          <Cpu className="h-6 w-6 text-cyber-cyan text-glow-cyber" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            <span className="text-cyber-cyan text-glow-cyber">CNN+LSTM</span>{" "}
            <span className="text-foreground">IoT Malware Detection</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-0.5">
            Security Operations Center · Hybrid Deep Learning Engine
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/60 bg-card/60">
          <Wifi
            className={`h-4 w-4 ${isLive ? "text-safe animate-blink" : "text-muted-foreground"}`}
          />
          <span className="text-xs font-mono">
            {isLive ? "LIVE" : "OFFLINE"}
          </span>
        </div>
        <div className="text-xs text-muted-foreground font-mono hidden md:block">
          {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : "Connecting…"}
        </div>
      </div>
    </header>
  );
}
