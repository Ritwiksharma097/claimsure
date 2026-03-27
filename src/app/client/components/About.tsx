"use client";

import { Reveal, token } from "./utils";

const pillars = [
  {
    icon: "🏥",
    title: "Hospital-First Approach",
    desc: "Embedded within your workflows, not bolted on. Our system maps to your existing processes and scales with your claims volume — without disrupting your team.",
  },
  {
    icon: "⚡",
    title: "Real-Time Processing",
    desc: "Every claim, document, and status update is processed instantly. No batching, no overnight delays — just live visibility across your entire portfolio.",
  },
  {
    icon: "🔒",
    title: "Compliance Built-In",
    desc: "Ayushman Bharat, Rajasthan MAA, and all major state and private insurer rules are baked into every checklist, reducing rejections at the source.",
  },
];

export function About() {
  return (
    <section
      id="about"
      style={{ padding: "6rem clamp(1.5rem,5vw,3rem)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <Reveal>
          <div style={token.sectionTag}>
            <span>◈</span> About ClaimBridge
          </div>
          <h2 style={token.sectionTitle}>
            Where Expertise Meets
            <br />
            <em style={{ color: "#c9a84c", fontStyle: "italic" }}>
              Modern Technology
            </em>
          </h2>
          <p
            style={{
              color: "#8a9ab5",
              maxWidth: "560px",
              lineHeight: 1.75,
              marginBottom: "3rem",
              fontSize: "0.9375rem",
            }}
          >
            We are not a software company that stumbled into healthcare. We
            are claims specialists who built the right tools after a decade
            of working directly with hospitals, TPAs, and insurers across
            Rajasthan.
          </p>
        </Reveal>

        {/* Three-column pillars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div
                style={{ ...token.glassCard }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(0,180,200,0.25)";
                  el.style.boxShadow = "0 0 32px rgba(0,180,200,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>
                  {p.icon}
                </div>
                <h3
                  style={{
                    fontFamily:
                      "var(--font-cormorant,'Cormorant Garamond',serif)",
                    fontSize: "1.375rem",
                    fontWeight: 600,
                    color: "#f8f6f0",
                    marginBottom: "0.75rem",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    color: "#8a9ab5",
                    fontSize: "0.9375rem",
                    lineHeight: 1.7,
                  }}
                >
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
