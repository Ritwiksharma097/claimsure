"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

const SCHEMES = [
  "Ayushman Bharat - PMJAY",
  "Rajasthan MAA Yojana",
  "Mukhyamantri Chiranjeevi Swasthya Bima Yojana",
  "ESIC",
  "CGHS",
  "Star Health Insurance",
  "New India Assurance",
  "United India Insurance",
  "National Insurance",
  "HDFC ERGO Health",
  "Religare Health Insurance",
  "Other",
];

type FormData = {
  full_name: string;
  mobile: string;
  scheme: string;
  gender: string;
  dob: string;
  city: string;
  aadhaar_last4: string;
  jan_aadhaar: string;
  notes: string;
};

const EMPTY: FormData = {
  full_name: "",
  mobile: "",
  scheme: "",
  gender: "",
  dob: "",
  city: "",
  aadhaar_last4: "",
  jan_aadhaar: "",
  notes: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ patient_id: string; message: string } | null>(null);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.full_name.trim()) { setError("Full name is required."); return; }
    if (!form.mobile.trim() || form.mobile.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!form.scheme) { setError("Please select your insurance scheme."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/public/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          mobile: form.mobile.trim(),
          scheme: form.scheme,
          gender: form.gender || null,
          dob: form.dob || null,
          city: form.city.trim() || null,
          aadhaar_last4: form.aadhaar_last4.trim() || null,
          jan_aadhaar: form.jan_aadhaar.trim() || null,
          notes: form.notes.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { detail?: string };
        throw new Error(data.detail ?? "Registration failed");
      }
      const data = (await res.json()) as { patient_id: string; message: string };
      setSuccess(data);
      setForm(EMPTY);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: "5rem clamp(1rem,5vw,3rem)", minHeight: "80vh" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={tagStyle}>
            <span>◈</span> Patient Portal
          </div>
          <h1
            style={{
              fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
              fontSize: "clamp(2rem,4vw,2.75rem)",
              fontWeight: 600,
              color: "#f8f6f0",
              lineHeight: 1.15,
              marginBottom: "0.75rem",
            }}
          >
            Register for{" "}
            <em style={{ color: "#00b4c8", fontStyle: "italic" }}>
              Insurance Claims
            </em>
          </h1>
          <p style={{ color: "#8a9ab5", fontSize: "0.9375rem", lineHeight: 1.75 }}>
            Fill in your details below and our claims team will get your case
            started. All fields marked <span style={{ color: "#f87171" }}>*</span> are required.
          </p>
        </div>

        {/* Success state */}
        {success ? (
          <div
            style={{
              background: "rgba(0,180,200,0.06)",
              border: "1px solid rgba(0,180,200,0.25)",
              borderRadius: "16px",
              padding: "2.5rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h2
              style={{
                fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "#f8f6f0",
                marginBottom: "0.75rem",
              }}
            >
              Registration Successful
            </h2>
            <p style={{ color: "#8a9ab5", fontSize: "0.9375rem", marginBottom: "1.5rem" }}>
              {success.message}
            </p>

            {/* Patient ID box */}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,180,200,0.3)",
                borderRadius: "10px",
                padding: "1.25rem",
                marginBottom: "2rem",
                display: "inline-block",
                minWidth: "240px",
              }}
            >
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a9ab5", marginBottom: "0.375rem" }}>
                Your Patient ID
              </div>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono, monospace)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#00b4c8",
                  letterSpacing: "0.06em",
                }}
              >
                {success.patient_id}
              </div>
            </div>

            <p style={{ color: "#8a9ab5", fontSize: "0.8125rem", marginBottom: "1.75rem" }}>
              Please save this ID — you will need it when you visit our facility or call our helpline.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => setSuccess(null)}
                style={btnSecondaryStyle}
              >
                Register Another
              </button>
              <Link href="/client/contact" style={btnPrimaryStyle}>
                Contact Us
              </Link>
            </div>
          </div>
        ) : (
          /* Registration form */
          <form onSubmit={(e) => void handleSubmit(e)}>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                padding: "2.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.375rem",
              }}
            >
              {/* Section: Personal Info */}
              <SectionLabel>Personal Information</SectionLabel>

              <div style={rowStyle}>
                <Field label="Full Name *">
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={set("full_name")}
                    placeholder="As per Aadhaar / ID"
                    style={inputStyle}
                    required
                  />
                </Field>
                <Field label="Mobile Number *">
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={set("mobile")}
                    placeholder="10-digit number"
                    maxLength={10}
                    style={inputStyle}
                    required
                  />
                </Field>
              </div>

              <div style={rowStyle}>
                <Field label="Gender">
                  <select value={form.gender} onChange={set("gender")} style={inputStyle}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>
                <Field label="Date of Birth">
                  <input
                    type="date"
                    value={form.dob}
                    onChange={set("dob")}
                    style={inputStyle}
                  />
                </Field>
              </div>

              <Field label="City / District">
                <input
                  type="text"
                  value={form.city}
                  onChange={set("city")}
                  placeholder="e.g. Jaipur, Jodhpur, Udaipur"
                  style={inputStyle}
                />
              </Field>

              {/* Section: Insurance */}
              <SectionLabel>Insurance Details</SectionLabel>

              <Field label="Insurance Scheme *">
                <select value={form.scheme} onChange={set("scheme")} style={inputStyle} required>
                  <option value="">Select your scheme</option>
                  {SCHEMES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <div style={rowStyle}>
                <Field label="Aadhaar Last 4 Digits">
                  <input
                    type="text"
                    value={form.aadhaar_last4}
                    onChange={set("aadhaar_last4")}
                    placeholder="XXXX"
                    maxLength={4}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Jan Aadhaar / Family ID">
                  <input
                    type="text"
                    value={form.jan_aadhaar}
                    onChange={set("jan_aadhaar")}
                    placeholder="Jan Aadhaar number"
                    style={inputStyle}
                  />
                </Field>
              </div>

              {/* Section: Additional */}
              <SectionLabel>Additional Details</SectionLabel>

              <Field label="Notes / Remarks">
                <textarea
                  value={form.notes}
                  onChange={set("notes")}
                  placeholder="Describe your condition, treatment needed, or any other details..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" as const }}
                />
              </Field>

              {/* Error */}
              {error && (
                <div
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "8px",
                    padding: "0.875rem 1rem",
                    fontSize: "0.875rem",
                    color: "#f87171",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "0.5rem",
                  padding: "1rem",
                  background: loading
                    ? "rgba(0,180,200,0.4)"
                    : "linear-gradient(135deg,#00b4c8,#00d4eb)",
                  color: "#0a0f1e",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  letterSpacing: "0.03em",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 0 24px rgba(0,180,200,0.25)",
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "Submitting…" : "Submit Registration →"}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "#4a5a72", margin: 0 }}>
                Already registered?{" "}
                <Link href="/client/contact" style={{ color: "#00b4c8", textDecoration: "none" }}>
                  Contact our helpdesk
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#00b4c8",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid rgba(0,180,200,0.15)",
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

/* ── Styles ───────────────────────────────────────────────────────────── */

const tagStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#00b4c8",
  marginBottom: "1rem",
};

const labelStyle: CSSProperties = {
  fontSize: "0.75rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#8a9ab5",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  fontSize: "0.9375rem",
};

const rowStyle: CSSProperties = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
};

const btnPrimaryStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "0.75rem 1.75rem",
  background: "linear-gradient(135deg, #00b4c8, #00d4eb)",
  color: "#0a0f1e",
  fontWeight: 600,
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  fontSize: "0.9375rem",
  textDecoration: "none",
  boxShadow: "0 0 24px rgba(0,180,200,0.25)",
};

const btnSecondaryStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "0.75rem 1.75rem",
  background: "transparent",
  color: "#f8f6f0",
  fontWeight: 500,
  borderRadius: "4px",
  border: "1px solid rgba(255,255,255,0.2)",
  cursor: "pointer",
  fontSize: "0.9375rem",
};
