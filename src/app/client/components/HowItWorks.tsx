"use client";

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
    <section
      id="how"
      style={{ padding: "6rem clamp(1.5rem,5vw,3rem)" }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Header */}
        <Reveal>
          <div style={{ marginBottom: "3rem" }}>
            <div style={token.sectionTag}>
              <span>◈</span> Process
            </div>
            <h2 style={token.sectionTitle}>
              How{" "}
              <em style={{ color: "#00b4c8", fontStyle: "italic" }}>
                ClaimBridge
              </em>{" "}
              Works
            </h2>
          </div>
        </Reveal>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.08}>
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "flex-start",
                  padding: "1.5rem 2rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  transition: "border-color 0.3s, background 0.3s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(0,180,200,0.2)";
                  el.style.background = "rgba(0,180,200,0.03)";
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
                    width: "48px",
                    height: "48px",
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
                      fontSize: "1rem",
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
                      fontSize: "0.9375rem",
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
      </div>
    </section>
  );
}
