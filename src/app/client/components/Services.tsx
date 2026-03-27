"use client";

import { Reveal, token } from "./utils";

const services = [
  {
    num: "01",
    icon: "📋",
    title: "Pre-Authorization Management",
    desc: "Streamlined prior-approval workflows connecting hospitals directly with insurer portals. Real-time status tracking, automated follow-ups, and zero missed deadlines.",
  },
  {
    num: "02",
    icon: "💳",
    title: "Cashless Claims Processing",
    desc: "End-to-end cashless settlement coordination with all major TPAs and insurers. We handle documentation, verification, and dispute resolution so your team does not have to.",
  },
  {
    num: "03",
    icon: "🗂️",
    title: "Patient Records Intelligence",
    desc: "Secure, structured patient file management with smart document tagging, identity verification, and cross-referencing against policy eligibility.",
  },
  {
    num: "04",
    icon: "✅",
    title: "Claim Audit & Compliance",
    desc: "Thorough pre-submission audits against insurer-specific policy rules. Every claim reviewed for coding accuracy, documentation completeness, and regulatory compliance.",
  },
  {
    num: "05",
    icon: "📊",
    title: "Analytics & Reporting",
    desc: "Granular dashboards showing approval rates, denial patterns, TAT benchmarks, and financial forecasting — giving leadership the data to make informed decisions.",
  },
  {
    num: "06",
    icon: "🤝",
    title: "Insurer Liaison Services",
    desc: "Dedicated account managers who maintain direct relationships with TPA and insurer desks — escalating disputes, tracking queries, and protecting your revenue.",
  },
];

export function Services() {
  return (
    <section
      id="services"
      style={{
        padding: "6rem clamp(1.5rem,5vw,3rem)",
        background: "rgba(255,255,255,0.015)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <Reveal>
          <div style={token.sectionTag}>
            <span>◈</span> What We Do
          </div>
          <h2 style={token.sectionTitle}>
            A Complete{" "}
            <em style={{ color: "#00b4c8", fontStyle: "italic" }}>
              Claims Ecosystem
            </em>
          </h2>
        </Reveal>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginTop: "3rem",
          }}
        >
          {services.map((svc, i) => (
            <Reveal key={svc.num} delay={i * 0.05}>
              <div
                style={{ ...token.glassCard, cursor: "default" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(0,180,200,0.3)";
                  el.style.boxShadow = "0 0 32px rgba(0,180,200,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    color: "rgba(0,180,200,0.5)",
                    fontWeight: 700,
                    marginBottom: "0.875rem",
                  }}
                >
                  {svc.num}
                </div>
                <div style={{ fontSize: "2rem", marginBottom: "0.875rem" }}>
                  {svc.icon}
                </div>
                <h3
                  style={{
                    fontFamily:
                      "var(--font-cormorant,'Cormorant Garamond',serif)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#f8f6f0",
                    marginBottom: "0.75rem",
                  }}
                >
                  {svc.title}
                </h3>
                <p
                  style={{
                    color: "#8a9ab5",
                    fontSize: "0.875rem",
                    lineHeight: 1.75,
                  }}
                >
                  {svc.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
