import { Services } from "../components/Services";
import Link from "next/link";

export const metadata = {
  title: "Services — ClaimBridge",
  description:
    "Pre-authorization, cashless claims processing, patient records, compliance audits, analytics, and insurer liaison services.",
};

export default function ServicesPage() {
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
          <span>◈</span> What We Do
        </div>
        <h1
          style={{
            fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
            fontSize: "clamp(2.25rem,5vw,3.5rem)",
            fontWeight: 600, color: "#f8f6f0", lineHeight: 1.1,
          }}
        >
          A Complete{" "}
          <em style={{ color: "#00b4c8", fontStyle: "italic" }}>Claims Ecosystem</em>
        </h1>
        <p
          style={{
            marginTop: "1rem", fontSize: "1.0625rem", color: "#6b7a94",
            maxWidth: "580px", margin: "1rem auto 0", lineHeight: 1.7,
          }}
        >
          End-to-end claims management services designed for hospitals, TPAs, and
          healthcare networks that demand zero errors and faster settlements.
        </p>
      </div>

      {/* Services grid */}
      <Services />

      {/* CTA */}
      <div
        style={{
          textAlign: "center",
          padding: "1rem clamp(1.5rem,5vw,3rem) 5rem",
        }}
      >
        <p style={{ color: "#4a5a72", marginBottom: "1.25rem", fontSize: "0.9375rem" }}>
          Ready to see these services in action?
        </p>
        <Link
          href="/client/contact"
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
