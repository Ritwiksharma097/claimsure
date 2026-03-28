"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { clearToken } from "@/lib/auth";

const navItems = [
  { href: "/dashboard",     label: "Dashboard",      icon: "⊞" },
  { href: "/explorer",      label: "Master Explorer", icon: "◎" },
  { href: "/claimdesk",     label: "Claim Desk",      icon: "✦" },
  { href: "/patients",      label: "Patients",        icon: "♦" },
  { href: "/preauth",       label: "Preauth",         icon: "◈" },
  { href: "/admin-updates", label: "Admin Updates",   icon: "⚙" },
];

export function ProtectedShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    clearToken();
    router.push("/admin");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        color: "#f8f6f0",
        fontFamily: "var(--font-outfit,'Outfit',sans-serif)",
        display: "flex",
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          background: "#0d1428",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: sidebarOpen ? 0 : "-240px",
          zIndex: 200,
          transition: "left 0.3s ease",
        }}
        className="lg:left-0"
      >
        {/* Logo */}
        <div
          style={{
            padding: "1.5rem 1.25rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg,#00b4c8,#00d4eb)",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              boxShadow: "0 0 16px rgba(0,180,200,0.3)",
              flexShrink: 0,
            }}
          >
            ⚕
          </div>
          <div>
            <div
              style={{
                fontFamily:
                  "var(--font-cormorant,'Cormorant Garamond',serif)",
                fontSize: "1.25rem",
                fontWeight: 600,
                lineHeight: 1.1,
              }}
            >
              Claim<span style={{ color: "#00b4c8" }}>Sure</span>
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#384456",
                marginTop: "1px",
              }}
            >
              Operations
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "1rem 0", overflowY: "auto" }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 1.25rem",
                  margin: "0.125rem 0.75rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#f8f6f0" : "#4a5a72",
                  background: active
                    ? "rgba(0,180,200,0.1)"
                    : "transparent",
                  borderLeft: active
                    ? "2px solid #00b4c8"
                    : "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "#c8c0b0";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.03)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "#4a5a72";
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }
                }}
              >
                <span
                  style={{
                    fontSize: "1rem",
                    width: "20px",
                    textAlign: "center",
                    color: active ? "#00b4c8" : "inherit",
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          style={{
            padding: "1rem 0.75rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.625rem 1.25rem",
              borderRadius: "8px",
              background: "transparent",
              border: "none",
              color: "#4a5a72",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#f87171";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(239,68,68,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#4a5a72";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <span style={{ fontSize: "1rem", width: "20px", textAlign: "center" }}>⇥</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 199,
          }}
          className="lg:hidden"
        />
      )}

      {/* ── MAIN CONTENT ── */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
        className="lg:ml-[240px]"
      >
        {/* Topbar */}
        <header
          style={{
            height: "64px",
            background: "rgba(13,20,40,0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
            style={{
              background: "none",
              border: "none",
              color: "#f8f6f0",
              fontSize: "1.25rem",
              cursor: "pointer",
              padding: "0.25rem",
            }}
            aria-label="Open sidebar"
          >
            ☰
          </button>

          {/* Page title */}
          <div>
            <h1
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#f8f6f0",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "0.7rem",
                color: "#2d3a4a",
                margin: 0,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              ClaimSure Operations
            </p>
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link
              href="/"
              style={{
                fontSize: "0.75rem",
                color: "#384456",
                textDecoration: "none",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#00b4c8")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "#384456")
              }
            >
              ← Website
            </Link>

            <button
              onClick={handleLogout}
              style={{
                padding: "0.4rem 1rem",
                background: "transparent",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#f87171",
                borderRadius: "6px",
                fontSize: "0.75rem",
                cursor: "pointer",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(239,68,68,0.1)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(239,68,68,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(239,68,68,0.25)";
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Page body */}
        <main
          style={{
            flex: 1,
            padding: "2rem clamp(1rem,3vw,2rem)",
            maxWidth: "1400px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
