import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseService } from "@/lib/supabase";
import { DocumentView, type PublicDoc } from "@/components/DocumentView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Votre facture — Artisans de France",
  robots: { index: false, follow: false },
};

export default async function FacturePublic({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const db = getSupabaseService();
  if (!db) notFound();
  const { data: doc } = await db
    .from("documents")
    .select("*")
    .eq("public_token", token)
    .eq("type", "facture")
    .maybeSingle();
  if (!doc) notFound();

  return (
    <main className="docpage">
      <DocumentView doc={doc as PublicDoc} />
    </main>
  );
}
