const statusConfig = {
  FRAUD: {
    bg: "var(--bahaya-bg)",
    text: "var(--bahaya-text)",
    border: "var(--terracotta)",
    label: "FRAUD TERDETEKSI",
  },
  LEGIT: {
    bg: "var(--aman-bg)",
    text: "var(--aman-text)",
    border: "var(--bottle)",
    label: "TRANSAKSI AMAN",
  },
};

function MembershipBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <span
          style={{ fontSize: "12px", color: "var(--umber)", fontWeight: "600" }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "12px",
            color: "var(--inkwell)",
            fontFamily: "monospace",
          }}
        >
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <div
        style={{
          background: "var(--linen)",
          borderRadius: "99px",
          height: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value * 100}%`,
            height: "100%",
            background: color,
            borderRadius: "99px",
            transition: "width 0.8s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function HasilDeteksi({ data }) {
  if (!data) return null;

  const { ann, fuzzy, result } = data;
  const status = statusConfig[result.label];

  return (
    <div
      style={{
        background: "rgba(240, 247, 255, 0.82)",
        border: `1px solid ${status.border}`,
        borderRadius: "24px",
        padding: "24px",
        marginTop: "20px",
        boxShadow: "0 24px 60px rgba(13, 59, 102, 0.08)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Badge Status */}
      <div
        style={{
          background: status.bg,
          color: status.text,
          padding: "12px 20px",
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "16px",
          textAlign: "center",
          marginBottom: "24px",
          letterSpacing: "1px",
        }}
      >
        {status.label}
      </div>

      {/* ANN Probability */}
      <div style={{ marginBottom: "24px" }}>
        <p
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "var(--ocean)",
            letterSpacing: "1px",
            marginBottom: "12px",
          }}
        >
          PROBABILITAS ANN
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "800",
              color: result.is_fraud ? "var(--terracotta)" : "var(--bottle)",
              fontFamily: "monospace",
            }}
          >
            {(ann.probability_fraud * 100).toFixed(1)}%
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                background: "var(--linen)",
                borderRadius: "99px",
                height: "14px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${ann.probability_fraud * 100}%`,
                  height: "100%",
                  background: result.is_fraud ? "var(--alert)" : "var(--ocean)",
                  borderRadius: "99px",
                  transition: "width 1s ease",
                }}
              />
            </div>
            <p
              style={{
                fontSize: "11px",
                color: "var(--khaki)",
                marginTop: "4px",
              }}
            >
              Keyakinan jaringan saraf tiruan bahwa transaksi ini fraud
            </p>
          </div>
        </div>
      </div>

      {/* Fuzzy Membership */}
      <div style={{ marginBottom: "24px" }}>
        <p
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "var(--bottle)",
            letterSpacing: "1px",
            marginBottom: "12px",
          }}
        >
          DERAJAT KEANGGOTAAN FUZZY SUGENO
        </p>
        <MembershipBar
          label="Aman"
          value={fuzzy.mu_low}
          color="var(--bottle)"
        />
        <MembershipBar
          label="Mencurigakan"
          value={fuzzy.mu_medium}
          color="var(--caramel)"
        />
        <MembershipBar
          label="Sangat Mencurigakan"
          value={fuzzy.mu_high}
          color="var(--terracotta)"
        />
      </div>

      {/* Fuzzy Score & XAI */}
      <div
        style={{
          background: "rgba(224, 240, 255, 0.55)",
          border: "1px solid rgba(197, 221, 245, 1)",
          borderRadius: "14px",
          padding: "16px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "var(--ocean)",
            letterSpacing: "1px",
            marginBottom: "8px",
          }}
        >
          🔍 TRANSPARANSI KEPUTUSAN
        </p>
        <p
          style={{ fontSize: "13px", color: "var(--umber)", lineHeight: "1.6" }}
        >
          ANN mendeteksi pola transaksi dengan probabilitas fraud sebesar{" "}
          <strong>{(ann.probability_fraud * 100).toFixed(1)}%</strong>. Sistem
          Fuzzy Sugeno menghasilkan skor akhir{" "}
          <strong>{(fuzzy.fuzzy_score * 100).toFixed(1)}</strong> dan
          mengklasifikasikan transaksi ini sebagai{" "}
          <strong style={{ color: status.text }}>{result.label}</strong> dengan
          tingkat keyakinan <strong>{result.confidence}%</strong>.
        </p>
      </div>
    </div>
  );
}
