import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth/token";

type UsuarioRow = {
  id: number;
  nome: string;
  login: string;
  senha_hash: string;
};

export type AuthenticatedAdmin = {
  id: number;
  uid: string;
  nome: string;
  login: string;
};

export async function verifyAdminCredentials(
  login: string,
  senha: string,
): Promise<AuthenticatedAdmin | null> {
  const normalizedLogin = login.trim();
  if (!normalizedLogin || !senha) {
    return null;
  }

  const { data, error } = await supabaseServer
    .from("usuario")
    .select("id, nome, login, senha_hash")
    .eq("login", normalizedLogin)
    .limit(1)
    .maybeSingle<UsuarioRow>();

  if (error || !data) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(senha, data.senha_hash);
  if (!passwordMatches) {
    return null;
  }

  return {
    id: data.id,
    uid: verifiedAdminUidFallback(data.id),
    nome: data.nome,
    login: data.login,
  };
}

function verifiedAdminUidFallback(id: number) {
  return `00000000-0000-4000-8000-${String(id).padStart(12, "0")}`;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyAdminToken(token);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}