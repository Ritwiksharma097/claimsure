"use client";

import Link from "next/link";

import { ProtectedShell } from "@/components/protected-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";

export default function HomePage() {
  const { ready } = useAuthGuard();
  if (!ready) return null;

  return (
    <ProtectedShell title="ClaimBridge Dashboard">
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/explorer" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50">
          <h2 className="text-lg font-semibold">Master Explorer</h2>
          <p className="mt-1 text-sm text-slate-600">Search scheme package/procedure/test master records.</p>
        </Link>
        <Link href="/claimdesk" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50">
          <h2 className="text-lg font-semibold">Claim Desk</h2>
          <p className="mt-1 text-sm text-slate-600">Compute best match, checklist, and readiness score.</p>
        </Link>
        <Link href="/patients" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50">
          <h2 className="text-lg font-semibold">Patient Registry</h2>
          <p className="mt-1 text-sm text-slate-600">Create and search patient records with visit tracking.</p>
        </Link>
        <Link href="/preauth" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50">
          <h2 className="text-lg font-semibold">Preauth Cases</h2>
          <p className="mt-1 text-sm text-slate-600">Track preauth status, amount, reference, and diagnosis.</p>
        </Link>
        <Link href="/admin-updates" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50">
          <h2 className="text-lg font-semibold">Admin Updates</h2>
          <p className="mt-1 text-sm text-slate-600">Manage update sources and publish master changes.</p>
        </Link>
      </div>
    </ProtectedShell>
  );
}
