"use client";

import { useEffect } from "react";

export default function RecruiterNavigationEnhancer() {
  useEffect(() => {
    const sidebar = document.querySelector(".dashNav nav");
    if (!sidebar) return;

    const destinations = ["/recruiter", "/recruiter/compare", "/recruiter/jobs", "/recruiter/analytics"];

    const cleanup = Array.from(sidebar.querySelectorAll("a")).map((item, index) => {
      if (item.getAttribute("href")) return () => undefined;
      const label = item.textContent?.trim().replace(/^[^A-Za-z]+/, "") || "";
      const destination = destinations[index];
      if (!destination) return () => undefined;
      item.setAttribute("href", destination);
      item.setAttribute("role", "link");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", label);
      return () => item.removeAttribute("href");
    });

    const additions = [
      ["↔", "Compare candidates", "/recruiter/compare"],
      ["＋", "Job requisitions", "/recruiter/jobs"],
      ["▤", "Interview playbook", "/recruiter/playbook"],
      ["♡", "Candidate feedback", "/recruiter/feedback"],
    ].map(([icon, label, href]) => {
      const link = document.createElement("a");
      link.href = href;
      link.innerHTML = `${icon} <span>${label}</span>`;
      link.setAttribute("aria-label", label);
      sidebar.appendChild(link);
      return link;
    });

    return () => {
      cleanup.forEach(remove => remove());
      additions.forEach(link => link.remove());
    };
  }, []);

  return null;
}
