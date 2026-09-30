import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function DELETE() {
  const supabase = await createSupabaseServer();
  if (!supabase) return NextResponse.json({ error: "Sync is not configured" }, { status: 503 });
  const { error } = await supabase.auth.signOut();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
