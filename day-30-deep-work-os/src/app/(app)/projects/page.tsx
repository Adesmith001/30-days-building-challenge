"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/storage/db";

export default function ProjectsPage() {
  const projects = useLiveQuery(() => db.projects.orderBy("updatedAt").reverse().toArray()) ?? [];
  return <main className="min-h-dvh p-5 md:p-10 lg:p-14"><h1 className="editorial text-6xl leading-none md:text-8xl">Projects</h1><p className="mt-5 text-sm text-[var(--muted)]">Keep related sessions visible without turning work into a workflow.</p><div className="mt-16 border-t">{projects.map((project) => <div key={project.id} className="border-b py-6"><p className="text-lg">{project.name}</p><p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">{project.archived ? "Archived" : "Active"}</p></div>)}{!projects.length && <p className="py-8 text-sm text-[var(--muted)]">Projects are optional. Start with a session.</p>}</div></main>;
}
