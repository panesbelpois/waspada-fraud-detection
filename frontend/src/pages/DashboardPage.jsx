import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CARD_STYLE = {
  background: "rgba(240, 247, 255, 0.82)",
  border: "1px solid rgba(197, 221, 245, 0.9)",
  borderRadius: "24px",
  boxShadow: "0 24px 60px rgba(13, 59, 102, 0.08)",
  backdropFilter: "blur(16px)",
  width: "100%",
};

const STATUS_STYLE = {
  FRAUD: {
    bg: "rgba(255, 51, 0, 0.1)",
    text: "var(--alert)",
    border: "rgba(255, 51, 0, 0.24)",
  },
  LEGIT: {
    bg: "rgba(0, 170, 102, 0.1)",
    text: "var(--safe)",
    border: "rgba(0, 170, 102, 0.24)",
  },
};

const LABEL_COLORS = {
  LEGIT: "var(--safe)",
  FRAUD: "var(--alert)",
};

function parseHistory() {
  try {
    const raw = JSON.parse(localStorage.getItem("riwayat") || "[]");
    if (!Array.isArray(raw)) return [];

    return raw
      .filter((item) => item && typeof item === "object")
      .sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  } catch {
    return [];
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatMoney(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function formatDateTime(value) {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

function StatusBadge({ label }) {
  const tone = STATUS_STYLE[label] || {
    bg: "rgba(13, 59, 102, 0.08)",
    text: "var(--deep)",
    border: "rgba(13, 59, 102, 0.18)",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        borderRadius: "999px",
        border: `1px solid ${tone.border}`,
        background: tone.bg,
        color: tone.text,
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "0.4px",
        padding: "4px 10px",
      }}
    >
      <span
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: tone.text,
        }}
      />
      {label || "LEGIT"}
    </span>
  );
}

function EmptyState({ navigate, onRefresh }) {
  return (
    <section
      style={{
        ...CARD_STYLE,
        padding: "32px",
        textAlign: "center",
        background:
          "linear-gradient(135deg, rgba(240, 247, 255, 0.95), rgba(224, 240, 255, 0.82))",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "20px",
          margin: "0 auto 18px",
          display: "grid",
          placeItems: "center",
          fontSize: "30px",
          background: "rgba(0, 119, 204, 0.12)",
          color: "var(--ocean)",
        }}
      >
        ⟡
      </div>
      <h2
        style={{
          margin: 0,
          fontSize: "26px",
          fontWeight: "900",
          color: "var(--deep)",
          letterSpacing: "-0.6px",
        }}
      >
        Dashboard masih kosong
      </h2>
      <p
        style={{
          margin: "10px auto 0",
          maxWidth: "680px",
          color: "rgba(13, 59, 102, 0.72)",
          fontSize: "15px",
          lineHeight: 1.8,
        }}
      >
        Jalankan deteksi transaksi single atau batch dulu supaya riwayat muncul
        di sini. Setelah itu dashboard akan menampilkan tren, distribusi label,
        dan daftar transaksi terbaru.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginTop: "24px",
        }}
      >
        <button
          onClick={() => navigate("/deteksi")}
          style={{
            border: "none",
            borderRadius: "14px",
            padding: "12px 18px",
            background: "linear-gradient(135deg, var(--ocean), var(--deep))",
            color: "white",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: "0 14px 24px rgba(0, 119, 204, 0.24)",
          }}
        >
          Ke Deteksi
        </button>
        <button
          onClick={() => navigate("/batch")}
          style={{
            border: "1.5px solid rgba(0, 119, 204, 0.22)",
            borderRadius: "14px",
            padding: "12px 18px",
            background: "rgba(240, 247, 255, 0.92)",
            color: "var(--deep)",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          Ke Batch
        </button>
        <button
          onClick={onRefresh}
          style={{
            border: "1.5px solid rgba(197, 221, 245, 1)",
            borderRadius: "14px",
            padding: "12px 18px",
            background: "white",
            color: "var(--ocean)",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          Muat Ulang
        </button>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(() => parseHistory());

  const summary = useMemo(() => {
    const total = rows.length;
    const fraudCount = rows.filter((row) => row.label === "FRAUD").length;
    const legitCount = rows.filter((row) => row.label === "LEGIT").length;
    const avgConfidence =
      total === 0
        ? 0
        : rows.reduce((acc, row) => acc + Number(row.confidence || 0), 0) /
          total;
    const avgAmount =
      total === 0
        ? 0
        : rows.reduce((acc, row) => acc + Number(row.amount || 0), 0) / total;
    const maxConfidence =
      total === 0
        ? 0
        : Math.max(...rows.map((row) => Number(row.confidence || 0)));
    const latest = rows[0] || null;

    return {
      total,
      fraudCount,
      legitCount,
      avgConfidence,
      avgAmount,
      maxConfidence,
      latest,
    };
  }, [rows]);

  const labelData = useMemo(
    () => [
      { name: "LEGIT", value: summary.legitCount },
      { name: "FRAUD", value: summary.fraudCount },
    ],
    [summary.fraudCount, summary.legitCount],
  );

  const trendData = useMemo(() => {
    const last12 = [...rows].slice(0, 12).reverse();

    return last12.map((row, index) => ({
      idx: index + 1,
      annProb: Number(row.ann_prob || 0) * 100,
      fuzzyScore: Number(row.fuzzy_score || 0) * 100,
      confidence: Number(row.confidence || 0),
      label: row.label,
    }));
  }, [rows]);

  const refresh = () => setRows(parseHistory());

  const clearHistory = () => {
    localStorage.removeItem("riwayat");
    setRows([]);
  };

  const hasData = summary.total > 0;

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
          ...CARD_STYLE,
          padding: "30px",
          background:
            "linear-gradient(135deg, rgba(240, 247, 255, 0.94), rgba(197, 221, 245, 0.6))",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "auto -90px -120px auto",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "rgba(0, 170, 170, 0.08)",
            filter: "blur(4px)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gap: "18px",
            gridTemplateColumns: "1.4fr 0.9fr",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "999px",
                padding: "6px 12px",
                background: "rgba(0, 119, 204, 0.1)",
                color: "var(--ocean)",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "var(--safe)",
                }}
              />
              Dashboard Monitoring
            </div>
            <h1
              style={{
                margin: 0,
                color: "var(--deep)",
                fontSize: "45px",
                lineHeight: 1.08,
                letterSpacing: "-1.2px",
                fontWeight: "950",
                maxWidth: "760px",
              }}
            >
              Pantau hasil deteksi fraud pada dashboard monitoring.
            </h1>
            <p
              style={{
                margin: "14px 0 0",
                maxWidth: "780px",
                color: "rgba(13, 59, 102, 0.72)",
                fontSize: "15px",
                lineHeight: 1.8,
              }}
            >
              Dashboard ini merangkum histori hasil deteksi single dan batch,
              memperlihatkan perbandingan ANN versus Fuzzy, lalu menampilkan
              transaksi terbaru dalam satu layar.
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "22px",
              }}
            >
              <button
                onClick={refresh}
                style={{
                  border: "none",
                  borderRadius: "14px",
                  padding: "11px 16px",
                  background:
                    "linear-gradient(135deg, var(--ocean), var(--deep))",
                  color: "white",
                  fontWeight: "800",
                  cursor: "pointer",
                  boxShadow: "0 14px 24px rgba(0, 119, 204, 0.18)",
                }}
              >
                Muat Ulang Data
              </button>
              <button
                onClick={clearHistory}
                style={{
                  border: "1.5px solid rgba(255, 51, 0, 0.22)",
                  borderRadius: "14px",
                  padding: "11px 16px",
                  background: "rgba(255, 51, 0, 0.08)",
                  color: "var(--alert)",
                  fontWeight: "800",
                  cursor: "pointer",
                }}
              >
                Hapus Riwayat
              </button>
              <button
                onClick={() => navigate("/deteksi")}
                style={{
                  border: "1.5px solid rgba(0, 119, 204, 0.22)",
                  borderRadius: "14px",
                  padding: "11px 16px",
                  background: "rgba(255, 255, 255, 0.92)",
                  color: "var(--deep)",
                  fontWeight: "800",
                  cursor: "pointer",
                }}
              >
                Buka Deteksi
              </button>
            </div>
          </div>

          <aside
            style={{
              ...CARD_STYLE,
              padding: "20px",
              background: "rgba(255, 255, 255, 0.64)",
            }}
          >
            <div style={{ display: "grid", gap: "14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(13, 59, 102, 0.62)",
                      fontWeight: "800",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    Status Sistem
                  </div>
                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "20px",
                      fontWeight: "900",
                      color: "var(--deep)",
                    }}
                  >
                    {hasData ? "Riwayat aktif" : "Menunggu data"}
                  </div>
                </div>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "18px",
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(0, 170, 102, 0.12)",
                    color: "var(--safe)",
                    fontSize: "22px",
                  }}
                >
                  {hasData ? "↗" : "◎"}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "10px",
                }}
              >
                {[
                  {
                    label: "Total",
                    value: summary.total,
                    tone: "var(--ocean)",
                  },
                  {
                    label: "Fraud",
                    value: summary.fraudCount,
                    tone: "var(--alert)",
                  },
                  {
                    label: "Legit",
                    value: summary.legitCount,
                    tone: "var(--safe)",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      borderRadius: "18px",
                      padding: "14px 12px",
                      background: "rgba(240, 247, 255, 0.88)",
                      border: "1px solid rgba(197, 221, 245, 0.92)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "rgba(13, 59, 102, 0.58)",
                        fontWeight: "800",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        marginTop: "8px",
                        color: item.tone,
                        fontSize: "22px",
                        fontWeight: "950",
                        fontFamily: "monospace",
                      }}
                    >
                      {formatNumber(item.value)}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "10px",
                  paddingTop: "4px",
                }}
              >
                {[
                  {
                    label: "Rata-rata confidence",
                    value: formatPercent(summary.avgConfidence),
                    color: "var(--ocean)",
                  },
                  {
                    label: "Rata-rata nominal",
                    value: formatMoney(summary.avgAmount),
                    color: "var(--deep)",
                  },
                  {
                    label: "Confidence tertinggi",
                    value: formatPercent(summary.maxConfidence),
                    color: "var(--safe)",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      alignItems: "baseline",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(197, 221, 245, 0.82)",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(13, 59, 102, 0.64)",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        color: item.color,
                        fontWeight: "900",
                        fontSize: "18px",
                        fontFamily: "monospace",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                <StatusBadge label={summary.latest?.label || "LEGIT"} />
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "rgba(0, 119, 204, 0.1)",
                    color: "var(--ocean)",
                    fontSize: "11px",
                    fontWeight: "800",
                  }}
                >
                  Sumber: localStorage
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {!hasData ? (
        <EmptyState navigate={navigate} onRefresh={refresh} />
      ) : (
        <>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {[
              {
                title: "Total Transaksi",
                value: formatNumber(summary.total),
                accent: "var(--ocean)",
                tint: "rgba(0, 119, 204, 0.08)",
              },
              {
                title: "Fraud",
                value: formatNumber(summary.fraudCount),
                accent: "var(--alert)",
                tint: "rgba(255, 51, 0, 0.08)",
              },
              {
                title: "Legit",
                value: formatNumber(summary.legitCount),
                accent: "var(--safe)",
                tint: "rgba(0, 170, 102, 0.08)",
              },
              {
                title: "Avg Confidence",
                value: formatPercent(summary.avgConfidence),
                accent: "var(--azure)",
                tint: "rgba(0, 170, 255, 0.08)",
              },
              {
                title: "Rata-rata Nominal",
                value: formatMoney(summary.avgAmount),
                accent: "var(--deep)",
                tint: "rgba(13, 59, 102, 0.08)",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  ...CARD_STYLE,
                  padding: "18px",
                  background: `linear-gradient(135deg, ${item.tint}, rgba(240, 247, 255, 0.9))`,
                  minHeight: "132px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                    color: "rgba(13, 59, 102, 0.58)",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "30px",
                    lineHeight: 1,
                    fontWeight: "950",
                    color: item.accent,
                    fontFamily: "monospace",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.25fr",
              gap: "16px",
              alignItems: "stretch",
            }}
          >
            <div style={{ ...CARD_STYLE, padding: "22px", minHeight: "360px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      fontWeight: "800",
                      letterSpacing: "2px",
                      color: "rgba(13, 59, 102, 0.58)",
                      textTransform: "uppercase",
                    }}
                  >
                    Distribusi Label
                  </p>
                  <h3
                    style={{
                      margin: "8px 0 0",
                      color: "var(--deep)",
                      fontSize: "20px",
                      fontWeight: "900",
                    }}
                  >
                    Perbandingan transaksi aman dan fraud
                  </h3>
                </div>
                <StatusBadge
                  label={summary.fraudCount > 0 ? "FRAUD" : "LEGIT"}
                />
              </div>

              <div style={{ width: "100%", height: "280px" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={labelData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={68}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {labelData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={LABEL_COLORS[entry.name] || "var(--ocean)"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255, 255, 255, 0.96)",
                        border: "1px solid rgba(197, 221, 245, 1)",
                        borderRadius: "12px",
                        color: "var(--deep)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ ...CARD_STYLE, padding: "22px", minHeight: "360px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      fontWeight: "800",
                      letterSpacing: "2px",
                      color: "rgba(13, 59, 102, 0.58)",
                      textTransform: "uppercase",
                    }}
                  >
                    Tren Terakhir
                  </p>
                  <h3
                    style={{
                      margin: "8px 0 0",
                      color: "var(--deep)",
                      fontSize: "20px",
                      fontWeight: "900",
                    }}
                  >
                    ANN, Fuzzy, dan confidence terbaru
                  </h3>
                </div>
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: "rgba(0, 119, 204, 0.1)",
                    color: "var(--ocean)",
                    fontSize: "11px",
                    fontWeight: "800",
                  }}
                >
                  12 transaksi terakhir
                </span>
              </div>

              <div style={{ width: "100%", height: "280px" }}>
                <ResponsiveContainer>
                  <BarChart data={trendData} barGap={10}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(197, 221, 245, 1)"
                    />
                    <XAxis dataKey="idx" stroke="rgba(13, 59, 102, 0.52)" />
                    <YAxis stroke="rgba(13, 59, 102, 0.52)" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255, 255, 255, 0.96)",
                        border: "1px solid rgba(197, 221, 245, 1)",
                        borderRadius: "12px",
                        color: "var(--deep)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="annProb"
                      name="ANN Prob (%)"
                      fill="var(--ocean)"
                      radius={[10, 10, 0, 0]}
                    />
                    <Bar
                      dataKey="fuzzyScore"
                      name="Fuzzy Score (%)"
                      fill="var(--safe)"
                      radius={[10, 10, 0, 0]}
                    />
                    <Line
                      dataKey="confidence"
                      name="Confidence (%)"
                      stroke="var(--alert)"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section style={{ ...CARD_STYLE, padding: "22px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "2px",
                    color: "rgba(13, 59, 102, 0.58)",
                    textTransform: "uppercase",
                  }}
                >
                  Riwayat Terkini
                </p>
                <h3
                  style={{
                    margin: "8px 0 0",
                    color: "var(--deep)",
                    fontSize: "20px",
                    fontWeight: "900",
                  }}
                >
                  Transaksi terbaru dari deteksi single dan batch
                </h3>
              </div>
              <span
                style={{
                  color: "rgba(13, 59, 102, 0.64)",
                  fontSize: "13px",
                }}
              >
                Update terakhir: {formatDateTime(summary.latest?.timestamp)}
              </span>
            </div>

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
                      "Waktu",
                      "Nominal",
                      "Status",
                      "ANN",
                      "Fuzzy",
                      "Confidence",
                    ].map((head) => (
                      <th
                        key={head}
                        style={{
                          textAlign: "left",
                          color: "rgba(13, 59, 102, 0.62)",
                          fontWeight: "800",
                          fontSize: "11px",
                          letterSpacing: "0.7px",
                          padding: "10px 12px",
                          textTransform: "uppercase",
                        }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 20).map((row, index) => (
                    <tr
                      key={row.id || index}
                      style={{
                        borderBottom: "1px solid rgba(197, 221, 245, 0.8)",
                        background:
                          index % 2 === 0
                            ? "transparent"
                            : "rgba(224, 240, 255, 0.42)",
                      }}
                    >
                      <td style={{ padding: "12px", color: "var(--deep)" }}>
                        {formatDateTime(row.timestamp)}
                      </td>
                      <td style={{ padding: "12px", color: "var(--deep)" }}>
                        {formatMoney(row.amount)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <StatusBadge label={row.label || "LEGIT"} />
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "var(--deep)",
                          fontFamily: "monospace",
                        }}
                      >
                        {Number(row.ann_prob || 0).toFixed(4)}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "var(--deep)",
                          fontFamily: "monospace",
                        }}
                      >
                        {Number(row.fuzzy_score || 0).toFixed(4)}
                      </td>
                      <td style={{ padding: "12px", color: "var(--deep)" }}>
                        {formatPercent(row.confidence)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
