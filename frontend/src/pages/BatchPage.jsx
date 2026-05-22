import { useState } from "react";

const cardStyle = {
  background: "rgba(240, 247, 255, 0.82)",
  border: "1px solid rgba(197, 221, 245, 0.9)",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 24px 60px rgba(13, 59, 102, 0.08)",
  backdropFilter: "blur(16px)",
  width: "100%",
};

const labelBadge = (label) => {
  const config = {
    FRAUD: { bg: "var(--bahaya-bg)", text: "var(--bahaya-text)" },
    LEGIT: { bg: "var(--aman-bg)", text: "var(--aman-text)" },
  };
  const c = config[label] || { bg: "var(--linen)", text: "var(--umber)" };
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.5px",
      }}
    >
      {label}
    </span>
  );
};

export default function BatchPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const vals = line.split(",");
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = parseFloat(vals[i]) || 0;
      });
      return obj;
    });
  };

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.endsWith(".csv")) {
      setError("File harus berformat .csv");
      return;
    }
    setFile(f);
    setError(null);
    setResults(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalisis = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const transactions = parseCSV(text);

      if (transactions.length === 0) {
        setError("File CSV kosong atau format tidak valid.");
        setLoading(false);
        return;
      }
      if (transactions.length > 100) {
        setError("Maksimal 100 transaksi per batch.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/predict/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactions),
      });

      const data = await res.json();
      setResults(data);

      // Simpan ke riwayat
      const existing = JSON.parse(localStorage.getItem("riwayat") || "[]");
      const newEntries = data.results
        .filter((r) => !r.error)
        .map((r, i) => ({
          id: Date.now() + i,
          time: transactions[i]?.Time || 0,
          amount: transactions[i]?.Amount || 0,
          label: r.label,
          confidence: Math.round(r.fuzzy_score * 100),
          ann_prob: r.ann_prob,
          fuzzy_score: r.fuzzy_score,
          timestamp: new Date().toLocaleString("id-ID"),
        }));
      localStorage.setItem(
        "riwayat",
        JSON.stringify([...newEntries, ...existing].slice(0, 50)),
      );
    } catch (err) {
      setError("Gagal terhubung ke server. Pastikan back-end aktif.");
    } finally {
      setLoading(false);
    }
  };

  const fraudCount = results?.fraud_count ?? 0;
  const legitCount = results?.legit_count ?? 0;
  const total = results?.total ?? 0;

  return (
    <main
      style={{
        maxWidth: "1480px",
        margin: "0 auto",
        padding: "32px",
        display: "grid",
        gap: "20px",
      }}
    >
      <section
        style={{
          ...cardStyle,
          padding: "28px",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "900",
            color: "var(--deep)",
            marginBottom: "8px",
            letterSpacing: "-0.8px",
          }}
        >
          Deteksi Batch
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "rgba(13, 59, 102, 0.72)",
            marginBottom: 0,
            maxWidth: "760px",
            lineHeight: "1.8",
          }}
        >
          Upload file CSV berisi banyak transaksi — maksimal 100 baris per
          analisis.
        </p>
      </section>

      <div style={{ ...cardStyle, marginBottom: "20px", padding: "24px" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: "800",
            letterSpacing: "2px",
            color: "var(--khaki)",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}
        >
          Upload File CSV
        </p>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("csvInput").click()}
          style={{
            border: `2px dashed ${dragOver ? "var(--bottle)" : "var(--flax)"}`,
            borderRadius: "16px",
            padding: "44px",
            textAlign: "center",
            cursor: "pointer",
            background: dragOver
              ? "rgba(0, 170, 102, 0.08)"
              : "rgba(224, 240, 255, 0.45)",
            transition: "all 0.2s ease",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📂</div>
          <p
            style={{
              fontWeight: "600",
              color: "var(--deep)",
              marginBottom: "4px",
            }}
          >
            {file ? file.name : "Klik atau drag & drop file CSV di sini"}
          </p>
          <p style={{ fontSize: "12px", color: "var(--khaki)" }}>
            {file
              ? `${(file.size / 1024).toFixed(1)} KB · siap dianalisis`
              : "Format: .csv · Maks. 100 baris"}
          </p>
          <input
            id="csvInput"
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {/* Format Info */}
        <div
          style={{
            background: "rgba(224, 240, 255, 0.55)",
            border: "1px solid rgba(197, 221, 245, 1)",
            borderRadius: "14px",
            padding: "16px 18px",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "var(--deep)",
              marginBottom: "6px",
            }}
          >
            Format kolom CSV yang dibutuhkan:
          </p>
          <code
            style={{
              fontSize: "11px",
              color: "var(--ocean)",
              lineHeight: "1.8",
            }}
          >
            Time, Amount, V1, V2, V3, ..., V28
          </code>
        </div>

        {error && (
          <div
            style={{
              background: "var(--bahaya-bg)",
              border: "1px solid var(--terracotta)",
              borderRadius: "14px",
              padding: "12px 16px",
              marginBottom: "16px",
              color: "var(--bahaya-text)",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleAnalisis}
          disabled={!file || loading}
          style={{
            width: "100%",
            padding: "12px",
            background:
              !file || loading
                ? "var(--linen)"
                : "linear-gradient(135deg, var(--ocean), var(--deep))",
            color: !file || loading ? "var(--khaki)" : "var(--ivory)",
            border: "none",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: !file || loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            boxShadow:
              !file || loading ? "none" : "0 14px 24px rgba(0, 119, 204, 0.18)",
          }}
        >
          {loading ? "Menganalisis..." : "Analisis Semua Transaksi"}
        </button>
      </div>

      {results && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "16px",
              alignItems: "stretch",
            }}
          >
            {[
              {
                label: "Total Transaksi",
                value: total,
                bg: "var(--ivory)",
                text: "var(--deep)",
              },
              {
                label: "Terdeteksi Fraud",
                value: fraudCount,
                bg: "var(--bahaya-bg)",
                text: "var(--bahaya-text)",
              },
              {
                label: "Transaksi Aman",
                value: legitCount,
                bg: "var(--aman-bg)",
                text: "var(--aman-text)",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: s.bg,
                  border: "1px solid var(--flax)",
                  borderRadius: "18px",
                  padding: "22px",
                  textAlign: "center",
                  minHeight: "148px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderRadius: "18px",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "800",
                    color: s.text,
                    fontFamily: "monospace",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--umber)",
                    marginTop: "4px",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...cardStyle, padding: "24px", minHeight: "320px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "2px",
                color: "var(--khaki)",
                marginBottom: "16px",
                textTransform: "uppercase",
              }}
            >
              Hasil Per Transaksi
            </p>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr
                    style={{ borderBottom: "2px solid rgba(197, 221, 245, 1)" }}
                  >
                    {[
                      "#",
                      "Status",
                      "ANN Prob",
                      "Fuzzy Score",
                      "Keyakinan",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "8px 12px",
                          textAlign: "left",
                          color: "rgba(13, 59, 102, 0.62)",
                          fontWeight: "800",
                          fontSize: "11px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.results.map((r, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid var(--linen)",
                        background:
                          i % 2 === 0 ? "transparent" : "var(--parchment)",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "var(--khaki)",
                          fontFamily: "monospace",
                        }}
                      >
                        {r.index + 1}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        {r.error ? (
                          <span
                            style={{ color: "var(--khaki)", fontSize: "11px" }}
                          >
                            Error
                          </span>
                        ) : (
                          labelBadge(r.label)
                        )}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontFamily: "monospace",
                          color: "var(--inkwell)",
                        }}
                      >
                        {r.ann_prob?.toFixed(4) ?? "-"}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontFamily: "monospace",
                          color: "var(--inkwell)",
                        }}
                      >
                        {r.fuzzy_score?.toFixed(4) ?? "-"}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "var(--inkwell)",
                        }}
                      >
                        {r.fuzzy_score
                          ? `${(r.fuzzy_score * 100).toFixed(1)}%`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
