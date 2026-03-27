"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { clearToken } from "@/lib/auth";

export function ProtectedShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900 md:p-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-slate-600">ClaimBridge secure operations console</p>
          </div>
          <button
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
            onClick={() => {
              clearToken();
              router.push("/login");
            }}
          >
            Logout
          </button>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { href: "/", label: "Home" },
            { href: "/explorer", label: "Master Explorer" },
            { href: "/claimdesk", label: "Claim Desk" },
            { href: "/patients", label: "Patients" },
            { href: "/preauth", label: "Preauth" },
            { href: "/admin-updates", label: "Admin Updates" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl border px-3 py-2 text-sm ${
                pathname === item.href
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </main>
  );
}
