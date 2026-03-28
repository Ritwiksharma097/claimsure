"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ProtectedShell } from "@/components/protected-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import {
  ApiError,
  createAdminSource,
  fetchAdminSources,
  fetchChangeLog,
  previewAdminUpdate,
  publishAdminUpdate,
  AdminUpdateSource,
  ChangeLogItem,
} from "@/lib/api";
import { clearToken } from "@/lib/auth";

export default function AdminUpdatesPage() {
  const { ready } = useAuthGuard();
  const router = useRouter();
  const [sources, setSources] = useState<AdminUpdateSource[]>([]);
  const [changelog, setChangelog] = useState<ChangeLogItem[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [scheme, setScheme] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [publishScheme, setPublishScheme] = useState("");
  const [publishSummary, setPublishSummary] = useState("");
  const [publishJson, setPublishJson] = useState("[]");
  const [previewText, setPreviewText] = useState("");
  const [creatingSource, setCreatingSource] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError("");
      const [s, c] = await Promise.all([fetchAdminSources(), fetchChangeLog()]);
      setSources(s);
      setChangelog(c);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearToken();
        router.replace("/admin");
        return;
      }
      if (err instanceof ApiError && err.status === 403) {
        setError("Admin/manager role required for some actions.");
        return;
      }
      setError("Failed to load admin update data");
    }
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(t);
  }, [ready, load]);

  if (!ready) return null;

  return (
    <ProtectedShell title="Admin Update Center">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <h2 className="text-lg font-semibold">Add update source</h2>
          <div className="mt-3 space-y-2">
            <input
              className="w-full rounded-xl border border-slate-300 p-2"
              placeholder="Scheme"
              value={scheme}
              onChange={(e) => setScheme(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-slate-300 p-2"
              placeholder="Source name"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
            />
            <button
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
              disabled={creatingSource}
              onClick={async () => {
                try {
                  setCreatingSource(true);
                  setError("");
                  if (!scheme.trim() || !sourceName.trim()) {
                    setError("Scheme and source name are required.");
                    return;
                  }
                  await createAdminSource({ scheme, source_name: sourceName, status: "Active" });
                  setMessage("Source added");
                  setScheme("");
                  setSourceName("");
                  void load();
                } catch (err) {
                  if (err instanceof ApiError && err.status === 403) {
                    setError("Only admin/manager can create sources.");
                    return;
                  }
                  setError("Failed to create source");
                } finally {
                  setCreatingSource(false);
                }
              }}
            >
              {creatingSource ? "Saving..." : "Save source"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <h2 className="text-lg font-semibold">Publish update</h2>
          <div className="mt-3 space-y-2">
            <input
              className="w-full rounded-xl border border-slate-300 p-2"
              placeholder="Scheme"
              value={publishScheme}
              onChange={(e) => setPublishScheme(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-slate-300 p-2"
              placeholder="Summary"
              value={publishSummary}
              onChange={(e) => setPublishSummary(e.target.value)}
            />
            <textarea
              className="min-h-28 w-full rounded-xl border border-slate-300 p-2 font-mono text-xs"
              value={publishJson}
              onChange={(e) => setPublishJson(e.target.value)}
            />
            <button
              className="rounded-xl border border-slate-300 px-4 py-2 disabled:opacity-50"
              disabled={previewing}
              onClick={async () => {
                try {
                  setPreviewing(true);
                  setError("");
                  const parsed = JSON.parse(publishJson);
                  const preview = await previewAdminUpdate({
                    scheme: publishScheme,
                    summary: publishSummary,
                    records: parsed,
                  });
                  if (!preview.ok) {
                    setPreviewText(preview.message || "Preview failed");
                    return;
                  }
                  setPreviewText(
                    `${preview.count} record(s), replace: ${preview.replace_count}, insert: ${preview.insert_count}, schemes: ${preview.schemes.join(", ")}`
                  );
                } catch {
                  setError("Preview failed. Ensure JSON array is valid.");
                } finally {
                  setPreviewing(false);
                }
              }}
            >
              {previewing ? "Previewing..." : "Preview"}
            </button>
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
              disabled={publishing}
              onClick={async () => {
                try {
                  setPublishing(true);
                  setError("");
                  const parsed = JSON.parse(publishJson);
                  if (!confirm("Publish this update to master records?")) return;
                  await publishAdminUpdate({
                    scheme: publishScheme,
                    summary: publishSummary,
                    records: parsed,
                  });
                  setMessage("Update published");
                  void load();
                } catch (err) {
                  if (err instanceof ApiError && err.status === 403) {
                    setError("Only admin/manager can publish updates.");
                    return;
                  }
                  setError("Publish failed. Ensure JSON array is valid.");
                } finally {
                  setPublishing(false);
                }
              }}
            >
              {publishing ? "Publishing..." : "Publish"}
            </button>
            {previewText ? <div className="text-xs text-slate-600">{previewText}</div> : null}
          </div>
        </div>
      </div>

      {message ? <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div> : null}
      {error ? <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <h3 className="font-semibold">Update sources</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {sources.map((s) => (
              <li key={s.id} className="rounded-xl border border-slate-100 p-2">
                <div className="font-medium">{s.scheme}</div>
                <div className="text-slate-600">{s.source_name}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <h3 className="font-semibold">Change log</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {changelog.map((c) => (
              <li key={c.id} className="rounded-xl border border-slate-100 p-2">
                <div className="font-medium">
                  {c.scheme} ({c.record_count} records)
                </div>
                <div className="text-slate-600">{c.summary || "-"}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedShell>
  );
}
