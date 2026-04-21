from fastapi import APIRouter, Request, Query
from pathlib import Path
import pandas as pd

router = APIRouter()

DATA_PATH = Path(__file__).parent.parent / "data" / "transactions.csv"


@router.get("/spend/trend")
def spend_trend(
    request: Request,
    dept: str = Query(..., description="Department name, e.g. Marketing"),
):
    """
    Returns daily spend totals for a department + anomaly dates.
    Anomaly dates = days where a flagged transaction exists for that dept.
    """
    if not DATA_PATH.exists():
        return _mock_trend(dept)

    df = pd.read_csv(DATA_PATH)
    df["date"] = pd.to_datetime(df["timestamp"]).dt.date

    dept_df = df[df["department"].str.lower() == dept.lower()]
    if dept_df.empty:
        return {"dates": [], "amounts": [], "anomaly_dates": []}

    daily = dept_df.groupby("date")["amount"].sum().reset_index()
    daily = daily.sort_values("date")

    # Anomaly dates: days that contain at least one flagged transaction
    flagged = request.app.state.flagged
    flagged_ids = {t["id"] for t in flagged if t["department"].lower() == dept.lower()}

    # If transactions.csv has an 'id' column, use it; otherwise fall back to empty
    anomaly_dates: list[str] = []
    if "id" in dept_df.columns:
        flagged_rows = dept_df[dept_df["id"].isin(flagged_ids)]
        anomaly_dates = sorted(flagged_rows["date"].astype(str).unique().tolist())

    return {
        "dates":         daily["date"].astype(str).tolist(),
        "amounts":       daily["amount"].tolist(),
        "anomaly_dates": anomaly_dates,
    }


def _mock_trend(dept: str) -> dict:
    """Fallback mock data when CSV is not yet available."""
    return {
        "dates": [
            "2024-04-01", "2024-04-02", "2024-04-03", "2024-04-04",
            "2024-04-05", "2024-04-18", "2024-04-19", "2024-04-20", "2024-04-21",
        ],
        "amounts": [45000, 52000, 38000, 61000, 47000, 120000, 43000, 55000, 84000],
        "anomaly_dates": ["2024-04-18", "2024-04-21"],
    }
