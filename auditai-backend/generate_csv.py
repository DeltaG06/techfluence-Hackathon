"""
generate_csv.py
Run once to generate data/transactions.csv
500 transactions, 5 departments, 8 vendors, injected anomalies
"""

import pandas as pd
import numpy as np
from faker import Faker
from pathlib import Path
import random

fake = Faker("en_IN")
random.seed(42)
np.random.seed(42)

# ── Config ────────────────────────────────────────────────────────
DEPARTMENTS = ["Marketing", "Engineering", "Finance", "HR", "Operations"]
VENDORS     = [
    "Nexaflow Solutions", "CloudBridge Inc", "Apex Global Ltd",
    "TechMind Systems", "Vertex Analytics", "BrightCore Ltd",
    "Sigma Infra", "PeakEdge Consulting",
]
CATEGORIES  = ["Software", "Travel", "Office Supplies", "Consulting", "Hardware", "Marketing"]

# Normal spend range per department (in INR)
DEPT_AVG = {
    "Marketing":   12000,
    "Engineering": 18000,
    "Finance":     8000,
    "HR":          6000,
    "Operations":  10000,
}

EMPLOYEES = {
    "Marketing":   ["Priya Sharma", "Arjun Nair", "Divya Menon"],
    "Engineering": ["Rahul Menon", "Karan Joshi", "Sneha Patel"],
    "Finance":     ["Sneha Kulkarni", "Amit Desai", "Pooja Iyer"],
    "HR":          ["Riya Kapoor", "Vikram Singh", "Neha Gupta"],
    "Operations":  ["Suresh Kumar", "Anita Rao", "Manoj Tiwari"],
}

# ── Generate normal transactions ──────────────────────────────────
records = []

for i in range(460):  # 460 normal + 40 anomalies = 500
    dept     = random.choice(DEPARTMENTS)
    avg      = DEPT_AVG[dept]
    amount   = int(np.random.normal(avg, avg * 0.25))
    amount   = max(500, amount)  # no negatives

    timestamp = fake.date_time_between(start_date="-60d", end_date="now")

    vendor        = random.choice(VENDORS[:6])  # normal vendors
    vendor_count  = random.randint(3, 50)       # known vendors have history

    records.append({
        "id":                f"TXN-{i+1:03d}",
        "amount":            amount,
        "vendor":            vendor,
        "department":        dept,
        "employee":          random.choice(EMPLOYEES[dept]),
        "timestamp":         timestamp.isoformat(),
        "category":          random.choice(CATEGORIES),
        "hour_of_day":       timestamp.hour,
        "is_weekend":        int(timestamp.weekday() >= 5),
        "vendor_txn_count":  vendor_count,
        "dept_avg":          avg,
        "amount_vs_dept_avg": round(amount / avg, 2),
        "is_anomaly":        0,
    })

# ── Inject anomalies ──────────────────────────────────────────────
anomaly_patterns = [
    # (label, overrides)
    ("new_vendor_high_amount", {
        "vendor": "Nexaflow Solutions",
        "vendor_txn_count": 0,
        "amount": lambda avg: avg * random.randint(5, 9),
        "hour_of_day": random.randint(22, 23),
        "is_weekend": 1,
    }),
    ("late_night_high_value", {
        "hour_of_day": random.randint(22, 23),
        "amount": lambda avg: avg * random.randint(4, 7),
        "is_weekend": 0,
    }),
    ("exceeds_approval_limit", {
        "amount": lambda avg: avg * random.randint(6, 10),
        "vendor_txn_count": 1,
    }),
    ("weekend_bulk_payment", {
        "is_weekend": 1,
        "amount": lambda avg: avg * random.randint(4, 6),
        "hour_of_day": random.randint(8, 12),
    }),
]

for j in range(40):
    dept     = random.choice(DEPARTMENTS)
    avg      = DEPT_AVG[dept]
    pattern  = random.choice(anomaly_patterns)
    overrides = pattern[1]

    amount = overrides.get("amount", lambda a: a)(avg)
    amount = int(amount)

    timestamp = fake.date_time_between(start_date="-60d", end_date="now")
    hour      = overrides.get("hour_of_day", timestamp.hour)
    is_weekend = overrides.get("is_weekend", int(timestamp.weekday() >= 5))

    # Reconstruct timestamp with correct hour
    timestamp = timestamp.replace(hour=hour if isinstance(hour, int) else hour)

    vendor       = overrides.get("vendor", random.choice(VENDORS[6:]))  # use rare vendors
    vendor_count = overrides.get("vendor_txn_count", random.randint(0, 2))

    records.append({
        "id":                f"TXN-{460+j+1:03d}",
        "amount":            amount,
        "vendor":            vendor,
        "department":        dept,
        "employee":          random.choice(EMPLOYEES[dept]),
        "timestamp":         timestamp.isoformat(),
        "category":          random.choice(CATEGORIES),
        "hour_of_day":       hour if isinstance(hour, int) else timestamp.hour,
        "is_weekend":        is_weekend,
        "vendor_txn_count":  vendor_count,
        "dept_avg":          avg,
        "amount_vs_dept_avg": round(amount / avg, 2),
        "is_anomaly":        1,
    })

# ── Save ──────────────────────────────────────────────────────────
df = pd.DataFrame(records).sample(frac=1, random_state=42).reset_index(drop=True)

output_path = Path(__file__).parent / "data" / "transactions.csv"
output_path.parent.mkdir(exist_ok=True)
df.to_csv(output_path, index=False)

print(f"✅ Generated {len(df)} transactions → {output_path}")
print(f"   Normal: {(df['is_anomaly']==0).sum()} | Anomalies: {(df['is_anomaly']==1).sum()}")
print(f"\nDept averages:")
for dept, avg in DEPT_AVG.items():
    print(f"   {dept}: ₹{avg:,}")
print(f"\nFeatures included: amount, amount_vs_dept_avg, hour_of_day, is_weekend, vendor_txn_count")
