"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getPatientAuthHeader, getPatientName, getPatientId, hasValidPatientToken } from "@/lib/patient-auth";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

type Booking = {
  id: number;
  procedure_name: string;
  scheme: string;
  preferred_date: string | null;
  status: string;
  sso_uid: string | null;
  ack_ref: string | null;
};

const STATUS_COLOR: Record<string, string> = {
  Pending: "#c9a84c",
  Submitted: "#00b4c8",
  Approved: "#22c55e",
  Rejected: "#f87171",
};

export default function PatientPortalDashboard() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasValidPatientToken()) { router.replace("/client/portal/login"); return; }
    setName(getPatientName());
    setPatientId(getPatientId());

    void (async () => {
      try {
        const res = await fetch(`${API}/patient/bookings`, {
          headers: getPatientAuthHeader(),
        });
        if (res.ok) {
          const data = (await res.json()) as Booking[];
          setRecentBookings(data.slice(0, 5));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const tiles = [
    {
      href: "/client/portal/book-test",
      icon: "📋",
      title: "Book a Test / Treatment",
      desc: "Select your scheme and procedure from the master list and submit a booking request.",
      accent: "#00b4c8",
    },
    {
      href: "/client/portal/my-claims",
      icon: "◈",
      title: "My Claims & Bookings",
      desc: "Track the status of your submitted claims and view SSO acknowledgement numbers.",
      accent: "#c9a84c",
    },
    {
      href: "/client/portal/profile",
      icon: "♦",
      title: "Profile & Documents",
      desc: "Update your details and upload Aadhaar, Jan Aadhaar, or other identity documents.",
      accent: "#00b4c8",
    },
  ];

  return (
    <div>
      {/* Welcome banner */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1.75rem 2rem",
          background: "linear-gradient(135deg, rgba(0,180,200,0.07) 0%, rgba(201,168,76,0.04) 100%)",
          border: "1px solid rgba(0,180,200,0.12)",
          borderRadius: "12px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,180,200,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#00b4c8", marginBottom: "0.375rem" }}>
          ◈ Patient Portal
        </div>
        <h2
          style={{
            fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
            fontSize: "1.75rem",
            fontWeight: 600,
            color: "#f8f6f0",
            marginBottom: "0.25rem",
          }}
        >
          Welcome, {name ?? "Patient"}
        </h2>
        {patientId && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#4a5a72" }}>Patient ID:</span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.8125rem",
                color: "#00b4c8",
                letterSpacing: "0.06em",
                fontWeight: 600,
              }}
            >
              {patientId}
            </span>
          </div>
        )}
        <p style={{ color: "#6b7a94", fontSize: "0.875rem", margin: 0 }}>
          Use this portal to book treatments, track your claims, and upload documents.
        </p>
      </div>

      {/* Action tiles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} style={{ textDecoration: "none" }}>
            <div
              style={{
                padding: "1.625rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                transition: "all 0.25s ease",
                cursor: "pointer",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(255,255,255,0.055)";
                el.style.borderColor = `${t.accent}33`;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = `0 8px 32px ${t.accent}12`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(255,255,255,0.03)";
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: `${t.accent}18`,
                  border: `1px solid ${t.accent}40`,
                  borderRadius: "9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  marginBottom: "1rem",
                }}
              >
                {t.icon}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#f8f6f0", marginBottom: "0.5rem" }}>
                {t.title}
              </h3>
              <p style={{ color: "#4a5a72", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>
                {t.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#f8f6f0", margin: 0 }}>
            Recent Bookings
          </h3>
          <Link
            href="/client/portal/my-claims"
            style={{ fontSize: "0.8125rem", color: "#00b4c8", textDecoration: "none" }}
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#4a5a72", fontSize: "0.875rem" }}>
            Loading…
          </div>
        ) : recentBookings.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</div>
            <p style={{ color: "#4a5a72", fontSize: "0.875rem", margin: 0 }}>
              No bookings yet.{" "}
              <Link href="/client/portal/book-test" style={{ color: "#00b4c8", textDecoration: "none" }}>
                Book a test now →
              </Link>
            </p>
          </div>
        ) : (
          <div>
            {recentBookings.map((b) => (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "#f8f6f0" }}>
                    {b.procedure_name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#4a5a72", marginTop: "2px" }}>
                    {b.scheme}
                    {b.preferred_date ? ` · ${b.preferred_date}` : ""}
                    {b.ack_ref ? ` · Ref: ${b.ack_ref}` : ""}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "0.25rem 0.75rem",
                    borderRadius: "999px",
                    background: `${STATUS_COLOR[b.status] ?? "#4a5a72"}18`,
                    color: STATUS_COLOR[b.status] ?? "#4a5a72",
                    border: `1px solid ${STATUS_COLOR[b.status] ?? "#4a5a72"}40`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
