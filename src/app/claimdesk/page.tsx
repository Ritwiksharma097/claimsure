"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ProtectedShell } from "@/components/protected-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { ApiError, ChecklistResult, fetchClaimChecklist, fetchClaimDeskCase, fetchSchemes, Scheme } from "@/lib/api";
import { clearToken } from "@/lib/auth";

export default function ClaimDeskPage() {
  const { ready } = useAuthGuard();
  const router = useRouter();
  const patientId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("patientId") || "";
  }, []);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [scheme, setScheme] = useState("");
  const [search, setSearch] = useState("");
  const [caseId, setCaseId] = useState<number | null>(null);
  const [result, setResult] = useState<ChecklistResult | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;
    const run = async () => {
      try {
        setSchemes(await fetchSchemes());
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          router.replace("/admin");
          return;
        }
        setError("Failed to load schemes");
      }
    };
    void run();
  }, [ready, router]);

  useEffect(() => {
    if (!scheme || !patientId) {
      setCheckedDocs([]);
      return;
    }
    const run = async () => {
      try {
        const c = await fetchClaimDeskCase({ patientId, scheme, search });
        if (!c) {
          setCheckedDocs([]);
          setCaseId(null);
          return;
        }
        setCheckedDocs(c.checked_documents || []);
        setCaseId(c.id);
      } catch {
        setCheckedDocs([]);
        setCaseId(null);
      }
    };
    void run();
  }, [scheme, search, patientId]);

  useEffect(() => {
    if (!ready || !scheme) {
      setResult(null);
      return;
    }
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const resp = await fetchClaimChecklist({
          scheme,
          search: search || undefined,
          patient_id: patientId || undefined,
          case_id: caseId || undefined,
          checked_documents: checkedDocs,
        });
        if (resp.case_id) setCaseId(resp.case_id);
        setResult(resp);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          router.replace("/admin");
          return;
        }
        setError("Failed to compute checklist");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [ready, router, scheme, search, checkedDocs, patientId, caseId]);

  if (!ready) return null;

  return (
    <ProtectedShell title="Claim Desk">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold">Scheme</label>
          <select
            className="w-full rounded-xl border border-slate-300 p-2"
            value={scheme}
            onChange={(e) => setScheme(e.target.value)}
          >
            <option value="">Select scheme</option>
            {schemes.map((s) => (
              <option key={s.id} value={s.scheme}>
                {s.scheme}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Find package/disease/test</label>
          <input
            className="w-full rounded-xl border border-slate-300 p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="CABG, stroke, MRI..."
          />
        </div>
      </div>
      {patientId ? (
        <div className="mt-2 text-xs text-slate-500">
          Linked patient: <span className="font-semibold">{patientId}</span>
        </div>
      ) : (
        <div className="mt-2 text-xs text-amber-700">
          Not linked to a patient yet. Open Claim Desk from Patient Registry for server-side persistence.
        </div>
      )}
      {error ? <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
      <div className="mt-4 text-sm text-slate-600">{loading ? "Computing..." : "Checklist ready"}</div>

      {result ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Readiness score</div>
            <div className="text-4xl font-bold">{result.readiness_score}%</div>
            <div className="mt-1 text-sm text-slate-600">
              Mandatory: {result.mandatory_checked}/{result.mandatory_total}
            </div>
            <div className="mt-3 text-sm">
              <span className="font-semibold">Best match:</span>{" "}
              {result.best_match
                ? `${result.best_match.package_code || ""} ${result.best_match.package_name || ""}`.trim() ||
                  result.best_match.procedure_name ||
                  "-"
                : "No match"}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-2 text-sm font-semibold">Document checklist</div>
            <div className="max-h-72 space-y-2 overflow-auto text-sm text-slate-700">
              {result.checklist.map((item, idx) => (
                <label key={`${item.document_proof}-${idx}`} className="flex items-start gap-2 rounded-lg border border-slate-100 p-2">
                  <input
                    type="checkbox"
                    checked={checkedDocs.includes(item.document_proof)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? Array.from(new Set([...checkedDocs, item.document_proof]))
                        : checkedDocs.filter((d) => d !== item.document_proof);
                      setCheckedDocs(next);
                    }}
                    className="mt-1"
                  />
                  <span>
                    {item.document_proof} {item.status ? `(${item.status})` : ""}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          Select a scheme to calculate claim checklist.
        </div>
      )}
    </ProtectedShell>
  );
}
