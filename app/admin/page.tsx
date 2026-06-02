import { AdminView } from "@/features/admin";
import { requireAdminSession } from "@/lib/auth/session";
import { getAdminPanelData } from "@/lib/db/admin";

export default async function AdminPage() {
  const session = await requireAdminSession();
  const data = await getAdminPanelData();
  return <AdminView currentAdmin={session} initialData={data} />;
}
