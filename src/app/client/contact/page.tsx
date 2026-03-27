import { Contact } from "../components/Contact";

export const metadata = {
  title: "Contact — ClaimBridge",
  description:
    "Request a demo and see how ClaimBridge transforms your claims process in under 30 minutes.",
};

export default function ContactPage() {
  return (
    <div style={{ paddingTop: "72px" }}>
      {/* Page hero banner */}
      <div
        style={{
          padding: "4rem clamp(1.5rem,5vw,3rem) 2rem",
          background:
            "linear-gradient(180deg, rgba(201,168,76,0.07) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#c9a84c", marginBottom: "1rem",
          }}
        >
          <span>◈</span> Get in Touch
        </div>
        <h1
          style={{
            fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
            fontSize: "clamp(2.25rem,5vw,3.5rem)",
            fontWeight: 600, color: "#f8f6f0", lineHeight: 1.1,
          }}
        >
          Ready to Transform Your
          <br />
          <em style={{ color: "#c9a84c", fontStyle: "italic" }}>Claims Process?</em>
        </h1>
        <p
          style={{
            marginTop: "1rem", fontSize: "1.0625rem", color: "#6b7a94",
            maxWidth: "520px", margin: "1rem auto 0", lineHeight: 1.7,
          }}
        >
          Fill in the form below and our team will reach out within 24 hours
          to schedule a personalised demo — no commitment required.
        </p>
      </div>

      {/* Contact form + details */}
      <Contact />
    </div>
  );
}
