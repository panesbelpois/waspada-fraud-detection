import { useState } from "react";
import TransactionForm from "../components/TransactionForm";
import HasilDeteksi from "../components/HasilDeteksi";

const cardStyle = {
  background: "rgba(240, 247, 255, 0.82)",
  border: "1px solid rgba(197, 221, 245, 0.9)",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 24px 60px rgba(13, 59, 102, 0.08)",
  backdropFilter: "blur(16px)",
};

export default function DeteksiPage() {
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResult = (data) => {
    setHasil(data);
    // Simpan ke riwayat localStorage
    const existing = JSON.parse(localStorage.getItem("riwayat") || "[]");
    const entry = {
      id: Date.now(),
      time: data.input.Time,
      amount: data.input.Amount,
      label: data.result.label,
      confidence: data.result.confidence,
      ann_prob: data.ann.probability_fraud,
      fuzzy_score: data.fuzzy.fuzzy_score,
      timestamp: new Date().toLocaleString("id-ID"),
    };
    localStorage.setItem(
      "riwayat",
      JSON.stringify([entry, ...existing].slice(0, 50)),
    );
  };

  return (
    <main
      style={{
        padding: "32px",
        maxWidth: "1480px",
        margin: "0 auto",
        display: "grid",
        gap: "20px",
      }}
    >
      <section
        style={{
          ...cardStyle,
          padding: "28px",
          marginBottom: 0,
        }}
      >
        <h1
          style={{
            color: "var(--deep)",
            fontSize: "26px",
            fontWeight: "900",
            marginBottom: "8px",
            letterSpacing: "-0.8px",
          }}
        >
          Deteksi Transaksi
        </h1>
        <p
          style={{
            color: "rgba(13, 59, 102, 0.72)",
            fontSize: "15px",
            marginBottom: 0,
            maxWidth: "760px",
            lineHeight: "1.8",
          }}
        >
          Masukkan data transaksi untuk dianalisis oleh sistem hibrida ANN +
          Fuzzy Sugeno.
        </p>
      </section>

      <section
        style={{
          ...cardStyle,
          padding: "24px",
        }}
      >
        <TransactionForm onResult={handleResult} onLoading={setLoading} />

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "32px",
              color: "rgba(13, 59, 102, 0.72)",
            }}
          >
            Menganalisis transaksi...
          </div>
        )}

        {!loading && hasil && <HasilDeteksi data={hasil} />}
      </section>
    </main>
  );
}
