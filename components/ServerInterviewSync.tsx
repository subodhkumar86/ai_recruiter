"use client";

import { useEffect } from "react";

const key = "itseasynow-interviews-v1";

export default function ServerInterviewSync() {
  useEffect(() => {
    if (!window.location.pathname.startsWith("/recruiter")) return;
    let cancelled = false;
    fetch("/api/interviews")
      .then(response => response.ok ? response.json() : [])
      .then((remote: unknown[]) => {
        if (cancelled || !Array.isArray(remote) || remote.length === 0) return;
        const local = JSON.parse(localStorage.getItem(key) || "[]") as Array<{ id: string }>;
        const merged = [...remote, ...local.filter(item => !remote.some((server: any) => server.id === item.id))];
        const before = localStorage.getItem(key);
        localStorage.setItem(key, JSON.stringify(merged));
        if (before !== JSON.stringify(merged) && !sessionStorage.getItem("interview-server-sync")) {
          sessionStorage.setItem("interview-server-sync", "done");
          window.location.reload();
        }
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  return null;
}
