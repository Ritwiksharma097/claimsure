"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { hasValidPatientToken, setPatientSession } from "@/lib/patient-auth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export default function PatientLoginPage() {
  const router = useRouter();
  const [patientId, setPatientId] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasValidPatientToken()) router.replace("/client/portal");
  }, [router]);

  const handleLogin = async () => {
    setError("");
    if (!patientId.trim()) { setError("Please enter your Patient ID."); return; }
    if (!mobile.trim()) { setError("Please enter your mobile number."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/public/patient-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId.trim().toUpperCase(),
          mobile: mobile.trim(),
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { detail?: string };
        throw new Error(data.detail ?? "Login failed. Please check your credentials.");
      }
      const data = (await res.json()) as {
        access_token: string;
        patient_id: string;
        full_name: string;
      };
      setPatientSession(data.access_token, data.patient_id, data.full_name);
      router.push("/client/portal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "var(--font-outfit,'Outfit',sans-serif)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,180,200,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/client" style={{ textDecoration: "none", display: "inline-block" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                background: "linear-gradient(135deg,#00b4c8,#00d4eb)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                margin: "0 auto 1rem",
                boxShadow: "0 0 32px rgba(0,180,200,0.3)",
              }}
            >
              ⚕
            </div>
            <div
              style={{
                fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
                fontSize: "1.875rem",
                fontWeight: 600,
                color: "#f8f6f0",
              }}
            >
              Claim<span style={{ color: "#00b4c8" }}>Sure</span>
            </div>
          </Link>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.875rem",
              color: "#4a5a72",
              letterSpacing: "0.04em",
            }}
          >
            Patient Portal
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "16px",
            padding: "2.5rem",
          }}
        >
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#f8f6f0",
              marginBottom: "0.375rem",
            }}
          >
            Sign In to Your Portal
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#4a5a72", marginBottom: "1.75rem" }}>
            Use your Patient ID and registered mobile number. No password needed.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Patient ID */}
            <div>
              <label style={labelStyle}>Patient ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value.toUpperCase())}
                placeholder="e.g. RAHULM91800000"
                style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "0.06em" }}
                onKeyDown={(e) => e.key === "Enter" && void handleLogin()}
              />
              <p style={{ marginTop: "4px", fontSize: "0.7rem", color: "#2d3a4a" }}>
                Found on your registration confirmation
              </p>
            </div>

            {/* Mobile */}
            <div>
              <label style={labelStyle}>Registered Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit number"
                style={inputStyle}
                onKeyDown={(e) => e.key === "Enter" && void handleLogin()}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                  fontSize: "0.875rem",
                  color: "#f87171",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              disabled={loading}
              onClick={() => void handleLogin()}
              style={{
                marginTop: "0.25rem",
                padding: "0.875rem",
                background: loading
                  ? "rgba(0,180,200,0.4)"
                  : "linear-gradient(135deg,#00b4c8,#00d4eb)",
                color: "#0a0f1e",
                fontWeight: 700,
                border: "none",
                borderRadius: "8px",
                fontSize: "0.9375rem",
                letterSpacing: "0.03em",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 24px rgba(0,180,200,0.25)",
                transition: "all 0.3s ease",
              }}
            >
              {loading ? "Signing in…" : "Enter Portal →"}
            </button>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "1.75rem",
            fontSize: "0.8125rem",
            color: "#2d3a4a",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <span>
            Not registered yet?{" "}
            <Link href="/client/register" style={{ color: "#00b4c8", textDecoration: "none" }}>
              Register here
            </Link>
          </span>
          <Link href="/client" style={{ color: "#384456", textDecoration: "none" }}>
            ← Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#4a5a72",
  marginBottom: "6px",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  fontSize: "0.9375rem",
};
