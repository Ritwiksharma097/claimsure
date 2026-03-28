"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { Reveal, token } from "./utils";

const contactDetails = [
  { icon: "✉️", label: "Email",    value: "Coming Soon"                 },
  { icon: "📞", label: "Phone",    value: "Coming Soon"                 },
  { icon: "📍", label: "Location", value: "Bikaner, Rajasthan — India"  },
];

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      style={{
        padding: "6rem clamp(1.5rem,5vw,3rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow orb */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,180,200,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "4rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── Left: info ── */}
        <Reveal>
          <div
            style={{
              width: "48px",
              height: "2px",
              background: "linear-gradient(90deg,#c9a84c,#e8c876)",
              marginBottom: "1.5rem",
            }}
          />
          <p
            style={{
              color: "#8a9ab5",
              lineHeight: 1.75,
              marginBottom: "2rem",
              fontSize: "0.9375rem",
            }}
          >
            Whether you&apos;re a hospital network, a standalone facility, or a
            TPA looking for a better system — ClaimSure adapts to your
            workflow. Request a demo and see the difference in under 30
            minutes.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {contactDetails.map((d) => (
              <div
                key={d.label}
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.125rem",
                    flexShrink: 0,
                  }}
                >
                  {d.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#3d4d5e",
                      marginBottom: "2px",
                    }}
                  >
                    {d.label}
                  </div>
                  <div style={{ color: "#c8c0b0", fontSize: "0.9375rem" }}>
                    {d.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Right: form ── */}
        <Reveal delay={0.15}>
          <div style={{ ...token.glassCard, padding: "2.5rem" }}>
            {submitted ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 0",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                <h3
                  style={{
                    fontFamily:
                      "var(--font-cormorant,'Cormorant Garamond',serif)",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: "#f8f6f0",
                    marginBottom: "0.75rem",
                  }}
                >
                  Request Received
                </h3>
                <p style={{ color: "#8a9ab5", fontSize: "0.9375rem" }}>
                  Our team will reach out within 24 hours to schedule your
                  demo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div
                  className="contact-name-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <input
                      type="text"
                      placeholder="Rajan"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <input
                      type="text"
                      placeholder="Mehta"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                {[
                  { label: "Hospital / Organisation", type: "text",  ph: "Your institution name" },
                  { label: "Email Address",            type: "email", ph: "you@hospital.com"      },
                ].map((f) => (
                  <div key={f.label} style={{ marginBottom: "1rem" }}>
                    <label style={labelStyle}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.ph}
                      required
                      style={inputStyle}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>I am a…</label>
                  <select required style={inputStyle}>
                    <option value="">Select your role</option>
                    <option>Hospital / Healthcare Provider</option>
                    <option>TPA (Third Party Administrator)</option>
                    <option>Insurance Company</option>
                    <option>Healthcare Network</option>
                    <option>Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>Message (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your current claims volume and pain points…"
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    background: "linear-gradient(135deg,#00b4c8,#00d4eb)",
                    color: "#0a0f1e",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.9375rem",
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                    boxShadow: "0 0 24px rgba(0,180,200,0.25)",
                    transition: "box-shadow 0.3s",
                  }}
                >
                  Request a Demo →
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const labelStyle: CSSProperties = {
  fontSize: "0.7rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#4a5a72",
  display: "block",
  marginBottom: "6px",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  fontSize: "0.9375rem",
};
