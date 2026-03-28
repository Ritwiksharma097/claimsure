"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  clearPatientSession,
  getPatientId,
  getPatientName,
  hasValidPatientToken,
} from "@/lib/patient-auth";

const portalLinks = [
  { href: "/portal",            label: "Dashboard", icon: "⊞" },
  { href: "/portal/book-test",  label: "Find My Claims", icon: "📋" },
  { href: "/portal/my-claims",  label: "My Claims", icon: "◈" },
  { href: "/portal/profile",    label: "Profile & Docs", icon: "♦" },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!hasValidPatientToken()) {
      router.replace("/portal/login");
      return;
    }
    setPatientId(getPatientId());
    setPatientName(getPatientName());
  }, [router]);

  const handleLogout = () => {
    clearPatientSession();
    router.push("/portal/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        color: "#f8f6f0",
        fontFamily: "var(--font-outfit,'Outfit',sans-serif)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top navbar */}
      <header
        style={{
          height: "64px",
          background: "rgba(13,20,40,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1rem,3vw,2rem)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo + portal label */}
        <Link
          href="/portal"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
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
            }}
          >
            ⚕
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
                fontSize: "1.125rem",
                fontWeight: 600,
                lineHeight: 1.1,
                color: "#f8f6f0",
              }}
            >
              Claim<span style={{ color: "#00b4c8" }}>Sure</span>
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#384456",
              }}
            >
              Patient Portal
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
          className="hidden md:flex"
        >
          {portalLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0.4rem 0.875rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "0.8125rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#f8f6f0" : "#6b7a94",
                  background: active ? "rgba(0,180,200,0.1)" : "transparent",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: "0.875rem" }}>{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: patient info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {patientId && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "1px",
              }}
              className="hidden sm:flex"
            >
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#f8f6f0",
                  maxWidth: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {patientName}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-geist-mono, monospace)",
                  fontSize: "0.7rem",
                  color: "#00b4c8",
                  letterSpacing: "0.04em",
                }}
              >
                {patientId}
              </span>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{
              background: "none",
              border: "none",
              color: "#f8f6f0",
              fontSize: "1.25rem",
              cursor: "pointer",
            }}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1.25rem",
              background: "rgba(239,68,68,0.15)",
              border: "1px solid #f87171",
              color: "#f87171",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.28)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.15)";
            }}
          >
            ⇥ Sign Out
          </button>
        </div>
      </header>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          style={{
            background: "rgba(13,20,40,0.98)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "1rem 1.5rem",
            position: "sticky",
            top: "64px",
            zIndex: 99,
          }}
        >
          {patientId && (
            <div
              style={{
                padding: "0.75rem",
                marginBottom: "0.75rem",
                background: "rgba(0,180,200,0.06)",
                borderRadius: "8px",
                border: "1px solid rgba(0,180,200,0.15)",
              }}
            >
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#f8f6f0" }}>
                {patientName}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "#00b4c8",
                }}
              >
                {patientId}
              </div>
            </div>
          )}
          {portalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "0.75rem 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                color: pathname === l.href ? "#f8f6f0" : "#6b7a94",
                textDecoration: "none",
                fontSize: "0.9375rem",
                fontWeight: pathname === l.href ? 600 : 400,
              }}
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => { setMobileOpen(false); handleLogout(); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              marginTop: "0.75rem",
              padding: "0.875rem 1rem",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: "8px",
              color: "#f87171",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span>⇥</span> Sign Out
          </button>
        </div>
      )}

      {/* Page content */}
      <main
        style={{
          flex: 1,
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
          padding: "2rem clamp(1rem,3vw,2rem)",
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "#232d3a" }}>
          © 2025 ClaimSure — Patient Portal
        </span>
        <Link
          href="/"
          style={{ fontSize: "0.75rem", color: "#384456", textDecoration: "none" }}
        >
          ← Back to Website
        </Link>
      </div>
    </div>
  );
}
