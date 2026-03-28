"use client";

import Image from "next/image";

import { Reveal, token } from "./utils";

const steps = [
  {
    num: "01",
    title: "Patient Onboarding",
    desc: "Register the patient with Aadhaar / Jan Aadhaar verification. Our system auto-fills eligibility fields and flags any policy mismatches before treatment starts.",
  },
  {
    num: "02",
    title: "Pre-Auth Submission",
    desc: "Generate pre-authorisation requests with one click. Documents are auto-attached based on the treatment package and sent directly to the insurer portal.",
  },
  {
    num: "03",
    title: "Live Claim Tracking",
    desc: "Monitor every open claim from a unified dashboard. Get instant alerts on queries raised, approvals received, and amounts sanctioned — in real time.",
  },
  {
    num: "04",
    title: "Settlement & Reconciliation",
    desc: "Once payment is received, our system reconciles the settled amount against the claimed amount, flags shortfalls, and prepares appeal documentation automatically.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" style={{ padding: "6rem clamp(1.5rem,5vw,3rem)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <Reveal>
          <div style={{ marginBottom: "3.5rem", textAlign: "center" }}>
            <div style={{ ...token.sectionTag, justifyContent: "center" }}>
              <span>◈</span> Process
            </div>
            <h2 style={{ ...token.sectionTitle, textAlign: "center" }}>
              How{" "}
              <em style={{ color: "#00b4c8", fontStyle: "italic" }}>
                ClaimSure
              </em>{" "}
              Works
            </h2>
            <p
              style={{
                color: "#8a9ab5",
                maxWidth: "540px",
                margin: "0 auto",
                fontSize: "0.9375rem",
                lineHeight: 1.75,
              }}
            >
              A streamlined four-step workflow designed around how hospitals
              actually operate — from admission to final settlement.
            </p>
          </div>
        </Reveal>

        {/* Two-column: Steps + Image */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
          }}
          className="how-grid"
        >
          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.08}>
                <div
                  style={{
                    display: "flex",
                    gap: "1.25rem",
                    alignItems: "flex-start",
                    padding: "1.375rem 1.5rem",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    transition: "border-color 0.3s, background 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(0,180,200,0.2)";
                    el.style.background = "rgba(0,180,200,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(255,255,255,0.06)";
                    el.style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  {/* Step badge */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: "44px",
                      height: "44px",
                      background: "rgba(0,180,200,0.1)",
                      border: "1px solid rgba(0,180,200,0.3)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily:
                        "var(--font-cormorant,'Cormorant Garamond',serif)",
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      color: "#00b4c8",
                    }}
                  >
                    {step.num}
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "#f8f6f0",
                        marginBottom: "0.375rem",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        color: "#8a9ab5",
                        fontSize: "0.875rem",
                        lineHeight: 1.68,
                        margin: 0,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Image */}
          <Reveal delay={0.15}>
            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
                position: "relative",
                aspectRatio: "4/5",
              }}
            >
              <Image
                src="/images/how-it-works.jpg"
                alt="Claims process workflow"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Gradient overlay at bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background:
                    "linear-gradient(to top, rgba(10,15,30,0.85) 0%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />
              {/* Caption badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1.5rem",
                  left: "1.5rem",
                  right: "1.5rem",
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "0.875rem 1.25rem",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "#f8f6f0",
                    marginBottom: "0.2rem",
                  }}
                >
                  End-to-End Claims Management
                </div>
                <div style={{ fontSize: "0.75rem", color: "#8a9ab5" }}>
                  From patient admission to final settlement
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
