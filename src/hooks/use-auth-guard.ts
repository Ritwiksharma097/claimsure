"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { hasValidToken } from "@/lib/auth";

export function useAuthGuard() {
  const router = useRouter();
  // Start as false — only check localStorage after mount (client-side only)
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasValidToken()) {
      router.replace("/admin");
    } else {
      setReady(true);
    }
  }, [router]);

  return { ready };
}
