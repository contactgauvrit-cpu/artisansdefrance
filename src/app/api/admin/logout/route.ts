import { NextResponse } from "next/server";
import { getSupabaseServerAuth } from "@/lib/supabase";
import { SITE } from "@/lib/content";

export async function POST() {
  const supabase = await getSupabaseServerAuth();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/admin/login", SITE.url), { status: 303 });
}
