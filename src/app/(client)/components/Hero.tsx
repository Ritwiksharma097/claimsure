"use client";

import Image from "next/image";
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
            "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(0,180,200,0.1) 0%, transparent 60%)",
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

      {/* Two-column content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "5rem clamp(1.5rem,5vw,3rem)",
          width: "100%",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* ── LEFT: Text ── */}
        <div>
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
              fontSize: "clamp(3rem, 6vw, 4.75rem)",
              fontWeight: 600,
              lineHeight: 1.07,
              marginBottom: "1.75rem",
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
              fontSize: "1.0625rem",
              color: "#c8c0b0",
              maxWidth: "520px",
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
              marginBottom: "3.5rem",
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
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.25rem",
              maxWidth: "420px",
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
                    fontSize: "1.875rem",
                    fontWeight: 700,
                    color: "#f8f6f0",
                    lineHeight: 1,
                  }}
                >
                  <Counter target={s.target} suffix={s.suffix} />
                </div>
                <div
                  style={{
                    fontSize: "0.725rem",
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
        </div>

        {/* ── RIGHT: Image ── */}
        <div
          style={{
            position: "relative",
            opacity: 0,
            animation: "fadeUp 0.9s ease 0.3s forwards",
          }}
          className="hero-image-col"
        >
          {/* Glow behind image */}
          <div
            style={{
              position: "absolute",
              inset: "-20px",
              borderRadius: "24px",
              background: "radial-gradient(ellipse at center, rgba(0,180,200,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Main image frame */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid rgba(0,180,200,0.2)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
              aspectRatio: "4/3",
            }}
          >
            <Image
              src="/images/hero-1.png"
              alt="ClaimSure healthcare claims platform"
              fill
              style={{ objectFit: "cover" }}
              priority
              unoptimized
            />
            {/* Overlay gradient at bottom */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40%",
                background: "linear-gradient(to top, rgba(10,15,30,0.7) 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Floating accent card */}
          <div
            style={{
              position: "absolute",
              bottom: "-1.5rem",
              left: "-1.5rem",
              zIndex: 2,
              background: "rgba(13,20,40,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(0,180,200,0.25)",
              borderRadius: "14px",
              padding: "1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.875rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg,#00b4c8,#00d4eb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                flexShrink: 0,
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#f8f6f0" }}>
                Claim Approved
              </div>
              <div style={{ fontSize: "0.7rem", color: "#4a5a72", marginTop: "1px" }}>
                PM-JAY · ₹4.2L · Processed in 36h
              </div>
            </div>
          </div>

          {/* Floating top-right badge */}
          <div
            style={{
              position: "absolute",
              top: "-1rem",
              right: "-1rem",
              zIndex: 2,
              background: "rgba(201,168,76,0.12)",
              border: "1px solid rgba(201,168,76,0.35)",
              borderRadius: "10px",
              padding: "0.625rem 1rem",
              fontSize: "0.75rem",
              color: "#c9a84c",
              fontWeight: 600,
              letterSpacing: "0.04em",
              backdropFilter: "blur(12px)",
            }}
          >
            ✦ NABH Compliant
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @media (max-width: 768px) {
          .hero-image-col {
            order: -1;
          }
          .hero-image-col > div:last-child,
          .hero-image-col > div:nth-child(3) {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
