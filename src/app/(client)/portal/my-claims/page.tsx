"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getPatientAuthHeader, hasValidPatientToken } from "@/lib/patient-auth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

type Booking = {
  id: number;
  procedure_name: string;
  scheme: string;
  specialty: string | null;
  preferred_date: string | null;
  status: string;
  sso_uid: string | null;
  ack_ref: string | null;
  ack_date: string | null;
  ack_note: string | null;
  created_at: string;
};

type Claim = {
  id: number;
  patient_id: string;
  diagnosis: string | null;
  test_name: string | null;
  hospital_name: string | null;
  preauth_status: string;
  preauth_amount: number | null;
  preauth_ref_no: string | null;
  insurer_name: string | null;
};

const STATUS_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  Pending:   { bg: "rgba(201,168,76,0.1)",  text: "#c9a84c", border: "rgba(201,168,76,0.3)"  },
  Submitted: { bg: "rgba(0,180,200,0.1)",   text: "#00b4c8", border: "rgba(0,180,200,0.3)"   },
  Approved:  { bg: "rgba(34,197,94,0.1)",   text: "#22c55e", border: "rgba(34,197,94,0.3)"   },
  Rejected:  { bg: "rgba(248,113,113,0.1)", text: "#f87171", border: "rgba(248,113,113,0.3)" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLOR[status] ?? STATUS_COLOR.Pending;
  return (
    <span
      style={{
        fontSize: "0.75rem",
        fontWeight: 600,
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

export default function MyClaimsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [tab, setTab] = useState<"bookings" | "preauth">("bookings");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasValidPatientToken()) { router.replace("/portal/login"); return; }
    const headers = getPatientAuthHeader();
    void Promise.all([
      fetch(`${API}/patient/bookings`, { headers }).then((r) => r.ok ? r.json() : []),
      fetch(`${API}/patient/claims`, { headers }).then((r) => r.ok ? r.json() : []),
    ]).then(([b, c]) => {
      setBookings(b as Booking[]);
      setClaims(c as Claim[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  const tabStyle = (active: boolean) => ({
    padding: "0.5rem 1.25rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: active ? 600 : 400,
    background: active ? "rgba(0,180,200,0.12)" : "transparent",
    color: active ? "#f8f6f0" : "#4a5a72",
    transition: "all 0.2s",
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#00b4c8",
            marginBottom: "0.75rem",
          }}
        >
          ◈ My Claims
        </div>
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
          My Claims & Bookings
        </h1>
        <p style={{ color: "#8a9ab5", fontSize: "0.9rem" }}>
          Track the status of your booked procedures and pre-authorisation cases. SSO acknowledgement
          numbers appear here once staff submits your case.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          marginBottom: "1.5rem",
          background: "rgba(255,255,255,0.03)",
          padding: "0.25rem",
          borderRadius: "8px",
          width: "fit-content",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button style={tabStyle(tab === "bookings")} onClick={() => setTab("bookings")}>
          My Bookings ({bookings.length})
        </button>
        <button style={tabStyle(tab === "preauth")} onClick={() => setTab("preauth")}>
          Preauth Cases ({claims.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#4a5a72", fontSize: "0.875rem" }}>
          Loading…
        </div>
      ) : tab === "bookings" ? (
        bookings.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📋</div>
            <p style={{ color: "#4a5a72", fontSize: "0.9375rem", margin: "0 0 1rem" }}>
              You have not booked any procedures yet.
            </p>
            <Link
              href="/portal/book-test"
              style={{
                padding: "0.75rem 1.75rem",
                background: "linear-gradient(135deg,#00b4c8,#00d4eb)",
                color: "#0a0f1e",
                fontWeight: 700,
                border: "none",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "0.9375rem",
              }}
            >
              Book a Test Now →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {bookings.map((b) => (
              <div
                key={b.id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "1.25rem 1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    flexWrap: "wrap",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "1rem", fontWeight: 600, color: "#f8f6f0" }}>
                      {b.procedure_name}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "#4a5a72", marginTop: "2px" }}>
                      {b.scheme}
                      {b.specialty ? ` · ${b.specialty}` : ""}
                      {b.preferred_date ? ` · Preferred: ${b.preferred_date}` : ""}
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                {/* SSO acknowledgement section */}
                {(b.sso_uid || b.ack_ref) && (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.875rem 1rem",
                      background: "rgba(0,180,200,0.05)",
                      border: "1px solid rgba(0,180,200,0.15)",
                      borderRadius: "8px",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4a5a72", marginBottom: "2px" }}>
                        SSO UID
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.875rem", fontWeight: 600, color: "#00b4c8" }}>
                        {b.sso_uid ?? "—"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4a5a72", marginBottom: "2px" }}>
                        Acknowledgement Ref
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.875rem", fontWeight: 600, color: "#c9a84c" }}>
                        {b.ack_ref ?? "—"}
                      </div>
                    </div>
                    {b.ack_date && (
                      <div>
                        <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4a5a72", marginBottom: "2px" }}>
                          Ack Date
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#f8f6f0" }}>{b.ack_date}</div>
                      </div>
                    )}
                    {b.ack_note && (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4a5a72", marginBottom: "2px" }}>
                          Note
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#8a9ab5" }}>{b.ack_note}</div>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ fontSize: "0.75rem", color: "#2d3a4a", marginTop: "0.75rem" }}>
                  Submitted: {new Date(b.created_at).toLocaleDateString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        claims.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📁</div>
            <p style={{ color: "#4a5a72", fontSize: "0.9375rem", margin: 0 }}>
              No preauth cases found. Your cases will appear here once our staff processes your booking.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {claims.map((c) => (
              <div
                key={c.id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: "#f8f6f0" }}>
                    {c.diagnosis ?? c.test_name ?? "Preauth Case #" + c.id}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#4a5a72", marginTop: "2px" }}>
                    {c.hospital_name ?? ""}
                    {c.insurer_name ? ` · ${c.insurer_name}` : ""}
                    {c.preauth_ref_no ? ` · Ref: ${c.preauth_ref_no}` : ""}
                    {c.preauth_amount
                      ? ` · ₹${Number(c.preauth_amount).toLocaleString()}`
                      : ""}
                  </div>
                </div>
                <StatusBadge status={c.preauth_status} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
