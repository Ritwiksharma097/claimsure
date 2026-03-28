"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ProtectedShell } from "@/components/protected-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { ApiError, fetchMasterRecords, fetchSchemes, MasterRecord, Scheme } from "@/lib/api";
import { clearToken } from "@/lib/auth";

const PAGE_SIZE = 100;

function buildPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export default function ExplorerPage() {
  const { ready } = useAuthGuard();
  const router = useRouter();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [records, setRecords] = useState<MasterRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [scheme, setScheme] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce search input by 400 ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [scheme, debouncedQuery]);

  // Load schemes once
  useEffect(() => {
    if (!ready) return;
    const run = async () => {
      try {
        setSchemes(await fetchSchemes());
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          router.replace("/admin");
        }
      }
    };
    void run();
  }, [ready, router]);

  // Fetch records on filter / page change
  useEffect(() => {
    if (!ready) return;
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetchMasterRecords({
          scheme: scheme || undefined,
          q: debouncedQuery || undefined,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        });
        setRecords(res.items);
        setTotal(res.total);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          router.replace("/admin");
          return;
        }
        const detail =
          err instanceof ApiError
            ? `API error ${err.status}: ${err.message}`
            : err instanceof Error
            ? err.message
            : "Unknown error";
        setError(`Failed to load records — ${detail}`);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [ready, router, scheme, debouncedQuery, page]);

  if (!ready) return null;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageNums = buildPageNumbers(page, totalPages);
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <ProtectedShell title="Master Explorer">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
      >
        ← Back
      </button>

      {/* Filters */}
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

      {/* Status bar */}
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        {loading ? (
          <span>Loading...</span>
        ) : total > 0 ? (
          <span>
            Showing <strong className="text-slate-700">{from}–{to}</strong> of{" "}
            <strong className="text-slate-700">{total.toLocaleString()}</strong> records
          </span>
        ) : (
          <span>No records found</span>
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      )}

      {/* Table */}
      <div className="mt-3 overflow-auto rounded-xl border border-slate-600">
        <table className="min-w-full text-sm" style={{ background: "#ffffff", color: "#1e293b" }}>
          <thead style={{ background: "#1e293b", color: "#f1f5f9" }}>
            <tr>
              <th className="p-2 text-left text-xs font-semibold">Scheme</th>
              <th className="p-2 text-left text-xs font-semibold">Type</th>
              <th className="p-2 text-left text-xs font-semibold">Specialty</th>
              <th className="p-2 text-left text-xs font-semibold">Package</th>
              <th className="p-2 text-left text-xs font-semibold">Procedure</th>
              <th className="p-2 text-right text-xs font-semibold">Rate (₹)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr
                key={r.id}
                style={{ borderTop: "1px solid #e2e8f0", color: "#1e293b" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
              >
                <td className="p-2 text-xs font-semibold" style={{ color: "#4f46e5" }}>{r.scheme}</td>
                <td className="p-2 text-xs" style={{ color: "#475569" }}>{r.record_type}</td>
                <td className="p-2 text-xs" style={{ color: "#475569" }}>{r.specialty || "—"}</td>
                <td className="p-2 text-xs" style={{ color: "#334155" }}>
                  {r.package_code && (
                    <span
                      className="mr-1 rounded px-1 font-mono text-[11px]"
                      style={{ background: "#e0e7ff", color: "#3730a3" }}
                    >
                      {r.package_code}
                    </span>
                  )}
                  {r.package_name || "—"}
                </td>
                <td className="p-2 text-xs" style={{ color: "#334155" }}>{r.procedure_name || "—"}</td>
                <td className="p-2 text-right text-xs tabular-nums" style={{ color: "#0f766e", fontWeight: 600 }}>
                  {r.rate_primary != null
                    ? `₹${Number(r.rate_primary).toLocaleString("en-IN")}`
                    : "—"}
                </td>
              </tr>
            ))}
            {!loading && records.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center" style={{ color: "#94a3b8" }}>
                  No records match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-slate-100"
          >
            ← Prev
          </button>

          {pageNums.map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`min-w-[36px] rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  p === page
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-300 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-slate-100"
          >
            Next →
          </button>
        </div>
      )}
    </ProtectedShell>
  );
}
