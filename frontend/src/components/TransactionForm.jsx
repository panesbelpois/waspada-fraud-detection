import { useState } from "react";

const defaultValues = {
  Time: 406.0,
  Amount: 149.62,
  V1: -1.36,
  V2: -0.07,
  V3: 2.54,
  V4: 1.38,
  V5: -0.34,
  V6: 0.46,
  V7: 0.24,
  V8: 0.1,
  V9: 0.36,
  V10: 0.09,
  V11: -0.55,
  V12: -0.62,
  V13: -0.99,
  V14: -0.31,
  V15: 1.47,
  V16: -0.47,
  V17: 0.21,
  V18: 0.03,
  V19: 0.4,
  V20: 0.25,
  V21: -0.02,
  V22: 0.28,
  V23: -0.11,
  V24: 0.07,
  V25: 0.13,
  V26: -0.19,
  V27: 0.13,
  V28: -0.02,
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid rgba(197, 221, 245, 1)",
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.82)",
  color: "var(--inkwell)",
  fontSize: "13px",
  outline: "none",
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: "600",
  color: "var(--umber)",
  marginBottom: "4px",
  display: "block",
  letterSpacing: "0.5px",
};

const formCardStyle = {
  background: "rgba(240, 247, 255, 0.82)",
  border: "1px solid rgba(197, 221, 245, 0.9)",
  borderRadius: "24px",
  padding: "22px",
  boxShadow: "0 24px 60px rgba(13, 59, 102, 0.08)",
  backdropFilter: "blur(16px)",
};

export default function TransactionForm({ onResult, onLoading }) {
  const [form, setForm] = useState(defaultValues);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleSubmit = async () => {
    onLoading(true);
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      onResult(data);
    } catch (err) {
      alert("Gagal terhubung ke server. Pastikan back-end aktif.");
    } finally {
      onLoading(false);
    }
  };

  const vFields = Array.from({ length: 28 }, (_, i) => `V${i + 1}`);

  return (
    <div
      style={{
        ...formCardStyle,
      }}
    >
      {/* Time & Amount */}
      <p
        style={{
          fontSize: "12px",
          fontWeight: "800",
          color: "var(--ocean)",
          letterSpacing: "1px",
          marginBottom: "16px",
        }}
      >
        DATA TRANSAKSI
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {["Time", "Amount"].map((field) => (
          <div key={field} style={{ minWidth: 0 }}>
            <label style={labelStyle}>{field}</label>
            <input
              style={inputStyle}
              type="number"
              name={field}
              value={form[field]}
              onChange={handleChange}
              step="any"
            />
          </div>
        ))}
      </div>

      {/* V1 - V28 */}
      <p
        style={{
          fontSize: "12px",
          fontWeight: "800",
          color: "var(--ocean)",
          letterSpacing: "1px",
          marginBottom: "16px",
        }}
      >
        FITUR PCA (V1 — V28)
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        {vFields.map((field) => (
          <div key={field} style={{ minWidth: 0 }}>
            <label style={labelStyle}>{field}</label>
            <input
              style={inputStyle}
              type="number"
              name={field}
              value={form[field]}
              onChange={handleChange}
              step="any"
            />
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(135deg, var(--ocean), var(--deep))",
          color: "var(--ivory)",
          border: "none",
          borderRadius: "14px",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
          letterSpacing: "0.5px",
          boxShadow: "0 14px 24px rgba(0, 119, 204, 0.18)",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.background =
            "linear-gradient(135deg, #005fa3, var(--ocean))")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.background =
            "linear-gradient(135deg, var(--ocean), var(--deep))")
        }
      >
        Analisis Transaksi
      </button>
    </div>
  );
}
