"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ProtectedShell } from "@/components/protected-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { ApiError, fetchMasterRecords, fetchSchemes, MasterRecord, Scheme } from "@/lib/api";
import { clearToken } from "@/lib/auth";

export default function ExplorerPage() {
  const { ready } = useAuthGuard();
  const router = useRouter();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [records, setRecords] = useState<MasterRecord[]>([]);
  const [scheme, setScheme] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;
    const run = async () => {
      try {
        setError("");
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
    if (!ready) return;
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        setRecords(await fetchMasterRecords({ scheme: scheme || undefined, q: query || undefined, limit: 100 }));
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          router.replace("/admin");
          return;
        }
        setError("Failed to load records");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [ready, router, scheme, query]);

  const shown = useMemo(() => records.slice(0, 100), [records]);
  if (!ready) return null;

  return (
    <ProtectedShell title="Master Explorer">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold">Scheme</label>
          <select
            className="w-full rounded-xl border border-slate-300 p-2"
            value={scheme}
            onChange={(e) => setScheme(e.target.value)}
          >
            <option value="">All schemes</option>
            {schemes.map((s) => (
              <option key={s.id} value={s.scheme}>
                {s.scheme}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Search</label>
          <input
            className="w-full rounded-xl border border-slate-300 p-2"
            placeholder="CABG, MRI, fracture..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      {error ? <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
      <div className="mt-4 text-sm text-slate-600">{loading ? "Loading..." : `Showing ${shown.length} records`}</div>
      <div className="mt-3 overflow-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-2">Scheme</th>
              <th className="p-2">Type</th>
              <th className="p-2">Specialty</th>
              <th className="p-2">Package</th>
              <th className="p-2">Procedure</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="p-2">{r.scheme}</td>
                <td className="p-2">{r.record_type}</td>
                <td className="p-2">{r.specialty || "-"}</td>
                <td className="p-2">{`${r.package_code || ""} ${r.package_name || ""}`.trim() || "-"}</td>
                <td className="p-2">{r.procedure_name || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedShell>
  );
}
