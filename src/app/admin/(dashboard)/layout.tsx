import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ADMIN_LOGIN_PATH } from "@/lib/admin/config";
import { getSession } from "@/lib/admin/require-session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect(ADMIN_LOGIN_PATH);
  return (
    <AdminShell email={session.sub} role={session.role}>
      {children}
    </AdminShell>
  );
}
