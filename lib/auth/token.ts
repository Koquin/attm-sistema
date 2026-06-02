import { SignJWT, jwtVerify } from "jose";

export const ADMIN_TOKEN_COOKIE_NAME = "attm_admin_token";
export const ADMIN_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type AdminTokenPayload = {
  sub: string;
  uid: string;
  login: string;
  nome: string;
};

function getJwtSecret() {
  const secret = process.env.AUTH_JWT_SECRET;

  if (!secret) {
    throw new Error("AUTH_JWT_SECRET is missing.");
  }

  return new TextEncoder().encode(secret);
}

export async function signAdminToken(payload: AdminTokenPayload) {
  return new SignJWT({
    uid: payload.uid,
    login: payload.login,
    nome: payload.nome,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string) {
  try {
    const verified = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });

    const login = verified.payload.login;
    const nome = verified.payload.nome;
    const sub = verified.payload.sub;
    const uid = verified.payload.uid;

    if (
      typeof login !== "string" ||
      typeof nome !== "string" ||
      typeof sub !== "string" ||
      typeof uid !== "string"
    ) {
      return null;
    }

    return {
      sub,
      uid,
      login,
      nome,
    } satisfies AdminTokenPayload;
  } catch {
    return null;
  }
}