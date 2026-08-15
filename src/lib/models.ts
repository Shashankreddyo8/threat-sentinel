/**
 * ML Model registry + metrics layer.
 *
 * ⚠️ PLACEHOLDER DATA NOTICE
 * The metrics below are NOT real evaluation results. They are clearly marked
 * placeholders (`source: "placeholder"`) so the UI can be built and reviewed
 * before the Python model evaluation APIs exist.
 *
 * To connect real results later:
 *   1. Set MODEL_METRICS_API_URL to your Python/Xano endpoint.
 *   2. The endpoint should return ModelMetrics[] (see shape below) with
 *      `source: "api"`.
 *   3. Nothing else needs to change — fetchModelMetrics() already prefers the
 *      API and only falls back to placeholders when the URL is unset/fails.
 */

export type ModelId =
  | "random_forest"
  | "xgboost"
  | "svm"
  | "isolation_forest"
  | "autoencoder"
  | "cnn"
  | "cnn_lstm";

export interface ModelInfo {
  id: ModelId;
  name: string;
  family: "Classical ML" | "Anomaly Detection" | "Deep Learning";
  description: string;
  isProposed?: boolean;
}

export interface ModelMetrics {
  model_id: ModelId;
  accuracy: number; // 0..1
  precision: number;
  recall: number;
  f1_score: number;
  detection_rate: number;
  false_positive_rate: number;
  /** "api" = real evaluation results, "placeholder" = mock, not real */
  source: "api" | "placeholder";
  evaluated_at?: string;
}

export const MODELS: ModelInfo[] = [
  {
    id: "random_forest",
    name: "Random Forest",
    family: "Classical ML",
    description: "Bagged decision-tree ensemble baseline.",
  },
  {
    id: "xgboost",
    name: "XGBoost",
    family: "Classical ML",
    description: "Gradient-boosted trees, strong tabular baseline.",
  },
  {
    id: "svm",
    name: "SVM",
    family: "Classical ML",
    description: "Support Vector Machine with RBF kernel.",
  },
  {
    id: "isolation_forest",
    name: "Isolation Forest",
    family: "Anomaly Detection",
    description: "Unsupervised outlier isolation for zero-day traffic.",
  },
  {
    id: "autoencoder",
    name: "Autoencoder",
    family: "Anomaly Detection",
    description: "Reconstruction-error based anomaly scoring.",
  },
  {
    id: "cnn",
    name: "CNN",
    family: "Deep Learning",
    description: "1D convolutional spatial feature extractor.",
  },
  {
    id: "cnn_lstm",
    name: "CNN-LSTM",
    family: "Deep Learning",
    description:
      "Proposed hybrid: CNN spatial features + LSTM temporal sequence modelling.",
    isProposed: true,
  },
];

export const PRIMARY_MODEL_ID: ModelId = "cnn_lstm";

export function getModel(id: ModelId): ModelInfo {
  return MODELS.find((m) => m.id === id) ?? MODELS[MODELS.length - 1];
}

/**
 * Set this once the Python model-evaluation API is deployed, e.g.
 * "https://x8ki-letl-twmt.n7.xano.io/api:Qnw6FEMs/model_metrics"
 */
export const MODEL_METRICS_API_URL: string | null = null;

/** Real N-BaIoT evaluation results (imported from model_metrics.json). */
const EVALUATED_METRICS: ModelMetrics[] = [
  { model_id: "random_forest", accuracy: 0.999867, precision: 1.0, recall: 0.999733, f1_score: 0.999867, detection_rate: 0.999733, false_positive_rate: 0.0, source: "api", evaluated_at: "2026-08-15T07:29:16.259459+00:00" },
  { model_id: "xgboost", accuracy: 0.999933, precision: 1.0, recall: 0.999867, f1_score: 0.999933, detection_rate: 0.999867, false_positive_rate: 0.0, source: "api", evaluated_at: "2026-08-15T07:29:16.259459+00:00" },
  { model_id: "svm", accuracy: 0.9988, precision: 0.998401, recall: 0.9992, f1_score: 0.9988, detection_rate: 0.9992, false_positive_rate: 0.0016, source: "api", evaluated_at: "2026-08-15T07:29:16.259459+00:00" },
  { model_id: "isolation_forest", accuracy: 0.595867, precision: 0.940564, recall: 0.204667, f1_score: 0.33618, detection_rate: 0.204667, false_positive_rate: 0.012933, source: "api", evaluated_at: "2026-08-15T07:29:16.259459+00:00" },
  { model_id: "autoencoder", accuracy: 0.728733, precision: 0.97168, recall: 0.4712, f1_score: 0.634641, detection_rate: 0.4712, false_positive_rate: 0.013733, source: "api", evaluated_at: "2026-08-15T07:29:16.259459+00:00" },
  { model_id: "cnn", accuracy: 0.998, precision: 0.998, recall: 1.0, f1_score: 0.998999, detection_rate: 1.0, false_positive_rate: 1.0, source: "api", evaluated_at: "2026-08-15T07:29:16.259459+00:00" },
  { model_id: "cnn_lstm", accuracy: 0.998, precision: 0.998, recall: 1.0, f1_score: 0.998999, detection_rate: 1.0, false_positive_rate: 1.0, source: "api", evaluated_at: "2026-08-15T07:29:16.259459+00:00" },
];

export async function fetchModelMetrics(): Promise<ModelMetrics[]> {
  if (!MODEL_METRICS_API_URL) return EVALUATED_METRICS;

  try {
    const res = await fetch(MODEL_METRICS_API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("metrics request failed");
    const data: ModelMetrics[] = await res.json();
    return data.map((m) => ({ ...m, source: "api" as const }));
  } catch {
    return EVALUATED_METRICS;
  }
}

export function hasRealMetrics(metrics: ModelMetrics[]) {
  return metrics.some((m) => m.source === "api");
}

export function pct(v: number) {
  return `${(v * 100).toFixed(2)}%`;
}
