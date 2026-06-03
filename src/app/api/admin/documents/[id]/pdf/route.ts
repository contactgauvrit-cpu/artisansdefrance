import { NextResponse } from "next/server";
import { getAdminUser, getSupabaseService } from "@/lib/supabase";
import { buildDocumentPdf, type DocForPdf } from "@/lib/pdf";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const db = getSupabaseService();
  if (!db) return NextResponse.json({ error: "db" }, { status: 500 });

  const { data: doc } = await db.from("documents").select("*").eq("id", id).maybeSingle();
  if (!doc) return NextResponse.json({ error: "introuvable" }, { status: 404 });

  const bytes = await buildDocumentPdf(doc as DocForPdf);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${doc.numero}.pdf"`,
    },
  });
}
