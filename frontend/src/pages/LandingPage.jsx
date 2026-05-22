import { useNavigate } from "react-router-dom";

const cardStyle = {
  background: "rgba(240, 247, 255, 0.82)",
  border: "1px solid rgba(197, 221, 245, 0.9)",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 24px 60px rgba(13, 59, 102, 0.08)",
  backdropFilter: "blur(16px)",
  width: "100%",
};

export default function LandingPage() {
  const navigate = useNavigate();

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
      <div
        style={{
          ...cardStyle,
          padding: "32px",
          marginBottom: 0,
          minHeight: "320px",
          background:
            "linear-gradient(135deg, rgba(240, 247, 255, 0.96), rgba(197, 221, 245, 0.62))",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "auto -90px -120px auto",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(0, 170, 255, 0.09)",
            filter: "blur(8px)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.9fr)",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "2px",
                color: "var(--ocean)",
                marginBottom: "16px",
                textTransform: "uppercase",
              }}
            >
              Tugas Besar · Kecerdasan Komputasional · ITERA 2026
            </p>

            <h1
              style={{
                fontSize: "48px",
                fontWeight: "900",
                lineHeight: "1.1",
                color: "var(--deep)",
                marginBottom: "20px",
                letterSpacing: "-1px",
              }}
            >
              Kenali transaksi
              <br />
              <span style={{ color: "var(--bottle)" }}>mencurigakan,</span>
              <br />
              sebelum terlambat.
            </h1>

            <p
              style={{
                fontSize: "16px",
                color: "rgba(13, 59, 102, 0.72)",
                lineHeight: "1.8",
                maxWidth: "540px",
                marginBottom: "32px",
              }}
            >
              WASPADA menggabungkan <strong>Artificial Neural Network</strong>{" "}
              dan <strong>Fuzzy Sugeno</strong> untuk mendeteksi fraud transaksi
              kartu kredit secara akurat — sekaligus menjelaskan{" "}
              <em>mengapa</em> sebuah transaksi dianggap mencurigakan.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "24px",
                alignItems: "stretch",
              }}
            >
              <button
                onClick={() => navigate("/deteksi")}
                style={{
                  padding: "12px 28px",
                  background:
                    "linear-gradient(135deg, var(--ocean), var(--deep))",
                  color: "var(--ivory)",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  letterSpacing: "0.3px",
                  borderRadius: "14px",
                  boxShadow: "0 14px 24px rgba(0, 119, 204, 0.18)",
                }}
              >
                Mulai Deteksi →
              </button>
              <button
                onClick={() => navigate("/batch")}
                style={{
                  padding: "12px 28px",
                  background: "transparent",
                  color: "var(--deep)",
                  border: "1.5px solid rgba(0, 119, 204, 0.22)",
                  borderRadius: "14px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(0, 119, 204, 0.08)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Upload CSV
              </button>
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              padding: "22px",
              alignSelf: "center",
              background: "rgba(255, 255, 255, 0.72)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "2px",
                color: "var(--khaki)",
                marginBottom: "14px",
                textTransform: "uppercase",
              }}
            >
              Ringkasan
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              {[
                {
                  angka: "284.807",
                  label: "Data Transaksi",
                  sub: "dataset ULB Kaggle",
                },
                { angka: "2", label: "Metode CI", sub: "ANN + Fuzzy Sugeno" },
                {
                  angka: "3",
                  label: "Kategori Output",
                  sub: "Aman · Curiga · Bahaya",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    borderRadius: "16px",
                    padding: "16px 14px",
                    background: "rgba(240, 247, 255, 0.9)",
                    border: "1px solid rgba(197, 221, 245, 1)",
                    minHeight: "118px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "900",
                      color: "var(--ocean)",
                      marginBottom: "4px",
                      fontFamily: "monospace",
                    }}
                  >
                    {s.angka}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "800",
                      color: "var(--deep)",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--khaki)",
                      marginTop: "2px",
                    }}
                  >
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 0 }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "2px",
              color: "var(--khaki)",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            Cara Kerja Sistem
          </p>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px" }}
          >
            {[
              {
                no: "01",
                judul: "Input Data Transaksi",
                desc: "Pengguna memasukkan data transaksi — Time, Amount, dan 28 fitur hasil PCA dari dataset kartu kredit.",
                warna: "var(--seafoam)",
                warnaText: "var(--bottle)",
              },
              {
                no: "02",
                judul: "Deteksi Pola oleh ANN",
                desc: "Artificial Neural Network menganalisis pola dari data historis dan menghasilkan nilai probabilitas fraud antara 0 hingga 1.",
                warna: "var(--linen)",
                warnaText: "var(--inkwell)",
              },
              {
                no: "03",
                judul: "Klasifikasi Fuzzy Sugeno",
                desc: "Probabilitas dari ANN dimasukkan ke Fuzzy Inference System Sugeno yang menghasilkan derajat keanggotaan dan label final secara gradual.",
                warna: "var(--blush)",
                warnaText: "var(--terracotta)",
              },
            ].map((step) => (
              <div
                key={step.no}
                style={{
                  ...cardStyle,
                  padding: "22px",
                  display: "flex",
                  gap: "20px",
                  alignItems: "flex-start",
                  minHeight: "128px",
                }}
              >
                <div
                  style={{
                    background: step.warna,
                    color: step.warnaText,
                    fontWeight: "800",
                    fontSize: "13px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    minWidth: "40px",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                    flexShrink: 0,
                  }}
                >
                  {step.no}
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: "700",
                      color: "var(--inkwell)",
                      marginBottom: "4px",
                    }}
                  >
                    {step.judul}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--umber)",
                      lineHeight: "1.6",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            ...cardStyle,
            background: "var(--linen)",
            padding: "26px",
            marginBottom: 0,
          }}
        >
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
            Tim Pengembang
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {[
              "Memory Simanjuntak · 123140095",
              "Fanisa Aulia Safitri · 123140121",
              "Refi Ikhsanti · 123140126",
              "Anisah Octa Rohila · 123140137",
              "Keira Lakeisha Fachra Fuady · 123140142",
            ].map((nama) => (
              <span
                key={nama}
                style={{
                  background: "var(--ivory)",
                  border: "1px solid var(--flax)",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  color: "var(--umber)",
                  fontWeight: "500",
                }}
              >
                {nama}
              </span>
            ))}
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "var(--khaki)",
              marginTop: "12px",
            }}
          >
            Program Studi Teknik Informatika · Fakultas Teknologi Industri ·
            ITERA · 2026
          </p>
        </div>
      </div>
    </main>
  );
}
