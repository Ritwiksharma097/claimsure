import type { CSSProperties } from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        background: "#0d1428",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "3.5rem clamp(1.5rem,5vw,3rem)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "2.5rem",
          alignItems: "flex-start",
        }}
      >
        {/* Brand */}
        <div style={{ maxWidth: "340px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                background: "linear-gradient(135deg,#00b4c8,#00d4eb)",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                boxShadow: "0 0 14px rgba(0,180,200,0.25)",
              }}
            >
              ⚕
            </div>
            <span
              style={{
                fontFamily:
                  "var(--font-cormorant,'Cormorant Garamond',serif)",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#f8f6f0",
              }}
            >
              Claim<span style={{ color: "#00b4c8" }}>Sure</span>
            </span>
          </div>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "#384456",
              lineHeight: 1.7,
            }}
          >
            Intelligent health insurance claims management for modern
            healthcare providers across India.
          </p>
        </div>

        {/* Links columns */}
        <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
          <div>
            <div style={colHead}>Platform</div>
            <Link href="/client/about" style={colLink}>About</Link>
            <Link href="/client/services" style={colLink}>Services</Link>
            <Link href="/client/how-it-works" style={colLink}>How It Works</Link>
            <Link href="/client/contact" style={colLink}>Contact</Link>
          </div>

          <div>
            <div style={colHead}>Access</div>
            <Link href="/client/register" style={colLink}>Patient Register</Link>
            <Link href="/login" style={colLink}>Staff Login</Link>
            <Link href="/client/contact" style={colLink}>Request Demo</Link>
          </div>

          <div>
            <div style={colHead}>Contact</div>
            <span style={{ ...colLink, display: "block" }}>hello@claimsure.site</span>
            <span style={{ ...colLink, display: "block" }}>+91 98765 43210</span>
            <span style={{ ...colLink, display: "block" }}>Jodhpur, Rajasthan</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "2.5rem auto 0",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <p style={{ fontSize: "0.8125rem", color: "#232d3a", margin: 0 }}>
          © 2025 ClaimSure. All rights reserved.
        </p>
        <p style={{ fontSize: "0.8125rem", color: "#232d3a", margin: 0 }}>
          Built for healthcare professionals across Rajasthan &amp; beyond.
        </p>
      </div>
    </footer>
  );
}

const colHead: CSSProperties = {
  fontSize: "0.7rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#384456",
  marginBottom: "0.875rem",
};

const colLink: CSSProperties = {
  display: "block",
  color: "#4a5a72",
  fontSize: "0.875rem",
  textDecoration: "none",
  marginBottom: "0.5rem",
  transition: "color 0.2s",
};
