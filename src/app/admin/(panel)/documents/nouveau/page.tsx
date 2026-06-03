import { redirect } from "next/navigation";
import { getAdminUser, getSupabaseService } from "@/lib/supabase";
import { DocForm, type ClientLite } from "./DocForm";

export const dynamic = "force-dynamic";

export default async function NouveauDocument() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const db = getSupabaseService();
  const clients: ClientLite[] = db
    ? ((
        await db
          .from("clients")
          .select("id,nom,prenom,email,tel,adresse,cp,ville,est_entreprise,raison_sociale,siret")
          .order("created_at", { ascending: false })
          .limit(300)
      ).data as ClientLite[]) ?? []
    : [];

  return (
    <>
      <div className="admin-head">
        <h1>Nouveau document</h1>
      </div>
      <DocForm clients={clients} />
    </>
  );
}
