"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { hasValidToken, setToken } from "@/lib/auth";
import { ApiError, login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasValidToken()) router.replace("/");
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">ClaimBridge Login</h1>
        <p className="mt-2 text-sm text-slate-600">Use your API credentials to continue.</p>
        <div className="mt-5 space-y-3">
          <input
            className="w-full rounded-xl border border-slate-300 p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            className="w-full rounded-xl border border-slate-300 p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                setError("");
                const token = await login(username, password);
                setToken(token.access_token);
                router.push("/");
              } catch (err) {
                if (err instanceof ApiError) setError(err.message);
                else setError("Login failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
          {error ? <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        </div>
      </div>
    </main>
  );
}
