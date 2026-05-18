"""
WASPADA — Backend API
Sistem Deteksi Fraud Kartu Kredit menggunakan ANN + Fuzzy Sugeno
FastAPI + Uvicorn
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
import joblib
# pyrefly: ignore [missing-import]
import skfuzzy as fuzz
from tensorflow.keras.models import load_model
import os

# ─────────────────────────────────────────
# Inisialisasi App
# ─────────────────────────────────────────
app = FastAPI(
    title="WASPADA API",
    description="Deteksi Fraud Kartu Kredit — ANN + Fuzzy Sugeno",
    version="1.0.0"
)

# Izinkan akses dari frontend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
# Load Model & Scaler saat startup
# ─────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR  = os.path.join(BASE_DIR, "model")

try:
    ann_model      = load_model(os.path.join(MODEL_DIR, "ann_model.h5"))
    scaler_amount  = joblib.load(os.path.join(MODEL_DIR, "scaler_amount.pkl"))
    scaler_time    = joblib.load(os.path.join(MODEL_DIR, "scaler_time.pkl"))
    fuzzy_params   = joblib.load(os.path.join(MODEL_DIR, "fuzzy_params.pkl"))
    print("✅ Semua model berhasil dimuat.")
except Exception as e:
    print(f"❌ Gagal memuat model: {e}")
    raise RuntimeError(f"Gagal memuat model: {e}")

# ─────────────────────────────────────────
# Setup Fuzzy dari params yang disimpan
# ─────────────────────────────────────────
x_universe = np.linspace(0, 1, 1000)

mf_low    = fuzz.trapmf(x_universe, fuzzy_params['mf_low']['params'])
mf_medium = fuzz.trimf (x_universe, fuzzy_params['mf_medium']['params'])
mf_high   = fuzz.trapmf(x_universe, fuzzy_params['mf_high']['params'])

C_LOW    = fuzzy_params['constants']['low']
C_MEDIUM = fuzzy_params['constants']['medium']
C_HIGH   = fuzzy_params['constants']['high']
THRESHOLD = fuzzy_params['threshold']

# ─────────────────────────────────────────
# Schema Input
# ─────────────────────────────────────────
class TransactionInput(BaseModel):
    Time: float = Field(..., description="Waktu transaksi (detik sejak transaksi pertama)")
    Amount: float = Field(..., description="Jumlah nominal transaksi")
    V1:  float; V2:  float; V3:  float; V4:  float
    V5:  float; V6:  float; V7:  float; V8:  float
    V9:  float; V10: float; V11: float; V12: float
    V13: float; V14: float; V15: float; V16: float
    V17: float; V18: float; V19: float; V20: float
    V21: float; V22: float; V23: float; V24: float
    V25: float; V26: float; V27: float; V28: float

    model_config = {
        "json_schema_extra": {
            "example": {
                "Time": 406.0, "Amount": 149.62,
                "V1": -1.36, "V2": -0.07, "V3": 2.54, "V4": 1.38,
                "V5": -0.34, "V6": 0.46, "V7": 0.24, "V8": 0.10,
                "V9": 0.36, "V10": 0.09, "V11": -0.55, "V12": -0.62,
                "V13": -0.99, "V14": -0.31, "V15": 1.47, "V16": -0.47,
                "V17": 0.21, "V18": 0.03, "V19": 0.40, "V20": 0.25,
                "V21": -0.02, "V22": 0.28, "V23": -0.11, "V24": 0.07,
                "V25": 0.13, "V26": -0.19, "V27": 0.13, "V28": -0.02
            }
        }
    }

# ─────────────────────────────────────────
# Helper: Preprocessing
# ─────────────────────────────────────────
def preprocess(data: TransactionInput) -> np.ndarray:
    amount_scaled = scaler_amount.transform([[data.Amount]])[0][0]
    time_scaled   = scaler_time.transform([[data.Time]])[0][0]

    v_features = [
        data.V1,  data.V2,  data.V3,  data.V4,  data.V5,
        data.V6,  data.V7,  data.V8,  data.V9,  data.V10,
        data.V11, data.V12, data.V13, data.V14, data.V15,
        data.V16, data.V17, data.V18, data.V19, data.V20,
        data.V21, data.V22, data.V23, data.V24, data.V25,
        data.V26, data.V27, data.V28
    ]

    # Urutan fitur sesuai preprocessing: V1-V28, Amount_scaled, Time_scaled
    features = np.array([v_features + [amount_scaled, time_scaled]])
    return features

# ─────────────────────────────────────────
# Helper: Fuzzy Sugeno
# ─────────────────────────────────────────
def fuzzy_inference(prob: float) -> dict:
    mu_low    = float(fuzz.interp_membership(x_universe, mf_low,    prob))
    mu_medium = float(fuzz.interp_membership(x_universe, mf_medium, prob))
    mu_high   = float(fuzz.interp_membership(x_universe, mf_high,   prob))

    denominator = mu_low + mu_medium + mu_high
    if denominator == 0:
        fuzzy_score = 0.0
    else:
        fuzzy_score = (mu_low * C_LOW + mu_medium * C_MEDIUM + mu_high * C_HIGH) / denominator

    label = "FRAUD" if fuzzy_score >= THRESHOLD else "LEGIT"

    return {
        "mu_low"     : round(mu_low, 4),
        "mu_medium"  : round(mu_medium, 4),
        "mu_high"    : round(mu_high, 4),
        "fuzzy_score": round(fuzzy_score, 4),
        "label"      : label
    }

# ─────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────

@app.get("/", tags=["Info"])
def root():
    return {
        "app"    : "WASPADA API",
        "version": "1.0.0",
        "status" : "running",
        "docs"   : "/docs"
    }

@app.get("/health", tags=["Info"])
def health_check():
    return {"status": "ok", "models_loaded": True}

@app.post("/predict", tags=["Prediksi"])
def predict(transaction: TransactionInput):
    """
    Terima data transaksi → preprocessing → ANN → Fuzzy Sugeno → kembalikan hasil.
    """
    try:
        # 1. Preprocessing
        features = preprocess(transaction)

        # 2. Prediksi ANN (probabilitas)
        ann_prob = float(ann_model.predict(features, verbose=0)[0][0])

        # 3. Inferensi Fuzzy Sugeno
        fuzzy_result = fuzzy_inference(ann_prob)

        # 4. Susun respons
        return {
            "input": {
                "Time"  : transaction.Time,
                "Amount": transaction.Amount
            },
            "ann": {
                "probability_fraud": round(ann_prob, 4)
            },
            "fuzzy": fuzzy_result,
            "result": {
                "label"      : fuzzy_result["label"],
                "is_fraud"   : fuzzy_result["label"] == "FRAUD",
                "confidence" : round(fuzzy_result["fuzzy_score"] * 100, 2)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/batch", tags=["Prediksi"])
def predict_batch(transactions: list[TransactionInput]):
    """
    Prediksi untuk banyak transaksi sekaligus (maks 100).
    """
    if len(transactions) > 100:
        raise HTTPException(status_code=400, detail="Maksimal 100 transaksi per request.")

    results = []
    for i, t in enumerate(transactions):
        try:
            features     = preprocess(t)
            ann_prob     = float(ann_model.predict(features, verbose=0)[0][0])
            fuzzy_result = fuzzy_inference(ann_prob)
            results.append({
                "index"   : i,
                "label"   : fuzzy_result["label"],
                "is_fraud": fuzzy_result["label"] == "FRAUD",
                "ann_prob": round(ann_prob, 4),
                "fuzzy_score": fuzzy_result["fuzzy_score"]
            })
        except Exception as e:
            results.append({"index": i, "error": str(e)})

    fraud_count = sum(1 for r in results if r.get("is_fraud"))
    return {
        "total"      : len(results),
        "fraud_count": fraud_count,
        "legit_count": len(results) - fraud_count,
        "results"    : results
    }


# ─────────────────────────────────────────
# Run langsung (development)
# ─────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)