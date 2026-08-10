export interface Prediction {
  id: number;
  created_at: number;
  timestamp: string;
  source_ip: string;
  destination_ip: string;
  protocol: string;
  prediction: string;
  confidence_score: number;
  status: string;
  /** Optional — populated once multi-model records are written to Xano. */
  model_name?: string;
  /** Optional — specific attack class (DDoS, Botnet, ...) when available. */
  attack_type?: string;
}


const API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:Qnw6FEMs/predictions";

export async function fetchPredictions(): Promise<Prediction[]> {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch predictions");
  const data: Prediction[] = await res.json();
  // Filter out empty placeholder records, sort newest first
  return data
    .filter((p) => p.prediction && p.timestamp)
    .sort((a, b) => b.created_at - a.created_at);
}

export function isAttack(p: Prediction) {
  return p.prediction?.toUpperCase() === "ATTACK";
}

export function formatTime(p: Prediction) {
  const t = p.timestamp || new Date(p.created_at).toISOString();
  return t.replace("T", " ").split(".")[0];
}
