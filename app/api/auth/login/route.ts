import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  ADMIN_TOKEN_COOKIE_NAME,
  ADMIN_TOKEN_MAX_AGE_SECONDS,
  signAdminToken,
} from "@/lib/auth/token";
import { verifyAdminCredentials } from "@/lib/auth/session";

type LoginBody = {
  login?: string;
  senha?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;

    const login = body.login?.trim() ?? "";
    const senha = body.senha ?? "";

    if (!login || !senha) {
      return NextResponse.json(
        { error: "Login e senha sao obrigatorios." },
        { status: 400 },
      );
    }

    const admin = await verifyAdminCredentials(login, senha);
    if (!admin) {
      return NextResponse.json({ error: "Credenciais invalidas." }, { status: 401 });
    }

    const token = await signAdminToken({
      sub: String(admin.id),
      uid: randomUUID(),
      login: admin.login,
      nome: admin.nome,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: admin.id,
        nome: admin.nome,
        login: admin.login,
      },
    });

    response.cookies.set({
      name: ADMIN_TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ADMIN_TOKEN_MAX_AGE_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao tentar autenticar." },
      { status: 500 },
    );
  }
}