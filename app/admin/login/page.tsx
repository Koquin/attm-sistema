import { redirect } from "next/navigation";
import { AdminLoginView } from "@/features/admin";
import { getAdminSession } from "@/lib/auth/session";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return <AdminLoginView />;
}