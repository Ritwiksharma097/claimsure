"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ProtectedShell } from "@/components/protected-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import {
  ApiError,
  createPatient,
  deletePatientFile,
  fetchPatientFiles,
  fetchPatients,
  Patient,
  PatientFile,
  updatePatient,
  uploadPatientFiles,
} from "@/lib/api";
import { clearToken } from "@/lib/auth";

export default function PatientsPage() {
  const { ready } = useAuthGuard();
  const router = useRouter();
  const [rows, setRows] = useState<Patient[]>([]);
  const [q, setQ] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [scheme, setScheme] = useState("PM-JAY");
  const [aadhaarLast4, setAadhaarLast4] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [agentName, setAgentName] = useState("");
  const [govtIdType, setGovtIdType] = useState("");
  const [govtIdNumber, setGovtIdNumber] = useState("");
  const [janAadhaar, setJanAadhaar] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [editingPatientId, setEditingPatientId] = useState("");
  const [patientFiles, setPatientFiles] = useState<PatientFile[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setFullName("");
    setMobile("");
    setScheme("PM-JAY");
    setAadhaarLast4("");
    setDob("");
    setCity("");
    setAgentName("");
    setGovtIdType("");
    setGovtIdNumber("");
    setJanAadhaar("");
    setEditingPatientId("");
  };

  const load = useCallback(async () => {
    try {
      setError("");
      setRows(await fetchPatients({ q, limit, offset }));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearToken();
        router.replace("/login");
        return;
      }
      setError("Failed to load patients");
    }
  }, [q, offset, router]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(t);
  }, [ready, load]);

  const loadFiles = useCallback(
    async (pid: string) => {
      try {
        setError("");
        setPatientFiles(await fetchPatientFiles(pid));
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          router.replace("/login");
          return;
        }
        setError("Failed to load patient files");
      }
    },
    [router]
  );

  if (!ready) return null;

  return (
    <ProtectedShell title="Patient Registry">
      <div className="grid gap-3 md:grid-cols-4">
        <input
          className="rounded-xl border border-slate-300 p-2"
          placeholder="Search name/mobile/patient id"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={() => void load()}>
          Search
        </button>
        <button
          className="rounded-xl border border-slate-300 px-4 py-2"
          onClick={() => setOffset((v) => Math.max(0, v - limit))}
        >
          Prev
        </button>
        <button
          className="rounded-xl border border-slate-300 px-4 py-2"
          onClick={() => setOffset((v) => v + limit)}
        >
          Next
        </button>
      </div>
      <div className="mt-2 text-xs text-slate-500">Page offset: {offset} (page size {limit})</div>

      <div className="mt-6 rounded-2xl border border-slate-200 p-4">
        <div className="text-sm font-semibold">Create / update patient visit</div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Scheme"
            value={scheme}
            onChange={(e) => setScheme(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Aadhaar last 4"
            value={aadhaarLast4}
            onChange={(e) => setAadhaarLast4(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="DOB (YYYY-MM-DD)"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Agent name"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Govt ID type"
            value={govtIdType}
            onChange={(e) => setGovtIdType(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Govt ID number"
            value={govtIdNumber}
            onChange={(e) => setGovtIdNumber(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Jan Aadhaar"
            value={janAadhaar}
            onChange={(e) => setJanAadhaar(e.target.value)}
          />
        </div>
        <button
          className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={saving}
          onClick={async () => {
            try {
              setSaving(true);
              setError("");
              if (!fullName.trim()) {
                setError("Full name is required.");
                return;
              }
              const cleanMobile = mobile.replace(/\D/g, "");
              if (cleanMobile.length < 10) {
                setError("Mobile should have at least 10 digits.");
                return;
              }
              const saved = editingPatientId
                ? await updatePatient(editingPatientId, {
                    full_name: fullName,
                    mobile,
                    scheme,
                    aadhaar_last4: aadhaarLast4 || undefined,
                    dob: dob || undefined,
                    city: city || undefined,
                    agent_name: agentName || undefined,
                    govt_id_type: govtIdType || undefined,
                    govt_id_number: govtIdNumber || undefined,
                    jan_aadhaar: janAadhaar || undefined,
                  })
                : await createPatient({
                    full_name: fullName,
                    mobile,
                    scheme,
                    aadhaar_last4: aadhaarLast4,
                    dob,
                    city,
                    agent_name: agentName,
                    govt_id_type: govtIdType,
                    govt_id_number: govtIdNumber,
                    jan_aadhaar: janAadhaar,
                  });
              setMessage(
                editingPatientId
                  ? `Updated: ${saved.full_name} (${saved.patient_id})`
                  : `Saved: ${saved.full_name} (${saved.patient_id})`
              );
              setSelectedPatientId(saved.patient_id);
              if (pendingFiles.length) {
                await uploadPatientFiles(saved.patient_id, pendingFiles);
                setPendingFiles([]);
                await loadFiles(saved.patient_id);
              }
              resetForm();
              void load();
            } catch (err) {
              if (err instanceof ApiError && err.status === 401) {
                clearToken();
                router.replace("/login");
                return;
              }
              setError("Failed to save patient");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Saving..." : editingPatientId ? "Update patient" : "Save patient"}
        </button>
        {editingPatientId ? (
          <button
            className="ml-2 mt-3 rounded-xl border border-slate-300 px-4 py-2"
            onClick={() => resetForm()}
          >
            Cancel edit
          </button>
        ) : null}
        <div className="mt-3">
          <input
            type="file"
            multiple
            onChange={(e) => setPendingFiles(Array.from(e.target.files || []))}
            className="text-sm"
          />
          <div className="mt-1 text-xs text-slate-500">
            {pendingFiles.length ? `${pendingFiles.length} file(s) selected for upload on save` : "No files selected"}
          </div>
        </div>
      </div>

      {message ? <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div> : null}
      {error ? <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}

      <div className="mt-4 overflow-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-2">Patient ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Mobile</th>
              <th className="p-2">Scheme</th>
              <th className="p-2">Visits</th>
              <th className="p-2">Last visit</th>
              <th className="p-2">Files</th>
              <th className="p-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="p-2">{r.patient_id}</td>
                <td className="p-2">{r.full_name}</td>
                <td className="p-2">{r.mobile}</td>
                <td className="p-2">{r.scheme}</td>
                <td className="p-2">{r.visit_count}</td>
                <td className="p-2">{r.last_visit_date || "-"}</td>
                <td className="p-2">
                  <button
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    onClick={() => {
                      setSelectedPatientId(r.patient_id);
                      void loadFiles(r.patient_id);
                    }}
                  >
                    Open files
                  </button>
                  <button
                    className="ml-1 rounded-lg border border-blue-300 px-2 py-1 text-xs text-blue-700"
                    onClick={() => router.push(`/preauth?patientId=${encodeURIComponent(r.patient_id)}`)}
                  >
                    New preauth
                  </button>
                  <button
                    className="ml-1 rounded-lg border border-emerald-300 px-2 py-1 text-xs text-emerald-700"
                    onClick={() => router.push(`/claimdesk?patientId=${encodeURIComponent(r.patient_id)}`)}
                  >
                    Claim desk
                  </button>
                </td>
                <td className="p-2">
                  <button
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    onClick={() => {
                      setEditingPatientId(r.patient_id);
                      setFullName(r.full_name || "");
                      setMobile(r.mobile || "");
                      setScheme(r.scheme || "PM-JAY");
                      setAadhaarLast4(r.aadhaar_last4 || "");
                      setDob(r.dob || "");
                      setCity(r.city || "");
                      setAgentName(r.agent_name || "");
                      setGovtIdType(r.govt_id_type || "");
                      setGovtIdNumber(r.govt_id_number || "");
                      setJanAadhaar(r.jan_aadhaar || "");
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPatientId ? (
        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
          <div className="mb-2 text-sm font-semibold">Files for {selectedPatientId}</div>
          <ul className="space-y-2 text-sm">
            {patientFiles.map((f) => (
              <li key={f.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-2">
                <a
                  className="text-blue-700 underline"
                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"}/patients/${selectedPatientId}/files/${f.id}/download`}
                  target="_blank"
                >
                  {f.original_name}
                </a>
                <button
                  className="rounded-lg border border-rose-300 px-2 py-1 text-xs text-rose-700"
                  onClick={async () => {
                    if (!confirm("Delete this file?")) return;
                    await deletePatientFile(selectedPatientId, f.id);
                    await loadFiles(selectedPatientId);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </ProtectedShell>
  );
}
