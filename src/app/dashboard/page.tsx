"use client";

import Link from "next/link";

import { ProtectedShell } from "@/components/protected-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";

const modules = [
  {
    href: "/explorer",
    icon: "◎",
    title: "Master Explorer",
    desc: "Search and filter scheme package, procedure, and test master records across all insurers.",
    accent: "#00b4c8",
  },
  {
    href: "/claimdesk",
    icon: "✦",
    title: "Claim Desk",
    desc: "Compute best package match, generate a document checklist, and view your readiness score.",
    accent: "#c9a84c",
  },
  {
    href: "/patients",
    icon: "♦",
    title: "Patient Registry",
    desc: "Create and manage patient records, track visits, upload files, and link claims.",
    accent: "#00b4c8",
  },
  {
    href: "/preauth",
    icon: "◈",
    title: "Preauth Cases",
    desc: "Track pre-authorisation status, admitted amounts, reference IDs, and diagnosis notes.",
    accent: "#c9a84c",
  },
  {
    href: "/admin-updates",
    icon: "⚙",
    title: "Admin Updates",
    desc: "Manage master-data update sources, preview JSON diffs, and publish changes to the DB.",
    accent: "#00b4c8",
  },
];

export default function DashboardPage() {
  const { ready } = useAuthGuard();
  if (!ready) return null;

  return (
    <ProtectedShell title="Dashboard">
      {/* Welcome banner */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1.75rem 2rem",
          background:
            "linear-gradient(135deg, rgba(0,180,200,0.07) 0%, rgba(201,168,76,0.04) 100%)",
          border: "1px solid rgba(0,180,200,0.12)",
          borderRadius: "12px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,180,200,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#00b4c8",
            marginBottom: "0.375rem",
          }}
        >
          ◈ Operations Console
        </div>
        <h2
          style={{
            fontFamily:
              "var(--font-cormorant,'Cormorant Garamond',serif)",
            fontSize: "1.75rem",
            fontWeight: 600,
            color: "#f8f6f0",
            marginBottom: "0.5rem",
          }}
        >
          Welcome to ClaimSure
        </h2>
        <p style={{ color: "#6b7a94", fontSize: "0.9375rem", maxWidth: "560px" }}>
          Select a module below to begin. All data is saved to your PostgreSQL
          database and synced in real-time.
        </p>
      </div>

      {/* Module grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                padding: "1.625rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                transition: "all 0.25s ease",
                cursor: "pointer",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(255,255,255,0.055)";
                el.style.borderColor = `${m.accent}33`;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = `0 8px 32px ${m.accent}12`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(255,255,255,0.03)";
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: `${m.accent}18`,
                  border: `1px solid ${m.accent}40`,
                  borderRadius: "9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.125rem",
                  color: m.accent,
                  marginBottom: "1rem",
                }}
              >
                {m.icon}
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#f8f6f0",
                  marginBottom: "0.5rem",
                }}
              >
                {m.title}
              </h3>
              <p style={{ color: "#4a5a72", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>
                {m.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </ProtectedShell>
  );
}
