import { About } from "../components/About";

export const metadata = {
  title: "About — ClaimSure",
  description:
    "Learn how ClaimSure was built by claims specialists with a decade of real hospital experience across Rajasthan.",
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
          About <em style={{ color: "#00b4c8", fontStyle: "italic" }}>ClaimSure</em>
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

      {/* Team section */}
      <section style={{ padding: "0 clamp(1.5rem,5vw,3rem) 5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#00b4c8", marginBottom: "1rem",
              }}
            >
              <span>◈</span> The People Behind It
            </div>
            <h2
              style={{
                fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
                fontSize: "clamp(1.75rem,3.5vw,2.5rem)",
                fontWeight: 600, color: "#f8f6f0", lineHeight: 1.15,
              }}
            >
              Meet Our{" "}
              <em style={{ color: "#00b4c8", fontStyle: "italic" }}>Team</em>
            </h2>
            <p style={{ color: "#6b7a94", fontSize: "0.9375rem", maxWidth: "480px", margin: "0.75rem auto 0", lineHeight: 1.7 }}>
              A dedicated group of claims specialists and healthcare technology experts
              working together to transform how India handles health insurance claims.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              { name: "Manish Sharma",  initials: "MS",  accent: "#00b4c8" },
              { name: "Amit Sharma",    initials: "AS",  accent: "#c9a84c" },
              { name: "Gagan Sharma",   initials: "GS",  accent: "#00b4c8" },
              { name: "Anant Sharma",   initials: "AnS", accent: "#c9a84c" },
              { name: "Ritwik Sharma",  initials: "RS",  accent: "#00b4c8" },
            ].map((member) => (
              <div
                key={member.name}
                style={{
                  padding: "1.75rem 1.25rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "14px",
                  textAlign: "center",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(255,255,255,0.045)";
                  el.style.borderColor = `${member.accent}35`;
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = `0 12px 40px ${member.accent}10`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(255,255,255,0.02)";
                  el.style.borderColor = "rgba(255,255,255,0.07)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: `${member.accent}18`,
                    border: `2px solid ${member.accent}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                    fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: member.accent,
                    letterSpacing: "0.02em",
                  }}
                >
                  {member.initials}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
                    fontSize: "1.1875rem",
                    fontWeight: 600,
                    color: "#f8f6f0",
                    marginBottom: "0.375rem",
                  }}
                >
                  {member.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
