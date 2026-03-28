"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import { getPatientAuthHeader, hasValidPatientToken } from "@/lib/patient-auth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

type Profile = {
  patient_id: string;
  full_name: string;
  mobile: string;
  scheme: string;
  gender: string | null;
  dob: string | null;
  city: string | null;
  aadhaar_last4: string | null;
  jan_aadhaar: string | null;
  visit_count: number;
  last_visit_date: string | null;
  notes: string | null;
};

type UploadedFile = {
  id: number;
  original_name: string;
  content_type: string | null;
  size_bytes: number;
  category: string | null;
  created_at: string;
};

const DOC_CATEGORIES = [
  "Aadhaar Card",
  "Jan Aadhaar Card",
  "Insurance Card",
  "Scheme Eligibility Proof",
  "Admission Note",
  "Diagnosis Report",
  "Doctor Prescription",
  "Discharge Summary",
  "OT Notes",
  "Other",
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("Aadhaar Card");
  const [uploading, setUploading] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable fields
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [janAadhaar, setJanAadhaar] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!hasValidPatientToken()) { router.replace("/portal/login"); return; }
    const headers = getPatientAuthHeader();
    void Promise.all([
      fetch(`${API}/patient/me`, { headers }).then((r) => r.ok ? r.json() : null),
      fetch(`${API}/patient/files`, { headers }).then((r) => r.ok ? r.json() : []),
    ]).then(([p, f]) => {
      if (p) {
        setProfile(p as Profile);
        setCity((p as Profile).city ?? "");
        setGender((p as Profile).gender ?? "");
        setDob((p as Profile).dob ?? "");
        setAadhaar((p as Profile).aadhaar_last4 ?? "");
        setJanAadhaar((p as Profile).jan_aadhaar ?? "");
        setNotes((p as Profile).notes ?? "");
      }
      setFiles(f as UploadedFile[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`${API}/patient/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getPatientAuthHeader() },
        body: JSON.stringify({
          city: city || null,
          gender: gender || null,
          dob: dob || null,
          aadhaar_last4: aadhaar || null,
          jan_aadhaar: janAadhaar || null,
          notes: notes || null,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = (await res.json()) as Profile;
      setProfile(updated);
      setSaveMsg("Profile updated successfully.");
    } catch {
      setSaveMsg("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = e.target.files;
    if (!uploadFiles || uploadFiles.length === 0) return;
    setUploading(true);
    setUploadMsg("");
    try {
      const formData = new FormData();
      Array.from(uploadFiles).forEach((f) => formData.append("files", f));
      const res = await fetch(`${API}/patient/files?category=${encodeURIComponent(uploadCategory)}`, {
        method: "POST",
        headers: getPatientAuthHeader(),
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const newFiles = (await res.json()) as UploadedFile[];
      setFiles((prev) => [...newFiles, ...prev]);
      setUploadMsg(`${newFiles.length} file(s) uploaded successfully.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setUploadMsg("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#4a5a72", fontSize: "0.875rem" }}>
        Loading profile…
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={tagStyle}>◈ My Profile</div>
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
          Profile & Documents
        </h1>
        <p style={{ color: "#8a9ab5", fontSize: "0.9rem" }}>
          Update your details and upload identity documents for your insurance claim.
        </p>
      </div>

      {/* Read-only info card */}
      {profile && (
        <div
          style={{
            background: "rgba(0,180,200,0.05)",
            border: "1px solid rgba(0,180,200,0.15)",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          <InfoField label="Patient ID" value={profile.patient_id} mono />
          <InfoField label="Full Name" value={profile.full_name} />
          <InfoField label="Mobile" value={profile.mobile} />
          <InfoField label="Scheme" value={profile.scheme} />
          <InfoField label="Visits" value={String(profile.visit_count)} />
          {profile.last_visit_date && (
            <InfoField label="Last Visit" value={profile.last_visit_date} />
          )}
        </div>
      )}

      {/* Editable profile */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "2rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#f8f6f0", marginBottom: "1.5rem" }}>
          Update Details
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>City / District</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Jaipur" style={{ ...inputStyle, width: "100%" }} />
          </div>
          <div>
            <label style={labelStyle}>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ ...inputStyle, width: "100%" }}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date of Birth</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={{ ...inputStyle, width: "100%" }} />
          </div>
          <div>
            <label style={labelStyle}>Aadhaar Last 4 Digits</label>
            <input type="text" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} placeholder="XXXX" maxLength={4} style={{ ...inputStyle, width: "100%" }} />
          </div>
          <div>
            <label style={labelStyle}>Jan Aadhaar / Family ID</label>
            <input type="text" value={janAadhaar} onChange={(e) => setJanAadhaar(e.target.value)} placeholder="Jan Aadhaar number" style={{ ...inputStyle, width: "100%" }} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Notes / Remarks</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Any additional information…" style={{ ...inputStyle, width: "100%", resize: "vertical" as const }} />
          </div>
        </div>

        {saveMsg && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              background: saveMsg.includes("success") ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${saveMsg.includes("success") ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              borderRadius: "8px",
              fontSize: "0.875rem",
              color: saveMsg.includes("success") ? "#22c55e" : "#f87171",
            }}
          >
            {saveMsg}
          </div>
        )}

        <button
          disabled={saving}
          onClick={() => void handleSave()}
          style={{
            marginTop: "1.25rem",
            padding: "0.75rem 2rem",
            background: saving ? "rgba(0,180,200,0.4)" : "linear-gradient(135deg,#00b4c8,#00d4eb)",
            color: "#0a0f1e",
            fontWeight: 700,
            border: "none",
            borderRadius: "8px",
            fontSize: "0.9375rem",
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: saving ? "none" : "0 0 20px rgba(0,180,200,0.2)",
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Document upload */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "2rem",
        }}
      >
        <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#f8f6f0", marginBottom: "1.25rem" }}>
          Upload Documents
        </h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "1rem" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={labelStyle}>Document Category</label>
            <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} style={{ ...inputStyle, width: "100%" }}>
              {DOC_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => void handleUpload(e)}
              style={{ display: "none" }}
              id="doc-upload"
            />
            <label
              htmlFor="doc-upload"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.75rem 1.5rem",
                background: uploading ? "rgba(0,180,200,0.3)" : "rgba(0,180,200,0.12)",
                border: "1px solid rgba(0,180,200,0.3)",
                color: "#00b4c8",
                borderRadius: "8px",
                cursor: uploading ? "not-allowed" : "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              {uploading ? "Uploading…" : "📎 Choose Files"}
            </label>
          </div>
        </div>

        {uploadMsg && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              background: uploadMsg.includes("success") ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${uploadMsg.includes("success") ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              borderRadius: "8px",
              fontSize: "0.875rem",
              color: uploadMsg.includes("success") ? "#22c55e" : "#f87171",
            }}
          >
            {uploadMsg}
          </div>
        )}

        <p style={{ fontSize: "0.75rem", color: "#2d3a4a", marginBottom: "1.25rem" }}>
          Accepted: PDF, JPG, PNG, DOC, DOCX · Max file size: 10 MB each
        </p>

        {/* Uploaded files list */}
        {files.length > 0 && (
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4a5a72", marginBottom: "0.75rem" }}>
              Uploaded Documents ({files.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {files.map((f) => (
                <div
                  key={f.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.875rem", color: "#f8f6f0" }}>{f.original_name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#4a5a72", marginTop: "2px" }}>
                      {f.category} · {(f.size_bytes / 1024).toFixed(0)} KB
                    </div>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#2d3a4a" }}>
                    {new Date(f.created_at).toLocaleDateString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4a5a72", marginBottom: "2px" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#f8f6f0",
          fontFamily: mono ? "monospace" : "inherit",
          letterSpacing: mono ? "0.06em" : "inherit",
        }}
      >
        {value}
      </div>
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
