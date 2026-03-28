"use client";

import Image from "next/image";

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
    <section id="about" style={{ padding: "6rem clamp(1.5rem,5vw,3rem)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* ── TOP: Image + intro ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
            marginBottom: "4rem",
          }}
          className="about-grid"
        >
          {/* Image stack */}
          <Reveal>
            <div style={{ position: "relative" }}>
              {/* Main image */}
              <div
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
                  aspectRatio: "4/3",
                  position: "relative",
                }}
              >
                <Image
                  src="/images/about-main.jpg"
                  alt="Hospital operations"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* teal tint overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(0,180,200,0.08) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Accent image — overlapping bottom-right */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-24px",
                  right: "-24px",
                  width: "48%",
                  aspectRatio: "4/3",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "2px solid rgba(0,180,200,0.25)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
                  zIndex: 2,
                }}
              >
                <Image
                  src="/images/about-accent.jpg"
                  alt="Healthcare team"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="25vw"
                />
              </div>

              {/* Gold badge */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "-16px",
                  background: "linear-gradient(135deg, #c9a84c, #e8c876)",
                  color: "#0a0f1e",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  boxShadow: "0 8px 24px rgba(201,168,76,0.35)",
                  zIndex: 3,
                }}
              >
                10+ Years Experience
              </div>
            </div>
          </Reveal>

          {/* Text */}
          <Reveal delay={0.15}>
            <div style={token.sectionTag}>
              <span>◈</span> About ClaimSure
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
                lineHeight: 1.8,
                marginBottom: "1.5rem",
                fontSize: "0.9375rem",
              }}
            >
              We are not a software company that stumbled into healthcare. We
              are claims specialists who built the right tools after a decade
              of working directly with hospitals, TPAs, and insurers across
              Rajasthan.
            </p>
            <p
              style={{
                color: "#8a9ab5",
                lineHeight: 1.8,
                fontSize: "0.9375rem",
              }}
            >
              ClaimSure bridges the gap between complex insurance protocols and
              the everyday realities of hospital operations — so your team
              focuses on patients, not paperwork.
            </p>
          </Reveal>
        </div>

        {/* ── THREE PILLARS ── */}
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
