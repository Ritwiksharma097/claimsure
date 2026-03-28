"use client";

import Link from "next/link";
import { Counter } from "./utils";
import { token } from "./utils";

const stats = [
  { target: 98, suffix: "%", label: "First-Pass Approval Rate" },
  { target: 48, suffix: "h", label: "Average Turnaround Time" },
  { target: 500, suffix: "+", label: "Claims Processed Monthly" },
  { target: 0, suffix: "", label: "Tolerance for Errors" },
];

export function Hero() {
  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,200,0.12) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Side orb */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "-5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,180,200,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom divider line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,180,200,0.3), transparent)",
        }}
      />

      {/* Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "5rem clamp(1.5rem,5vw,3rem)",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "2rem",
            opacity: 0,
            animation: "fadeUp 0.7s ease 0.1s forwards",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#00b4c8",
              boxShadow: "0 0 10px #00b4c8",
            }}
          />
          <span
            style={{
              fontSize: "0.8125rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#00b4c8",
            }}
          >
            Trusted Claims Intelligence Platform
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily:
              "var(--font-cormorant, 'Cormorant Garamond', serif)",
            fontSize: "clamp(3.2rem, 8vw, 5.5rem)",
            fontWeight: 600,
            lineHeight: 1.07,
            marginBottom: "1.75rem",
            maxWidth: "720px",
            opacity: 0,
            animation: "fadeUp 0.7s ease 0.2s forwards",
          }}
        >
          Insurance Claims,
          <br />
          <em style={{ fontStyle: "italic", color: "#00b4c8" }}>
            Resolved
          </em>{" "}
          with
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c876)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Precision &amp; Speed
          </span>
        </h1>

        {/* Sub-heading */}
        <p
          style={{
            fontSize: "1.125rem",
            color: "#c8c0b0",
            maxWidth: "560px",
            marginBottom: "2.75rem",
            lineHeight: 1.75,
            opacity: 0,
            animation: "fadeUp 0.7s ease 0.3s forwards",
          }}
        >
          ClaimSure is India&apos;s intelligent health insurance claims
          management platform — built for hospitals, TPAs, and healthcare
          networks who demand zero errors and faster settlements.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "4rem",
            opacity: 0,
            animation: "fadeUp 0.7s ease 0.4s forwards",
          }}
        >
          <a href="#contact" style={token.btnPrimary}>
            Request a Demo →
          </a>
          <a href="#how" style={token.btnSecondary}>
            See How It Works ↓
          </a>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1.5rem",
            maxWidth: "680px",
            opacity: 0,
            animation: "fadeUp 0.7s ease 0.5s forwards",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                borderLeft: "2px solid rgba(0,180,200,0.3)",
                paddingLeft: "1rem",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#f8f6f0",
                  lineHeight: 1,
                }}
              >
                <Counter target={s.target} suffix={s.suffix} />
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7a94",
                  marginTop: "0.3rem",
                  letterSpacing: "0.02em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Staff login link */}
        <div
          style={{
            marginTop: "3rem",
            opacity: 0,
            animation: "fadeUp 0.7s ease 0.6s forwards",
          }}
        >
          <Link
            href="/login"
            style={{
              fontSize: "0.8125rem",
              color: "#4a5568",
              textDecoration: "none",
              letterSpacing: "0.04em",
              borderBottom: "1px solid rgba(74,85,104,0.4)",
              paddingBottom: "2px",
              transition: "color 0.2s",
            }}
          >
            Hospital staff? Sign in to the operations portal →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </section>
  );
}
