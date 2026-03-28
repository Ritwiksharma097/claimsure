"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ApiError, login } from "@/lib/api";
import { hasValidToken, setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasValidToken()) router.replace("/dashboard");
  }, [router]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const token = await login(username, password);
      setToken(token.access_token);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Login failed. Please check your credentials.");
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
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,180,200,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Corner orbs */}
      <div style={{ position: "absolute", top: "-200px", right: "-200px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,180,200,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-200px", left: "-200px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          <Link
            href="/"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
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
                fontFamily:
                  "var(--font-cormorant,'Cormorant Garamond',serif)",
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
            Operations Portal
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
            Welcome back
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#4a5a72",
              marginBottom: "1.75rem",
            }}
          >
            Sign in with your staff credentials to continue.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Username */}
            <div>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                style={inputStyle}
                onKeyDown={(e) => e.key === "Enter" && void handleLogin()}
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: "2.75rem" }}
                  onKeyDown={(e) => e.key === "Enter" && void handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#4a5a72",
                    fontSize: "1rem",
                    padding: "0",
                    lineHeight: 1,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#00b4c8")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#4a5a72")}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
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
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </div>
        </div>

        {/* Back to website */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.75rem",
            fontSize: "0.8125rem",
            color: "#2d3a4a",
          }}
        >
          Not staff?{" "}
          <Link
            href="/"
            style={{ color: "#00b4c8", textDecoration: "none" }}
          >
            Return to website
          </Link>
        </p>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#4a5a72",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  fontSize: "0.9375rem",
};
