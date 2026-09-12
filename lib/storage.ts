import { Interview } from "./types";
const KEY = "itseasynow-interviews-v1";
export const loadInterviews = (): Interview[] => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
export const saveInterview = (item: Interview) => {
  const items = loadInterviews(); const index = items.findIndex(x => x.id === item.id);
  if (index >= 0) items[index] = item; else items.unshift(item);
  localStorage.setItem(KEY, JSON.stringify(items));
  void fetch("/api/interviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }).catch(() => undefined);
};
export const deleteInterview = (id: string) => {
  localStorage.setItem(KEY, JSON.stringify(loadInterviews().filter(x => x.id !== id)));
  void fetch(`/api/interviews?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => undefined);
};
export const exportInterviewsCsv = (items: Interview[]) => {
  const esc=(v:unknown)=>`"${String(v??"").replace(/"/g,'""')}"`;
  const rows=[["Candidate","Email","Mobile","Role","Score","Technical","Communication","Recommendation","Recruiter status","Completed"],...items.map(x=>[x.candidate.name,x.candidate.email,x.candidate.mobile,x.candidate.role||"",x.overall||"",x.scores?.technical||"",x.scores?.communication||"",x.recommendation||"",x.recruiterStatus||"new",x.completedAt||x.startedAt])];
  const blob=new Blob([rows.map(r=>r.map(esc).join(",")).join("\n")],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a");a.href=url;a.download=`candidate-report-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);
};
