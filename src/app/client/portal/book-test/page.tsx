"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { getPatientAuthHeader, hasValidPatientToken } from "@/lib/patient-auth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

type Scheme = { id: number; scheme: string; type: string };
type Procedure = {
  package_code: string | null;
  package_name: string | null;
  procedure_name: string | null;
  specialty: string | null;
  scheme: string;
  rate_primary: number | null;
  los: string | null;
};

export default function BookTestPage() {
  const router = useRouter();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [selectedScheme, setSelectedScheme] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Procedure | null>(null);
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasValidPatientToken()) { router.replace("/client/portal/login"); return; }

    void (async () => {
      const res = await fetch(`${API}/public/schemes`);
      if (res.ok) setSchemes((await res.json()) as Scheme[]);
    })();
  }, [router]);

  // Search procedures when scheme or search query changes
  useEffect(() => {
    if (!selectedScheme) { setProcedures([]); return; }
    const timeout = setTimeout(() => {
      setSearching(true);
      const params = new URLSearchParams({ scheme: selectedScheme, limit: "30" });
      if (search.trim()) params.set("q", search.trim());
      void fetch(`${API}/patient/procedures?${params.toString()}`, {
        headers: getPatientAuthHeader(),
      }).then(async (res) => {
        if (res.ok) setProcedures((await res.json()) as Procedure[]);
        setSearching(false);
      }).catch(() => setSearching(false));
    }, 350);
    return () => clearTimeout(timeout);
  }, [selectedScheme, search]);

  const handleSubmit = async () => {
    if (!selectedScheme) { setError("Please select a scheme."); return; }
    if (!selected) { setError("Please select a procedure/test from the list."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/patient/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getPatientAuthHeader() },
        body: JSON.stringify({
          scheme: selectedScheme,
          specialty: selected.specialty,
          package_code: selected.package_code,
          procedure_name: selected.procedure_name ?? selected.package_name ?? "Unknown",
          preferred_date: preferredDate || null,
          notes: notes.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { detail?: string };
        throw new Error(d.detail ?? "Booking failed");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          background: "rgba(0,180,200,0.05)",
          border: "1px solid rgba(0,180,200,0.2)",
          borderRadius: "16px",
          maxWidth: "520px",
          margin: "0 auto",
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
          Booking Submitted
        </h2>
        <p style={{ color: "#8a9ab5", fontSize: "0.9375rem", marginBottom: "1.5rem" }}>
          Your booking request has been received. Our team will review it and update the status
          after SSO portal submission. You can track this in{" "}
          <strong style={{ color: "#f8f6f0" }}>My Claims</strong>.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => { setSuccess(false); setSelected(null); setSearch(""); setNotes(""); setPreferredDate(""); }}
            style={btnSecondary}
          >
            Book Another
          </button>
          <button
            onClick={() => router.push("/client/portal/my-claims")}
            style={btnPrimary}
          >
            View My Claims →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={tagStyle}>◈ Book a Treatment</div>
        <h1
          style={{
            fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
            fontSize: "clamp(1.75rem,3vw,2.25rem)",
            fontWeight: 600,
            color: "#f8f6f0",
            lineHeight: 1.15,
            marginBottom: "0.5rem",
          }}
        >
          Book a Test or Procedure
        </h1>
        <p style={{ color: "#8a9ab5", fontSize: "0.9rem" }}>
          Select your insurance scheme, search for the procedure, and submit a booking request.
          Our team will process it and update you with the SSO acknowledgement.
        </p>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Step 1: Scheme */}
        <div>
          <SectionLabel step="1" label="Select Your Insurance Scheme" />
          <select
            value={selectedScheme}
            onChange={(e) => { setSelectedScheme(e.target.value); setSelected(null); setSearch(""); }}
            style={{ ...inputStyle, width: "100%" }}
          >
            <option value="">Choose scheme…</option>
            {schemes.map((s) => (
              <option key={s.id} value={s.scheme}>{s.scheme}</option>
            ))}
          </select>
        </div>

        {/* Step 2: Search procedures */}
        {selectedScheme && (
          <div>
            <SectionLabel step="2" label="Search for Procedure / Test" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelected(null); }}
              placeholder="Type procedure name, package code, or specialty…"
              style={{ ...inputStyle, width: "100%", marginBottom: "0.75rem" }}
            />

            {/* Results list */}
            {searching ? (
              <div style={{ padding: "0.75rem", color: "#4a5a72", fontSize: "0.875rem" }}>Searching…</div>
            ) : procedures.length === 0 && search ? (
              <div style={{ padding: "0.75rem", color: "#4a5a72", fontSize: "0.875rem" }}>
                No results for &ldquo;{search}&rdquo;
              </div>
            ) : (
              <div
                style={{
                  maxHeight: "280px",
                  overflowY: "auto",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {procedures.map((p, i) => {
                  const isSelected =
                    selected?.package_code === p.package_code &&
                    selected?.procedure_name === p.procedure_name;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelected(p)}
                      style={{
                        padding: "0.875rem 1rem",
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        background: isSelected
                          ? "rgba(0,180,200,0.1)"
                          : "transparent",
                        borderLeft: isSelected
                          ? "2px solid #00b4c8"
                          : "2px solid transparent",
                        transition: "background 0.15s",
                      }}
                    >
                      <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "#f8f6f0" }}>
                        {p.procedure_name ?? p.package_name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#4a5a72", marginTop: "2px", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                        {p.specialty && <span>{p.specialty}</span>}
                        {p.package_code && <span>Code: {p.package_code}</span>}
                        {p.rate_primary && <span style={{ color: "#22c55e" }}>₹{p.rate_primary.toLocaleString()}</span>}
                        {p.los && <span>LOS: {p.los} days</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selected && (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.875rem 1rem",
                  background: "rgba(0,180,200,0.06)",
                  border: "1px solid rgba(0,180,200,0.2)",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  color: "#f8f6f0",
                }}
              >
                <span style={{ color: "#00b4c8", fontWeight: 600 }}>Selected: </span>
                {selected.procedure_name ?? selected.package_name}
                {selected.rate_primary && (
                  <span style={{ color: "#22c55e", marginLeft: "8px" }}>
                    ₹{selected.rate_primary.toLocaleString()} (Tier 1)
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Preferred date + notes */}
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SectionLabel step="3" label="Appointment Preference (Optional)" />
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <label style={labelStyle}>Preferred Date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your symptoms, urgency, or any other relevant information…"
                rows={3}
                style={{ ...inputStyle, width: "100%", resize: "vertical" as const }}
              />
            </div>
          </div>
        )}

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
          disabled={loading || !selected}
          onClick={() => void handleSubmit()}
          style={{
            padding: "1rem",
            background:
              loading || !selected
                ? "rgba(0,180,200,0.25)"
                : "linear-gradient(135deg,#00b4c8,#00d4eb)",
            color: "#0a0f1e",
            fontWeight: 700,
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: loading || !selected ? "not-allowed" : "pointer",
            boxShadow: loading || !selected ? "none" : "0 0 24px rgba(0,180,200,0.25)",
            transition: "all 0.3s ease",
          }}
        >
          {loading ? "Submitting…" : "Submit Booking Request →"}
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ step, label }: { step: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "rgba(0,180,200,0.15)",
          border: "1px solid rgba(0,180,200,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#00b4c8",
          flexShrink: 0,
        }}
      >
        {step}
      </div>
      <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#8a9ab5", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

const tagStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#00b4c8",
  marginBottom: "0.75rem",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#8a9ab5",
  marginBottom: "6px",
};

const inputStyle: CSSProperties = {
  padding: "0.75rem 1rem",
  fontSize: "0.9375rem",
};

const btnPrimary: CSSProperties = {
  padding: "0.75rem 1.75rem",
  background: "linear-gradient(135deg,#00b4c8,#00d4eb)",
  color: "#0a0f1e",
  fontWeight: 700,
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9375rem",
  boxShadow: "0 0 20px rgba(0,180,200,0.2)",
};

const btnSecondary: CSSProperties = {
  padding: "0.75rem 1.75rem",
  background: "transparent",
  color: "#f8f6f0",
  fontWeight: 500,
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9375rem",
};
