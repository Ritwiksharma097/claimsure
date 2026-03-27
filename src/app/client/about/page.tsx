import { About } from "../components/About";

export const metadata = {
  title: "About — ClaimBridge",
  description:
    "Learn how ClaimBridge was built by claims specialists with a decade of real hospital experience across Rajasthan.",
};

export default function AboutPage() {
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
          <span>◈</span> Who We Are
        </div>
        <h1
          style={{
            fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
            fontSize: "clamp(2.25rem,5vw,3.5rem)",
            fontWeight: 600, color: "#f8f6f0", lineHeight: 1.1,
          }}
        >
          About <em style={{ color: "#00b4c8", fontStyle: "italic" }}>ClaimBridge</em>
        </h1>
        <p
          style={{
            marginTop: "1rem", fontSize: "1.0625rem", color: "#6b7a94",
            maxWidth: "540px", margin: "1rem auto 0", lineHeight: 1.7,
          }}
        >
          We are not a software company that stumbled into healthcare.
          We are claims specialists who built the right tools after a decade
          of working directly with hospitals, TPAs, and insurers.
        </p>
      </div>

      {/* About section content */}
      <About />

      {/* Values section */}
      <section style={{ padding: "0 clamp(1.5rem,5vw,3rem) 5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
              marginTop: "1rem",
            }}
          >
            {[
              { icon: "🎯", title: "Mission", desc: "To eliminate claim rejections and settlement delays by making compliance intelligence available to every hospital, however large or small." },
              { icon: "👁️", title: "Vision", desc: "A future where every legitimate health claim is settled on the first pass — and every patient receives the coverage they deserve." },
              { icon: "⚖️", title: "Values", desc: "Accuracy over speed. Transparency over shortcuts. We do the hard work of getting it right so our clients never have to defend a rejection." },
            ].map((v) => (
              <div
                key={v.title}
                style={{
                  padding: "1.75rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.875rem" }}>{v.icon}</div>
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
                    fontSize: "1.25rem", fontWeight: 600, color: "#f8f6f0", marginBottom: "0.625rem",
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ color: "#6b7a94", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
