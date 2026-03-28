"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

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

type GroupedProcedures = Record<string, Procedure[]>;

function groupBySpecialty(items: Procedure[]): GroupedProcedures {
  return items.reduce<GroupedProcedures>((acc, p) => {
    const key = p.specialty ?? "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});
}

export default function FindMyClaimsPage() {
  const router = useRouter();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [selectedScheme, setSelectedScheme] = useState("");
  const [condition, setCondition] = useState("");
  const [selected, setSelected] = useState<Procedure | null>(null);
  const [expandedSpecialties, setExpandedSpecialties] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasValidPatientToken()) { router.replace("/portal/login"); return; }
    void fetch(`${API}/public/schemes`)
      .then(async (r) => { if (r.ok) setSchemes((await r.json()) as Scheme[]); });
  }, [router]);

  // Fetch procedures whenever scheme or condition changes
  useEffect(() => {
    if (!selectedScheme) { setProcedures([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFetching(true);
      const params = new URLSearchParams({ scheme: selectedScheme, limit: "200" });
      if (condition.trim()) params.set("q", condition.trim());
      void fetch(`${API}/patient/procedures?${params.toString()}`, {
        headers: getPatientAuthHeader(),
      }).then(async (res) => {
        if (res.ok) {
          const data = (await res.json()) as Procedure[];
          setProcedures(data);
          // Auto-expand first specialty
          if (data.length > 0) {
            const firstSpecialty = data[0].specialty ?? "General";
            setExpandedSpecialties(new Set([firstSpecialty]));
          }
        }
        setFetching(false);
      }).catch(() => setFetching(false));
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [selectedScheme, condition]);

  const toggleSpecialty = (specialty: string) => {
    setExpandedSpecialties((prev) => {
      const next = new Set(prev);
      if (next.has(specialty)) next.delete(specialty);
      else next.add(specialty);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!selectedScheme) { setError("Please select a scheme."); return; }
    if (!selected) { setError("Please select a claim package."); return; }
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
          preferred_date: null,
          notes: notes.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { detail?: string };
        throw new Error(d.detail ?? "Submission failed");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const grouped = groupBySpecialty(procedures);
  const specialties = Object.keys(grouped).sort();

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
          Claim Request Submitted
        </h2>
        <p style={{ color: "#8a9ab5", fontSize: "0.9375rem", marginBottom: "1.5rem" }}>
          Your request has been received. Our team will review the selected package and process it
          through the SSO portal. You can track the status in{" "}
          <strong style={{ color: "#f8f6f0" }}>My Claims</strong>.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => { setSuccess(false); setSelected(null); setCondition(""); setNotes(""); }}
            style={btnSecondary}
          >
            Find Another Claim
          </button>
          <button
            onClick={() => router.push("/portal/my-claims")}
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
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={tagStyle}>◈ Find My Claims</div>
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
          Find Available Claim Packages
        </h1>
        <p style={{ color: "#8a9ab5", fontSize: "0.9rem", maxWidth: "600px", lineHeight: 1.7 }}>
          Tell us your insurance scheme and what treatment you are receiving. We will show you all
          the matching claim packages available for you — select the one that fits your condition.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Step 1: Scheme */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px",
            padding: "1.5rem",
          }}
        >
          <StepLabel step="1" label="Select Your Insurance Scheme" />
          <select
            value={selectedScheme}
            onChange={(e) => { setSelectedScheme(e.target.value); setSelected(null); setCondition(""); }}
            style={{ ...inputStyle, width: "100%", maxWidth: "480px" }}
          >
            <option value="">Choose your scheme…</option>
            {schemes.map((s) => (
              <option key={s.id} value={s.scheme}>{s.scheme}</option>
            ))}
          </select>
        </div>

        {/* Step 2 + 3: Condition filter + Browse packages */}
        {selectedScheme && (
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <StepLabel step="2" label="What treatment are you receiving?" />
            <div>
              <input
                type="text"
                value={condition}
                onChange={(e) => { setCondition(e.target.value); setSelected(null); }}
                placeholder="e.g. eye surgery, knee replacement, kidney stone, diabetes…"
                style={{ ...inputStyle, width: "100%" }}
              />
              <p style={{ marginTop: "6px", fontSize: "0.775rem", color: "#2d3a4a" }}>
                Type to filter · Leave blank to see all available packages
              </p>
            </div>

            {/* Package list */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
                <StepLabel step="3" label="Select Your Claim Package" />
                {procedures.length > 0 && (
                  <span style={{ fontSize: "0.75rem", color: "#4a5a72" }}>
                    {procedures.length} package{procedures.length !== 1 ? "s" : ""} found
                  </span>
                )}
              </div>

              {fetching ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#4a5a72", fontSize: "0.875rem" }}>
                  Loading packages…
                </div>
              ) : procedures.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#4a5a72",
                    fontSize: "0.875rem",
                    border: "1px dashed rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                  }}
                >
                  {condition ? `No packages found for "${condition}". Try a different term.` : "No packages available for this scheme."}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {specialties.map((specialty) => {
                    const isOpen = expandedSpecialties.has(specialty);
                    const items = grouped[specialty];
                    return (
                      <div
                        key={specialty}
                        style={{
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        {/* Specialty header */}
                        <button
                          onClick={() => toggleSpecialty(specialty)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.875rem 1rem",
                            background: isOpen ? "rgba(0,180,200,0.05)" : "rgba(255,255,255,0.02)",
                            border: "none",
                            cursor: "pointer",
                            color: isOpen ? "#00b4c8" : "#c8c0b0",
                            transition: "all 0.2s",
                            textAlign: "left",
                          }}
                        >
                          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                            {specialty}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.775rem", color: "#4a5a72" }}>
                            {items.length} package{items.length !== 1 ? "s" : ""}
                            <span style={{ fontSize: "0.875rem", color: isOpen ? "#00b4c8" : "#4a5a72" }}>
                              {isOpen ? "▲" : "▼"}
                            </span>
                          </span>
                        </button>

                        {/* Package rows */}
                        {isOpen && (
                          <div>
                            {items.map((p, i) => {
                              const label = p.procedure_name ?? p.package_name ?? "Unknown";
                              const isSelected =
                                selected?.package_code === p.package_code &&
                                selected?.procedure_name === p.procedure_name &&
                                selected?.package_name === p.package_name;
                              return (
                                <div
                                  key={i}
                                  onClick={() => setSelected(p)}
                                  style={{
                                    padding: "0.875rem 1rem 0.875rem 1.25rem",
                                    cursor: "pointer",
                                    borderTop: "1px solid rgba(255,255,255,0.04)",
                                    background: isSelected
                                      ? "rgba(0,180,200,0.08)"
                                      : "transparent",
                                    borderLeft: isSelected
                                      ? "3px solid #00b4c8"
                                      : "3px solid transparent",
                                    transition: "background 0.15s",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    gap: "1rem",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected)
                                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected)
                                      (e.currentTarget as HTMLElement).style.background = "transparent";
                                  }}
                                >
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "0.9rem", fontWeight: isSelected ? 600 : 400, color: isSelected ? "#f8f6f0" : "#c8c0b0" }}>
                                      {label}
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "#4a5a72", marginTop: "3px", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                                      {p.package_code && <span>Code: {p.package_code}</span>}
                                      {p.los && <span>Stay: {p.los} days</span>}
                                    </div>
                                  </div>
                                  {p.rate_primary && (
                                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#22c55e", whiteSpace: "nowrap", flexShrink: 0 }}>
                                      ₹{p.rate_primary.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Confirm + notes */}
        {selected && (
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(0,180,200,0.2)",
              borderRadius: "14px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <StepLabel step="4" label="Confirm and Submit" />

            {/* Selected package summary */}
            <div
              style={{
                background: "rgba(0,180,200,0.06)",
                border: "1px solid rgba(0,180,200,0.2)",
                borderRadius: "10px",
                padding: "1rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#00b4c8", marginBottom: "4px" }}>
                  Selected Package
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 600, color: "#f8f6f0" }}>
                  {selected.procedure_name ?? selected.package_name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#4a5a72", marginTop: "2px" }}>
                  {selected.specialty && <span>{selected.specialty} · </span>}
                  {selected.package_code && <span>Code: {selected.package_code}</span>}
                </div>
              </div>
              {selected.rate_primary && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.7rem", color: "#4a5a72", textTransform: "uppercase", letterSpacing: "0.06em" }}>Claim Rate</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#22c55e" }}>
                    ₹{selected.rate_primary.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label style={labelStyle}>Additional Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional information — symptoms, doctor's advice, ward details, etc."
                rows={3}
                style={{ ...inputStyle, width: "100%", resize: "vertical" as const }}
              />
            </div>

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

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setSelected(null)}
                style={{ ...btnSecondary, flex: "0 0 auto" }}
              >
                ← Change Package
              </button>
              <button
                disabled={loading}
                onClick={() => void handleSubmit()}
                style={{
                  ...btnPrimary,
                  flex: 1,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Submitting…" : "Submit Claim Request →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepLabel({ step, label }: { step: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.875rem" }}>
      <div
        style={{
          width: "26px",
          height: "26px",
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
      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#8a9ab5", letterSpacing: "0.06em", textTransform: "uppercase" }}>
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
  padding: "0.875rem 1.75rem",
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
  padding: "0.875rem 1.75rem",
  background: "transparent",
  color: "#f8f6f0",
  fontWeight: 500,
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9375rem",
};
