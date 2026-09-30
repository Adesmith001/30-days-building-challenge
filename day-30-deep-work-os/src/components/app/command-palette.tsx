"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const commands = [["Home", "/home"], ["New session", "/new"], ["Sessions", "/sessions"], ["Settings", "/settings"]] as const;

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) return null;
  const filtered = commands.filter(([label]) => label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/30 px-4 pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="mx-auto max-w-xl border bg-[var(--surface)] shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a command…" className="w-full border-b bg-transparent p-5 outline-none" />
        <div className="p-2">{filtered.map(([label, href]) => <button key={href} onClick={() => { setOpen(false); router.push(href); }} className="block w-full px-4 py-3 text-left text-sm hover:bg-[var(--accent-soft)]">{label}</button>)}</div>
      </div>
    </div>
  );
}
