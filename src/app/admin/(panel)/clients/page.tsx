import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser, getSupabaseService } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type C = {
  id: string;
  nom: string;
  prenom: string | null;
  email: string | null;
  tel: string | null;
  ville: string | null;
  est_entreprise: boolean;
  raison_sociale: string | null;
};

export default async function Clients() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const db = getSupabaseService();
  const clients: C[] = db
    ? ((await db.from("clients").select("*").order("created_at", { ascending: false }).limit(300)).data as C[]) ?? []
    : [];

  return (
    <>
      <div className="admin-head">
        <h1>Clients</h1>
        <Link href="/admin/documents/nouveau" className="btn btn-primary admin-btn-sm">
          + Nouveau document
        </Link>
      </div>
      <p className="muted" style={{ marginTop: -8 }}>
        Les clients sont enregistrés automatiquement quand tu crées un devis/facture.
      </p>

      {clients.length === 0 ? (
        <div className="admin-card">
          <p className="muted">Aucun client enregistré pour l'instant.</p>
        </div>
      ) : (
        <div className="admin-table">
          <div className="admin-tr admin-th admin-tr-3">
            <span>Nom</span>
            <span>Coordonnées</span>
            <span>Ville</span>
          </div>
          {clients.map((c) => (
            <Link key={c.id} href={`/admin/clients/${c.id}`} className="admin-tr admin-tr-3 admin-row">
              <span>
                <strong>
                  {c.est_entreprise && c.raison_sociale
                    ? c.raison_sociale
                    : `${c.prenom ?? ""} ${c.nom}`.trim()}
                </strong>
              </span>
              <span className="muted">{[c.tel, c.email].filter(Boolean).join(" · ") || "—"}</span>
              <span className="muted">{c.ville || "—"}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
