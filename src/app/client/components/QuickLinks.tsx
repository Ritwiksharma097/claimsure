"use client";

import Link from "next/link";

const quickLinks = [
  {
    href: "/client/about",
    icon: "🏥",
    title: "About Us",
    desc: "Learn how ClaimBridge was built by claims specialists with a decade of real hospital experience.",
    accent: "#00b4c8",
  },
  {
    href: "/client/services",
    icon: "📋",
    title: "Our Services",
    desc: "Pre-auth, cashless processing, patient records, compliance audits, analytics, and insurer liaison.",
    accent: "#c9a84c",
  },
  {
    href: "/client/how-it-works",
    icon: "⚡",
    title: "How It Works",
    desc: "Four simple steps from patient onboarding to final settlement reconciliation.",
    accent: "#00b4c8",
  },
  {
    href: "/client/contact",
    icon: "✉️",
    title: "Get in Touch",
    desc: "Ready to transform your claims process? Request a demo in under 30 minutes.",
    accent: "#c9a84c",
  },
];

export function QuickLinks() {
  return (
    <section style={{ padding: "5rem clamp(1.5rem,5vw,3rem)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#00b4c8", marginBottom: "1rem",
            }}
          >
            <span>◈</span> Explore ClaimBridge
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
              fontSize: "clamp(1.75rem,3.5vw,2.5rem)",
              fontWeight: 600, color: "#f8f6f0", lineHeight: 1.15,
            }}
          >
            Everything You Need to Know
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  padding: "1.75rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  height: "100%",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(255,255,255,0.055)";
                  el.style.borderColor = `${item.accent}33`;
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = `0 12px 40px ${item.accent}10`;
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
                    width: "44px", height: "44px",
                    background: `${item.accent}18`,
                    border: `1px solid ${item.accent}40`,
                    borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.25rem",
                    marginBottom: "1rem",
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#f8f6f0", marginBottom: "0.5rem" }}>
                  {item.title}
                </h3>
                <p style={{ color: "#4a5a72", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>
                  {item.desc}
                </p>
                <div style={{ marginTop: "1.25rem", fontSize: "0.8125rem", color: item.accent, letterSpacing: "0.04em" }}>
                  Learn more →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
