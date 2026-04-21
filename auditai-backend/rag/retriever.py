"""
rag/retriever.py
Person A owns the real implementation (ChromaDB + sentence-transformers + LLM call).
This stub lets Person B wire the /api/flags/{id} route immediately.
"""


def retrieve_context(txn: dict) -> dict:
    """
    Given a transaction dict, return supporting evidence.
    Real version: ChromaDB semantic search + pandas vendor history lookup.
    """
    # ── Person A: replace with real ChromaDB + pandas lookups ────────────────
    return {
        "vendor_count": 0,
        "dept_avg": 12000,
        "amount_ratio": round(txn["amount"] / 12000, 1),
        "emp_max_prior": 18000,
        "policy_matches": [
            "FIN-12 section 3.2: New vendors require procurement approval",
            "FIN-07 section 1.1: Transactions above ₹50,000 need CFO sign-off",
        ],
    }


def generate_narrative(txn: dict, context: dict) -> str:
    """
    Call LLM with txn + context and return plain-English explanation.
    Real version: builds structured prompt → OpenAI / Anthropic API call.
    """
    # ── Person A: replace with real LLM call ─────────────────────────────────
    return (
        f"An ₹{txn['amount']:,} payment to {txn['vendor']} was flagged as {txn['risk']} risk. "
        f"This vendor has no prior payment history and the amount is {context['amount_ratio']}x "
        f"the department average of ₹{context['dept_avg']:,}. "
        f"The transaction was submitted outside business hours, which combined with the unregistered "
        f"vendor status triggers mandatory procurement review under FIN-12."
    )
