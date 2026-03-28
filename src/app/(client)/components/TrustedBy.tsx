"use client";

const brands = [
  "Apollo Hospitals",
  "Fortis Healthcare",
  "Max Health",
  "Manipal Hospitals",
  "Care Health Insurance",
  "Star Health",
  "Medi Assist TPA",
  "HDFC Ergo",
];

export function TrustedBy() {
  const doubled = [...brands, ...brands];

  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(255,255,255,0.018)",
        padding: "1.375rem 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "3rem",
          padding: "0 3rem",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#384456",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Trusted by
        </span>

        <div
          style={{
            display: "flex",
            gap: "3.5rem",
            whiteSpace: "nowrap",
            animation: "marquee 22s linear infinite",
          }}
        >
          {doubled.map((name, i) => (
            <span
              key={i}
              style={{
                color: "#4a5a72",
                fontSize: "0.875rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
