import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseService } from "@/lib/supabase";
import { DocumentView, type PublicDoc } from "@/components/DocumentView";
import { SignaturePad } from "@/components/SignaturePad";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Votre devis — Artisans de France",
  robots: { index: false, follow: false },
};

export default async function DevisPublic({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const db = getSupabaseService();
  if (!db) notFound();
  const { data: doc } = await db
    .from("documents")
    .select("*")
    .eq("public_token", token)
    .eq("type", "devis")
    .maybeSingle();
  if (!doc) notFound();

  return (
    <main className="docpage">
      <DocumentView doc={doc as PublicDoc} />
      {doc.statut !== "signe" ? (
        <SignaturePad token={token} />
      ) : (
        <div className="docsign-done">Ce devis est signé. Merci !</div>
      )}
    </main>
  );
}
