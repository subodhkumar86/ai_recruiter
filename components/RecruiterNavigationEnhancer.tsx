"use client";

import { useEffect } from "react";

export default function RecruiterNavigationEnhancer() {
  useEffect(() => {
    const sidebar = document.querySelector(".dashNav nav");
    if (!sidebar) return;

    const actions: Record<string, () => void> = {
      Overview: () => { window.location.href = "/recruiter"; },
      Analytics: () => { window.location.href = "/recruiter/analytics"; },
    };

    const cleanup = Array.from(sidebar.querySelectorAll("a")).map((item) => {
      const label = item.textContent?.trim().replace(/^[^A-Za-z]+/, "") || "";
      const action = actions[label];
      if (!action) return () => undefined;
      item.setAttribute("role", "link");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", label);
      const activate = (event: Event) => { event.preventDefault(); action(); };
      const keyActivate = (event: KeyboardEvent) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); action(); } };
      item.addEventListener("click", activate);
      item.addEventListener("keydown", keyActivate);
      return () => { item.removeEventListener("click", activate); item.removeEventListener("keydown", keyActivate); };
    });

    return () => cleanup.forEach(remove => remove());
  }, []);

  return null;
}
