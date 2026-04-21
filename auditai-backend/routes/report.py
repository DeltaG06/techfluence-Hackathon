from fastapi import APIRouter, Request, HTTPException

from rag.retriever import retrieve_context, generate_narrative

router = APIRouter()


@router.get("/flags/{txn_id}")
def get_report(txn_id: str, request: Request):
    """
    Returns full audit detail for one flagged transaction:
    transaction fields + RAG context + LLM narrative.
    """
    flagged = request.app.state.flagged
    txn = next((t for t in flagged if t["id"] == txn_id), None)

    if txn is None:
        raise HTTPException(status_code=404, detail=f"Transaction {txn_id} not found")

    context   = retrieve_context(txn)
    narrative = generate_narrative(txn, context)

    return {
        "transaction": txn,
        "context": context,
        "narrative": narrative,
    }
