import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Beranda" },
  { to: "/deteksi", label: "Deteksi" },
  { to: "/batch", label: "Batch CSV" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "18px",
        padding: "14px 32px",
        background: "rgba(255, 255, 255, 0.72)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(197, 221, 245, 0.8)",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            background: "linear-gradient(135deg, var(--ocean), var(--azure))",
            color: "white",
            fontWeight: "900",
            fontSize: "13px",
            padding: "6px 14px",
            borderRadius: "999px",
            letterSpacing: "1px",
            boxShadow: "0 10px 24px rgba(0, 119, 204, 0.18)",
          }}
        >
          WASPADA
        </span>
      </Link>

      <nav style={{ display: "flex", gap: "6px", flex: 1, flexWrap: "wrap" }}>
        {navLinks.map((link) => {
          const active = pathname === link.to;

          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: "none",
                padding: "8px 14px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: active ? "800" : "600",
                color: active ? "var(--deep)" : "rgba(13, 59, 102, 0.72)",
                background: active ? "rgba(0, 119, 204, 0.1)" : "transparent",
                border: active
                  ? "1px solid rgba(0, 119, 204, 0.18)"
                  : "1px solid transparent",
                transition: "all 0.15s ease",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "999px",
          background: "rgba(0, 170, 102, 0.08)",
          border: "1px solid rgba(0, 170, 102, 0.18)",
          color: "var(--safe)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--safe)",
          }}
        />
        <span style={{ fontSize: "11px", fontWeight: "800" }}>API Online</span>
      </div>
    </header>
  );
}
