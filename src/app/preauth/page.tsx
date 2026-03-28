"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ProtectedShell } from "@/components/protected-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { ApiError, createPreauth, fetchPreauths, Preauth, updatePreauth } from "@/lib/api";
import { clearToken } from "@/lib/auth";

export default function PreauthPage() {
  const { ready } = useAuthGuard();
  const router = useRouter();
  const initialPatientId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("patientId") || "";
  }, []);
  const [rows, setRows] = useState<Preauth[]>([]);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [patientId, setPatientId] = useState(initialPatientId);
  const [editingPreauthId, setEditingPreauthId] = useState<number | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [testName, setTestName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [refNo, setRefNo] = useState("");
  const [preauthAmount, setPreauthAmount] = useState("");
  const [preauthDate, setPreauthDate] = useState("");
  const [insurerName, setInsurerName] = useState("");
  const [tpaCompany, setTpaCompany] = useState("");
  const [policyType, setPolicyType] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setEditingPreauthId(null);
    setPatientId("");
    setDiagnosis("");
    setTestName("");
    setHospitalName("");
    setDoctorName("");
    setStatus("Not Started");
    setRefNo("");
    setPreauthAmount("");
    setPreauthDate("");
    setInsurerName("");
    setTpaCompany("");
    setPolicyType("");
  };

  const load = useCallback(async () => {
    try {
      setError("");
      setRows(await fetchPreauths({ limit, offset }));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearToken();
        router.replace("/admin");
        return;
      }
      setError("Failed to load preauths");
    }
  }, [offset, router]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(t);
  }, [ready, load]);

  if (!ready) return null;

  return (
    <ProtectedShell title="Preauth Cases">
      <div className="rounded-2xl border border-slate-200 p-4">
        <div className="text-sm font-semibold">Create preauth case</div>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Test name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Hospital name"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Doctor name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Preauth Ref No"
            value={refNo}
            onChange={(e) => setRefNo(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Preauth amount"
            value={preauthAmount}
            onChange={(e) => setPreauthAmount(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Preauth date (YYYY-MM-DD)"
            value={preauthDate}
            onChange={(e) => setPreauthDate(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Insurer name"
            value={insurerName}
            onChange={(e) => setInsurerName(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="TPA company"
            value={tpaCompany}
            onChange={(e) => setTpaCompany(e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 p-2"
            placeholder="Policy type"
            value={policyType}
            onChange={(e) => setPolicyType(e.target.value)}
          />
        </div>
        <button
          className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={saving}
          onClick={async () => {
            try {
              setSaving(true);
              setError("");
              if (!patientId.trim() && !editingPreauthId) {
                setError("Patient ID is required.");
                return;
              }
              const common = {
                diagnosis: diagnosis || undefined,
                test_name: testName || undefined,
                hospital_name: hospitalName || undefined,
                doctor_name: doctorName || undefined,
                preauth_status: status || undefined,
                preauth_ref_no: refNo || undefined,
                preauth_amount: preauthAmount ? Number(preauthAmount) : undefined,
                preauth_date: preauthDate || undefined,
                insurer_name: insurerName || undefined,
                tpa_company: tpaCompany || undefined,
                policy_type: policyType || undefined,
              };
              const saved = editingPreauthId
                ? await updatePreauth(editingPreauthId, common)
                : await createPreauth({
                    patient_id: patientId,
                    ...common,
                  });
              setMessage(
                editingPreauthId ? `Updated preauth case #${saved.id}` : `Created preauth case #${saved.id}`
              );
              resetForm();
              void load();
            } catch (err) {
              if (err instanceof ApiError && err.status === 401) {
                clearToken();
                router.replace("/admin");
                return;
              }
              setError("Failed to create preauth case. Ensure patient ID exists.");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Saving..." : editingPreauthId ? "Update preauth" : "Save preauth"}
        </button>
        {editingPreauthId ? (
          <button
            className="ml-2 mt-3 rounded-xl border border-slate-300 px-4 py-2"
            onClick={() => resetForm()}
          >
            Cancel edit
          </button>
        ) : null}
      </div>
      <div className="mt-3 flex gap-2">
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
      <div className="mt-1 text-xs text-slate-500">Page offset: {offset} (page size {limit})</div>

      {message ? <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div> : null}
      {error ? <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}

      <div className="mt-4 overflow-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Patient ID</th>
              <th className="p-2">Diagnosis</th>
              <th className="p-2">Hospital</th>
              <th className="p-2">Status</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Ref</th>
              <th className="p-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.patient_id}</td>
                <td className="p-2">{r.diagnosis || "-"}</td>
                <td className="p-2">{r.hospital_name || "-"}</td>
                <td className="p-2">{r.preauth_status}</td>
                <td className="p-2">{String(r.preauth_amount ?? "-")}</td>
                <td className="p-2">{r.preauth_ref_no || "-"}</td>
                <td className="p-2">
                  <button
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    onClick={() => {
                      setEditingPreauthId(r.id);
                      setPatientId(r.patient_id || "");
                      setDiagnosis(r.diagnosis || "");
                      setTestName(r.test_name || "");
                      setHospitalName(r.hospital_name || "");
                      setDoctorName(r.doctor_name || "");
                      setStatus(r.preauth_status || "Not Started");
                      setRefNo(r.preauth_ref_no || "");
                      setPreauthAmount(
                        r.preauth_amount !== null && r.preauth_amount !== undefined
                          ? String(r.preauth_amount)
                          : ""
                      );
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
    </ProtectedShell>
  );
}
