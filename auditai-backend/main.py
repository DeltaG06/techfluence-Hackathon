from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from models.detector import load_model, score_transactions
from routes import flags, report, spend

# ── Startup / shutdown ────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load ML model once at startup — shared via app.state
    app.state.model = load_model()
    # Score all transactions and cache results in memory
    app.state.flagged = score_transactions(app.state.model)
    print(f"[startup] {len(app.state.flagged)} flagged transactions loaded")
    yield
    # (cleanup here if needed)

# ── App init ──────────────────────────────────────────────────────
app = FastAPI(title="AuditAI API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # React dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────
app.include_router(flags.router,  prefix="/api")
app.include_router(report.router, prefix="/api")
app.include_router(spend.router,  prefix="/api")

@app.get("/")
def root():
    return {"status": "AuditAI running"}
