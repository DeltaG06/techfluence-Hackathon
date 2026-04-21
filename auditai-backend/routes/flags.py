from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/flags")
def get_flags(request: Request):
    """
    Returns all flagged transactions (score >= 0.65).
    Sorted by score descending so HIGH risk appears first.
    """
    flagged = request.app.state.flagged
    return sorted(flagged, key=lambda x: x["score"], reverse=True)
