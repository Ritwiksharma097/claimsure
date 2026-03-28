"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { hasValidToken } from "@/lib/auth";

export function useAuthGuard() {
  const router = useRouter();
  const ready = hasValidToken();

  useEffect(() => {
    if (!ready) {
      router.replace("/admin");
    }
  }, [ready, router]);

  return { ready };
}
