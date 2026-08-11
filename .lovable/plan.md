# Train the 7 Models on N-BaIoT (Python Training Kit)

The dashboard runs on a web/edge runtime, so training happens outside the app. This delivers a ready-to-run Python project that trains all 7 models on N-BaIoT and emits a metrics file the dashboard can consume unchanged.

## What you get

A downloadable folder (`/mnt/documents/nbaiot-training/`) containing:

- `README.md` — Colab and local setup, 5-minute quickstart
- `requirements.txt` — scikit-learn, xgboost, tensorflow, pandas, numpy
- `data_prep.py` — loads N-BaIoT CSVs (benign + Mirai/Gafgyt per device), labels benign=0 / attack=1, balanced sampling, train/test split, StandardScaler, and a sliding-window reshaper for the sequence models
- `train_models.py` — trains and evaluates all 7:
  - Random Forest, XGBoost, SVM (RBF) — classical, on flat 115-feature vectors
  - Isolation Forest, Autoencoder — unsupervised, fit on benign only, thresholded by reconstruction/anomaly score
  - CNN (1D conv) and CNN-LSTM (conv front-end + LSTM head) — Keras, on windowed sequences
- `evaluate.py` — computes accuracy, precision, recall, F1, detection rate, false positive rate per model
- `export_metrics.py` — writes `model_metrics.json` in the exact `ModelMetrics[]` shape the dashboard expects (`model_id`, six metrics, `source: "api"`, `evaluated_at`)
- `serve_metrics.py` — optional tiny FastAPI server exposing `GET /model_metrics` for live wiring

## How the results reach the dashboard

Two supported paths, no UI rework either way:

1. Paste-in: you send me `model_metrics.json`; I replace the placeholder array in `src/lib/models.ts` with real values marked `source: "api"`, which auto-hides the "placeholder metrics" warning.
2. Live API: you host `serve_metrics.py` (or add the endpoint in Xano); I set `MODEL_METRICS_API_URL` in `src/lib/models.ts` and the existing fetch path picks it up.

## Technical notes

- Dataset: N-BaIoT (UCI), 115 statistical traffic features per record, 9 devices, Mirai + BASHLITE families.
- Sequence models use windows of 10 consecutive records (shape 10x115); classical models use single records.
- Unsupervised models train on benign traffic only; threshold set at the 99th percentile of benign scores.
- Metrics stored as 0..1 floats to match the dashboard's `pct()` formatting.
- Detection rate = recall on the attack class; FPR = false positives / total benign.
- Scripts run on CPU; N-BaIoT subsampling defaults keep a full run under ~10 minutes.

## Not changed

No edits to the dashboard's Xano integration, prediction history, or CNN-LSTM live path in this step. The only later dashboard change is swapping placeholder metrics for real ones.
