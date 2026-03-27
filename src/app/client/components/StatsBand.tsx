"use client";

import { Counter, Reveal } from "./utils";

const stats = [
  { target: 98,  suffix: "%",  label: "First-Pass Approval Rate" },
  { target: 48,  suffix: "h",  label: "Avg. Turnaround Time"     },
  { target: 500, suffix: "+",  label: "Claims / Month"            },
  { target: 12,  suffix: "+",  label: "Schemes Supported"         },
  { target: 99,  suffix: "%",  label: "Client Retention"          },
];

export function StatsBand() {
  return (
    <div
      style={{
        padding: "4.5rem clamp(1.5rem,5vw,3rem)",
        background:
          "linear-gradient(135deg, rgba(0,180,200,0.06) 0%, rgba(201,168,76,0.04) 100%)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "2rem",
          textAlign: "center",
        }}
      >
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div>
              <div
                style={{
                  fontFamily:
                    "var(--font-cormorant,'Cormorant Garamond',serif)",
                  fontSize: "3rem",
                  fontWeight: 700,
                  color: "#f8f6f0",
                  lineHeight: 1,
                }}
              >
                <Counter target={s.target} suffix={s.suffix} />
              </div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "#6b7a94",
                  marginTop: "0.5rem",
                  letterSpacing: "0.03em",
                }}
              >
                {s.label}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
