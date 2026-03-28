"use client";

const members = [
  { name: "Manish Sharma",  initials: "MS",  accent: "#00b4c8" },
  { name: "Amit Sharma",    initials: "AS",  accent: "#c9a84c" },
  { name: "Gagan Sharma",   initials: "GS",  accent: "#00b4c8" },
  { name: "Anant Sharma",   initials: "AnS", accent: "#c9a84c" },
  { name: "Ritwik Sharma",  initials: "RS",  accent: "#00b4c8" },
];

export function TeamSection() {
  return (
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
          {members.map((member) => (
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
                }}
              >
                {member.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
