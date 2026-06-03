import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAdminUser } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="admin">
      <header className="admin-top">
        <Link href="/admin" className="admin-brand">
          <Image src="/assets/coq-metal.png" alt="" width={26} height={28} />
          <span>Admin · Artisans de France</span>
        </Link>
        <nav className="admin-nav">
          <Link href="/admin">Tableau de bord</Link>
          <Link href="/admin/clients">Clients</Link>
          <Link href="/admin/documents/nouveau" className="admin-nav-cta">+ Nouveau</Link>
          <form action="/api/admin/logout" method="post">
            <button className="admin-logout" type="submit">
              Déconnexion
            </button>
          </form>
        </nav>
      </header>
      <main className="admin-main wrap">{children}</main>
    </div>
  );
}
