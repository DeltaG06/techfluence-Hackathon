"""
models/detector.py
Person A owns the real implementation.
This stub lets Person B's API start and return mock data
until Person A hands over isolation_forest.pkl.
"""

import os
import pandas as pd
from pathlib import Path

DATA_PATH  = Path(__file__).parent.parent / "data" / "transactions.csv"
MODEL_PATH = Path(__file__).parent / "isolation_forest.pkl"


def load_model():
    """Load trained IsolationForest from disk. Returns None if not ready yet."""
    if not MODEL_PATH.exists():
        print("[detector] WARNING: isolation_forest.pkl not found — using stub scores")
        return None
    import joblib
    model = joblib.load(MODEL_PATH)
    print("[detector] Model loaded from", MODEL_PATH)
    return model


def score_transactions(model) -> list[dict]:
    """
    Read transactions.csv, run model, return only flagged rows (score >= 0.65).
    Falls back to synthetic mock data if model or CSV is not ready.
    """
    if model is None or not DATA_PATH.exists():
        return _mock_flagged()

    df = pd.read_csv(DATA_PATH)
    # ── Person A: replace this block with real feature extraction + scoring ──
    # features = df[["amount", "amount_vs_dept_avg", "hour_of_day", "is_weekend", "vendor_txn_count"]]
    # scores   = model.decision_function(features)          # raw scores
    # df["score"] = 1 - (scores - scores.min()) / (scores.max() - scores.min())  # normalise 0-1
    # ────────────────────────────────────────────────────────────────────────
    raise NotImplementedError("Person A: implement scoring in detector.py")


def _mock_flagged() -> list[dict]:
    """Synthetic flagged transactions for development before ML is ready."""
    return [
        {
            "id": "TXN-001",
            "amount": 84000,
            "vendor": "Nexaflow Solutions",
            "department": "Marketing",
            "employee": "Priya Sharma",
            "timestamp": "2024-04-21T23:47:00",
            "risk": "HIGH",
            "score": 0.91,
            "summary": "New vendor, 7x dept average, submitted Sunday 11pm",
        },
        {
            "id": "TXN-002",
            "amount": 32000,
            "vendor": "CloudBridge Inc",
            "department": "Engineering",
            "employee": "Rahul Menon",
            "timestamp": "2024-04-19T08:12:00",
            "risk": "MEDIUM",
            "score": 0.71,
            "summary": "3x dept average, vendor has only 1 prior transaction",
        },
        {
            "id": "TXN-003",
            "amount": 61000,
            "vendor": "Apex Global Ltd",
            "department": "Finance",
            "employee": "Sneha Kulkarni",
            "timestamp": "2024-04-20T22:05:00",
            "risk": "HIGH",
            "score": 0.83,
            "summary": "Exceeds employee approval limit by 3x, late-night submission",
        },
    ]
