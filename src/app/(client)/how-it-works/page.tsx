import { HowItWorks } from "../components/HowItWorks";
import { StatsBand }  from "../components/StatsBand";
import Link           from "next/link";

export const metadata = {
  title: "How It Works — ClaimSure",
  description:
    "Four simple steps from patient onboarding to final settlement reconciliation with ClaimSure.",
};

export default function HowItWorksPage() {
  return (
    <div style={{ paddingTop: "72px" }}>
      {/* Page hero banner */}
      <div
        style={{
          padding: "4rem clamp(1.5rem,5vw,3rem) 2rem",
          background:
            "linear-gradient(180deg, rgba(0,180,200,0.07) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#00b4c8", marginBottom: "1rem",
          }}
        >
          <span>◈</span> The Process
        </div>
        <h1
          style={{
            fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
            fontSize: "clamp(2.25rem,5vw,3.5rem)",
            fontWeight: 600, color: "#f8f6f0", lineHeight: 1.1,
          }}
        >
          How{" "}
          <em style={{ color: "#00b4c8", fontStyle: "italic" }}>ClaimSure</em>{" "}
          Works
        </h1>
        <p
          style={{
            marginTop: "1rem", fontSize: "1.0625rem", color: "#6b7a94",
            maxWidth: "520px", margin: "1rem auto 0", lineHeight: 1.7,
          }}
        >
          From the moment a patient walks in to the final settlement hitting your
          bank account — ClaimSure manages every step of the journey.
        </p>
      </div>

      {/* Steps */}
      <HowItWorks />

      {/* Stats */}
      <StatsBand />

      {/* Why it matters */}
      <section style={{ padding: "5rem clamp(1.5rem,5vw,3rem)" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#c9a84c", marginBottom: "1rem",
              }}
            >
              <span>◈</span> Why It Matters
            </div>
            <h2
              style={{
                fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
                fontSize: "clamp(1.75rem,3.5vw,2.5rem)",
                fontWeight: 600, color: "#f8f6f0", lineHeight: 1.15,
              }}
            >
              The Cost of Getting It Wrong
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              { stat: "30–40%", label: "of claims are rejected on the first submission at most Indian hospitals", color: "#f87171" },
              { stat: "₹2–5L",  label: "average revenue lost per bed per month due to delayed or denied claims", color: "#fbbf24" },
              { stat: "72h+",   label: "average time wasted chasing a single query with an insurer desk", color: "#f87171" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "1.75rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
                    fontSize: "2.5rem", fontWeight: 700, color: item.color, lineHeight: 1, marginBottom: "0.75rem",
                  }}
                >
                  {item.stat}
                </div>
                <p style={{ color: "#6b7a94", fontSize: "0.9375rem", lineHeight: 1.65, margin: 0 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "0 2rem 5rem" }}>
        <p style={{ color: "#4a5a72", marginBottom: "1.25rem", fontSize: "0.9375rem" }}>
          Stop leaving revenue on the table.
        </p>
        <Link
          href="/contact"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "0.75rem 2rem",
            background: "linear-gradient(135deg,#00b4c8,#00d4eb)",
            color: "#0a0f1e", fontWeight: 700,
            borderRadius: "4px", textDecoration: "none",
            fontSize: "0.9375rem", letterSpacing: "0.02em",
            boxShadow: "0 0 28px rgba(0,180,200,0.25)",
          }}
        >
          Request a Demo →
        </Link>
      </div>
    </div>
  );
}
